'use strict';

const request = require('request-promise');
const Promise = require('bluebird');
const FreeGeoIp = require('./freegeoip.net');
const IpApiCom = require('./ip-api.com');
const log = require('../../utils/logger').child({
  module: 'GeoIp'
});

class GeoIp {

  static getDetails(/*string*/ clientIp) {
    return Promise.any([IpApiCom.getDetails(clientIp), FreeGeoIp.getDetails(clientIp)])
      .catch(error => {
        if (process.env.NODE_ENV !== 'test')
          log.error(error, 'Not able to get GeoIp from either of API');
        throw error;
      })
      .then((/*{latitude, longitude}*/ latlng) => {
        if (!latlng.latitude && !latlng.longitude) {
          if (process.env.NODE_ENV === 'development')
            latlng = {
              latitude: 12.9833,
              longitude: 77.5833
            };
          else {
            const error = new Error(`Invalid Ip : ${clientIp}`);
            log.error(error);
            throw error;
          }
        }

        return latlng;
      });
  }

}

module.exports = GeoIp;
