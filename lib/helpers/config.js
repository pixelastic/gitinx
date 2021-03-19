const _ = require('golgoth/lodash');

module.exports = {
  config: {},
  get(key) {
    return _.get(this.config, key);
  },
  set(key, value) {
    return _.set(this.config, key, value);
  },
};
