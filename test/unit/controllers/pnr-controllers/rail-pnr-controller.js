'use strict';

const railResponses = require('../../../mock/rail-pnr/rail-responses');
const RailPnrController = require('../../../../controllers/pnr-controllers/rail-pnr-controller');

describe('RailPnrController', () => {

  it('parses html from railway site', () => {
    return RailPnrController._parseHtml(railResponses.twoPassengers)
      .should.deep.equal(railResponses.twoPassengersParsed);
  });
});
