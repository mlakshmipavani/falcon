'use strict';

const Promise = require('bluebird');
const util = require('util');
const config = require('../../../../config/config');
const OlaController = require('../../../../controllers/cabs/ola-controller');
const mockResponses = require('../../../mock/cabs/mock-ola-responses');

describe('Ola Controller', () => {

  const latitude = 1.23;
  const longitude = 4.56;

  it('gets cabs', () => {
    // mock
    OlaController._queryOlaServer = () => Promise.resolve(mockResponses.response);

    // expected
    const expected = [
      {
        name: 'Mini',
        eta: 2,
        surgeMultiplier: 1,
        surgeFixed: 0,
        productId: 'mini',
        minFare: 100,
        maxFare: 110
      },
      {
        name: 'Sedan',
        eta: 9,
        surgeMultiplier: 1,
        surgeFixed: 0,
        productId: 'sedan',
        minFare: 123,
        maxFare: 133
      },
      {
        name: 'Prime',
        eta: 10,
        surgeMultiplier: 1.2,
        surgeFixed: 0,
        productId: 'prime',
        minFare: 149,
        maxFare: 161
      }];

    // execute
    return OlaController.getCabs(latitude, longitude)
      .should.eventually.deep.equal(expected);
  });

  it('verifies 5km fare rate calculation', () => {
    OlaController._calculate5kmFare(80, 4, 10, 1, 1, 0)
      .should.deep.equal({minFare: 100, maxFare: 110});
  });

  it('verifies 5km fare rate with surge multiplier', () => {
    OlaController._calculate5kmFare(80, 4, 10, 1, 1.5, 0)
      .should.deep.equal({minFare: 150, maxFare: 165});
  });

  it('verifies 5km fare rate with fixed surge', () => {
    OlaController._calculate5kmFare(80, 4, 10, 1, 1, 50)
      .should.deep.equal({minFare: 150, maxFare: 160});
  });

  it('verifies 5km fare rate wit surge multiplier and fixed surge', () => {
    OlaController._calculate5kmFare(80, 4, 10, 1, 1.5, 50)
      .should.deep.equal({minFare: 200, maxFare: 215});
  });

  it('verifies the options used to query ola server', () => {
    const expected = {
      url: `${config.ola.baseUrl}/products`,
      headers: {'X-APP-TOKEN': config.ola.token},
      qs: {pickup_lat: latitude, pickup_lng: longitude},
      json: true
    };
    OlaController._getOptions(latitude, longitude).should.deep.equal(expected);
  });
});
