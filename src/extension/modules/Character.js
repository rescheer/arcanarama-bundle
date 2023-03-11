/* eslint-disable no-param-reassign */
import axios from 'axios';
import { getContext } from '../util/nodecg-api-context';
import parseDDBData from './DDBParser';

export class CharacterItem {
  constructor(ddbID, player) {
    this.ddbID = ddbID;
    this.player = player;
    this.timestamp = '';
    this.hidden = false;
    this.data = {};
    this.override = {};
    this.computedData = {};
  }
}

function getCharacterIndexById(id) {
  const nodecg = getContext();
  const characters = nodecg.Replicant('characters');
  let index;

  characters.value.forEach((character, i) => {
    if (id === character.ddbID) {
      index = i;
    }
  });
  return index;
}

export function deleteCharacter(id) {
  const nodecg = getContext();
  const characters = nodecg.Replicant('characters');

  characters.value.splice(getCharacterIndexById(id), 1);
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
  const index = getCharacterIndexById(id);
  const char = charactersRep.value[index];
  if (char) {
    char.data = {};
    Object.assign(char.data, parseDDBData(id));
    char.computedData = getComputedData(char);
  }
}

export function resetOverrides(obj) {
  obj.override = {};
  obj.computedData = {};
  getComputedData();
}

export function getBeyondData(obj) {
  const nodecg = getContext();
  const id = obj.ddbID;
  const characterUrl = `https://character-service.dndbeyond.com/character/v3/character/${id}/`;
  const charactersRep = nodecg.Replicant('characters');

  return new Promise((resolve, reject) => {
    axios
      .get(characterUrl)
      .then((res) => {
        charactersRep.value.push(obj);
        getContext().sendMessage('console', {
          type: 'info',
          msg: `[getBeyondData] Successfully got DDB data for ${res.data.data.name} (id ${obj.ddbID})`,
        });
        const newRep = getContext().Replicant(id);
        obj.timestamp = Date.now();
        newRep.value = res.data.data;
        parseRawData(id);
        resolve('Character added successfully');
      })
      .catch((error) => {
        reject(error);
        getContext().sendMessage('console', {
          type: 'warn',
          msg: `[getBeyondData] Failed to get JSON: ${error}`,
        });
      });
  });
}
