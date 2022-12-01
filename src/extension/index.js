/* eslint-disable no-unused-vars */
import { setContext } from './util/nodecg-api-context';
import ChatListener from './ChatListener';
import DashboardListener from './DashboardListener';

export default function (nodecg) {
  setContext(nodecg);

  const utilityItemList = nodecg.Replicant('utilityItemList', {
    defaultValue: [],
  });

  // TODO: currentUtilityItem needs a default, and should not persist
  const currentUtilityItem = nodecg.Replicant('currentUtilityItem', {
    defaultValue: {},
  });

  const lastUtilityItem = nodecg.Replicant('lastUtilityItem', {
    defaultValue: 'none',
    persistent: false,
  });

  const debugMessageRep = nodecg.Replicant('debugMessageRep', {
    defaultValue: { active: true, destination: 'log', msg: '' },
    persistent: false,
  });

  const statusRep = nodecg.Replicant('statusRep', {
    defaultValue: { chatConnected: null },
    persistent: false,
  });

  const giveawayRep = nodecg.Replicant('giveawayRep', {
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

  ChatListener(nodecg);
  DashboardListener(nodecg);

  // TODO: debugMessageRep event listener

  // TODO: Commands/Timers
  // TODO: Nat 20/Nat 1 announcements with per-player stats
  // TODO: Sub/Follow Alerts
  // TODO: Spotify Connect(song info)
  // TODO: Discord Connect(twitch chat / stream message when someone joins the discord)
}
