/*
 ** From https://github.com/GamesDoneQuick/agdq18-layouts
 ** by Alexander Lange Van Camp
 */

let context;
module.exports = {
  get() {
    return context;
  },
  set(ctx) {
    context = ctx;
  },
};
