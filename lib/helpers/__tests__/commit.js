const current = require('@app/helpers/commit');
const _ = require('golgoth/lodash');

describe('commit', () => {
  describe('normalize', () => {
    it.each([
      [
        'sha',
        { sha: '668da81ee5158764b088555b6f2acedcb88dd9a6' },
        {
          'sha.long': '668da81ee5158764b088555b6f2acedcb88dd9a6',
          'sha.short': '668da81',
        },
      ],
      [
        'message',
        { 'commit.message': 'fix typo (#4678)\n\n* do this\n\n* do that' },
        {
          'message.short': 'fix typo',
          'message.full': 'fix typo (#4678)\n\n* do this\n\n* do that',
        },
      ],
      [
        'date',
        { 'commit.author.date': '2021-03-19T11:31:04Z' },
        { date: 1616153464 },
      ],
      [
        'author',
        {
          'author.id': 42,
          'author.login': 'pixelastic',
          'commit.author.name': 'Tim Carry',
        },
        {
          'author.id': 42,
          'author.handle': 'pixelastic',
          'author.name': 'Tim Carry',
        },
      ],
      [
        'pr',
        { 'commit.message': 'fix typo (#4678)\n\n* do this\n\n* do that' },
        {
          'pr.id': '4678',
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
