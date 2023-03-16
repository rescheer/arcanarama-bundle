import * as OSC from 'osc';

let udpPort;

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
    });
  } else {
    nodecg.log.warn(
      '[OSC] Mixer IP not found in bundle config. Mixer functionality unavailable'
    );
  }

  udpPort.on('error', (err) => {
    nodecg.log.error(`[OSC] Error: ${err}`);
  });

  udpPort.on('message', (oscMessage) => {
    if (oscMessage.address === '/info') {
      nodecg.log.info('[OSC] Mixer connection successful');
      coreStatus.value.mixerConnected = true;
    }
  });

  udpPort.open();

  return udpPort;
}

export function sendTestMessage() {
  udpPort.send({ address: '/info' });
}
