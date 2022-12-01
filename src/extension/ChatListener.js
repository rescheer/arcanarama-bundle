import { requireService } from 'nodecg-io-core';
import { setChatClient, setChatChannel } from './util/chatclient-context';
import handleMessage from './ChatHandler';

function addListeners(nodecg, client, channel) {
  client
    .join(channel)
    .then(() => {
      nodecg.log.info(`Connected to twitch channel "${channel}"`);

      client.onMessage((chan, user, message, _msg) => {
        handleMessage(client, chan, user, message, _msg);
      });
    })
    .catch((reason) => {
      nodecg.log.error(`Couldn't connect to twitch: ${reason}.`);
      nodecg.log.info('Retrying in 5 seconds.');
      setTimeout(() => addListeners(nodecg, client, channel), 5000);
    });
}

export default function ChatListener(nodecg) {
  // Require the twitch service.
  const twitch = requireService(nodecg, 'twitch-chat');
  const statusRep = nodecg.Replicant('statusRep');

  // Hardcoded channels for testing purposes.
  // Note that this does need a # before the channel name and is case-insensitive.
  const twitchChannels = ['#arcanarama'];

  // Once the service instance has been set we add listeners for messages in the corresponding channels.
  twitch?.onAvailable((client) => {
    nodecg.log.info(
      'Twitch chat client has been updated, adding handlers for messages.'
    );

    twitchChannels.forEach((channel) => {
      client.say(channel, `connected to ${channel}! how wild is that`);
      setChatClient(client);
      setChatChannel(channel);
      statusRep.value.chatConnected = true;
    });

    twitchChannels.forEach((channel) => {
      addListeners(nodecg, client, channel);
    });
  });

  twitch?.onUnavailable(() => {
    nodecg.log.info('Twitch chat client has been unset.');
    setChatClient(undefined);
    setChatChannel(undefined);
    statusRep.value.chatConnected = false;
  });
}
