import axios from 'axios';

// Ours
import { getContext } from '../util/nodecg-api-context';

/**
 *  Gets JSON data from a tab or tabs of a google sheet
 * @param {string} sheet - The ID of the requested sheet
 * @param {Object[]} tabs - An array of tab names
 * @param {string} tabs[].name - The name of a tab to read from
 * @param {bool} [byColumn=true] - Whether to import by Column (default) or by row
 * @returns
 */
export default async function getSheetJSON(sheet, tabNames, byColumn = true) {
  const nodecg = getContext();
  const dimension = byColumn ? 'COLUMNS' : 'ROWS';
  const urls = [];

  if (
    nodecg?.bundleConfig?.googleAPIKey &&
    sheet &&
    typeof tabNames === 'object'
  ) {
    const apiKey = nodecg.bundleConfig.googleAPIKey;
    const parsedData = {};

    tabNames.forEach((tab) => {
      urls.push(
        `https://sheets.googleapis.com/v4/spreadsheets/${sheet}/values/${tab}?majorDimension=${dimension}&alt=json&key=${apiKey}`
      );
    });

    const fetchUrl = (url) =>
      axios.get(url).catch((error) => {
        let msg;
        if (error.response) {
          msg = `Bad status ${error.response.status}`;
        } else if (error.request) {
          msg = `No response recieved: ${error.request}`;
        } else {
          msg = `Error: ${error.message}`;
        }
        nodecg.sendMessage('console', {
          type: 'error',
          msg: `[getSheetJSON] ${msg}`,
        });
      });
    const promises = urls.map(fetchUrl);

    try {
      const responses = await Promise.all(promises);
      responses.forEach((res) => {
        if (res.status !== 200) {
          throw new Error(res.status);
        }
        const tabName = res.data.range.split('!')[0];

        if (res.data.values[0][0] !== 'unordered') {
          parsedData[tabName] = {};
          res.data.values.forEach((tab) => {
            const type = tab.shift();
            const filteredItems = tab.filter((n) => n);
            parsedData[tabName][type] = filteredItems;
          });
        } else {
          res.data.values[0].shift();
          const filteredItems = res.data.values[0].filter((n) => n);
          parsedData[tabName] = filteredItems;
        }
      });
    } catch (err) {
      nodecg.sendMessage('console', {
        type: 'error',
        msg: `[getSheetJSON] Error: ${err}`,
      });
    }

    return parsedData;
  }
  // Invalid vibesheet config
  throw new Error(
    `[VibeCheck] vibeSheet configuration is missing! Check bundle config.`
  );
}
