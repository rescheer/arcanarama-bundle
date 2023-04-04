import { getContext } from '../util/nodecg-api-context';
import { addNotification } from './Notifier';

export function initMessenger(nodecg) {
  const playersRep = nodecg.Replicant('players');
  const messengerRep = nodecg.Replicant('messenger', {
    defaultValue: {},
    persistent: false,
  });
  const playerNamesArray = Object.keys(playersRep.value);

  playerNamesArray.forEach((player) => {
    messengerRep.value[player] = [];
  });

  nodecg.sendMessage('console', {
    type: 'info',
    msg: '[Messenger] Module Ready',
  });
}

export function sendMessageTo(recipientArray, data) {
  const nodecg = getContext();
  const playersRep = nodecg.Replicant('players');
  const messengerRep = nodecg.Replicant('messenger');
  const playerNamesArray = Object.keys(playersRep.value);
  const { from, to, message } = data;

  if (recipientArray.length > 0) {
    if (
      recipientArray.every((playerName) =>
        playerNamesArray.includes(playerName)
      )
    ) {
      const messagePacket = { from, to, message };
      messagePacket.readTimestamp = '';
      messagePacket.sentTimestamp = Date.now();

      recipientArray.forEach((recipient) => {
        messengerRep.value[recipient].push(messagePacket);
        addNotification(
          {
            text: `New Message from ${from}`,
            duration: 30000,
            variant: 'error',
          },
          [recipient]
        );
      });
    } else {
      nodecg.sendMessage('console', {
        type: 'error',
        msg: '[Messenger] Invalid recipient.',
      });
    }
  } else {
    nodecg.sendMessage('console', {
      type: 'error',
      msg: '[Messenger] Undefined recipient.',
    });
  }
}

export function deleteMessage(recipient, messageIndex) {
  const nodecg = getContext();
  const playersRep = nodecg.Replicant('players');
  const messengerRep = nodecg.Replicant('messenger');
  const playerNamesArray = Object.keys(playersRep.value);

  if (recipient.length > 0) {
    if (playerNamesArray.includes(recipient)) {
      messengerRep.value[recipient].splice(messageIndex, 1);
    }
  }
}

export function clearMessages(recipient) {
  const nodecg = getContext();
  const playersRep = nodecg.Replicant('players');
  const messengerRep = nodecg.Replicant('messenger');
  const playerNamesArray = Object.keys(playersRep.value);

  if (recipient.length > 0) {
    if (playerNamesArray.includes(recipient)) {
      messengerRep.value[recipient] = [];
    }
  }
}
