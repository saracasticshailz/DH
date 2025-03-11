const modDateTimeUtil = {
  /**
   * Calculates the current client date.
   * @returns {Date} - The current client date.
   */
  getCurrentDate() {
    return new Date();
  },

  /**
   * Calculates the current client time in milliseconds.
   * @returns {number} - The current client time in milliseconds.
   */
  getCurrentTime() {
    return this.getCurrentDate().getTime();
  },
};

export default modDateTimeUtil;
