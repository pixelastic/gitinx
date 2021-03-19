const _ = require('golgoth/lodash');
const url = require('url');
const path = require('path');
// const date = require('@app/helpers/date');
// const path = require('path');

module.exports = {
  normalize(rawState) {
    const state = _.get(rawState, 'state', '');
    const name = _.get(rawState, 'context', '');
    const description = _.get(rawState, 'description', '');
    const id = _.get(rawState, 'id', '');
    const checkUrl = _.get(rawState, 'target_url', '');

    const rawAvatarUrl = _.get(rawState, 'avatar_url', '');
    const user = this.normalizeUser(rawAvatarUrl);
    return {
      state,
      id,
      url: checkUrl,
      name,
      description,
      user,
    };
  },
  normalizeUser(avatarUrl) {
    if (!avatarUrl) {
      return {};
    }
    const parsed = new url.URL(avatarUrl);
    const id = path.basename(parsed.pathname);

    return {
      id,
    };
  },

  // {
  //   "id": 12537716516,
  //   "target_url": "https://tc.doctolib.net/viewLog.html?buildId=594007&buildTypeId=Doctolib_CIrrusDoctolibTestLauncherMasterProduction",
  // },
};
