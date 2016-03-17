'use strict';

const request = require('request-promise');
var log = require('../../utils/logger').child({
  module: 'geoip'
});

/**
 * Gets the GeoIp details for an Ip
 * Note: the rate-limit for this service is 10K requests/hour
 * For more info: https://freegeoip.net/
 */
class GeoIp {

  /**
   * Gets the GeoIp details related to a given IP address
   * @param clientIp IP Address to get the details for
   * @example
   * <pre>
   * {
   *   ip: '210.212.205.18',
   *   country_code: 'IN',
   *   country_name: 'India',
   *   region_code: 'KA',
   *   region_name: 'Karnataka',
   *   city: 'Bengaluru',
   *   zip_code: '',
   *   time_zone: 'Asia/Kolkata',
   *   latitude: 12.9833,
   *   longitude: 77.5833,
   *   metro_code: 0
   * }
   * </pre>
   * @returns {Promise<{ip, country_code, country_name, region_code, region_name, city, time_zone, latitude, longitude}>}
   */
  static getDetails(/*string*/ clientIp) {
    const options = this._getOptions(clientIp);
    return request(options)
      .catch(err => {
        log.error(err, `clientIp : ${clientIp}`);
        throw err;
      });
  }

  static _getOptions(/*string*/ clientIp) {
    return {
      url: `http://freegeoip.net/json/${clientIp}`,
      json: true
    };
  }

}

module.exports = GeoIp;
