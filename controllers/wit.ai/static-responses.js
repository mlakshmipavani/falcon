'use strict';

class StaticResponses {

  static get hello() {
    return 'Hi, there';
  }

  /**
   * Reply to How Are you intent
   * @returns {string}
   */
  static get howAreYouIntentReply() {
    return `I'm good! What about you?`;
  }

  /**
   * Reply to Thank you intent
   * @returns {string}
   */
  static get thankYouIntentReply() {
    return `My pleasure!`;
  }

}

module.exports = StaticResponses;
