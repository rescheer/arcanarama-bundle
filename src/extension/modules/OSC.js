import * as OSC from 'osc';
import { getContext } from '../util/nodecg-api-context';

let udpPort;

/*
 * Channel assignments:
 * 01: DM
 * 02: Sam
 * 03: Guest (Josh?)
 * 04: [UNUSED]
 * 05: Taylor
 * 06: Kitty
 * 07: Music (Left)
 * 08: Music (Right)
 */

/*
 * (Note copied from AGDQ OSC implementation)
 * NOTE: It is absolutely critical that the `args` param of any udpPort.send command not be null or undefined.
 * Doing so causes the osc lib to actually encode it as a null argument (,N). Instead, use an empty array ([]).
 */

/**
 * Sends a /info command to test mixer connectivity
 */
function testMixerConnection() {
  udpPort.send({ address: '/info', args: [] });
}

/**
 * Adds a command to the queue to be verified
 * @param {string} address - The address of the command
 * @param {any} expectedValue - The value the command should have set
 * @param {object} promise - An object containing the resolve/reject functions for the command' Promise
 */
function addToVerifyQueue(address, expectedValue, promise) {
  const nodecg = getContext();
  const oscVerifyQueueRep = nodecg.Replicant('oscVerifyQueue');

  if (typeof address === 'string') {
    const task = { address, expectedValue, promise };
    // Definitely a completely stable UUID generator with no possible issues
    const id = Date.now();

    oscVerifyQueueRep.value[id] = task;
  } else {
    nodecg.sendMessage('console', {
      type: 'error',
      msg: `[OSC.addToVerifyQueue] Invalid args!'`,
    });
  }
}

/**
 * Handles incoming OSC messages
 * @param {oscMessage} oscMessage - The message recieved
 */
function handleOscMessage(oscMessage) {
  const nodecg = getContext();
  const coreStatus = nodecg.Replicant('coreStatus');
  const oscVerifyQueueRep = nodecg.Replicant('oscVerifyQueue');
  const queueKeys = Object.keys(oscVerifyQueueRep.value);

  if (Array.isArray(queueKeys) && queueKeys.length > 0) {
    const recievedAddress = oscMessage.address;
    const recievedArgs = oscMessage.args;
    queueKeys.forEach((key) => {
      const { address, expectedValue, promise } = oscVerifyQueueRep.value[key];

      if (expectedValue === undefined) {
        if (address === recievedAddress) {
          promise.resolve(recievedArgs[0].value);
          delete oscVerifyQueueRep.value[key];
        }
      } else if (
        address === recievedAddress &&
        expectedValue === !!recievedArgs[0].value
      ) {
        promise.resolve(recievedArgs[0].value);
        delete oscVerifyQueueRep.value[key];
      }
    });
  }

  switch (oscMessage.address) {
    case '/info':
      // Reply from connection test
      nodecg.sendMessage('console', {
        type: 'info',
        msg: '[OSC] Mixer connection test successful',
      });
      coreStatus.value.mixerConnected = true;
      break;

    default:
      break;
  }
}

/**
 * Checks the queue for commands that have not recieved verification and times them out
 */
function checkVerifyQueue() {
  const nodecg = getContext();
  const oscVerifyQueueRep = nodecg.Replicant('oscVerifyQueue');
  const queueKeys = Object.keys(oscVerifyQueueRep.value);
  const currentTime = Date.now();

  queueKeys.forEach((key) => {
    const timestamp = key;

    if (currentTime - timestamp > 3000) {
      const { promise } = oscVerifyQueueRep.value[key];
      promise.reject('Request timed out');
      delete oscVerifyQueueRep.value[key];
    }
  });
}

/**
 * Initializes the mixer command system
 * @param {nodecg} nodecg - The NodeCG API
 * @returns {udpPort} - The configured UDP port object
 */
export function initMixer(nodecg) {
  const oscVerifyQueueRep = nodecg.Replicant('oscVerifyQueue', {
    defaultValue: {},
    persistent: false,
  });
  const mixerIp = nodecg.bundleConfig.mixer.ip;
  const mixerPort = 10024;

  if (mixerIp) {
    udpPort = new OSC.UDPPort({
      localAddress: '0.0.0.0',
      localPort: 57121,
      remotePort: mixerPort,
      remoteAddress: mixerIp,
      metadata: true,
    });

    oscVerifyQueueRep.on('change', (newValue, oldValue) => {
      if (oldValue) {
        // If the number of keys went up, send get message for added values
        const oldKeys = Object.keys(oldValue);
        const newKeys = Object.keys(newValue);

        if (newKeys.length > oldKeys.length) {
          const addedKeys = newKeys.filter((x) => !oldKeys.includes(x));
          addedKeys.forEach((key) => {
            const { address } = oscVerifyQueueRep.value[key];

            // Get value from mixer
            udpPort.send({
              address,
              args: [],
            });
          });
        }
      }
    });

    udpPort.on('error', (err) => {
      nodecg.log.error(`[OSC] Error: ${err}`);
    });
    udpPort.on('ready', testMixerConnection);
    udpPort.on('message', handleOscMessage);
    setInterval(checkVerifyQueue, 500);
  } else {
    // Mixer IP not in bundle
    nodecg.log.warn(
      '[OSC] Mixer IP not found in bundle config. Mixer functionality unavailable'
    );
  }

  udpPort.open();

  return udpPort;
}

/**
 * Mutes or unmutes a single channel
 * @param {string} ch - The two digit channel to mute/unmute ('01' - '16')
 * @param {number} state 0 to mute, any other number to unmute
 * @returns {Promise} - Resolves upon command result
 */
export function setChannelMute(ch, state) {
  const nodecg = getContext();
  let channel = ch;
  const mutedState = state ? 1 : 0;
  const mutedString = state ? 'mute' : 'unmute';

  if (+channel > 0 && +channel <= 16) {
    if (ch.toString().length === 1) {
      channel = `0${ch}`;
    }
    const address = `/ch/${channel}/mix/on`;
    udpPort.send({
      address,
      args: [{ type: 'i', value: mutedState }],
    });

    let resultResolve;
    let resultReject;
    const resultPromise = new Promise((resolve, reject) => {
      resultResolve = resolve;
      resultReject = reject;
    });

    // Verify
    addToVerifyQueue(address, mutedState, {
      resolve: resultResolve,
      reject: resultReject,
    });

    return resultPromise;
  } // Else
  nodecg.log.warn(
    `[OSC] Attempted to ${mutedString} channel out of bounds (channel ${channel})`
  );
  return false;
}

/**
 * Gets mute status for a single channel
 * @param {string} ch - The two digit channel to mute/unmute ('01' - '16')
 * @returns {Promise} - Resolves upon command result
 */
export function getChannelMute(ch) {
  const nodecg = getContext();
  let channel = ch;

  if (+channel > 0 && +channel <= 16) {
    if (ch.toString().length === 1) {
      channel = `0${ch}`;
    }
    const address = `/ch/${channel}/mix/on`;

    let resultResolve;
    let resultReject;
    const resultPromise = new Promise((resolve, reject) => {
      resultResolve = resolve;
      resultReject = reject;
    });

    // Verify
    addToVerifyQueue(address, undefined, {
      resolve: resultResolve,
      reject: resultReject,
    });

    return resultPromise;
  } // Else
  nodecg.log.warn(
    `[OSC] Attempted to get mute status for channel out of bounds (channel ${channel})`
  );
  return false;
}
