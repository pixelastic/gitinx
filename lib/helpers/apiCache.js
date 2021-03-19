const stringify = require('json-stable-stringify');
const exists = require('firost/exist');
const readJson = require('firost/readJson');
const writeJson = require('firost/writeJson');
const _ = require('golgoth/lodash');
const path = require('path');

module.exports = {
  cachePath(methodName, options) {
    const optionString = _.chain(options)
      .thru(stringify)
      .replace(/({|}|")/g, '')
      .replace(/:/g, '-')
      .replace(/,/g, '_')
      .value();
    const methodPath = _.replace(methodName, '.', '/');
    return path.resolve(`./.cache/api/${methodPath}/call-${optionString}.json`);
  },
  async has(methodName, options) {
    const cachePath = this.cachePath(methodName, options);
    return await exists(cachePath);
  },
  async read(methodName, options) {
    const cachePath = this.cachePath(methodName, options);
    return await readJson(cachePath);
  },
  async write(data, methodName, options) {
    const cachePath = this.cachePath(methodName, options);
    return await writeJson(data, cachePath);
  },
};
