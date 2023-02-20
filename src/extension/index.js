/* eslint-disable no-unused-vars */
import { setContext } from './util/nodecg-api-context';
import ChatListener from './ChatListener';
import DashboardListener from './DashboardListener';
import debugListener from './debugListener';

export default function (nodecg) {
  setContext(nodecg);

  const statusRep = nodecg.Replicant('statusRep', {
    defaultValue: { chatConnected: null },
    persistent: false,
  });

  const vibesRep = nodecg.Replicant('vibesRep', {
    defaultValue: [],
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

  const giveawaySettingsRep = nodecg.Replicant('settings:giveaway', {
    defaultValue: {
      diceBackgroundScrollAsset: 'WINNER_dice_BG',
      otherBackgroundScrollAsset: 'WINNER_minis_BG',
    },
  });

  ChatListener(nodecg);
  DashboardListener(nodecg);
  debugListener(nodecg);

  // TODO: debugMessageRep event listener

  // TODO: Commands/Timers
  // TODO: Nat 20/Nat 1 announcements with per-player stats
  // TODO: Sub/Follow Alerts
  // TODO: Spotify Connect(song info)
  // TODO: Discord Connect(twitch chat / stream message when someone joins the discord)
}
