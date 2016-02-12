'use strict';

const request = require('request-promise');
const config = require('../config/config');
const Utils = require('../utils/Utils');

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
      .then(res => {
        console.log(JSON.stringify(res, null, 2));
        return res;
      })
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
    let reqOptions = this._getOptions(latitude, longitude);
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
    let rideEstimates = result.ride_estimate; // jscs:ignore
    rideEstimates = Utils.getObjectFromArray(rideEstimates, 'category');

    return categories.reduce((cabs, /*{id, fare_breakup}*/ eachCategory) => {
      const est = rideEstimates[eachCategory.id];

      //noinspection JSUnresolvedVariable
      let cab = {
        name: eachCategory.display_name, // jscs:ignore
        eta: eachCategory.eta,
        fare: `₹${est.amount_min}-${est.amount_max}`, // jscs:ignore
        surgeMultiplier: 1, // default value
        surgeFixed: 0,
        productId: eachCategory.id
      };

      // if fare breakUp is available
      if (eachCategory.fare_breakup) { // jscs:ignore
        /*** @type {{surcharge}} */
        const flatRate = eachCategory.fare_breakup.find((/*{type}*/ breakUp) => { // jscs:ignore
          return breakUp.type === 'flat_rate'; // find the one with flat rate
        });

        // if it has a surgeCharge
        if (flatRate && flatRate.surcharge && flatRate.surcharge.length > 0) {

          // search for multiplier surcharge
          const multiplier = flatRate.surcharge.find(surcharge => surcharge.type === 'multiplier');
          if (multiplier) cab.surgeMultiplier = multiplier.value;

          // search for fixed surcharge
          const fixed = flatRate.surcharge.find(surcharge => surcharge.type === 'fixed');
          if (fixed) cab.surgeFixed = fixed.value;
        }
      }

      cabs.push(cab);
      return cabs;
    }, []);
  }

  /**
   * Returns options required by request module to make the request to ola servers
   * @param latitude Pickup Latitude
   * @param longitude Pickup longitude
   * @returns {{}}
   * @private
   */
  static _getOptions(/*number*/ latitude, /*number*/ longitude) {
    //noinspection Eslint
    return {
      url: `${baseUrl}/products`,
      headers,
      qs: {
        pickup_lat: latitude, // jscs:ignore
        pickup_lng: longitude, // jscs:ignore
        // the 0.045 is a rough approximation for 5kms
        drop_lat: latitude + 0.045, // jscs:ignore
        drop_lng: longitude // jscs:ignore
      },
      json: true
    };
  }
}

module.exports = OlaController;
