/* eslint-disable no-unused-vars */
const fs = require('fs');
const path = require('path');
const nodecgApiContext = require('./util/nodecg-api-context');

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

const DEFAULT_TIME = {
  interval: 15 * 60 * 1000,
  duration: 10 * 1000,
};

module.exports = function (nodecg) {
  nodecgApiContext.set(nodecg);

  const utilityItemList = nodecg.Replicant('utilityItemList', {
    defaultValue: [],
  });

  utilityItemList.value = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, './test.json'))
  );

  // console.log(utilityItemList.value[0]);
};

// Tests
/* const testItem = new UtilityItem(
  'itemName',
  'type',
  'title',
  'shortDesc',
  'homepage',
  'imagePath',
  'provider',
  'providerImagePath',
  'defaultDuration',
  'defaultInterval'
);
const testItemTwo = new UtilityItem(
  'itemName',
  'type',
  'title',
  'shortDesc',
  'homepage',
  'imagePath',
  'provider',
  'providerImagePath',
  'defaultDuration',
  'defaultInterval'
);

const testArray = [testItem, testItemTwo];

fs.writeFile('./test.json', JSON.stringify(testArray), (err) => {
  if (err) throw err;
  console.log('Saved!');
}); */
