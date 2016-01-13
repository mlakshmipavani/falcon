'use strict';

var Promise = require('bluebird');
var request = require('request-promise');
var _object = require('lodash/object');

const baseUrl = 'https://api.uber.com/v1';
const headers = {Authorization: 'Token jNWXqEXTsHSsBfH0fB-yxG8mw42I_YeQh0OoTDwp'};

class UberController {

  static getCabs(/* float */ latitude, /* float */ longitude) {
    var promises = [estimateTime(latitude, longitude), estimatePrice(latitude, longitude)];
    return Promise.all(promises).reduce((finalObj, eachObj) => {
      var output;
      if ('times' in eachObj) {
        let times = eachObj.times;
        output = parseTimeResult(times);

      } else if ('prices' in eachObj) {
        //noinspection JSUnresolvedVariable
        let prices = eachObj.prices;
        output = parsePriceResult(prices);
      }

      return _object.defaultsDeep(finalObj, output);
    }, {}).then(filterInvalidOutput).then(convertToArray);
  }
}

/**
 * Parse the estimate cab time output got from uber server
 * @param timeResult response from uber
 * @returns {{}}
 */
function parseTimeResult(/* Array<{display_name, estimate, product_id}> */ timeResult) {
  var finalObj = {};
  for (let cab of timeResult) {
    let productId = cab.product_id;// jscs:ignore
    finalObj[productId] = finalObj[productId] || {};
    finalObj[productId].name = cab.display_name;// jscs:ignore
    finalObj[productId].eta = cab.estimate;
  }

  return finalObj;
}

/**
 * Parse the estimate cab pricing output got from uber server
 * @param priceResult response from uber
 * @returns {{}}
 */
function parsePriceResult(/* Array<{display_name, estimate, product_id, surge_multiplier}>*/
                          priceResult) {
  var finalObj = {};
  for (let cab of priceResult) {
    let productId = cab.product_id;// jscs:ignore
    finalObj[productId] = finalObj[productId] || {};
    finalObj[productId].name = cab.display_name;// jscs:ignore
    finalObj[productId].fare = cab.estimate;
    let surgeMultiplier = cab.surge_multiplier;// jscs:ignore
    if (surgeMultiplier > 1) finalObj[productId].fare += ` (${surgeMultiplier}x)`;
  }

  return finalObj;
}

/**
 * Remove all the cab outputs that don't have both eta and fare
 * @returns {{}}
 */
function filterInvalidOutput(output) {
  return _object.pick(output, value => value.eta && value.fare);
}

//noinspection Eslint
/**
 * Get the estimated time of uber cabs at a given lat/lng
 * @param start_latitude latitude of the user
 * @param start_longitude longitude of the user
 * @returns {Promise}
 */
function estimateTime(start_latitude, start_longitude) {// jscs:ignore
  //noinspection Eslint
  var reqOptions = {
    url: `${baseUrl}/estimates/time`,
    headers,
    qs: {start_latitude, start_longitude},// jscs:ignore
    json: true
  };
  return request(reqOptions);
}

/**
 * Gives an estimate price for a ride of approx 5Kms
 * @param latitude Start latitude
 * @param longitude Start Longitude
 * @returns {Promise}
 */
function estimatePrice(latitude, longitude) {

  //noinspection Eslint
  var reqOptions = {
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
  return request(reqOptions);
}

function convertToArray(objOutput) {
  var arr = [];
  for (let key of Object.keys(objOutput)) {
    let value = objOutput[key];
    value.productId = key;
    arr.push(value);
  }

  return arr;
}

module.exports = UberController;
