const AppRouting = require('./appRouting');

module.exports = {
  init: (app) => {
    const appRouting = new AppRouting(app);

    appRouting.init();
  },
};
