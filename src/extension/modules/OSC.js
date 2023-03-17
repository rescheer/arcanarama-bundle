import * as OSC from 'osc';
import { getContext } from '../util/nodecg-api-context';

let udpPort;

/*
Channel assignments:
01: DM
02: Sam
03: Guest (Josh?)
04: [UNUSED]
05: Taylor
06: Kitty
07: Music (Left)
08: Music (Right)
*/

/*
 * (Note copied from AGDQ OSC implementation)
 * NOTE: It is absolutely critical that the `args` param of any udpPort.send command not be null or undefined.
 * Doing so causes the osc lib to actually encode it as a null argument (,N). Instead, use an empty array ([]).
 */

export function initMixer(nodecg) {
  const coreStatus = nodecg.Replicant('coreStatus');
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
  } else {
    // Mixer IP not in bundle
    nodecg.log.warn(
      '[OSC] Mixer IP not found in bundle config. Mixer functionality unavailable'
    );
  }

  udpPort.on('error', (err) => {
    nodecg.log.error(`[OSC] Error: ${err}`);
  });

  udpPort.on('message', (oscMessage) => {
    // Needs to check for responses and update the status rep
    if (oscMessage.address === '/info') {
      nodecg.log.info('[OSC] Mixer connection test successful');
      coreStatus.value.mixerConnected = true;
    } else {
      nodecg.log.info(oscMessage);
    }
  });

  udpPort.open();

  return udpPort;
}

export function sendTestMessage() {
  udpPort.send({ address: '/info', args: [] });
}

export function setChannelMute(ch, bool) {
  const nodecg = getContext();
  let channel = ch;
  const mutedState = bool ? 0 : 1;
  const mutedString = bool ? 'mute' : 'unmute';

  if (channel > 0 && channel <= 16) {
    if (ch.toString().length === 1) {
      channel = `0${ch}`;
    }
    udpPort.send({
      address: `/ch/${channel}/mix/on`,
      args: [{ type: 'i', value: mutedState }],
    });

    // Get
    udpPort.send({
      address: `/ch/${channel}/mix/on`,
      args: [],
    });
  } else {
    nodecg.log.warn(
      `[OSC] Attempted to ${mutedString} channel out of bounds (channel ${channel})`
    );
  }
}
