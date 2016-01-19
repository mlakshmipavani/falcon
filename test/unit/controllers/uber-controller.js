'use strict';

var UberController = require('../../../controllers/uber-controller.js');
var mockUber = require('../../mock/mock-uber-api');
var config = require('../../../config/config.js');

describe('UberController', () => {

  const latitude = 1.23;
  const longitude = 4.56;
  const headers = {Authorization: 'Token jNWXqEXTsHSsBfH0fB-yxG8mw42I_YeQh0OoTDwp'};
  const uberResponse = {
    'db6779d6-d8da-479f-8ac7-8068f4dade6f': {
      name: 'uberGO',
      eta: 60,
      fare: '₹97-118',
      surgeMultiplier: 1.2
    },
    '0dfc35e0-b4be-49a1-b1bf-0bc7217e4b58': {
      name: 'uberX',
      eta: 120,
      fare: '₹108-131',
      surgeMultiplier: 1
    }
  };
  const finalResponse = [
    {
      name: 'uberGO',
      eta: 60,
      fare: '₹97-118',
      surgeMultiplier: 1.2,
      productId: 'db6779d6-d8da-479f-8ac7-8068f4dade6f'
    },
    {
      name: 'uberX',
      eta: 120,
      fare: '₹108-131',
      surgeMultiplier: 1,
      productId: '0dfc35e0-b4be-49a1-b1bf-0bc7217e4b58'
    }
  ];

  before(() => mockUber.listen(5001));

  after(() => mockUber.close());

  it('gets cabs', () => {
    return UberController.getCabs(latitude, longitude).should.eventually.deep.equal(finalResponse);
  });

  it('verifies req options for estimating time', () => {
    var reqOptions = UberController._getOptionsForTime(latitude, longitude);

    //noinspection Eslint
    var expected = {
      url: `${config.uber.baseUrl}/estimates/time`,
      headers,
      qs: {start_latitude: latitude, start_longitude: longitude},// jscs:ignore
      json: true
    };
    reqOptions.should.deep.equal(expected);
  });

  it('verifies req options for estimating price', () => {
    var reqOptions = UberController._getOptionsForPrice(latitude, longitude);

    //noinspection Eslint
    var expected = {
      url: `${config.uber.baseUrl}/estimates/price`,
      headers,
      qs: {
        start_latitude: latitude, // jscs:ignore
        start_longitude: longitude, // jscs:ignore
        // the 0.045 is a rough approximation for 5kms
        end_latitude: latitude + 0.045, // jscs:ignore
        end_longitude: longitude // jscs:ignore
      },
      json: true
    };
    reqOptions.should.deep.equal(expected);
  });

  it('filters invalid output', () => {
    var input = Object.assign({
      '0bc7217e4b58': {
        name: 'uberSUV',
        fare: '₹108-131',
        surgeMultiplier: 1
      }
    }, uberResponse);
    UberController._filterInvalidOutput(input).should.deep.equal(uberResponse);
  });

  it('converts to array', () => {
    UberController._convertToArray(uberResponse).should.deep.equal(finalResponse);
  });

});
