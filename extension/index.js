/* eslint-disable no-unused-vars */
const fs = require('fs');
const path = require('path');
const nodecgApiContext = require('./util/nodecg-api-context');

const DEFAULT_TIME = {
  interval: 15 * 60 * 1000,
  duration: 10 * 1000,
};

class UtilityItem {
  constructor(
    itemName,
    type,
    title,
    shortDesc,
    homepage,
    imagePath,
    provider,
    providerImagePath,
    defaultDuration,
    defaultInterval
  ) {
    this.itemName = itemName;
    this.title = title;
    this.type = type;
    this.shortDesc = shortDesc;
    this.homepage = homepage;
    this.imagePath = imagePath;
    this.provider = provider;
    this.providerImagePath = providerImagePath;
    this.defaultDuration = defaultDuration;
    this.defaultInterval = defaultInterval;
  }
}

module.exports = function (nodecg) {
  nodecgApiContext.set(nodecg);

  const utilityItemList = nodecg.Replicant('utilityItemList', {
    defaultValue: [],
  });
  // TODO: currentUtilityItem needs a default, and should not persist
  const currentUtilityItem = nodecg.Replicant('currentUtilityItem', {
    defaultValue: {},
  });

  currentUtilityItem.on('change', (newValue, oldValue) => {
    const { title } = newValue;
    // console.log(`currentUtilityItem changed to ${title}.`);
  });

  // Tests
  /* utilityItemList.value = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, './test.json'))
  ); */
};
