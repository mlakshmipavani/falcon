'use strict';

const Promise = require('bluebird');
const UberController = require('../../../../controllers/cabs/uber-controller');
const uberResponses = require('../../../mock/cabs/mock-uber-responses');
const OlaController = require('../../../../controllers/cabs/ola-controller');
const olaResponses = require('../../../mock/cabs/mock-ola-responses');
const CabController = require('../../../../controllers/cabs/cab-controller');

describe('Cab controller', () => {

  const latitude = 1.23;
  const longitude = 4.56;

  it('gets cabs', () => {
    // mock
    UberController._getCabTypes = () => Promise.resolve(uberResponses.cabTypes);
    UberController._estimateTime = () => Promise.resolve(uberResponses.times);
    UberController._estimatePrice = () => Promise.resolve(uberResponses.prices);
    OlaController._queryOlaServer = () => Promise.resolve(olaResponses.response);

    // expected
    const expected = [
      {
        productId: 'db6779d6-d8da-479f-8ac7-8068f4dade6f',
        name: 'uberGO',
        eta: 1,
        surgeMultiplier: 1.2,
        surgeFixed: 0,
        minFare: 96,
        maxFare: 108,
        provider: 'uber'
      },
      {
        productId: '0dfc35e0-b4be-49a1-b1bf-0bc7217e4b58',
        name: 'uberX',
        eta: 2,
        surgeMultiplier: 1,
        surgeFixed: 0,
        minFare: 90,
        maxFare: 100,
        provider: 'uber'
      },
      {
        name: 'Mini',
        eta: 2,
        surgeMultiplier: 1,
        surgeFixed: 0,
        productId: 'mini',
        minFare: 100,
        maxFare: 110,
        provider: 'ola'
      },
      {
        name: 'Sedan',
        eta: 9,
        surgeMultiplier: 1.2,
        surgeFixed: 0,
        productId: 'sedan',
        minFare: 148,
        maxFare: 160,
        provider: 'ola'
      }];

    // execute
    return CabController.getCabs(latitude, longitude)
      .should.eventually.deep.equal(expected);
  });

});
