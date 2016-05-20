'use strict';

const Promise = require('bluebird');
const request = require('request-promise');
const config = require('../config/config');
const log = require('../utils/logger').child({
  module: 'aws-lambda'
});

/**
 * Contains methods for each AWS Lambda function
 */
class AwsLambda {

  /**
   * Gets the closest material palette color from the image
   * @param imgUrl Url of the image to process
   * @param eventCode A unique identifier along with the url
   * @returns {Promise<{color, eventCode}>}
   */
  static getClosestMaterialColor(/*string*/ imgUrl, /*string*/ eventCode) {
    const defaultResult = {color: '#212121', eventCode};

    // if imgUrl is empty
    if (!imgUrl) return Promise.resolve(defaultResult);

    // else get the color
    return request(this._getOptionsForClosestColor(imgUrl, eventCode))
      .then((/*{errorMessage, errorType}*/ res) => {
        if (res.errorMessage) {
          // if something goes wrong in lambda, catch it and return default value
          const opts = {imgUrl, eventCode};
          log.error(opts, `Error(${res.errorMessage}) occurred while getting closest color`);
          return defaultResult;
        }

        return res;
      });
  }

  /**
   * Sends the newly registered user an email confirmation mail
   * @param email Email of the newly registered user
   * @param name Name of the newly registered user
   * @return {Promise}
   */
  static sendWelcomeMail(/*string*/ email, /*string*/ name) {
    if (!email) return Promise.reject('email is empty!').catch(e => log.error(e));
    if (!name) return Promise.reject('name is empty!').catch(e => log.error(e));

    if (process.env.NODE_ENV === 'test') return Promise.resolve();
    return request(this._getOptionsForWelcomeMail(email, name));
  }

  /**
   * @private
   */
  static _getOptionsForWelcomeMail(/*string*/ email, /*string*/ name) {
    return this._getOptions(config.awsLambda.welcomeMailUrl, {email, name});
  }

  /**
   * @private
   */
  static _getOptionsForClosestColor(/*string*/ imgUrl, /*string*/ eventCode) {
    return this._getOptions(config.awsLambda.closestMaterialColorUrl, {imgUrl, eventCode});
  }

  /**
   * @private
   */
  static _getOptions(/*string*/ url, /*{*}*/ data) {
    const apiKey = config.awsLambda.apiKey;
    if (!apiKey) throw new Error('AWS_LAMBDA_API_KEY is empty');
    return {
      url: url,
      method: 'POST',
      headers: {'x-api-key': apiKey},
      json: data
    };
  }

}

module.exports = AwsLambda;
