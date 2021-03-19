const github = require('@app/helpers/github');
const config = require('@app/helpers/config');
const pMap = require('golgoth/pMap');
const _ = require('golgoth/lodash');
const commitHelper = require('@app/helpers/commit');
const writeJson = require('firost/writeJson');

module.exports = async (options) => {
  const { owner, repo, branch } = options;
  config.set('owner', owner);
  config.set('repo', repo);

  const commits = await github.fetchBranchCommits(branch);

  // For each commit, we fetch its status
  await pMap(commits, async (commit) => {
    const sha = _.get(commit, 'sha.long');
    const checks = await github.fetchCommitChecks(sha);
    commit.checks = checks;
  });

  await pMap(commits, async (record) => {
    const savePath = commitHelper.savePath(record);
    await writeJson(record, savePath);
  });
};
