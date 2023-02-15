import * as Giveaway from './modules/Giveaway';
import { getContext } from './util/nodecg-api-context';
import { getChatClient, getChatChannel } from './util/chatclient-context';

function dashboardHandler(data) {
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
          const { name } = giveawayRep.value[key];
          const winner = data[command].user;

          client.say(
            channel,
            `${winner} has been drawn for the ${name} giveaway!`
          );
          giveawayRep.value[key].finalWinner = winner;
          Giveaway.setGiveaway(giveawayRep, key, { active: false });
        }
        break;
      default:
        break;
    }
  }
}

export default function dashboardListener(nodecg) {
  nodecg.listenFor('giveaway', dashboardHandler);
}
