'use strict';

const IpApi = require('../../../../controllers/geoip/ip-api.com');

describe('IpApi.com', () => {

  const clientIp = '210.212.205.18';

  it('verifies the request options', () => {
    const options = IpApi._getOptions(clientIp);
    options.should.deep.equal({
      url: `http://ip-api.com/json/${clientIp}`,
      json: true
    });
  });

});
