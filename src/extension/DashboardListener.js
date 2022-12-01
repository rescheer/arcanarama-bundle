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
          newGiveawayData[key] = {
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
          const { name } = giveawayRep.value[key];
          client.say(
            channel,
            `The ${name} giveaway is now open! Type "${key}" to enter!`
          );

          Giveaway.setGiveaway(giveawayRep, key, { active: true });
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
