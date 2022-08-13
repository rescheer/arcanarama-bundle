/* eslint-disable no-unused-vars */
const fs = require('fs');
const path = require('path');
const nodecgApiContext = require('./util/nodecg-api-context');

module.exports = function (nodecg) {
  nodecgApiContext.set(nodecg);

  const utilityItemList = nodecg.Replicant('utilityItemList', {
    defaultValue: [],
  });
  // TODO: currentUtilityItem needs a default, and should not persist
  const currentUtilityItem = nodecg.Replicant('currentUtilityItem', {
    defaultValue: {},
  });

  const lastUtilityItem = nodecg.Replicant('lastUtilityItem', {
    defaultValue: 'none',
    persistent: false,
  });

  // Tests
  utilityItemList.value = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, './test.json'))
  );
};
