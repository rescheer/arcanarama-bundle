import { getContext } from '../util/nodecg-api-context';
import getSheetJSON from './GSheets';

const vibesReps = {};

/**
 * Declares needed replicants and stores them for later use
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
    defaultValue: { updateStatus: ['none', ''] },
    persistent: false,
  });

  vibesReps.data = vibesData;
  vibesReps.persistent = vibesDataPersistent;
  vibesReps.responses = vibesResponses;
  vibesReps.status = vibesStatus;
}

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
  } catch (e) {
    nodecg.sendMessage('console', {
      type: 'error',
      msg: `Function: [updateReplicantFromJSON] ${e.message}`,
    });
  }
}

/**
 * Attempts to update the responses replicant while tracking its own progress in the status replicant
 */
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

  // Responses from Replicant
  const { actions, places, events, monsters } = vibesReps.responses.value;

  // Tiered items
  let actionSet;
  let placeSet;

  // Update the temporary replicant
  vibesReps.data.value.forEach((el, index) => {
    if (el.user === user) {
      vibesReps.data.value.splice(index, 1);
    }
  });
  vibesReps.data.value.push({ user, roll });

  // Update the permanent replicant
  if (!vibesReps.persistent.value[user]) {
    vibesReps.persistent.value[user] = {};
  }
  vibesReps.persistent.value[user].total += roll;
  vibesReps.persistent.value[user].numRolls += 1;

  // Set tiers based on roll
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
      actionSet = 'neutrallow';
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

  const eventIndex = getRandomNumber(0, events.length - 1);
  const monsterIndex = getRandomNumber(0, monsters.length - 1);
  const placeIndex = getRandomNumber(0, places[placeSet].length - 1);
  const actionIndex = getRandomNumber(0, actions[actionSet].length - 1);

  let event;
  let monster;
  let place;
  let action;

  try {
    event = events[eventIndex];
    monster = monsters[monsterIndex];
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
      monster = `an ${monster}`;
      break;
    default:
      monster = `a ${monster}`;
      break;
  }

  let message = `[${roll}] ${user} has ${action}!`;

  // Replace all keywords
  message = message
    .replace(/MONSTER/g, monster)
    .replace(/PLACE/g, place)
    .replace(/EVENT/g, event);

  return message;
}
