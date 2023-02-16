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
 * @param {string} key - the keyword to enter the giveaway
 * @param {Replicant} giveawayRep - The replicant holding the giveaway objects
 * @return {bool} Returns true on success
 */
function announceEntries(client, channel, key, giveawayRep) {
  if (giveawayRep.value[key].newEntries?.length >= 1) {
    const { newEntries } = giveawayRep.value[key];
    const { entries } = giveawayRep.value[key];
    const { name } = giveawayRep.value[key];

    let chatMessageEntryText;

    switch (newEntries.length) {
      case 1:
        chatMessageEntryText = `${newEntries[0]} entered`;
        break;
      case 2:
        chatMessageEntryText = `${newEntries[0]} and ${newEntries[1]} entered`;
        break;
      default:
        chatMessageEntryText = `Added ${newEntries.length} new entries to`;
        break;
    }

    const chatMessage = `${chatMessageEntryText} the ${name} giveaway! 
    (${entries.length} total entries) Type "${key}" to enter. You can check on your giveaway entries with !entries`;

    client.say(channel, chatMessage);
    // eslint-disable-next-line no-param-reassign
    giveawayRep.value[key].newEntries = [];
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
 * @param {Replicant} giveawayRep - The replicant holding the giveaway objects
 */
export function announceGiveaway(client, channel, key, giveawayRep) {
  const { name } = giveawayRep.value[key];
  const entryCount = getEntryCount(giveawayRep, key);

  if (entryCount === 0) {
    client.say(
      channel,
      `The ${name} giveaway has started! Type "${key}" to enter. 
      You must be a follower (it's free!) to be eligible to win`
    );
  } else {
    client.say(
      channel,
      `The ${name} giveaway is currently running with ${entryCount} total entries! 
      Type "${key}" to enter. You must be a follower (it's free!) to be eligible to win`
    );
  }

  setGiveaway(giveawayRep, key, { active: true });
}

/**
 * Finalizes a giveaway winner and announces the result to chat
 * @param {ChatClient} client - Twurple ChatClient object
 * @param {string} channel - the channel to send the message to
 * @param {string} user - The winning user
 * @param {string} key - the keyword to enter the giveaway
 * @param {Replicant} giveawayRep - The replicant holding the giveaway objects
 */
export function announceWinner(client, channel, user, key, giveawayRep) {
  const { name } = giveawayRep.value[key];
  const winner = user;

  client.say(channel, `${winner} has been drawn for the ${name} giveaway!`);

  giveawayRep.value[key].finalWinner = winner;
  setGiveaway(giveawayRep, key, { active: false });
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
  const giveawayRep = nodecg.Replicant('giveawayRep');

  if (giveawayRep.value[key]?.active) {
    if (
      !giveawayRep.value[key].entries.includes(user) &&
      !giveawayRep.value[key].winner.includes(user)
    ) {
      giveawayRep.value[key].entries.push(user);
      giveawayRep.value[key].newEntries.push(user);
      clearTimeout(announcerTimer?.[key]);
      announcerTimer[key] = setTimeout(() => {
        announceEntries(client, channel, key, giveawayRep);
      }, 4000);
    }
  }
}
