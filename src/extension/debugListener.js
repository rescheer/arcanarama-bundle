import { getContext } from './util/nodecg-api-context';

function debugHandler(data) {
  const nodecg = getContext();

  const { type, msg } = data;

  switch (type) {
    case 'error':
      nodecg.log.error(`[ERROR] ${msg}`);
      break;
    case 'warn':
      nodecg.log.warn(`[WARN] ${msg}`);
      break;
    case 'info':
      nodecg.log.info(`[INFO] ${msg}`);
      break;
    case 'trace':
      nodecg.log.trace(`[TRACE] ${msg}`);
      break;
    default:
      nodecg.log.debug(`[DEBUG] ${msg}`);
      break;
  }
}

export default function debugListener(nodecg) {
  nodecg.listenFor('debug', debugHandler);
}
