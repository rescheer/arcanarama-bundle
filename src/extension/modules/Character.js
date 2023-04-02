/* eslint-disable no-param-reassign */
import axios from 'axios';
import { getContext } from '../util/nodecg-api-context';
import parseDDBData from './DDBParser';

export function deleteCharacter(id) {
  const nodecg = getContext();
  const charactersRep = nodecg.Replicant('characters');

  delete charactersRep.value[id];
}

export function getComputedData(obj) {
  obj.computedData = {};
  Object.assign(obj.computedData, {
    ...obj.data,
    ...obj.override,
  });
}

export function setHiddenStatus(id, hidden) {
  const nodecg = getContext();
  const charactersRep = nodecg.Replicant('characters');

  charactersRep.value[id].hidden = !!hidden;
}

export function parseRawData(id) {
  const nodecg = getContext();
  const charactersRep = nodecg.Replicant('characters');

  charactersRep.value[id].data = parseDDBData(id);
}

export function resetOverrides(obj) {
  obj.override = {};
  obj.computedData = {};
  getComputedData();
}

export async function getBeyondData(ddbId, player) {
  const result = { player, ddbId, hidden: false };
  const characterUrl = `https://character-service.dndbeyond.com/character/v3/character/${ddbId}/`;
  const nodecg = getContext();
  const charactersRep = nodecg.Replicant('characters');

  return new Promise((resolve, reject) => {
    axios
      .get(characterUrl)
      .then((res) => {
        const newRep = nodecg.Replicant(ddbId);
        const characterName = res.data.data.name;

        getContext().sendMessage('console', {
          type: 'info',
          msg: `[getBeyondData] Successfully got DDB data for ${characterName} (id ${ddbId})`,
        });

        result.timestamp = Date.now();
        newRep.value = res.data.data;
        charactersRep.value[ddbId] = result;
        resolve(`${characterName} was imported successfully!`);
      })
      .catch((error) => {
        reject(error);
        getContext().sendMessage('console', {
          type: 'error',
          msg: `[getBeyondData] Failed to get JSON: ${error}`,
        });
      });
  });
}
