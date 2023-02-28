/* eslint-disable prefer-destructuring */
import { getContext } from '../util/nodecg-api-context';
import getSheetJSON from './GSheets';

const vibesReps = {};

/**
 * Updates the Status replicant
 * @param {string} key - The key in the status replicant to change
 * @param {string} value - New value
 */
function setStatus(key, value) {
  vibesReps.status.value[key] = value;
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

function replaceAllRands(msg) {
  let text = msg;

  function isNumeric(str) {
    if (typeof str !== 'string') return false;
    return !Number.isNaN(str) && !Number.isNaN(parseFloat(str));
  }

  while (text.search(/\$RAND/i) !== -1) {
    let result;
    const pos = text.search(/\$RAND/i);
    const endPos = text.indexOf(')', pos);

    if (text.charAt(pos + '$RAND'.length) === '(' && endPos !== -1) {
      const argString = text.slice(pos + '$RAND'.length + 1, endPos);
      const argArray = argString.split(',').map((el) => el.trim());

      if (argArray.length === 2 && argArray.every((el) => isNumeric(el))) {
        result = getRandomNumber(+argArray[0], +argArray[1]);
      }
    }

    // Bad Syntax
    if (!result) {
      getContext().sendMessage('console', {
        type: 'warn',
        msg: `[VibeCheck] Bad $RAND(min,max) syntax in message: '${msg}'. Returning default message`,
      });

      return (
        '$USER somehow triggered an error in the vibecheck code, ' +
        'causing this boring default message to appear!'
      );
    }
    // Replace the substring
    const substrToReplace = text.slice(pos, endPos + 1);
    text = text.replace(substrToReplace, result);
  }

  return text;
}

/**
 * Awaits JSON data from GSheets, then handles the data
 */
async function updateReplicantFromJSON() {
  const nodecg = getContext();
  const sheetId = nodecg.bundleConfig.vibesSheet.id;
  const tabNames = nodecg.bundleConfig.vibesSheet.tabs;
  let responses = {};

  try {
    responses = await getSheetJSON(sheetId, tabNames);

    vibesReps.responses.value = responses;
    return true;
  } catch (e) {
    nodecg.sendMessage('console', {
      type: 'error',
      msg: `Function: [updateReplicantFromJSON] ${e.message}`,
    });
    return e;
  }
}

/**
 * Attempts to update the responses replicant while tracking its own progress in the status replicant
 */
export function refreshVibeResponses() {
  const nodecg = getContext();
  vibesReps.status.value.update = 'updating';
  updateReplicantFromJSON()
    .then(() => setStatus('update', 'success'))
    .catch((e) => {
      setStatus('update', 'failure');
      nodecg.sendMessage('console', {
        type: 'error',
        msg: `Function: [refreshVibeResponses] ${e.message}`,
      });
    });
}

/**
 * Declares replicants and gets responses from GSheets
 * @param {Object} nodecg - The nodecg context to use for initializing replicants
 */
export function initVibes(nodecg) {
  const vibesData = nodecg.Replicant('vibesData', {
    defaultValue: [],
    persistent: false,
  });
  const vibesDataPersistent = nodecg.Replicant('vibesDataPersistent', {
    defaultValue: {},
  });
  const vibesResponses = nodecg.Replicant('vibesResponses', {
    defaultValue: {},
  });
  const vibesStatus = nodecg.Replicant('vibesStatus', {
    defaultValue: { update: 'initializing' },
    persistent: false,
  });

  vibesReps.data = vibesData;
  vibesReps.persistent = vibesDataPersistent;
  vibesReps.responses = vibesResponses;
  vibesReps.status = vibesStatus;

  refreshVibeResponses();

  vibesStatus.on('change', (newValue) => {
    switch (newValue.update) {
      case 'success':
        nodecg.log.info('[Vibecheck] Module loaded.');
        break;
      case 'failure':
        nodecg.log.error('[Vibecheck] Module failed to load.');
        break;
      default:
        break;
    }
  });
  // Debug vibechecks
  // setInterval(getVibeCheck, 10, 'testUser');
}

/**
 * Rolls 1-20 and returns a randomly assembled response
 * @param {string} user - the user requesting the vibe check
 * @returns a string ready to be sent to a chat
 */
export function getVibeCheck(user) {
  const roll = getRandomNumber(1, 20);

  if (vibesReps.status.value.update !== 'success') {
    return '';
  }

  // Responses from Replicant
  const { actions, places, events, monsters, foods } =
    vibesReps.responses.value;

  // Tiered items
  let actionSet;
  let placeSet;
  const actionSetTiers = [
    'lowest',
    'lower',
    'low',
    'neutrallow',
    'neutralhigh',
    'high',
    'higher',
    'highest',
  ];
  const placeSetTiers = ['bad', 'neutral', 'good'];

  // Update the permanent replicant
  if (!vibesReps.persistent.value[user]) {
    vibesReps.persistent.value[user] = { total: 0, numRolls: 0 };
  }
  vibesReps.persistent.value[user].total += roll;
  vibesReps.persistent.value[user].numRolls += 1;

  // Set tiers based on roll
  switch (roll) {
    case 20:
      actionSet = actionSetTiers[7];
      placeSet = placeSetTiers[2];
      break;
    case 19:
    case 18:
    case 17:
      actionSet = actionSetTiers[6];
      placeSet = placeSetTiers[2];
      break;
    case 16:
    case 15:
    case 14:
      actionSet = actionSetTiers[5];
      placeSet = placeSetTiers[2];
      break;
    case 13:
    case 12:
    case 11:
      actionSet = actionSetTiers[4];
      placeSet = placeSetTiers[1];
      break;
    case 10:
    case 9:
    case 8:
      actionSet = actionSetTiers[3];
      placeSet = placeSetTiers[1];
      break;
    case 7:
    case 6:
    case 5:
      actionSet = actionSetTiers[2];
      placeSet = placeSetTiers[0];
      break;
    case 4:
    case 3:
    case 2:
      actionSet = actionSetTiers[1];
      placeSet = placeSetTiers[0];
      break;
    default:
      actionSet = actionSetTiers[0];
      placeSet = placeSetTiers[0];
      break;
  }

  const eventIndex = getRandomNumber(0, events.length - 1);
  const foodsIndex = getRandomNumber(0, foods.length - 1);
  const monsterIndex = getRandomNumber(0, monsters.singular.length - 1);
  const monsterPluralIndex = getRandomNumber(0, monsters.plural.length - 1);
  const placeIndex = getRandomNumber(0, places[placeSet].length - 1);
  const actionIndex = getRandomNumber(0, actions[actionSet].length - 1);

  let event;
  let food;
  let monster;
  let aMonster;
  let monsterPlural;
  let place;
  let action;
  const rollArticle = `${
    roll === 8 || roll === 11 || roll === 18 ? 'an' : 'a'
  }`;

  try {
    event = events[eventIndex];
    food = foods[foodsIndex];
    monster = monsters.singular[monsterIndex];
    monsterPlural = monsters.plural[monsterPluralIndex];
    place = places[placeSet][placeIndex];
    action = actions[actionSet][actionIndex];
  } catch (e) {
    getContext().log.error(e);
    return '';
  }

  // Dirty monster article assignment
  switch (monster.charAt(0)) {
    case 'A':
    case 'E':
    case 'I':
    case 'O':
    case 'U':
      aMonster = `an ${monster}`;
      break;
    default:
      aMonster = `a ${monster}`;
      break;
  }

  // Remove whitespace from action and put it in a new variable
  let message = action.trim();

  // Replace all the $RANDs in message with random numbers

  // Replace all keywords
  message = message
    .replace(/\$USER/gi, `@${user}`)
    .replace(/\$AROLL/gi, rollArticle)
    .replace(/\$ROLL/gi, roll)
    .replace(/\$MONSTERS/gi, monsterPlural)
    .replace(/\$AMONSTER/gi, aMonster)
    .replace(/\$MONSTER/gi, monster)
    .replace(/\$FOOD/gi, food)
    .replace(/\$PLACE/gi, place)
    .replace(/\$EVENT/gi, event);

  if (message.search(/\$RAND/gi)) {
    message = replaceAllRands(message);
  }

  // Update the temporary replicant for dashboard display
  vibesReps.data.value.forEach((el, index) => {
    if (el.user === user) {
      vibesReps.data.value.splice(index, 1);
    }
  });

  // Catch the message if a keyword was not replaced for some reason
  if (message.search(/\$/) !== -1) {
    getContext().sendMessage('console', {
      type: 'warn',
      msg: `[Vibecheck] Keyword error in message: ${message}`,
    });

    message = `check out @${user} with the big ol' ${roll} vibe check`;
  }

  vibesReps.data.value.push({ user, roll, message: `[${roll}] ${message}` });

  return `[${roll}] ${message}`;
}
