import { RefreshingAuthProvider } from '@twurple/auth';
import { ApiClient } from '@twurple/api';
import { EventSubWsListener } from '@twurple/eventsub-ws';

// Ours
import { getContext } from '../util/nodecg-api-context';
import * as TwitchContext from '../util/twitch-api-context';
import { addNotification } from './Notifier';

let subSpamTimerId;
const subSpamEvents = [];

const NOTE_NEWSUB_AUTOHIDE = 10 * 1000;
const NOTE_RESUB_AUTOHIDE = 10 * 1000;
const NOTE_GIFTER_AUTOHIDE = 10 * 1000;
const NOTE_GIFTWINS_AUTOHIDE = 10 * 1000;
const NOTE_RAID_AUTOHIDE = 15 * 1000;
const NOTE_FOLLOW_AUTOHIDE = 5 * 1000;

export function send(msg, replyTo) {
  const chatClient = TwitchContext.getChatClient();
  const chatChannel = TwitchContext.getChatChannel();

  if (chatClient && chatChannel) {
    if (replyTo) {
      chatClient.say(chatChannel, msg, { replyTo });
    } else {
      chatClient.say(chatChannel, msg);
    }
  }
}

function parseTier(tier, long = true) {
  let result;

  if (long) {
    switch (tier) {
      case 1000:
      case '1000':
        result = '';
        break;
      case 2000:
      case '2000':
        result = ' at Tier 2';
        break;
      case 3000:
      case '3000':
        result = ' at Tier 3';
        break;
      default:
        result = '';
        getContext().sendMessage('console', {
          type: 'warn',
          msg: `[parseTier] Unidentifiable tier returned: ${tier}`,
        });
        break;
    }
  } else {
    switch (tier) {
      case 1000:
      case '1000':
        result = '';
        break;
      case 2000:
      case '2000':
        result = ' (T2)';
        break;
      case 3000:
      case '3000':
        result = ' (T3)';
        break;
      default:
        result = '';
        getContext().sendMessage('console', {
          type: 'warn',
          msg: `[parseTier] Unidentifiable tier returned: ${tier}`,
        });
        break;
    }
  }

  return result;
}

function handleDelayedSubEvent() {
  if (subSpamEvents.length > 0) {
    const newSubs = [];
    subSpamEvents.forEach((event) => {
      const { userDisplayName, tier } = event;
      const tierReadable = parseTier(tier, false);

      newSubs.push(`${userDisplayName}${tierReadable}`);
    });
    const newSubsString = `GIFT WINNERS: ${newSubs.join(', ')}`;

    addNotification({
      text: newSubsString,
      duration: NOTE_GIFTWINS_AUTOHIDE,
      variant: 'success',
    });
  }
}

function addToDelayedSubEvent(event) {
  if (!subSpamTimerId) {
    subSpamEvents.push(event);
    subSpamTimerId = setTimeout(handleDelayedSubEvent, 3000);
  } else {
    clearTimeout(subSpamTimerId);
    subSpamTimerId = undefined;
    subSpamEvents.push(event);
    subSpamTimerId = setTimeout(handleDelayedSubEvent, 3000);
  }
}

function handleIncomingRaidEvent(event) {
  const { raidingBroadcasterDisplayName, viewers } = event;

  addNotification({
    text: `${raidingBroadcasterDisplayName} is raiding with ${viewers} viewers!`,
    duration: NOTE_RAID_AUTOHIDE,
    variant: 'info',
  });
}

function handleGiftSubEvent(event) {
  const { amount, cumulativeAmount, gifterDisplayName, isAnonymous } = event;

  let message;
  if (!isAnonymous) {
    if (cumulativeAmount) {
      message = `${gifterDisplayName} gifted ${amount} subs! (Total Gifts: ${cumulativeAmount})`;
    } else {
      message = `${gifterDisplayName} gifted ${amount} subs!`;
    }
  }

  addNotification({
    text: message,
    duration: NOTE_GIFTER_AUTOHIDE,
    variant: 'info',
  });
}

function handleResubEvent(event) {
  const {
    userDisplayName,
    tier,
    cumulativeMonths,
    durationMonths,
    streakMonths,
    messageText,
  } = event;

  const tierReadable = parseTier(tier);

  let durationReadable;
  if (durationMonths > 1) {
    durationReadable = ` (${durationMonths} month prepaid sub!)`;
  } else {
    durationReadable = '';
  }

  let streakReadable;
  if (streakMonths > 1) {
    // eslint-disable-next-line no-unused-vars
    streakReadable = ` | Streak: ${streakMonths} months`;
  }

  const subInfo = `RESUB: ${userDisplayName}${durationReadable}${tierReadable}`;
  const monthsInfo = `(Subbed for ${cumulativeMonths} ${
    cumulativeMonths === 1 ? 'month' : 'months'
  })`;
  const message = `${subInfo} ${monthsInfo} Msg: "${messageText}"`;

  addNotification({
    text: message,
    duration: NOTE_RESUB_AUTOHIDE,
    variant: 'success',
  });
}

function handleSubEvent(event) {
  const { isGift, tier, userDisplayName } = event;

  if (!isGift) {
    const tierReadable = parseTier(tier);
    const message = `NEW SUB: ${userDisplayName}${tierReadable}`;

    addNotification({
      text: message,
      duration: NOTE_NEWSUB_AUTOHIDE,
      variant: 'success',
    });
  } else {
    addToDelayedSubEvent(event);
  }
}

function handleChannelFollowEvent(event) {
  const { userDisplayName } = event;

  const message = `NEW FOLLOWER: ${userDisplayName}`;

  addNotification({
    text: message,
    duration: NOTE_FOLLOW_AUTOHIDE,
    variant: 'default',
  });
}

function initTwitchEventSub(user, authProvider) {
  const apiClient = new ApiClient({ authProvider });
  const listener = new EventSubWsListener({ apiClient });

  // Raid Listener
  listener.onChannelRaidTo(user, handleIncomingRaidEvent);

  // Gift Sub Listener
  listener.onChannelSubscriptionGift(user, handleGiftSubEvent);

  // Sub Listeners
  listener.onChannelSubscription(user, handleSubEvent);
  listener.onChannelSubscriptionMessage(user, handleResubEvent);

  // Follow Listener
  listener.onChannelFollow(user, user, handleChannelFollowEvent);

  // Events
  listener.onSubscriptionCreateFailure((sub, error) =>
    getContext().sendMessage('console', {
      type: 'error',
      msg: `[EventSub] ${error}`,
    })
  );
  listener.onUserSocketConnect(() =>
    getContext().sendMessage('console', {
      type: 'info',
      msg: '[EventSub] Connected to EventSub server.',
    })
  );
  listener.onUserSocketDisconnect((userId, error) => {
    getContext().sendMessage('console', {
      type: 'warn',
      msg: `[EventSub] UserId ${userId} was disconnected from EventSub server (Error: ${error}).`,
    });
  });

  listener.start();
}

export async function initTwitchAuth() {
  const nodecg = getContext();
  const statusRep = nodecg.Replicant('coreStatus');
  const authRep = nodecg.Replicant('twitchAuth');
  if (
    authRep.value.twitchAuth?.clientId &&
    authRep.value.twitchAuth?.clientSecret &&
    authRep.value.twitchAuth?.userId
  ) {
    const {
      clientId,
      clientSecret,
      userId: clientUserId,
    } = authRep.value.twitchAuth;

    const tokenData = authRep.value.twitchToken;
    const authProvider = new RefreshingAuthProvider({
      clientId,
      clientSecret,
      onRefresh: (userId, newTokenData) => {
        authRep.value.twitchToken = newTokenData;
        nodecg.sendMessage('console', {
          type: 'info',
          msg: `[TwitchAuth] Token Refreshed for userId ${userId}`,
        });
      },
    });

    await authProvider.addUser(clientUserId, tokenData);
    TwitchContext.setTwitchAuthProvider(authProvider);
    statusRep.value.twitchConnected = true;
    initTwitchEventSub(clientUserId, authProvider);
  } else {
    nodecg.sendMessage('console', {
      type: 'error',
      msg: '[initTwitchAuth] Invalid auth data in twitchAuth replicant. Skipping Twitch authorization',
    });
  }
}
