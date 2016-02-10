'use strict';

const request = require('request-promise');
const config = require('../config/config');

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
    return request(this._getOptions(imgUrl, eventCode))
      .then((/*{errorMessage, errorType}*/ res) => {
        if (res.errorMessage) throw new Error(res.errorMessage);
        return res;
      });
  }

  static _getOptions(/*string*/ imgUrl, /*string*/ eventCode) {
    const apiKey = process.env.AWS_LAMBDA_API_KEY;
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
