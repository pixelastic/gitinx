const current = require('@app/helpers/check');
const _ = require('golgoth/lodash');

describe('commit', () => {
  describe('normalize', () => {
    it.each([
      [
        'state',
        { state: 'success' },
        {
          state: 'success',
        },
      ],
      [
        'user',
        {
          avatar_url: 'https://avatars.githubusercontent.com/u/9841878?v=4',
        },
        {
          'user.id': '9841878',
        },
      ],
      [
        'name',
        { context: 'Exotic browser tests | master' },
        {
          name: 'Exotic browser tests | master',
        },
      ],
      [
        'description',
        { description: 'None reported' },
        {
          description: 'None reported',
        },
      ],
      [
        'id',
        { id: 42 },
        {
          id: 42,
        },
      ],
      [
        'url',
        {
          target_url:
            'https://tc.doctolib.net/viewLog.html?buildId=594007&buildTypeId=Doctolib_CIrrusDoctolibTestLauncherMasterProduction',
        },
        {
          url:
            'https://tc.doctolib.net/viewLog.html?buildId=594007&buildTypeId=Doctolib_CIrrusDoctolibTestLauncherMasterProduction',
        },
      ],
    ])('%s', async (_title, flattenInput, expected) => {
      const actual = current.normalize(_.unflatten(flattenInput));
      _.each(expected, (value, key) => {
        expect(actual).toHaveProperty(key, value);
      });
    });
  });
});
