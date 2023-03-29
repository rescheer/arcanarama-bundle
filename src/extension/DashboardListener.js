import { getContext } from './util/nodecg-api-context';
import { getChatClient, getChatChannel } from './util/twitch-api-context';

import * as Giveaway from './modules/Giveaway';
import * as Character from './modules/Character';
import * as Mixer from './modules/OSC';

// Message packet format: { COMMAND: { ARG1: value, ARG2: value, ...}}

function dashboardGiveawayHandler(data) {
  const nodecg = getContext();
  const client = getChatClient();
  const channel = getChatChannel();
  const giveawayData = nodecg.Replicant('giveawayData');

  if (typeof data === 'object') {
    const command = Object.keys(data)[0];
    const { key } = data[command];
    switch (command) {
      case 'add':
        {
          const newGiveawayData = {};
          const lowercaseKey = key.toLowerCase();

          newGiveawayData[lowercaseKey] = {
            name: data[command].name,
            active: data[command].active,
          };
          Giveaway.addGiveaway(giveawayData, newGiveawayData);
        }
        break;
      case 'delete':
        Giveaway.deleteGiveaway(giveawayData, key);
        break;
      case 'reset':
        break;
      case 'toggle':
        giveawayData.value[key].active = !giveawayData.value[key].active;
        break;
      case 'announce':
        if (client) {
          Giveaway.announceGiveaway(client, channel, key, giveawayData);
        }
        break;
      case 'draw':
        Giveaway.drawGiveaway(giveawayData, key);
        break;
      case 'announceWinner':
        if (client) {
          Giveaway.announceWinner(
            client,
            channel,
            data[command].user,
            key,
            giveawayData
          );
        }
        break;
      default:
        break;
    }
  }
}

function dashboardCharacterHandler(data, ack) {
  const command = Object.keys(data)[0];

  switch (command) {
    case 'add':
      {
        const { ddbId, player } = data[command];

        if (ack && !ack.handled) {
          Character.getBeyondData(ddbId, player)
            .then((result) => {
              Character.parseRawData(ddbId);
              ack(null, result);
            })
            .catch((error) => {
              ack(
                new Error(`Couldn't get data from D&D Beyond (error: ${error})`)
              );
            });
        }
      }
      break;
    case 'refresh':
      Character.getBeyondData(data[command].ddbId, data[command].player).then(
        () => {
          Character.parseRawData(data[command].ddbId);
        }
      );
      break;
    case 'reparse':
      Character.parseRawData(data[command].ddbId);
      break;
    case 'delete':
      Character.deleteCharacter(data[command].ddbId);
      break;
    default:
      // unrecognized command
      break;
  }
}

function dashboardMixerHandler(data, ack) {
  const nodecg = getContext();
  const statusRep = nodecg.Replicant('coreStatus');
  const command = Object.keys(data)[0];

  if (statusRep.value.mixerConnected) {
    switch (command) {
      case 'mute':
      case 'unmute':
        {
          // Args: { channel: <string>, muteBool: <bool> }
          const { channel, muteBool } = data[command];

          if (ack && !ack.handled) {
            Mixer.setChannelMute(channel, muteBool)
              .then((result) => {
                ack(null, result);
              })
              .catch((error) => {
                nodecg.sendMessage('console', {
                  type: 'error',
                  msg: `[OSC] Mute/Unmute Failed: ${error}`,
                });
                ack(new Error(`Error: ${error}`));
              });
          }
        }
        break;

      default:
        break;
    }
  } else {
    nodecg.sendMessage('console', {
      type: 'warn',
      msg: `[OSC] Ignored command '${command}': Mixer not connected.`,
    });
  }
}

export default function dashboardListener(nodecg) {
  nodecg.listenFor('giveaway', dashboardGiveawayHandler);
  nodecg.listenFor('character', dashboardCharacterHandler);
  nodecg.listenFor('mixer', dashboardMixerHandler);
}
