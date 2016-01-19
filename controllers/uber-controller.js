'use strict';

var Promise = require('bluebird');
var request = require('request-promise');
var _object = require('lodash/object');
var config = require('../config/config.js');

const baseUrl = config.uber.baseUrl;
const headers = {Authorization: 'Token jNWXqEXTsHSsBfH0fB-yxG8mw42I_YeQh0OoTDwp'};

class UberController {

  static getCabs(/* float */ latitude, /* float */ longitude) {
    var promises = [this._estimateTime(latitude, longitude),
      this._estimatePrice(latitude, longitude)];
    return Promise.all(promises).reduce((finalObj, eachObj) => {
      var output;
      if ('times' in eachObj) {
        let times = eachObj.times;
        output = this._parseTimeResult(times);

      } else if ('prices' in eachObj) {
        //noinspection JSUnresolvedVariable
        let prices = eachObj.prices;
        output = this._parsePriceResult(prices);
      }

      return _object.defaultsDeep(finalObj, output);
    }, {}).then(this._filterInvalidOutput).then(this._convertToArray);
  }

  /**
   * Parse the estimate cab pricing output got from uber server
   * @param priceResult response from uber
   * @returns {{}}
   */
  static _parsePriceResult(/* Array<{display_name, estimate, product_id, surge_multiplier}>*/
                           priceResult) {
    var finalObj = {};
    for (let cab of priceResult) {
      let productId = cab.product_id;// jscs:ignore
      finalObj[productId] = finalObj[productId] || {};
      finalObj[productId].name = cab.display_name;// jscs:ignore
      finalObj[productId].fare = cab.estimate;
      finalObj[productId].surgeMultiplier = cab.surge_multiplier;// jscs:ignore
    }

    return finalObj;
  }

  /**
   * Parse the estimate cab time output got from uber server
   * @param timeResult response from uber
   * @returns {{}}
   */
  static _parseTimeResult(/* Array<{display_name, estimate, product_id}> */ timeResult) {
    var finalObj = {};
    for (let cab of timeResult) {
      let productId = cab.product_id;// jscs:ignore
      finalObj[productId] = finalObj[productId] || {};
      finalObj[productId].name = cab.display_name;// jscs:ignore
      finalObj[productId].eta = cab.estimate;
    }

    return finalObj;
  }

  //noinspection Eslint
  /**
   * Get the estimated time of uber cabs at a given lat/lng
   * @param latitude latitude of the user
   * @param longitude longitude of the user
   * @returns {Promise}
   */
  static _estimateTime(latitude, longitude) {
    var reqOptions = this._getOptionsForTime(latitude, longitude);
    return request(reqOptions);
  }

  //noinspection Eslint
  static _getOptionsForTime(start_latitude, start_longitude) {// jscs:ignore
    //noinspection Eslint
    return {
      url: `${baseUrl}/estimates/time`,
      headers,
      qs: {start_latitude, start_longitude},// jscs:ignore
      json: true
    };
  }

  /**
   * Gives an estimate price for a ride of approx 5Kms
   * @param latitude Start latitude
   * @param longitude Start Longitude
   * @returns {Promise}
   */
  static _estimatePrice(latitude, longitude) {
    var reqOptions = this._getOptionsForPrice(latitude, longitude);
    return request(reqOptions);
  }

  //noinspection Eslint
  /**
   * Retruns the request options for making the http request
   * @param latitude user provided latitude
   * @param longitude user provided longitude
   * @returns {{url: string, headers: {Authorization: string}, qs: {start_latitude: float,start_longitude: float, end_latitude: float, end_longitude: float}, json: boolean}}
   * @private
   */
  static _getOptionsForPrice(latitude, longitude) {
    //noinspection Eslint
    return {
      url: `${baseUrl}/estimates/price`,
      headers,
      qs: {
        start_latitude: latitude, // jscs:ignore
        start_longitude: longitude, // jscs:ignore
        // the 0.045 is a rough approximation for 5kms
        end_latitude: latitude + 0.045, // jscs:ignore
        end_longitude: longitude // jscs:ignore
      },
      json: true
    };
  }

  /**
   * Remove all the cab outputs that don't have both eta and fare
   * @returns {{}}
   */
  static _filterInvalidOutput(output) {
    return _object.pick(output, value => value.eta && value.fare);
  }

  static _convertToArray(objOutput) {
    var arr = [];
    for (let key of Object.keys(objOutput)) {
      let value = objOutput[key];
      value.productId = key;
      arr.push(value);
    }

    return arr;
  }
}

module.exports = UberController;
