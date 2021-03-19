const github = require('@app/helpers/github');
const commit = require('@app/helpers/commit');
const pMap = require('golgoth/pMap');
const writeJson = require('firost/writeJson');

module.exports = async (options) => {
  const records = await github.getLatestCommitsFromBranch(options);

  await pMap(records, async (record) => {
    const savePath = commit.savePath(record);
    await writeJson(record, savePath);
  });
};
