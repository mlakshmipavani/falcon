'use strict';

const Promise = require('bluebird');
const request = require('request-promise');
const _object = require('lodash/object');
const config = require('../../config/config');
const Utils = require('../../utils/Utils');

const baseUrl = config.uber.baseUrl;
const headers = {Authorization: 'Token jNWXqEXTsHSsBfH0fB-yxG8mw42I_YeQh0OoTDwp'};

class UberController {

  /**
   * Gets uber cabs around a given lat/lng
   * @param latitude
   * @param longitude
   * @returns {{productId, name, eta, surgeMultiplier, surgeFixed, minFare, maxFare}}
   */
  static getCabs(/*number*/ latitude, /*number*/ longitude) {
    return Promise.join(
      this._getCabTypes(latitude, longitude),
      this._estimateTime(latitude, longitude),
      this._estimatePrice(latitude, longitude),
      (/*{products}*/ products, /*{times}*/ times, /*{prices}*/ prices) => {
        return this._getCabsCallback(products.products, times.times, prices.prices);
      });
  }

  /**
   * This callback is called when cabTypes, cab timings and cab prices have been fetched from Uber servers
   * @param cabTypesArr An array of cab types
   * @param times An array of cab timings
   * @param prices An array of cab prices
   * @returns {{productId, name, eta, surgeMultiplier, surgeFixed, minFare, maxFare}}
   * @private
   */
  static _getCabsCallback(/*Array<{product_id, price_details, display_name}>*/ cabTypesArr,
                          /*Array<{product_id, estimate}>*/ times,
                          /*Array<{product_id, surge_multiplier}>*/ prices) {
    let cabs = Utils.getObjectFromArray(cabTypesArr, 'product_id');
    for (const eachTime of times) {
      const productId = eachTime.product_id;
      cabs[productId].eta = eachTime.estimate / 60; // converts eta into minutes
    }

    for (const eachPrice of prices) {
      const productId = eachPrice.product_id;
      cabs[productId].surgeMultiplier = eachPrice.surge_multiplier;
      cabs[productId].surgeFixed = 0;
    }

    cabs = _object.values(cabs);
    cabs.forEach(UberController._calculateFare);
    cabs = cabs.map(UberController._keepOnlyRequiredFields)
      .filter(cab => cab.eta && cab.minFare && cab.maxFare); // filter out cabs that don't have eta or fare
    return cabs;
  }

  /**
   * Calculates an estimated fare a cab and attaches the fare field to it
   * @param {{price_details: {cost_per_minute, minimum, cost_per_distance, base}, surgeMultiplier}} cab
   * @private
   */
  static _calculateFare(cab) {
    const fareBreakUp = cab.price_details;
    if (!fareBreakUp) return;
    const calculate = (time) => {
      const fare = (fareBreakUp.base + (fareBreakUp.cost_per_distance * 5)
        + (time * fareBreakUp.cost_per_minute)) * cab.surgeMultiplier;
      return Math.round(fare);
    };

    const minTime = 10; // Going @ 30Km/hr it would take 10 mins to travel 5Km
    const maxTime = 20; // Going @ 15Km/hr it would take 20 mins to travel 5Km
    cab.minFare = calculate(minTime);
    cab.maxFare = calculate(maxTime);
  }

  /**
   * Get the type of uber cabs available at a given lat/lng
   * @param latitude latitude of the user
   * @param longitude longitude of the user
   * @returns {Promise}
   */
  static _getCabTypes(/*number*/ latitude, /*number*/ longitude) {
    const reqOptions = this._getOptionsForCabTypes(latitude, longitude);
    return request(reqOptions);
  }

  /**
   * Get the estimated time of uber cabs at a given lat/lng
   * @param latitude latitude of the user
   * @param longitude longitude of the user
   * @returns {Promise}
   */
  static _estimateTime(/*number*/ latitude, /*number*/ longitude) {
    const reqOptions = this._getOptionsForTime(latitude, longitude);
    return request(reqOptions);
  }

  /**
   * Get the estimated time of uber cabs at a given lat/lng
   * @param latitude latitude of the user
   * @param longitude longitude of the user
   * @returns {Promise}
   */
  static _estimatePrice(/*number*/ latitude, /*number*/ longitude) {
    const reqOptions = this._getOptionsForPrice(latitude, longitude);
    return request(reqOptions);
  }

  static _getOptionsForCabTypes(/*number*/ latitude, /*number*/ longitude) {
    return {
      url: `${baseUrl}/products`,
      headers,
      qs: {latitude, longitude},
      json: true
    };
  }

  static _getOptionsForTime(/*number*/ latitude, /*number*/ longitude) {
    return {
      url: `${baseUrl}/estimates/time`,
      headers,
      qs: {start_latitude: latitude, start_longitude: longitude},
      json: true
    };
  }

  static _getOptionsForPrice(/*number*/ latitude, /*number*/ longitude) {
    return {
      url: `${baseUrl}/estimates/price`,
      headers,
      qs: {
        start_latitude: latitude,
        start_longitude: longitude,

        // the 0.045 is a rough approximation for 5kms
        end_latitude: latitude + 0.045,
        end_longitude: longitude
      },
      json: true
    };
  }

  /**
   * Keeps only fields that are required by the client
   * @param {{product_id, display_name, eta, surgeMultiplier, surgeFixed, minFare, maxFare}} cab
   * @returns {{productId, name, eta, surgeMultiplier, surgeFixed, minFare, maxFare}}
   * @private
   */
  static _keepOnlyRequiredFields(cab) {
    const newCab = {};
    newCab.productId = cab.product_id;
    newCab.name = cab.display_name;
    newCab.eta = cab.eta;
    newCab.surgeMultiplier = cab.surgeMultiplier;
    newCab.surgeFixed = cab.surgeFixed;
    newCab.minFare = cab.minFare;
    newCab.maxFare = cab.maxFare;
    return newCab;
  }
}

module.exports = UberController;
