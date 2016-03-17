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
    return request(this._getOptions(imgUrl, eventCode))
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

  static _getOptions(/*string*/ imgUrl, /*string*/ eventCode) {
    const apiKey = config.awsLambda.apiKey;
    if (!apiKey) throw new Error('AWS_LAMBDA_API_KEY is empty');
    return {
      url: config.awsLambda.closestMaterialColorUrl,
      method: 'POST',
      headers: {'x-api-key': apiKey},
      json: {imgUrl, eventCode}
    };
  }

}

module.exports = AwsLambda;
