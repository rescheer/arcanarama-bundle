import { getContext } from '../util/nodecg-api-context';

// eslint-disable-next-line import/prefer-default-export
export function initNotifier(nodecg) {
  // Set up Replicant
  const playersRep = nodecg.Replicant('players');
  const notificationsRep = nodecg.Replicant('notifications', {
    defaultValue: {},
    persistent: false,
  });

  Object.keys(playersRep.value).forEach((player) => {
    notificationsRep.value[player] = [];
  });
}

export function addNotification(noteData, sendToPlayers = []) {
  // noteData object structure: {
  // text: The string displayed on the notification
  // duration: (default: 10000) - The time in ms to display the notification
  // variant: (default: 'default')  - passed to the snackBar component (info, warning, error)
  // }

  const nodecg = getContext();
  const { text, duration = 10000, variant = 'default' } = noteData;
  const playersRep = nodecg.Replicant('players');
  const notificationsRep = nodecg.Replicant('notifications');
  const fullPlayerList = Object.keys(playersRep.value);
  let verifiedPlayerList;
  const newNotificationsRepValue = notificationsRep?.value;

  if (!text) {
    nodecg.sendMessage('console', {
      type: 'warn',
      msg: '[Notifier] Note with no text skipped.',
    });
    return null;
  }

  if (newNotificationsRepValue) {
    if (sendToPlayers.length > 0) {
      if (
        !sendToPlayers.every((playerName) =>
          fullPlayerList.includes(playerName)
        )
      ) {
        nodecg.sendMessage('console', {
          type: 'warn',
          msg: `[Notifier] Note to invalid player name skipped. (sendToPlayers: ${sendToPlayers.join(
            ', '
          )})`,
        });
        return null;
      }
      verifiedPlayerList = sendToPlayers;
    } else {
      verifiedPlayerList = fullPlayerList;
    }

    verifiedPlayerList.forEach((playerName) => {
      newNotificationsRepValue.value[playerName].push({
        text,
        variant,
        duration,
      });
    });

    notificationsRep.value = newNotificationsRepValue;
    return null;
  }
  nodecg.sendMessage('console', {
    type: 'error',
    msg: '[Notifier] Notifications Replicant was undefined when trying to add a note',
  });
  return null;
}
