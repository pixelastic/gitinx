const _ = require('golgoth/lodash');
const date = require('@app/helpers/date');
const path = require('path');

module.exports = {
  normalize(rawCommit) {
    const longSha = _.get(rawCommit, 'sha', '');
    const sha = {
      long: longSha,
      short: longSha.substring(0, 7),
    };
    const commitDate = _.chain(rawCommit)
      .get('commit.author.date')
      .thru(date.toTimestamp)
      .value();

    const rawMessage = _.get(rawCommit, 'commit.message', '');
    const message = this.normalizeMessage(rawMessage);
    const pullRequest = this.normalizePullRequest(rawMessage);

    const authorHandle = _.get(rawCommit, 'author.login', '');
    const authorId = _.get(rawCommit, 'author.id', '');
    const authorName = _.get(rawCommit, 'commit.author.name', '');

    return {
      sha,
      message,
      date: commitDate,
      author: {
        id: authorId,
        name: authorName,
        handle: authorHandle,
      },
      pullRequest,
    };
  },
  normalizeMessage(message) {
    if (!message) {
      return {};
    }
    const fullMessage = message;
    const rawShortMessage = fullMessage.split('\n\n')[0];
    const shortMessage = _.chain(rawShortMessage)
      .replace(/\(#.*\)$/, '')
      .trim()
      .value();
    return {
      full: fullMessage,
      short: shortMessage,
    };
  },
  normalizePullRequest(message) {
    const rawShortMessage = message.split('\n\n')[0];
    const matches = rawShortMessage.match(/\(#(?<pullRequestId>[0-9]*)\)$/);
    if (!matches) {
      return {};
    }
    const { pullRequestId } = matches.groups;
    return {
      id: pullRequestId,
    };
  },
  savePath(commit) {
    const datePath = date.path(commit.date);
    const sha = _.get(commit, 'sha.long');
    return path.resolve('./data/', datePath, `${sha}.json`);
  },
};
