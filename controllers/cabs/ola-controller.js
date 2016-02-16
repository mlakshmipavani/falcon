'use strict';

const util = require('util');
const request = require('request-promise');
const config = require('../../config/config');
const Utils = require('../../utils/Utils');

const baseUrl = config.ola.baseUrl;
const headers = {'X-APP-TOKEN': config.ola.token};

class OlaController {

  /**
   * Higher level method to get Ola cabs data
   * @param latitude Pickup latitude
   * @param longitude Pickup longitude
   * @returns {Array<{name, eta, fare, surgeMultiplier, surgeFixed, productId}>}
   */
  static getCabs(/*number*/ latitude, /*number*/ longitude) {
    //noinspection JSValidateTypes
    return this._queryOlaServer(latitude, longitude)
      .then(this._parseResult);
  }

  /**
   * Queries the OLA server for data
   * @param latitude Pickup Latitude
   * @param longitude Pickup longitude
   * @returns {Promise}
   * @private
   */
  static _queryOlaServer(/*number*/ latitude, /*number*/ longitude) {
    const reqOptions = this._getOptions(latitude, longitude);
    return request(reqOptions);
  }

  /**
   * Parses the result obtained from ola server to one that the client can understand
   * @param result Result from OLA server
   * @returns {Array<{name, eta, fare, surgeMultiplier, surgeFixed, productId}>}
   * @private
   */
  static _parseResult(/*{categories, ride_estimate}*/ result) {
    const categories = result.categories;

    return categories.reduce((cabs, /*{id, display_name, eta, fare_breakup}*/ eachCategory) => {
      if (eachCategory.eta === -1) return cabs;
      const cab = {
        name: eachCategory.display_name,
        eta: eachCategory.eta,
        surgeMultiplier: 1, // default value
        surgeFixed: 0, // default value
        productId: eachCategory.id
      };

      OlaController._parseFareBreakUp(cab, eachCategory.fare_breakup);

      cabs.push(cab);
      return cabs;
    }, []);
  }

  /**
   * Parses the fare break-up given by ola and calculate an estimated fare for 5 km
   * @param cab Cab object to which `fare` field will be attached
   * @param fareBreakUp Fare breakup given by ola
   * @private
   */
  static _parseFareBreakUp(cab, /*Array<{}>*/ fareBreakUp) {
    // if fare breakUp is available
    if (fareBreakUp) {
      // find the one with flat rate
      /**
       * @type {{base_fare, cost_per_distance, ride_cost_per_minute, minimum_distance, surcharge}}
       */
      const flatRate = fareBreakUp.find((/*{type}*/breakUp) => breakUp.type === 'flat_rate');

      // if it has a surgeCharge
      if (flatRate && flatRate.surcharge && flatRate.surcharge.length > 0) {

        // search for multiplier surcharge
        const multiplier = flatRate.surcharge.find(surcharge => surcharge.type === 'multiplier');
        if (multiplier) cab.surgeMultiplier = multiplier.value;

        // search for fixed surcharge
        const fixed = flatRate.surcharge.find(surcharge => surcharge.type === 'fixed');
        if (fixed) cab.surgeFixed = fixed.value;
      }

      if (flatRate) {
        const fare = OlaController._calculate5kmFare(flatRate.base_fare,
          flatRate.minimum_distance, flatRate.cost_per_distance, flatRate.ride_cost_per_minute,
          cab.surgeMultiplier, cab.surgeFixed);
        cab.fare = `₹${fare.minFare}-${fare.maxFare}`;
      }
    }
  }

  /**
   * Calculates the fare for a 5Km ride
   * @param baseFare The minimum a user has to pay
   * @param minDistance Distance compensated in the baseFare
   * @param costPerDistance Cost per Km
   * @param costPerMinute Cost per minute
   * @param surgeMultiplier Surge rate multiplier
   * @param surgeFixed Fixed amount surge
   * @returns {{minFare: number, maxFare: number}}
   */
  static _calculate5kmFare(/*number|string*/ baseFare, /*number|string*/ minDistance,
                           /*number|string*/ costPerDistance, /*number|string*/ costPerMinute,
                           /*number*/ surgeMultiplier, /*number|string*/ surgeFixed) {
    baseFare = parseInt(baseFare);
    const calculate = (time) => {
      const fare = (surgeMultiplier *
        (baseFare + (extraDistance * costPerDistance) + (time * costPerMinute))) + surgeFixed;
      return Math.round(fare);
    };

    const extraDistance = Math.max(5 - minDistance, 0);
    const minTime = 10; // Going @ 30Km/hr it would take 10 mins to travel 5Km
    const maxTime = 20; // Going @ 15Km/hr it would take 20 mins to travel 5Km
    const minFare = calculate(minTime);
    const maxFare = calculate(maxTime);
    return {minFare, maxFare};
  }

  /**
   * Returns options required by request module to make the request to ola servers
   * @param latitude Pickup Latitude
   * @param longitude Pickup longitude
   * @returns {{}}
   * @private
   */
  static _getOptions(/*number*/ latitude, /*number*/ longitude) {
    return {
      url: `${baseUrl}/products`,
      headers,
      qs: {pickup_lat: latitude, pickup_lng: longitude},
      json: true
    };
  }
}

module.exports = OlaController;
