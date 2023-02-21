// Eventually we'll switch to the Twitch API for chat, so
// this file will have additional functions
/* eslint-disable import/prefer-default-export */

// import { getContext } from '../util/nodecg-api-context';
import { getChatChannel, getChatClient } from '../util/chatclient-context';

export function send(msg, replyTo) {
  const chatClient = getChatClient();
  const chatChannel = getChatChannel();

  if (chatClient && chatChannel) {
    if (replyTo) {
      chatClient.say(chatChannel, msg, { replyTo });
    } else {
      chatClient.say(chatChannel, msg);
    }
  }
}
