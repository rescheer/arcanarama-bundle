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
  const result = { player, ddbId };
  const characterUrl = `https://character-service.dndbeyond.com/character/v3/character/${ddbId}/`;
  const nodecg = getContext();
  const charactersRep = nodecg.Replicant('characters');

  const response = await axios.get(characterUrl);
  const newRep = nodecg.Replicant(ddbId);
  const characterName = response.data.data.name;

  result.timestamp = Date.now();
  newRep.value = response.data.data;
  charactersRep.value[ddbId] = result;

  return characterName;
}
