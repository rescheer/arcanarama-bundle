let chatClient;
let chatChannel;
let twitchAuthProvider;

export function getChatClient() {
  return chatClient;
}
export function setChatClient(c) {
  chatClient = c;
}

export function getChatChannel() {
  return chatChannel;
}
export function setChatChannel(c) {
  chatChannel = c;
}

export function getTwitchAuthProvider() {
  return twitchAuthProvider;
}
export function setTwitchAuthProvider(c) {
  twitchAuthProvider = c;
}
