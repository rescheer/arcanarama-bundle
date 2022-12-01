/* eslint-disable no-unused-vars */
module.exports = function (nodecg) {
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
};
