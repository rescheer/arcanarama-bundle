import * as Giveaway from './modules/Giveaway';
import { getContext } from './util/nodecg-api-context';
import { getChatClient, getChatChannel } from './util/chatclient-context';

function dashboardGiveawayHandler(data) {
  const nodecg = getContext();
  const client = getChatClient();
  const channel = getChatChannel();
  const giveawayRep = nodecg.Replicant('giveawayRep');

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
          Giveaway.addGiveaway(giveawayRep, newGiveawayData);
        }
        break;
      case 'delete':
        Giveaway.deleteGiveaway(giveawayRep, key);
        break;
      case 'reset':
        break;
      case 'toggle':
        giveawayRep.value[key].active = !giveawayRep.value[key].active;
        break;
      case 'announce':
        if (client) {
          Giveaway.announceGiveaway(client, channel, key, giveawayRep);
        }
        break;
      case 'draw':
        Giveaway.drawGiveaway(giveawayRep, key);
        break;
      case 'announceWinner':
        if (client) {
          Giveaway.announceWinner(
            client,
            channel,
            data[command].user,
            key,
            giveawayRep
          );
        }
        break;
      default:
        break;
    }
  }
}

export default function dashboardListener(nodecg) {
  nodecg.listenFor('giveaway', dashboardGiveawayHandler);
}
