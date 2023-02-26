import { getContext } from '../util/nodecg-api-context';
import getSheetJSON from './GSheets';

const vibesReps = {};

export function initVibes(nodecg) {
  const vibesData = nodecg.Replicant('vibesData', {
    defaultValue: [],
    persistent: false,
  });
  const vibesDataPersistent = nodecg.Replicant('vibesDataPersistent');
  const vibesResponses = nodecg.Replicant('vibesResponses');
  const vibesStatus = nodecg.Replicant('vibesStatus', {
    defaultValue: { updateStatus: ['none', ''] },
    persistent: false,
  });

  vibesReps.data = vibesData;
  vibesReps.persistent = vibesDataPersistent;
  vibesReps.responses = vibesResponses;
  vibesReps.status = vibesStatus;
}

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

async function updateReplicantFromJSON() {
  const nodecg = getContext();
  const sheetId = nodecg.bundleConfig.vibesSheet.id;
  const tabNames = nodecg.bundleConfig.vibesSheet.tabs;
  let responses = {};

  try {
    responses = await getSheetJSON(sheetId, tabNames);

    vibesReps.responses.value = responses;
  } catch (e) {
    nodecg.sendMessage('console', {
      type: 'error',
      msg: `Function: [updateReplicantFromJSON] ${e.message}`,
    });
  }
}

export function refreshVibeResponses() {
  const nodecg = getContext();
  vibesReps.status.value.updateStatus = ['updating', 'Updating...'];
  updateReplicantFromJSON()
    .then(() => setStatus('updateStatus', ['success', 'Success']))
    .catch((e) => {
      setStatus('updateStatus', ['failure', `Update Failed: ${e.message}`]);
      nodecg.sendMessage('console', {
        type: 'error',
        msg: `Function: [refreshVibeResponses] ${e.message}`,
      });
    });
}

/**
 * Rolls 1-20 and selects a random response in a range
 * @param {string} user
 * @returns a string ready to be sent to a chat
 */
export function getVibeCheck(user) {
  const roll = getRandomNumber(1, 20);

  // Update the temporary replicant
  vibesReps.data.value.forEach((el, index) => {
    if (el.user === user) {
      vibesReps.data.value.splice(index, 1);
    }
  });
  vibesReps.data.value.push({ user, roll });

  // Update the permanent replicant
  if (!vibesReps.vibesDataPersistent.value[user]) {
    vibesReps.vibesDataPersistent.value[user] = {};
  }
  vibesReps.vibesDataPersistent.value[user].total += roll;
  vibesReps.vibesDataPersistent.value[user].numRolls += 1;

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

  switch (roll) {
    case 20:
      actionSet = 'highest';
      placeSet = 'good';
      break;
    case 19:
    case 18:
    case 17:
      actionSet = 'higher';
      placeSet = 'good';
      break;
    case 16:
    case 15:
    case 14:
      actionSet = 'high';
      placeSet = 'good';
      break;
    case 13:
    case 12:
    case 11:
      actionSet = 'neutralhigh';
      placeSet = 'neutral';
      break;
    case 10:
    case 9:
    case 8:
      actionSet = 'neutralow';
      placeSet = 'neutral';
      break;
    case 7:
    case 6:
    case 5:
      actionSet = 'low';
      placeSet = 'bad';
      break;
    case 4:
    case 3:
    case 2:
      actionSet = 'lower';
      placeSet = 'bad';
      break;
    default:
      actionSet = 'lowest';
      placeSet = 'bad';
      break;
  }

  const placeIndex = getRandomNumber(0, placeSet.length);
  const actionIndex = getRandomNumber(0, actionSet.length);
  const place = responsesRep.places[placeSet][placeIndex];
  const action = responsesRep.actions[actionSet][actionIndex];

  let message = `[${roll}] ${user} has ${action}!`;

  message = message
    .replace(/MONSTER/g, monster)
    .replace(/PLACE/g, place)
    .replace(/EVENT/g, event);

  return message;
}
