/* eslint-disable no-param-reassign */
import { getContext } from '../util/nodecg-api-context';

// Since we aren't declaring nodecg globally, declare it inside the debug message func
// const debugMessageRep = nodecg.Replicant('debugMessageRep');

const announcerTimer = {};

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Checks if a given key exists in the giveawayRep Replicant
 * @param {Replicant} giveawayRep - The replicant holding the giveaway objects
 * @param {string} key - the keyword for the giveaway
 */
export function keyExists(giveawayRep, key) {
  return Object.keys(giveawayRep.value).includes(key);
}

/**
 * Checks if a user already has an entry in the specified giveaway
 * @param {Replicant} giveawayRep - The replicant holding the giveaway objects
 * @param {string} key - the keyword for the giveaway
 * @param {string} userName - the username to be searched for
 * @returns {bool}
 */
export function entryExists(giveawayRep, key, userName) {
  let result = false;
  if (keyExists(giveawayRep, key)) {
    if (
      giveawayRep.value[key].entries.includes(userName) ||
      giveawayRep.value[key].winner.includes(userName)
    ) {
      result = true;
    }
  }
  return result;
}

/**
 * Returns an array containing keys for each giveaway the user has entered
 * @param {Replicant} giveawayRep - The replicant holding the giveaway objects
 * @param {string} userName - The user to search for
 * @returns {array<string>} The keys of each active giveaway the user has entered
 */
export function getActiveEntries(giveawayRep, userName) {
  const entryList = [];
  Object.keys(giveawayRep.value).forEach((key) => {
    if (giveawayRep.value[key].active) {
      if (
        giveawayRep.value[key].entries.includes(userName) ||
        giveawayRep.value[key].winner.includes(userName)
      ) {
        entryList.push(key);
      }
    }
  });
  return entryList;
}

/**
 * Returns a bool for the active status of a giveaway
 * @param {Replicant} giveawayRep - The replicant holding the giveaway objects
 * @param {string} key - the keyword for the giveaway
 * @return {bool} Returns true if the giveaway is active
 */
export function getActiveStatus(giveawayRep, key) {
  if (keyExists(giveawayRep, key)) {
    return giveawayRep.value[key].active;
  }
  // Failstate
  return false;
}

/**
 * Gets an array of keys for giveaways that the user was drawn for
 * @param {Replicant} giveawayRep  The replicant holding the giveaway objects
 * @param {string} userName - The user to search for
 * @returns {array<string>}
 */
export function getWinsForUser(giveawayRep, userName) {
  const winList = [];
  Object.keys(giveawayRep.value).forEach((key) => {
    if (giveawayRep.value[key].finalWinner === userName) {
      winList.push(key);
    }
  });
  return winList;
}

/**
 * Deletes a specified user's entry from the specified giveaway
 * @param {Replicant} giveawayRep - The replicant holding the giveaway objects
 * @param {string} key - the keyword for the giveaway
 * @param {string} userName - the user whose entry should be deleted
 * @return {bool} Returns true on success
 */
export function deleteEntry(giveawayRep, key, userName) {
  if (entryExists(giveawayRep, key, userName)) {
    const index = giveawayRep.value[key].entries.indexOf(userName);
    if (index !== -1) {
      giveawayRep.value[key].entries.splice(index, 1);
      return true;
    }
  }
  // Failstate
  return false;
}

/**
 * Returns an array containing each key for all stored giveaway objects
 * @param {Replicant} giveawayRep - The replicant holding the giveaway objects
 * @returns {array<string>} A list of the keywords for each stored giveaway
 */
export function getKeys(giveawayRep) {
  return Object.keys(giveawayRep?.value);
}

/**
 * Adds a giveaway with the provided data
 * @param {Replicant} giveawayRep - The replicant holding the giveaway objects
 * @param {Object} data - An object containing properties for the new giveaway
 * @return {bool} Returns true on success
 */
export function addGiveaway(giveawayRep, data) {
  const keyArray = Object.keys(data);
  if (keyArray.length === 1) {
    const key = keyArray[0];
    if (!keyExists(giveawayRep, key)) {
      const defaultGiveaway = {
        active: false,
        name: 'Default',
        winner: [],
        finalWinner: '',
        entries: [],
        newEntries: [],
      };

      const newGiveaway = Object.assign(defaultGiveaway, data[key]);
      giveawayRep.value[key] = newGiveaway;
      return true;
    }
    // say A giveaway with this key already exists
  }
  // Failstate
  return false;
}

/**
 * Sets a giveaway's properties using the data provided
 * @param {Replicant} giveawayRep - The replicant holding the giveaway objects
 * @param {string} key - the keyword for the giveaway
 * @param {Object} data - and object containing the desired changes
 * @return {bool} Returns true on success
 */
export function setGiveaway(giveawayRep, key, data) {
  if (keyExists(giveawayRep, key)) {
    Object.assign(giveawayRep.value[key], data);
    return true;
  }
  // Failstate
  return false;
}

/**
 * Deletes a giveaway
 * @param {Replicant} giveawayRep - The replicant holding the giveaway objects
 * @param {string} key - the keyword for the giveaway
 * @return {bool} Returns true on success
 */
export function deleteGiveaway(giveawayRep, key) {
  if (keyExists(giveawayRep, key)) {
    delete giveawayRep.value[key];
    return true;
  }
  // Failstate
  return false;
}

/**
 * Deletes all giveaways
 * @param {Replicant} giveawayRep - The replicant holding the giveaway objects
 * @return {bool} Returns true on success
 */
export function deleteAllGiveaways(giveawayRep) {
  const keys = getKeys(giveawayRep);
  const successes = [];
  keys.forEach((element) => {
    const result = deleteGiveaway(giveawayRep, element);
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
 * @param {Replicant} giveawayRep - The replicant holding the giveaway objects
 * @param {string} key - the keyword for the giveaway
 * @return {bool} Returns true on success
 */
export function resetGiveaway(giveawayRep, key) {
  if (keyExists(giveawayRep, key)) {
    giveawayRep.value[key].entries = [];
    giveawayRep.value[key].newEntries = [];
    giveawayRep.value[key].winner = [];
    giveawayRep.value[key].finalWinner = '';
    return true;
  }
  // Failstate
  return false;
}

/**
 * Removes all entries from all active giveaways
 * @param {Replicant} giveawayRep - The replicant holding the giveaway objects
 * @return {bool} Returns true on success
 */
export function resetAllActiveGiveaways(giveawayRep) {
  const keys = getKeys(giveawayRep);
  const successes = [];
  keys.forEach((key) => {
    if (getActiveStatus(giveawayRep, key)) {
      const result = resetGiveaway(giveawayRep, key);
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
 * @param {Replicant} giveawayRep - The replicant holding the giveaway objects
 * @param {string} key - The keyword for the giveaway
 * @returns {bool} Returns true if successful
 */
export function drawGiveaway(giveawayRep, key) {
  if (keyExists(giveawayRep, key)) {
    const numEntries = giveawayRep.value[key].entries.length;
    let winningIndex;

    if (numEntries !== 0) {
      winningIndex = getRandomNumber(0, numEntries - 1);
      giveawayRep.value[key].winner.push(
        giveawayRep.value[key].entries[winningIndex]
      );
      giveawayRep.value[key].entries.splice(winningIndex, 1);
      return true;
    }
  }
  // Failstate
  return false;
}

/**
 * Confirms a giveaway winner and sets the giveaway inactive
 * @param {Replicant} giveawayRep - The replicant holding the giveaway objects
 * @param {string} key - The key of the giveaway to finalize
 * @param {string} userName - The winning user
 * @returns {bool} Returns true if successful
 */
export function finalizeGiveaway(giveawayRep, key, userName) {
  if (keyExists(giveawayRep, key)) {
    giveawayRep.value[key].finalWinner = userName;
    giveawayRep.value[key].active = false;
    return true;
  }
  // Failstate
  return false;
}

/**
 * Returns the number of entries for a giveaway
 * @param {Replicant} giveawayRep - The replicant holding the giveaway objects
 * @param {string} key - the keyword for the giveaway
 * @return {number}
 */
export function getEntryCount(giveawayRep, key) {
  if (keyExists(giveawayRep, key)) {
    return (
      giveawayRep.value[key].entries.length +
      giveawayRep.value[key].winner.length
    );
  }
  // Failstate
  return false;
}

/**
 * Returns the number of new (unannounced) entries for a giveaway
 * @param {Replicant} giveawayRep - The replicant holding the giveaway objects
 * @param {string} key - the keyword for the giveaway
 * @return {number}
 */
export function getNewEntryCount(giveawayRep, key) {
  if (keyExists(giveawayRep, key)) {
    return giveawayRep.value[key].newEntries.length;
  }
  // Failstate
  return false;
}

/**
 * Sends a message to the channel enumerating the new and total entries.
 * @param {ChatClient} client - Twurple ChatClient object
 * @param {string} channel - the channel to send the message to
 * @param {string} keyword - the keyword to enter the giveaway
 * @param {Replicant} giveaway - The replicant holding the giveaway objects
 * @return {bool} Returns true on success
 */
function announceEntries(client, channel, keyword, giveaway) {
  if (giveaway?.newEntries?.length >= 1) {
    client.say(
      channel,
      `Added ${giveaway.newEntries.length} new ${
        giveaway.newEntries.length === 1 ? 'entry' : 'entries'
      } to the ${giveaway.name} giveaway! 
      (Total entries: ${
        giveaway.entries.length
      }) Type "${keyword}" to enter. You can check your entry status with !entries`
    );
    // eslint-disable-next-line no-param-reassign
    giveaway.newEntries = [];
    return true;
  }
  // Failstate
  return false;
}

/**
 * Attempts to add a giveaway entry for the single corresponding keyword.
 * @param {ChatClient} client - a ChatClient object
 * @param {string} channel - Channel name prefixed with '#'
 * @param {string} user
 * @param {string} keyword - the keyword detected
 * @param {TwitchPrivateMessage} _msg - Raw message data
 */
// eslint-disable-next-line no-unused-vars
export function handleEntry(client, channel, user, keyword, _msg) {
  const nodecg = getContext();
  const giveawayRep = nodecg.Replicant('giveawayRep');

  if (giveawayRep.value[keyword]?.active) {
    if (
      !giveawayRep.value[keyword].entries.includes(user) &&
      !giveawayRep.value[keyword].winner.includes(user)
    ) {
      giveawayRep.value[keyword].entries.push(user);
      giveawayRep.value[keyword].newEntries.push(user);
      clearTimeout(announcerTimer?.[keyword]);
      announcerTimer[keyword] = setTimeout(() => {
        announceEntries(client, channel, keyword, giveawayRep.value[keyword]);
      }, 4000);
    }
  }
}
