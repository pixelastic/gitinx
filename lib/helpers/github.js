const { Octokit } = require('@octokit/rest');
const envHelper = require('@app/helpers/env.js');
const apiCache = require('@app/helpers/apiCache.js');
const config = require('@app/helpers/config.js');
const commit = require('@app/helpers/commit.js');
const _ = require('golgoth/lodash');
const consoleError = require('firost/consoleError');

module.exports = {
  async getLatestCommitsFromBranch(options) {
    const { owner, repo, branch } = options;
    const rawCommits = await this.call('repos.listCommits', {
      owner,
      repo,
      sha: branch,
    });
    return _.map(rawCommits, commit.normalize.bind(commit));
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
      const { data } = await method(options);
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
    // Display the full error when --debug is passed
    if (config.args.debug) {
      console.info(error);
    }
  },
  __octokit: null,
};
