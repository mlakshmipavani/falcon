'use strict';

const FreeGeoIp = require('../../../../controllers/geoip/freegeoip.net');
const IpApiCom = require('../../../../controllers/geoip/ip-api.com');
const GeoIp = require('../../../../controllers/geoip/geoip');

describe('GeoIp aggregator', () => {

  const clientIp = '210.212.205.18';

  it('verify the aggregator', () => {
    const result = {latitude: 12.9833, longitude: 77.5833};
    IpApiCom.getDetails = () => Promise.resolve(result);
    FreeGeoIp.getDetails = () => Promise.resolve(result);

    return GeoIp.getDetails(clientIp).should.eventually.deep.equal(result);
  });

  it('verify for local dev machine', () => {
    // backup NODE_ENV
    const nodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    // prepare
    const result = {latitude: 0, longitude: 0};
    const localIp = '127.0.0.1';
    IpApiCom.getDetails = () => Promise.resolve(result);
    FreeGeoIp.getDetails = () => Promise.resolve(result);
    const expected = {latitude: 12.9833, longitude: 77.5833};

    return GeoIp.getDetails(localIp)
      .then(actual => actual.should.deep.equal(expected))
      .then(() => process.env.NODE_ENV = nodeEnv);
  });

  it('verify errors', () => {
    const error = new Error('hey error!');
    IpApiCom.getDetails = () => Promise.reject(error);
    FreeGeoIp.getDetails = () => Promise.reject(error);

    let errorThrown = false;
    return GeoIp.getDetails(clientIp)
      .catch(err => errorThrown = true)
      .then(() => errorThrown.should.be.true);
  });

  it('verifies invalid IP errors', () => {
    const result = {latitude: 0, longitude: 0};
    IpApiCom.getDetails = () => Promise.resolve(result);
    FreeGeoIp.getDetails = () => Promise.resolve(result);

    let errorThrown = false;
    return GeoIp.getDetails(clientIp)
      .catch(err => errorThrown = true)
      .then(() => errorThrown.should.be.true);
  });

});
