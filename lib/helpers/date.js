const dayjs = require('golgoth/dayjs');
module.exports = {
  dayjs,
  /**
   * Convert a string date to a timestamp
   * @param {string} input String date
   * @returns {number} timestamp
   **/
  toTimestamp(input) {
    return dayjs(input).utc().unix();
  },
  /**
   * Returns a dayjs object from a timestamp
   * @param {number} timestamp UTC timestamp
   * @returns {object} dayjs object
   **/
  fromTimestamp(timestamp) {
    return dayjs.unix(timestamp).utc();
  },
  /**
   * Return the path as YYYY/MM from a date
   * @param {number} timestamp UTC timestamp
   * @returns {string} YYYY/MM string
   **/
  path(timestamp) {
    return this.fromTimestamp(timestamp).format('YYYY/MM/DD');
  },
  /**
   * Display a timestamp in a local, readable format
   * @param {number} timestamp UTC timestamp to display
   * @returns {string} Readable output string
   **/
  display(timestamp) {
    return dayjs.unix(timestamp).format('MMMM D, YYYY at h:mm A');
  },
};
