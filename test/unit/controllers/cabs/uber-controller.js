'use strict';

const UberController = require('../../../../controllers/cabs/uber-controller');
const mockResponses = require('../../../mock/cabs/mock-uber-responses');
const config = require('../../../../config/config.js');

describe('UberController', () => {

  const latitude = 1.23;
  const longitude = 4.56;
  const headers = {Authorization: 'Token jNWXqEXTsHSsBfH0fB-yxG8mw42I_YeQh0OoTDwp'};
  const finalResponse = [
    {
      name: 'uberGO',
      eta: 1,
      minFare: 96,
      maxFare: 108,
      surgeMultiplier: 1.2,
      surgeFixed: 0,
      productId: 'db6779d6-d8da-479f-8ac7-8068f4dade6f'
    },
    {
      name: 'uberX',
      eta: 2,
      minFare: 90,
      maxFare: 100,
      surgeMultiplier: 1,
      surgeFixed: 0,
      productId: '0dfc35e0-b4be-49a1-b1bf-0bc7217e4b58'
    }
  ];

  it('gets cabs', () => {
    // mock
    UberController._getCabTypes = () => mockResponses.cabTypes;
    UberController._estimateTime = () => mockResponses.times;
    UberController._estimatePrice = () => mockResponses.prices;

    // execute
    return UberController.getCabs(latitude, longitude).should.eventually.deep.equal(finalResponse);
  });

  it('verifies req options for estimating time', () => {
    const reqOptions = UberController._getOptionsForTime(latitude, longitude);

    const expected = {
      url: `${config.uber.baseUrl}/estimates/time`,
      headers,
      qs: {start_latitude: latitude, start_longitude: longitude},
      json: true
    };
    reqOptions.should.deep.equal(expected);
  });

  it('verifies req options for estimating price', () => {
    const reqOptions = UberController._getOptionsForPrice(latitude, longitude);

    const expected = {
      url: `${config.uber.baseUrl}/estimates/price`,
      headers,
      qs: {
        start_latitude: latitude,
        start_longitude: longitude,

        // the 0.045 is a rough approximation for 5kms
        end_latitude: latitude + 0.045,
        end_longitude: longitude
      },
      json: true
    };
    reqOptions.should.deep.equal(expected);
  });

  it('verifies req options for cab types', () => {
    const reqOptions = UberController._getOptionsForCabTypes(latitude, longitude);

    const expected = {
      url: `${config.uber.baseUrl}/products`,
      headers,
      qs: {latitude, longitude},
      json: true
    };
    reqOptions.should.deep.equal(expected);
  });

});
