/* eslint-disable no-unused-vars */
import { setContext } from './util/nodecg-api-context';
import { initGiveaway } from './modules/Giveaway';
import { initVibes } from './modules/VibeCheck';
import ChatListener from './ChatListener';
import DashboardListener from './DashboardListener';
import debugListener from './debugListener';
import { initMixer, sendTestMessage } from './modules/OSC';

export default function (nodecg) {
  setContext(nodecg);

  const coreStatus = nodecg.Replicant('coreStatus', {
    defaultValue: { chatConnected: null, mixerConnected: false },
    persistent: false,
  });

  const charactersRep = nodecg.Replicant('characters', {
    defaultValue: [],
  });

  initVibes(nodecg);
  initGiveaway(nodecg);
  ChatListener(nodecg);
  DashboardListener(nodecg);
  debugListener(nodecg);
  initMixer(nodecg);
  sendTestMessage();

  // TODO: Commands/Timers
  // TODO: Nat 20/Nat 1 announcements with per-player stats
  // TODO: Sub/Follow Alerts
  // TODO: Spotify Connect(song info)
  // TODO: Discord Connect(twitch chat / stream message when someone joins the discord)
}
