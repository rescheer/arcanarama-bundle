/* eslint-disable no-unused-vars */
import { setContext } from './util/nodecg-api-context';
import ChatListener from './ChatListener';
import DashboardListener from './DashboardListener';
import debugListener from './debugListener';
import { initGiveaway } from './modules/Giveaway';
import { initVibes } from './modules/VibeCheck';
import { initMixer } from './modules/OSC';
import { initTwitchAuth } from './modules/Twitch';
import { initNotifier } from './modules/Notifier';
import { initMessenger } from './modules/Messenger';

export default function (nodecg) {
  setContext(nodecg);

  const coreStatus = nodecg.Replicant('coreStatus', {
    defaultValue: {
      twitchAuth: false,
      chatConnected: false,
      eventSubConnected: false,
      mixerConnected: false,
      vibeCheckReady: false,
      giveawayReady: false,
      notifierReady: false,
      messengerReady: false,
    },
    persistent: false,
  });

  const charactersRep = nodecg.Replicant('characters', {
    defaultValue: {},
  });

  let playersArray;
  if (nodecg.bundleConfig.players) {
    playersArray = nodecg.bundleConfig.players;
  } else {
    nodecg.log.warn('Players not found in bundle config. Using default');
  }

  const defaultPlayerRep = {};
  if (Array.isArray(playersArray) && playersArray.length > 0) {
    playersArray.forEach((player) => {
      defaultPlayerRep[player] = {
        activeCharacter: 0,
        seat: 0,
        mixer: {
          channel: 0,
          monitorBus: 0,
          micEnabled: true,
          gateEnabled: true,
        },
      };
    });
  }

  defaultPlayerRep.Guest = {
    activeCharacter: 0,
    seat: 0,
    mixer: {
      channel: 0,
      monitorBus: 0,
      micEnabled: true,
      gateEnabled: true,
    },
  };

  const playersRep = nodecg.Replicant('players', {
    defaultValue: defaultPlayerRep,
  });

  Object.keys(playersRep.value).forEach((player) => {
    playersRep.value[player].activeCharacter = 0;
  });

  ChatListener(nodecg);
  DashboardListener(nodecg);
  debugListener(nodecg);

  initVibes(nodecg);
  initGiveaway(nodecg);
  initMixer(nodecg);
  // initTwitchAuth();
  initNotifier(nodecg);
  initMessenger(nodecg);

  // TODO: Commands/Timers
  // TODO: Spotify Connect(song info)
  // TODO: Discord Connect(twitch chat / stream message when someone joins the discord)
}
