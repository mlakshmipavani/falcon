'use strict';

const Promise = require('bluebird');
const util = require('util');
const config = require('../../../../config/config');
const OlaController = require('../../../../controllers/cabs/ola-controller');
const mockResponses = require('../../../mock/cabs/mock-ola-responses');
const DaoHelper = require('../../../../dao/dao-helper');
const UserDao = require('../../../../dao/user-dao');

describe('Ola Controller', () => {

  const latitude = 1.23;
  const longitude = 4.56;
  const olaToken = 'abcd-efgh-ijkl-mnop';

  before(() => Promise.delay(100).then(() => DaoHelper.db.dropDatabase()));

  it('gets cabs', () => {
    // mock
    OlaController._queryOlaServer = () => Promise.resolve(mockResponses.response);

    // execute
    return OlaController.getCabs(latitude, longitude)
      .should.eventually.deep.equal(mockResponses.parsedOutput);
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

  it('verifies store ola token method', () => {
    const socialId = 'sssId';
    return UserDao.newUser(socialId, 'jaydp', 'jaydp17@gmail.com')
      .then((/*User*/ userObj) =>
        OlaController.storeOlaAccessToken(userObj._id.toString(), olaToken))
      .then(() => DaoHelper.user.find({socialId}).next())
      .then((/*{olaAccessToken}*/ userObj) => userObj.olaAccessToken.should.equal(olaToken));
  });

  it('verifies options to book (in dev env)', () => {
    const cabType = 'mini'; // even if the user selects mini the options should contain sedan, coz sandbox servers respond to sedan only
    const expected = {
      url: config.ola.sandboxUrl + '/bookings/create',
      headers: {Authorization: `Bearer ${olaToken}`, 'X-APP-TOKEN': config.ola.sandboxToken},
      qs: {
        pickup_lat: 12.950072, // the only co-ordinates that work with Ola sandbox api
        pickup_lng: 77.642684,
        pickup_mode: 'NOW',
        category: 'sedan' // the only cabType that sandbox server replies to
      },
      json: true
    };
    const options = OlaController._getOptionsToBook(latitude, longitude, cabType, olaToken);
    options.should.deep.equal(expected);
  });

  it('verifies options to book (in prod env)', () => {
    // store the node environment
    const backUpEnvVar = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    const cabType = 'mini';
    const expected = {
      url: config.ola.sandboxUrl + '/bookings/create',
      headers: {Authorization: `Bearer ${olaToken}`, 'X-APP-TOKEN': config.ola.sandboxToken},
      qs: {
        pickup_lat: latitude,
        pickup_lng: longitude,
        pickup_mode: 'NOW',
        category: cabType
      },
      json: true
    };
    const options = OlaController._getOptionsToBook(latitude, longitude, cabType, olaToken);
    options.should.deep.equal(expected);

    // restore the node environment back
    process.env.NODE_ENV = backUpEnvVar;
  });

  it('verifies cab booking', () => {
    // mock
    const result = {
      crn: '5270',
      driver_name: 'Phonenix D297',
      driver_number: '4567894297',
      cab_type: 'sedan',
      cab_number: 'KA 29  7',
      car_model: 'Toyota Corolla',
      eta: 2,
      driver_lat: 12.950074,
      driver_lng: 77.641727
    };
    OlaController._bookWithOlaAccessToken = () => Promise.resolve(result);

    // prepare
    const socialId = 'sssId';
    const cabType = 'mini';
    return UserDao.newUser(socialId, 'jaydp', 'jaydp17@gmail.com')
      .then((/*User*/ userObj) => {
        const userToken = userObj._id.toString();
        return OlaController.storeOlaAccessToken(userToken, olaToken)
          .thenReturn(userToken);
      })

      // execute
      .then((/*string*/ token) => OlaController.book(token, latitude, longitude, cabType))
      .then(output => output.should.deep.equal(result));
  });

  it('verifies cab cancellation', () => {
    // mock
    const result = {
      status: 'SUCCESS',
      request_type: 'BOOKING_CANCEL',
      header: 'Success',
      text: 'Your booking with crn 5271 has been cancelled successfully.'
    };
    OlaController._cancelWithOlaAccessToken = () => Promise.resolve(result);

    // prepare
    const socialId = 'sssId';
    const crn = 5271;
    return UserDao.newUser(socialId, 'jaydp', 'jaydp17@gmail.com')
      .then((/*User*/ userObj) => {
        const userToken = userObj._id.toString();
        return OlaController.storeOlaAccessToken(userToken, olaToken)
          .thenReturn(userToken);
      })

      // execute
      .then((/*string*/ token) => OlaController.cancel(token, crn))
      .then(output => output.should.deep.equal(result));
  });

  it('verifies options to cancel', () => {
    const crn = 1234;
    const expected = {
      url: config.ola.sandboxUrl + '/bookings/cancel',
      headers: {Authorization: `Bearer ${olaToken}`, 'X-APP-TOKEN': config.ola.sandboxToken},
      qs: {crn},
      json: true
    };
    const options = OlaController._getOptionsToCancel(crn, olaToken);
    options.should.deep.equals(expected);
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
