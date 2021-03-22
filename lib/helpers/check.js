const _ = require('golgoth/lodash');
const url = require('url');

module.exports = {
  normalize(rawState) {
    const state = _.get(rawState, 'state', '');
    const name = _.get(rawState, 'context', '');
    const description = _.get(rawState, 'description', '');
    const id = _.get(rawState, 'id', '');
    const checkUrl = _.get(rawState, 'target_url', '');

    const user = this.normalizeUser(rawState);
    return {
      state,
      id,
      url: checkUrl,
      name,
      description,
      user,
    };
  },
  normalizeUser(rawState) {
    const avatar = _.get(rawState, 'avatar_url', '');
    if (!avatar) {
      return {};
    }
    const parsed = new url.URL(avatar);
    const [, type, id] = parsed.pathname.split('/');

    return {
      id,
      type,
      avatar,
    };
  },
};
