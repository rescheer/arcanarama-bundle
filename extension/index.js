const nodecgApiContext = require('./util/nodecg-api-context');

module.exports = function (nodecg) {
  nodecgApiContext.set(nodecg);
};
