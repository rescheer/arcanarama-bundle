/* eslint-disable no-unused-vars */
import { setContext } from './util/nodecg-api-context';
import { initGiveaway } from './modules/Giveaway';
import { initVibes } from './modules/VibeCheck';
import ChatListener from './ChatListener';
import DashboardListener from './DashboardListener';
import debugListener from './debugListener';
import { initMixer } from './modules/OSC';
import { initTwitchAuth } from './modules/Twitch';

export default function (nodecg) {
  setContext(nodecg);

  let playersArray;
  if (nodecg.bundleConfig.players) {
    playersArray = nodecg.bundleConfig.players;
  } else {
    nodecg.log.warn('Players not found in bundle config. Using default');
  }

  const coreStatus = nodecg.Replicant('coreStatus', {
    defaultValue: {
      chatConnected: null,
      twitchConnected: null,
      mixerConnected: false,
    },
    persistent: false,
  });

  const charactersRep = nodecg.Replicant('characters', {
    defaultValue: {},
  });

  const defaultPlayerRep = {};
  if (Array.isArray(playersArray) && playersArray.length > 0) {
    playersArray.forEach((player) => {
      defaultPlayerRep[player] = {
        activeCharacter: undefined,
        seat: undefined,
        mixer: {
          channel: undefined,
          micEnabled: true,
        },
      };
    });
  }

  defaultPlayerRep.Guest = {
    activeCharacter: undefined,
    seat: undefined,
    mixer: {
      channel: undefined,
      micEnabled: true,
    },
  };

  const playersRep = nodecg.Replicant('players', {
    defaultValue: defaultPlayerRep,
  });

  initVibes(nodecg);
  initGiveaway(nodecg);
  ChatListener(nodecg);
  DashboardListener(nodecg);
  debugListener(nodecg);
  initMixer(nodecg);
  initTwitchAuth();

  // TODO: Commands/Timers
  // TODO: Spotify Connect(song info)
  // TODO: Discord Connect(twitch chat / stream message when someone joins the discord)
}
