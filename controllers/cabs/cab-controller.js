'use strict';

const Promise = require('bluebird');
const UberController = require('./uber-controller');
const OlaController = require('./ola-controller');

/**
 * Aggregates all the cab providers
 */
class CabController {

  /**
   * Gets all the cabs around a given lat/lng
   * @param latitude
   * @param longitude
   * @returns {{productId, name, eta, surgeMultiplier, surgeFixed, fare, provider}}
   */
  static getCabs(/*number*/ latitude, /*number*/ longitude) {
    return Promise.join(
      UberController.getCabs(latitude, longitude),
      OlaController.getCabs(latitude, longitude),
      (uberCabs, olaCabs) => {
        uberCabs.forEach(cab => cab.provider = 'uber');
        olaCabs.forEach(cab => cab.provider = 'ola');
        return uberCabs.concat(olaCabs);
      }
    );
  }

}

module.exports = CabController;
