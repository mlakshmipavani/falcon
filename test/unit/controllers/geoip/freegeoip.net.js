'use strict';

const FreeGeoIp = require('../../../../controllers/geoip/freegeoip.net');

describe('IpApi.net tests', () => {

  const clientIp = '210.212.205.18';

  it('verifies the request options', () => {
    const options = FreeGeoIp._getOptions(clientIp);
    options.should.deep.equal({
      url: `http://freegeoip.net/json/${clientIp}`,
      json: true
    });
  });

});
