import { get } from 'https';
import { getContext } from '../util/nodecg-api-context';

const vibesReps = {};

export function initVibes(nodecg) {
  const vibesData = nodecg.Replicant('vibesData', {
    defaultValue: [],
    persistent: false,
  });

  const vibesResponses = nodecg.Replicant('vibesResponses');

  vibesReps.data = vibesData;
  vibesReps.responses = vibesResponses;
}

/**
 * Returns a random number between min and max
 * @param {number} min
 * @param {number} max
 * @returns result
 */
export function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Adds a vibecheck to the replicant while avoiding duplicate rolls from one user
 * @param {string} user
 * @param {number} roll
 */
function updateVibesData(user, roll) {
  if (typeof user === 'string' && typeof roll === 'number') {
    const data = { user, roll };

    // This is how we can use the Replicants stored in the global
    // object. Destructuring won't work.
    if (typeof vibesReps.data.value === 'object') {
      vibesReps.data.value.forEach((el, index) => {
        if (el.user === user) {
          vibesReps.data.value.splice(index, 1);
        }
      });
      vibesReps.data.value.push(data);
    }
  }
}

export function getResponsesFromDrive() {
  const nodecg = getContext();

  const responses = {};

  if (
    nodecg?.bundleConfig?.googleAPIKey &&
    nodecg?.bundleConfig?.vibesResponseSheetID &&
    nodecg?.bundleConfig?.vibesResponseSheetTabs
  ) {
    const apiKey = nodecg.bundleConfig.googleAPIKey;
    const sheet = nodecg.bundleConfig.vibesResponseSheetID;
    const tabsArray = nodecg.bundleConfig.vibesResponseSheetTabs;

    tabsArray.forEach((tab) => {
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheet}/values/${tab}?majorDimension=COLUMNS&alt=json&key=${apiKey}`;

      get(url, (res) => {
        const { statusCode } = res;
        const contentType = res.headers['content-type'];

        let error;
        // Any 2xx status code signals a successful response but
        // here we're only checking for 200.
        if (statusCode !== 200) {
          error = new Error(`Request Failed with Status Code: ${statusCode}`);
        } else if (!/^application\/json/.test(contentType)) {
          error = new Error(
            `Invalid content-type: Expected application/json but received ${contentType}`
          );
        }
        if (error) {
          nodecg.sendMessage('console', { type: 'error', msg: error.message });
          // Consume response data to free up memory
          res.resume();
          return;
        }

        res.setEncoding('utf8');
        let rawData = '';
        res.on('data', (chunk) => {
          rawData += chunk;
        });
        res.on('end', () => {
          try {
            const parsedData = JSON.parse(rawData);

            if (parsedData.values[0][0] !== 'unordered') {
              responses[tab] = {};
              parsedData.values.forEach((element) => {
                const key = element.shift();
                const filteredItems = element.filter((n) => n);
                responses[tab][key] = filteredItems;
              });
            } else {
              parsedData.values[0].shift();
              const filteredItems = parsedData.values[0].filter((n) => n);
              responses[tab] = filteredItems;
            }
            vibesReps.responses.value = responses;
          } catch (e) {
            nodecg.sendMessage('console', { type: 'error', msg: e.message });
          }
        });
      }).on('error', (e) => {
        nodecg.sendMessage('console', { type: 'error', msg: e.message });
      });
    });
    return true;
  }
  // else
  nodecg.sendMessage('console', {
    type: 'error',
    msg: `[VibeCheck] Couldn't get responses from Google Sheets`,
  });
  return false;
}

/**
 * Rolls 1-20 and selects a random response in a range
 * @param {string} user
 * @returns a string ready to be sent to a chat
 */
export function getVibeCheck(user) {
  const nodecg = getContext();
  const roll = getRandomNumber(1, 20);

  updateVibesData(user, roll);

  const responsesRep = vibesReps.responses.value;
  const eventIndex = getRandomNumber(0, responsesRep.events.length);
  const monsterIndex = getRandomNumber(0, responsesRep.monsters.length);
  const event = responsesRep.events[eventIndex];

  let actionSet;
  let placeSet;
  let monster = responsesRep.monsters[monsterIndex];

  switch (monster.charAt(0)) {
    case 'A':
    case 'E':
    case 'I':
    case 'O':
    case 'U':
      monster = `an ${monster}`;
      break;
    default:
      monster = `a ${monster}`;
      break;
  }

  // roll = 20
  // HIGHEST
  if (roll === 20) {
    actionSet = 'highest';
    placeSet = 'good';
  }
  // roll = 17-19
  // HIGHER
  if (roll > 16) {
    actionSet = 'higher';
    placeSet = 'good';
  }
  // roll = 14-16
  // HIGH
  if (roll > 13) {
    actionSet = 'high';
    placeSet = 'good';
  }
  // roll = 11-13
  // NEUTRALHIGH
  if (roll > 10) {
    actionSet = 'neutralhigh';
    placeSet = 'neutral';
  }
  // roll = 8-10
  // NEUTRALLOW
  if (roll > 7) {
    actionSet = 'neutralow';
    placeSet = 'neutral';
  }
  // roll = 5-7
  // LOW
  if (roll > 4) {
    actionSet = 'low';
    placeSet = 'bad';
  }
  // roll = 2-4
  // LOWER
  if (roll > 1) {
    actionSet = 'lower';
    placeSet = 'bad';
  }
  // roll = 1
  // LOWEST
  if (roll === 1) {
    actionSet = 'lowest';
    placeSet = 'bad';
  }

  const placeIndex = getRandomNumber(0, placeSet.length);
  const actionIndex = getRandomNumber(0, actionSet.length);
  const place = responsesRep.places[placeSet][placeIndex];
  let action = responsesRep.actions[actionSet][actionIndex];

  try {
    nodecg.sendMessage('console', { type: 'error', msg: `action: ${action}` });
    nodecg.sendMessage('console', {
      type: 'error',
      msg: `actionSet: ${actionSet}`,
    });
    nodecg.sendMessage('console', {
      type: 'error',
      msg: `actionIndex: ${actionIndex}`,
    });

    action = action.replace(/MONSTER/g, monster);
    action = action.replace(/PLACE/g, place);
    action = action.replace(/EVENT/g, event);

    return `[${roll}] ${user} has ${action}!`;
  } catch (e) {
    nodecg.sendMessage('console', { type: 'error', msg: e.message });
    nodecg.sendMessage('console', { type: 'error', msg: `action: ${action}` });
    nodecg.sendMessage('console', {
      type: 'error',
      msg: `actionSet: ${actionSet}`,
    });
    nodecg.sendMessage('console', {
      type: 'error',
      msg: `actionIndex: ${actionIndex}`,
    });
  }

  return null;
}
