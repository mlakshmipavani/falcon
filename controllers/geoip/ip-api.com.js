'use strict';

const request = require('request-promise');
const log = require('../../utils/logger').child({
  module: 'IpApi.com'
});

/**
 * Rate Limit : 150 requests/minute
 * http://ip-api.com
 */
class IpApiCom {

  /**
   * Gets the GeoIp details related to a given IP address
   * @param clientIp IP Address to get the details for
   * @example
   * <pre>
   * {
   *   as: "AS9829 National Internet Backbone",
   *   city: "Bengaluru",
   *   country: "India",
   *   countryCode: "IN",
   *   isp: "National Internet Backbone",
   *   lat: 12.9833,
   *   lon: 77.5833,
   *   org: "Amrita Institute of Technology & Science",
   *   query: "210.212.205.18",
   *   region: "KA",
   *   regionName: "Karnataka",
   *   status: "success",
   *   timezone: "Asia/Kolkata",
   *   zip: ""
   * }
   * </pre>
   * @returns {Promise<{latitude, longitude}>}
   */
  static getDetails(/*string*/ clientIp) {
    const options = this._getOptions(clientIp);
    return request(options)
      .then((/*{lat, lon}*/result) => {
        return {latitude: result.lat, longitude: result.lon};
      });
  }

  static _getOptions(/*string*/ clientIp) {
    return {
      url: `http://ip-api.com/json/${clientIp}`,
      json: true
    };
  }

}

module.exports = IpApiCom;
