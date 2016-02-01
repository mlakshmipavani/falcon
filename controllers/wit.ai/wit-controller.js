'use strict';

const wit = require('node-wit');
const Promise = require('bluebird');
const config = require('../../config/config.js');

wit.captureTextIntent = Promise.promisify(wit.captureTextIntent);

/**
 * All interactions with Wit.AI goes through here
 */
class WitController {

  /**
   * Sends the text to Wit.AI, analyses the text and returns an intent with confidence > 0.5
   * @param text Text to analyse
   * @returns {Promise<{intent, confidence, entities}>}
   */
  static getIntent(/*String*/ text) {
    return this._captureTextIntent(text)
      .then(this._filterLowConfidence);
  }

  /**
   * Filters outcomes with confidence value less than 0.5
   * @param witResponse Response received from Wit.AI
   * @returns {Promise<{intent, confidence, entities}>}
   * @private
   */
  static _filterLowConfidence(/*{outcomes}*/ witResponse) {
    return Promise.reduce(witResponse.outcomes,
      (/*{confidence}*/ finalOutcome, /*{confidence, intent, entities}*/ outcome) => {
        if (outcome.confidence > finalOutcome.confidence && outcome.confidence > 0.5)
          return outcome;
        return finalOutcome;
      }, {confidence: 0});
  }

  /**
   * Hits Wit.Ai api and analyses the text
   * @param text Text to analyse
   * @returns {Promise<{outcomes}>}
   * @private
   */
  static _captureTextIntent(/*String*/ text) {
    return wit.captureTextIntent(config.wit.apiKey, text);
  }
}

module.exports = WitController;
