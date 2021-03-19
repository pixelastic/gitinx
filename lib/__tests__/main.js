const current = require('../main.js');

describe('current', () => {
  it('should have initial and incremental methods', async () => {
    expect(current).toHaveProperty('initial');
    expect(current).toHaveProperty('incremental');
  });
});
