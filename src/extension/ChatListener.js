/* eslint-disable prefer-destructuring */
/* eslint-disable no-unused-vars */
import { requireService } from 'nodecg-io-core';
import * as Giveaway from './modules/Giveaway';
import { getContext } from './util/nodecg-api-context';
import { getVibeCheck } from './modules/CommonActions';
import { setChatClient, setChatChannel } from './util/chatclient-context';

// TODO: Build a new Handler module for commands from any source

/**
 * Tests all incoming messages and passes them to handlers.
 * @param {ChatClient} client - Ref: https://twurple.js.org/reference/chat/classes/ChatClient.html
 * @param {string} channel - Channel name prefixed with '#'
 * @param {string} user
 * @param {string} message
 * @param {TwitchPrivateMessage} _msg - Ref: https://twurple.js.org/reference/chat/classes/TwitchPrivateMessage.html
 */
function handleMessage(client, channel, user, message, _msg) {
  const nodecg = getContext();
  const giveawayRep = nodecg.Replicant('giveawayRep');

  // First, check for commands
  if (
    typeof message === 'string' &&
    _msg.userInfo.displayName !== 'autonorama' &&
    _msg.userInfo.displayName !== 'Moobot'
  ) {
    if (
      message.startsWith('!') &&
      message.length > 1 &&
      message.charAt(1) !== ' '
    ) {
      // Split message into array and get command
      const splitMessage = message.split(' ');
      const command = splitMessage[0].slice(1);

      // Get a lowercase array of params, but drop empty strings
      let params;
      let paramsPreservedCase;
      if (splitMessage.length > 1) {
        const dirtyParams = splitMessage.slice(1).filter((str) => str !== '');
        if (dirtyParams[0] === undefined) {
          params = undefined;
        } else {
          params = dirtyParams.map((element) => element.toLowerCase());
          paramsPreservedCase = dirtyParams;
        }
      }

      // Route Commands here
      switch (command.toLowerCase()) {
        // General Commands
        case 'vibecheck':
        case 'vibes':
        case 'vc':
          client.say(channel, getVibeCheck(user));
          break;
        case 'entries':
          {
            const entryList = Giveaway.getActiveEntries(giveawayRep, user);
            if (entryList.length !== 0) {
              const entryListNames = [];
              entryList.forEach((element) => {
                entryListNames.push(giveawayRep.value[element].name);
              });
              client.say(
                channel,
                `You are currently entered in ${entryList.length} active ${
                  entryList.length === 1 ? 'giveaway' : 'giveaways'
                }: ${entryListNames.toString()}`,
                { replyTo: _msg.id }
              );
            } else {
              client.say(
                channel,
                `You are not currently entered in any active giveaways.`,
                { replyTo: _msg.id }
              );
            }
          }
          break;
        case 'claim':
          {
            const winKeys = Giveaway.getActiveWins(giveawayRep, user);
            const winNames = [];

            if (winKeys.length > 0) {
              winKeys.forEach((key) => {
                winNames.push(giveawayRep.value[key].name);
                Giveaway.finalizeGiveaway(giveawayRep, key, user);
              });
              client.say(
                channel,
                `${user} claimed the following ${
                  winNames.length === 1 ? 'giveaway' : 'giveaways'
                }: ${winNames.toString()}! ${
                  winNames.length === 1 ? 'It is' : 'They are'
                } now closed`
              );
            }
          }
          break;
        // Mod-Only Commands
        case 'giveaway':
        case 'g':
          if (_msg.userInfo.isMod || _msg.userInfo.isBroadcaster) {
            if (params !== undefined) {
              switch (params[0]) {
                case 'list':
                case 'l':
                  {
                    const keys = Giveaway.getKeys(giveawayRep);
                    const activeKeys = [];
                    const inactiveKeys = [];

                    keys.forEach((key) => {
                      if (giveawayRep.value[key]?.active) {
                        activeKeys.push(key);
                      } else {
                        inactiveKeys.push(key);
                      }
                    });
                    if (activeKeys.length === 0 && inactiveKeys.length === 0) {
                      client.say(channel, `No giveaways found`);
                    } else {
                      if (activeKeys.length !== 0) {
                        client.say(
                          channel,
                          `Current active giveaway keywords: ${activeKeys.toString()}`
                        );
                      } else {
                        client.say(
                          channel,
                          `There are currently no active giveaways`
                        );
                      }

                      if (inactiveKeys.length !== 0) {
                        client.say(
                          channel,
                          `Current inactive giveaway keywords: ${inactiveKeys.toString()}`
                        );
                      } else {
                        client.say(
                          channel,
                          `There are currently no inactive giveaways`
                        );
                      }
                    }
                  }
                  break;
                case 'info':
                case 'i':
                  if (params.length > 1) {
                    if (Giveaway.keyExists(giveawayRep, params[1])) {
                      const key = params[1];
                      const fullName = giveawayRep.value[key].name;
                      const status = giveawayRep.value[key].active;
                      const numEntries = giveawayRep.value[key].entries.length;

                      client.say(
                        channel,
                        `Giveaway info: Keyword: "${key}", 
                        Name: "${fullName}" 
                        Active: ${status}, 
                        Total Entries: ${numEntries}`
                      );
                    } else {
                      client.say(
                        channel,
                        `Giveaway with key ${params[1]} not found. 
                        Current keys are: ${Object.keys(
                          giveawayRep.value
                        ).toString()}`
                      );
                    }
                  } else {
                    // syntax msg
                  }
                  break;
                case 'draw':
                case 'd':
                  if (params.length > 1) {
                    const key = params[1];
                    if (Giveaway.drawGiveaway(giveawayRep, key)) {
                      const winner = giveawayRep.value[key].winner.slice(-1);
                      const giveawayName = giveawayRep.value[key].name;
                      client.say(
                        channel,
                        `${winner} was drawn for the ${giveawayName} giveaway! 
                        ${winner}, please type "!claim" in chat to confirm`
                      );
                    } else if (Giveaway.keyExists(giveawayRep, key)) {
                      const giveawayName = giveawayRep.value[key].name;
                      client.say(
                        channel,
                        `${giveawayName} giveaway drawing failed: No entries`
                      );
                    }
                  }
                  break;
                case 'reset':
                case 'r':
                  switch (params[1]) {
                    case 'all':
                      if (Giveaway.resetAllActiveGiveaways(giveawayRep)) {
                        client.say(channel, `Resetting all giveaways.`);
                      } else {
                        // TODO: DEBUGMSG
                      }
                      break;
                    default:
                      if (params[1] !== undefined) {
                        const key = params[1];
                        if (Giveaway.resetGiveaway(giveawayRep, key)) {
                          client.say(
                            channel,
                            `Resetting giveaway with key ${key}.`
                          );
                        } else {
                          client.say(
                            channel,
                            `Giveaway with key ${
                              params[1]
                            } not found. Current keys are: ${Object.keys(
                              giveawayRep.value
                            ).toString()}`
                          );
                        }
                      }
                      break;
                  }
                  break;
                case 'set':
                case 's':
                  if (params.length >= 3) {
                    const key = params[1];
                    let newActiveState = false;
                    switch (params[2]) {
                      case 'active':
                      case 'a':
                      case 'on':
                        newActiveState = true;
                        if (Object.keys(giveawayRep.value).includes(key)) {
                          giveawayRep.value[key].active = newActiveState;
                          client.say(
                            channel,
                            `Giveaway with key ${key} is now ${
                              giveawayRep.value[key].active
                                ? 'active'
                                : 'inactive'
                            }.`
                          );
                        }
                        break;
                      case 'inactive':
                      case 'i':
                      case 'off':
                        newActiveState = false;
                        if (Object.keys(giveawayRep.value).includes(key)) {
                          giveawayRep.value[key].active = newActiveState;
                          client.say(
                            channel,
                            `Giveaway with key ${key} is now ${
                              giveawayRep.value[key].active
                                ? 'Active'
                                : 'Inactive'
                            }`
                          );
                        }
                        break;
                      default:
                        break;
                    }
                  }
                  break;
                case 'add':
                case 'a':
                  if (
                    params.length >= 3 &&
                    (params[2] === 'active' || params[2] === 'inactive')
                  ) {
                    const key = params[1];
                    const data = {};
                    data[key] = {};
                    const fullName = paramsPreservedCase
                      .slice(3)
                      .toString()
                      .replaceAll(',', ' ');

                    if (key === 'all') {
                      client.say(channel, `'all' cannot be used as a keyword`);
                      break;
                    }

                    data[key].name = fullName;
                    data[key].active = false;
                    if (params[2] === 'active') {
                      data[key].active = true;
                    }

                    if (Giveaway.addGiveaway(giveawayRep, data)) {
                      client.say(
                        channel,
                        `Added ${
                          data[key].active ? 'active' : 'inactive'
                        } giveaway '${fullName}' with keyword '${key}'`
                      );
                    } else {
                      client.say(
                        channel,
                        `A giveaway with keyword '${key}' already exists`
                      );
                    }
                  } else {
                    client.say(
                      channel,
                      `Add Giveaway syntax is: !giveaway add [keyword] [active/inactive] 
                      [Name (spaces allowed)]`
                    );
                  }
                  break;
                case 'delete':
                  if (params.length > 1) {
                    const key = params[1];
                    if (key === 'all') {
                      if (Giveaway.deleteAllGiveaways(giveawayRep)) {
                        client.say(channel, `All giveaways deleted`);
                      } else {
                        client.say(channel, `No giveaways found to delete`);
                      }
                    } else if (Giveaway.deleteGiveaway(giveawayRep, key)) {
                      client.say(
                        channel,
                        `Giveaway with keyword ${key} deleted`
                      );
                    } else {
                      client.say(
                        channel,
                        `Giveaway with keyword ${key} not found.  Current keywords are:
                        ${Object.keys(giveawayRep.value).toString()}`
                      );
                    }
                  }
                  break;
                default:
                  break;
              }
            }
          }
          break;
        default:
          break;
      }
    }

    // Other tests run here

    // Giveaway Keyword Check
    Object.keys(giveawayRep.value).forEach((key) => {
      // Check for the keyword, but ignore the keyword if part of a command
      if (
        message.toLowerCase().includes(key.toLowerCase()) &&
        !message.toLowerCase().startsWith('!')
      ) {
        Giveaway.handleEntry(client, channel, user, key, _msg);
      }
    });
  }
}

function addListeners(nodecg, client, channel) {
  client
    .join(channel)
    .then(() => {
      nodecg.log.info(`Connected to twitch channel "${channel}"`);

      client.onMessage((chan, user, message, _msg) => {
        handleMessage(client, chan, user, message, _msg);
      });
    })
    .catch((reason) => {
      nodecg.log.error(`Couldn't connect to twitch: ${reason}.`);
      nodecg.log.info('Retrying in 5 seconds.');
      setTimeout(() => addListeners(nodecg, client, channel), 5000);
    });
}

export default function ChatListener(nodecg) {
  // Require the twitch service.
  const twitch = requireService(nodecg, 'twitch-chat');
  const statusRep = nodecg.Replicant('statusRep');

  // Hardcoded channels for testing purposes.
  // Note that this does need a # before the channel name and is case-insensitive.
  const twitchChannels = ['#arcanarama'];

  // Once the service instance has been set we add listeners for messages in the corresponding channels.
  twitch?.onAvailable((client) => {
    nodecg.log.info(
      'Twitch chat client has been updated, adding handlers for messages.'
    );

    twitchChannels.forEach((channel) => {
      // client.say(channel, `connected to ${channel}! how wild is that`);
      setChatClient(client);
      setChatChannel(channel);
      statusRep.value.chatConnected = true;
    });

    twitchChannels.forEach((channel) => {
      addListeners(nodecg, client, channel);
    });
  });

  twitch?.onUnavailable(() => {
    nodecg.log.info('Twitch chat client has been unset.');
    setChatClient(undefined);
    setChatChannel(undefined);
    statusRep.value.chatConnected = false;
  });
}
