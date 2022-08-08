// const fs = require('fs');
// const path = require('path');

const nodecgApiContext = require('./util/nodecg-api-context');

module.exports = function (nodecg) {
  // nodecg.log.info('Hello, from your bundle\'s extension!');
  nodecgApiContext.set(nodecg);

  //  require('./utility');
};
