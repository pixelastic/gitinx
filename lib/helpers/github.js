const { Octokit } = require('@octokit/rest');
const envHelper = require('@app/helpers/env.js');
const apiCache = require('@app/helpers/apiCache.js');
const config = require('@app/helpers/config.js');
const commit = require('@app/helpers/commit.js');
const check = require('@app/helpers/check.js');
const _ = require('golgoth/lodash');
const consoleError = require('firost/consoleError');

module.exports = {
  // Returns a list of all (latest) commits from a given branch
  async fetchBranchCommits(branch) {
    const rawCommits = await this.call('repos.listCommits', {
      sha: branch,
    });
    return _.map(rawCommits, commit.normalize.bind(commit));
  },
  // Returns an object representing the current state of checks for a given
  // commit
  async fetchCommitChecks(sha) {
    const response = await this.call('repos.getCombinedStatusForRef', {
      ref: sha,
    });
    const globalState = _.get(response, 'state', '');
    const rawChecks = _.get(response, 'statuses', []);

    const details = _.map(rawChecks, check.normalize.bind(check));
    return {
      state: globalState,
      details,
    };
  },

  /**
   * Returns the GitHub token
   * @returns {string} GitHub Token
   **/
  token() {
    return envHelper.get('GITHUB_TOKEN');
  },
  /**
   * Check if a GitHub token is configured
   * @returns {boolean} True if a token is found **/
  hasToken() {
    return !!this.token();
  },
  /**
   * Call an Octokit method
   * @param {string} methodName Name of the method to call
   * @param {object} options Options to pass to the method
   * @returns {object} Data response from the call
   **/
  async call(methodName, options = {}) {
    // Read from cache if already downloaded
    if (await apiCache.has(methodName, options)) {
      return await apiCache.read(methodName, options);
    }

    // Create an Octokit instance on first call
    if (!this.__octokit) {
      const githubToken = envHelper.get('GITHUB_TOKEN');
      this.__octokit = new Octokit({ auth: githubToken });
    }

    const method = _.get(this.__octokit, methodName);
    try {
      const defaultOptions = {
        owner: config.get('owner'),
        repo: config.get('repo'),
      };
      const { data } = await method({ ...defaultOptions, ...options });
      await apiCache.write(data, methodName, options);
      return data;
    } catch (err) {
      this.displayError(err);
    }
  },
  displayError(error) {
    console.info('');
    consoleError('An error occurred while contacting GitHub');
    consoleError(error.toString());

    const errorLink = error.documentation_url;
    if (errorLink) {
      consoleError(`Please check ${errorLink} to fix the issue`);
    }
  },
  __octokit: null,
};
