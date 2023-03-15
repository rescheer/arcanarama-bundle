/* eslint-disable no-param-reassign */
import { getContext } from '../util/nodecg-api-context';

const announcerTimer = {};
const giveawayReps = {};

export function initGiveaway(nodecg) {
  const giveawayData = nodecg.Replicant('giveawayData', {
    defaultValue: {
      defaultKeyword: {
        name: 'Example',
        active: false,
        winner: [],
        finalWinner: [],
        entries: [],
        newEntries: [],
      },
    },
  });

  const giveawaySettings = nodecg.Replicant('giveawaySettings', {
    defaultValue: {
      diceBackgroundScrollAsset: 'WINNER_dice_BG',
      otherBackgroundScrollAsset: 'WINNER_minis_BG',
    },
  });

  const giveawayStatus = nodecg.Replicant('giveawayStatus', {
    persistent: false,
  });

  giveawayReps.data = giveawayData;
  giveawayReps.settings = giveawaySettings;
  giveawayReps.status = giveawayStatus;
}

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Checks if a given key exists in the rep Replicant
 * @param {Replicant} rep - The replicant holding the giveaway objects
 * @param {string} key - the keyword for the giveaway
 */
export function keyExists(rep, key) {
  return Object.keys(rep.value).includes(key);
}

/**
 * Checks if a user already has an entry in the specified giveaway
 * @param {Replicant} rep - The replicant holding the giveaway objects
 * @param {string} key - the keyword for the giveaway
 * @param {string} userName - the username to be searched for
 * @returns {bool}
 */
export function entryExists(rep, key, userName) {
  let result = false;
  if (keyExists(rep, key)) {
    if (
      rep.value[key].entries.includes(userName) ||
      rep.value[key].winner.includes(userName)
    ) {
      result = true;
    }
  }
  return result;
}

/**
 * Returns an array containing keys for each giveaway the user has entered
 * @param {Replicant} rep - The replicant holding the giveaway objects
 * @param {string} userName - The user to search for
 * @returns {array<string>} The keys of each active giveaway the user has entered
 */
export function getActiveEntries(rep, userName) {
  const entryList = [];
  Object.keys(rep.value).forEach((key) => {
    if (rep.value[key].active) {
      if (
        rep.value[key].entries.includes(userName) ||
        rep.value[key].winner.includes(userName)
      ) {
        entryList.push(key);
      }
    }
  });
  return entryList;
}

/**
 * Returns a bool for the active status of a giveaway
 * @param {Replicant} rep - The replicant holding the giveaway objects
 * @param {string} key - the keyword for the giveaway
 * @return {bool} Returns true if the giveaway is active
 */
export function getActiveStatus(rep, key) {
  if (keyExists(rep, key)) {
    return rep.value[key].active;
  }
  // Failstate
  return false;
}

/**
 * Gets an array of keys for giveaways that the user was drawn for
 * @param {Replicant} rep  The replicant holding the giveaway objects
 * @param {string} userName - The user to search for
 * @returns {array<string>}
 */
export function getWinsForUser(rep, userName) {
  const winList = [];
  Object.keys(rep.value).forEach((key) => {
    if (rep.value[key].finalWinner === userName) {
      winList.push(key);
    }
  });
  return winList;
}

/**
 * Deletes a specified user's entry from the specified giveaway
 * @param {Replicant} rep - The replicant holding the giveaway objects
 * @param {string} key - the keyword for the giveaway
 * @param {string} userName - the user whose entry should be deleted
 * @return {bool} Returns true on success
 */
export function deleteEntry(rep, key, userName) {
  if (entryExists(rep, key, userName)) {
    const index = rep.value[key].entries.indexOf(userName);
    if (index !== -1) {
      rep.value[key].entries.splice(index, 1);
      return true;
    }
  }
  // Failstate
  return false;
}

/**
 * Returns an array containing each key for all stored giveaway objects
 * @param {Replicant} rep - The replicant holding the giveaway objects
 * @returns {array<string>} A list of the keywords for each stored giveaway
 */
export function getKeys(rep) {
  return Object.keys(rep?.value);
}

/**
 * Adds a giveaway with the provided data
 * @param {Replicant} rep - The replicant holding the giveaway objects
 * @param {Object} data - An object containing properties for the new giveaway
 * @return {bool} Returns true on success
 */
export function addGiveaway(rep, data) {
  const keyArray = Object.keys(data);
  if (keyArray.length === 1) {
    const key = keyArray[0];
    if (!keyExists(rep, key)) {
      const defaultGiveaway = {
        active: false,
        name: 'Default',
        winner: [],
        finalWinner: '',
        entries: [],
        newEntries: [],
      };

      const newGiveaway = Object.assign(defaultGiveaway, data[key]);
      rep.value[key] = newGiveaway;
      return true;
    }
    // say A giveaway with this key already exists
  }
  // Failstate
  return false;
}

/**
 * Sets a giveaway's properties using the data provided
 * @param {Replicant} rep - The replicant holding the giveaway objects
 * @param {string} key - the keyword for the giveaway
 * @param {Object} data - and object containing the desired changes
 * @return {bool} Returns true on success
 */
export function setGiveaway(rep, key, data) {
  if (keyExists(rep, key)) {
    Object.assign(rep.value[key], data);
    return true;
  }
  // Failstate
  return false;
}

/**
 * Deletes a giveaway
 * @param {Replicant} rep - The replicant holding the giveaway objects
 * @param {string} key - the keyword for the giveaway
 * @return {bool} Returns true on success
 */
export function deleteGiveaway(rep, key) {
  if (keyExists(rep, key)) {
    delete rep.value[key];
    return true;
  }
  // Failstate
  return false;
}

/**
 * Deletes all giveaways
 * @param {Replicant} rep - The replicant holding the giveaway objects
 * @return {bool} Returns true on success
 */
export function deleteAllGiveaways(rep) {
  const keys = getKeys(rep);
  const successes = [];
  keys.forEach((element) => {
    const result = deleteGiveaway(rep, element);
    successes.push(result);
  });
  if (successes.length !== 0 && !successes.includes(false)) {
    return true;
  }
  // Failstate
  return false;
}

/**
 * Removes all entries from a giveaway
 * @param {Replicant} rep - The replicant holding the giveaway objects
 * @param {string} key - the keyword for the giveaway
 * @return {bool} Returns true on success
 */
export function resetGiveaway(rep, key) {
  if (keyExists(rep, key)) {
    rep.value[key].entries = [];
    rep.value[key].newEntries = [];
    rep.value[key].winner = [];
    rep.value[key].finalWinner = '';
    return true;
  }
  // Failstate
  return false;
}

/**
 * Removes all entries from all active giveaways
 * @param {Replicant} rep - The replicant holding the giveaway objects
 * @return {bool} Returns true on success
 */
export function resetAllActiveGiveaways(rep) {
  const keys = getKeys(rep);
  const successes = [];
  keys.forEach((key) => {
    if (getActiveStatus(rep, key)) {
      const result = resetGiveaway(rep, key);
      successes.push(result);
    }
  });
  if (!successes.includes(false)) {
    return true;
  }
  // Failstate
  return false;
}

/**
 * Draws a random winner and updates the giveaway object
 * @param {Replicant} rep - The replicant holding the giveaway objects
 * @param {string} key - The keyword for the giveaway
 * @returns {bool} Returns true if successful
 */
export function drawGiveaway(rep, key) {
  if (keyExists(rep, key)) {
    const numEntries = rep.value[key].entries.length;
    let winningIndex;

    if (numEntries !== 0) {
      winningIndex = getRandomNumber(0, numEntries - 1);
      rep.value[key].winner.push(rep.value[key].entries[winningIndex]);
      rep.value[key].entries.splice(winningIndex, 1);
      return true;
    }
  }
  // Failstate
  return false;
}

/**
 * Confirms a giveaway winner and sets the giveaway inactive
 * @param {Replicant} rep - The replicant holding the giveaway objects
 * @param {string} key - The key of the giveaway to finalize
 * @param {string} userName - The winning user
 * @returns {bool} Returns true if successful
 */
export function finalizeGiveaway(rep, key, userName) {
  if (keyExists(rep, key)) {
    rep.value[key].finalWinner = userName;
    rep.value[key].active = false;
    return true;
  }
  // Failstate
  return false;
}

/**
 * Returns the number of entries for a giveaway
 * @param {Replicant} rep - The replicant holding the giveaway objects
 * @param {string} key - the keyword for the giveaway
 * @return {number}
 */
export function getEntryCount(rep, key) {
  if (keyExists(rep, key)) {
    return rep.value[key].entries.length + rep.value[key].winner.length;
  }
  // Failstate
  return false;
}

/**
 * Returns the number of new (unannounced) entries for a giveaway
 * @param {Replicant} rep - The replicant holding the giveaway objects
 * @param {string} key - the keyword for the giveaway
 * @return {number}
 */
export function getNewEntryCount(rep, key) {
  if (keyExists(rep, key)) {
    return rep.value[key].newEntries.length;
  }
  // Failstate
  return false;
}

/**
 * Sends a message to the channel enumerating the new and total entries.
 * @param {ChatClient} client - Twurple ChatClient object
 * @param {string} channel - the channel to send the message to
 * @param {string} key - the keyword to enter the giveaway
 * @param {Replicant} rep - The replicant holding the giveaway objects
 * @return {bool} Returns true on success
 */
function announceEntries(client, channel, key, rep) {
  if (rep.value[key].newEntries?.length >= 1) {
    const { newEntries } = rep.value[key];
    const { entries } = rep.value[key];
    const entryCount = entries.length;
    const { name } = rep.value[key];

    let chatMessageEntryText;

    switch (newEntries.length) {
      case 1:
        chatMessageEntryText = `@${newEntries[0]} entered`;
        break;
      case 2:
        chatMessageEntryText = `@${newEntries[0]} and @${newEntries[1]} entered`;
        break;
      default:
        chatMessageEntryText = `Added ${newEntries.length} new entries to`;
        break;
    }

    const chatMessage = `${chatMessageEntryText} the ${name} giveaway! 
    (${entryCount} total ${
      entryCount !== 1 ? 'entries' : 'entry'
    }) Type "${key}" to enter. You can check on your giveaway entries with !entries`;

    // Bug Hunting
    if (entryCount === 0) {
      const nodecg = getContext();
      nodecg.sendMessage('console', {
        type: 'warn',
        msg: `[Giveaway] Total Entries bug happened. Replicant:`,
      });
      nodecg.sendMessage('console', {
        type: 'warn',
        msg: rep.value[key],
      });
    }

    client.say(channel, chatMessage);
    // eslint-disable-next-line no-param-reassign
    rep.value[key].newEntries = [];
    return true;
  }
  // Failstate
  return false;
}

/**
 * Announces a given giveaway in chat
 * @param {ChatClient} client - Twurple ChatClient object
 * @param {string} channel - the channel to send the message to
 * @param {string} key - the keyword to enter the giveaway
 * @param {Replicant} rep - The replicant holding the giveaway objects
 */
export function announceGiveaway(client, channel, key, rep) {
  const { name } = rep.value[key];
  const entryCount = getEntryCount(rep, key);

  if (entryCount === 0) {
    client.say(
      channel,
      `The ${name} giveaway has started! Type "${key}" to enter. 
      You must be a follower (it's free!) to be eligible to win`
    );
  } else {
    client.say(
      channel,
      `The ${name} giveaway is currently running with ${entryCount} total ${
        entryCount !== 1 ? 'entries' : 'entry'
      }! 
      Type "${key}" to enter. You must be a follower (it's free!) to be eligible to win`
    );
  }

  setGiveaway(rep, key, { active: true });
}

function getBackgroundAsset(giveaway) {
  const nodecg = getContext();
  const settingsRep = nodecg.Replicant('giveawaySettings');
  const assetsRep = nodecg.Replicant('assets:giveaway');
  const { name } = giveaway;
  const assets = assetsRep.value;
  let isDiceGiveaway = false;

  const diceAssetName = settingsRep.value.diceBackgroundScrollAsset;
  const otherAssetName = settingsRep.value.otherBackgroundScrollAsset;

  if (typeof name === 'string' && name.toLowerCase().includes('dice')) {
    isDiceGiveaway = true;
  }

  function checkAssetName(asset) {
    if (isDiceGiveaway) {
      return asset.name === diceAssetName;
    }
    return asset.name === otherAssetName;
  }

  if (Array.isArray(assets)) {
    const asset = assets.find(checkAssetName);
    if (asset) {
      const { url } = asset;
      return url;
    }
  }
  return undefined;
}

/**
 * Finalizes a giveaway winner and announces the result to chat
 * @param {ChatClient} client - Twurple ChatClient object
 * @param {string} channel - the channel to send the message to
 * @param {string} user - The winning user
 * @param {string} key - the keyword to enter the giveaway
 * @param {Replicant} rep - The replicant holding the giveaway objects
 */
export function announceWinner(client, channel, user, key, rep) {
  const nodecg = getContext();
  const { name } = rep.value[key];
  const winner = user;
  const url = getBackgroundAsset(rep.value[key]);
  const data = {
    name,
    winner,
    url,
  };

  client.say(channel, `@${winner} has been drawn for the ${name} giveaway!`);
  nodecg.sendMessage('giveaway:winnerAnnounced', data);

  rep.value[key].finalWinner = winner;
  setGiveaway(rep, key, { active: false });
}

/**
 * Attempts to add a giveaway entry for the single corresponding keyword.
 * @param {ChatClient} client - a ChatClient object
 * @param {string} channel - Channel name prefixed with '#'
 * @param {string} user
 * @param {string} key - the keyword detected
 * @param {TwitchPrivateMessage} _msg - Raw message data
 */
// eslint-disable-next-line no-unused-vars
export function handleEntry(client, channel, user, key, _msg) {
  const nodecg = getContext();
  const rep = nodecg.Replicant('giveawayData');

  if (rep.value[key]?.active) {
    if (
      !rep.value[key].entries.includes(user) &&
      !rep.value[key].winner.includes(user)
    ) {
      rep.value[key].entries.push(user);
      rep.value[key].newEntries.push(user);
      clearTimeout(announcerTimer?.[key]);
      announcerTimer[key] = setTimeout(() => {
        announceEntries(client, channel, key, rep);
      }, 4000);
    }
  }
}
