'use strict';

const moment = require('moment');
const Promise = require('bluebird');

const Utils = require('../../../../utils/Utils');
const DaoHelper = require('../../../../dao/dao-helper');
const PnrStatusDao = require('../../../../dao/pnr-status-dao');
const RailResponses = require('../../../mock/rail-pnr/rail-responses');
const InvalidPnrError = require('../../../../controllers/pnr-controllers/invalid-pnr-error');
const TrackPnrController = require('../../../../controllers/pnr-controllers/track-pnr');
const RailPnrController = require('../../../../controllers/pnr-controllers/rail-pnr-controller');
const PushController = require('../../../../controllers/push-controller');

describe('New Track', () => {

  const pnr = '1234567890';
  const userToken = 'token1';

  before(() => Promise.delay(100).then(() => DaoHelper.db.dropDatabase()));

  afterEach(() => DaoHelper.db.dropDatabase());

  it('verifies next schedule calculator', () => {
    const lessThan1Day = moment().add('22', 'hours').format('DD-MM-YYYY');
    TrackPnrController._getNextSchedule(lessThan1Day).should.equal('in 30 minutes');

    const moreThan1Day = moment().add('2', 'day').format('DD-MM-YYYY');
    TrackPnrController._getNextSchedule(moreThan1Day).should.equal('in 4 hours');

    const moreThan2Day = moment().add('3', 'day').format('DD-MM-YYYY');
    TrackPnrController._getNextSchedule(moreThan2Day).should.equal('in 24 hours');
  });

  it('verifies if all passengers are CNF', () => {
    const allCNF = {passengers: [{currentStatus: 'CNF'}, {currentStatus: 'CNF'}]};
    TrackPnrController._areAllConfirmed(allCNF).should.equal(true);

    const notAllCNF = {passengers: [{currentStatus: 'CNF'}, {currentStatus: 'RAC'}]};
    TrackPnrController._areAllConfirmed(notAllCNF).should.equal(false);
  });

  it('verifies schedule next if needed [allCNF]', () => {
    // prepare
    let scheduleCalled = false;
    TrackPnrController._schedule = () => scheduleCalled = true;

    // execute
    const allCNF = {passengers: [{currentStatus: 'CNF'}, {currentStatus: 'CNF'}]};
    TrackPnrController._scheduleNextIfNeeded(pnr, allCNF);

    // verify
    scheduleCalled.should.equal(false);
  });

  it('verifies schedule next if needed [22hrs to depart]', () => {
    // prepare
    let scheduleCalled = false;
    let taskName = undefined;
    TrackPnrController._schedule = (nextRunAt, task) => {
      scheduleCalled = true;
      taskName = task;
    };

    // execute
    const lessThan1Day = moment().add('22', 'hours').format('DD-MM-YYYY');
    const notAllCNF = {
      boardingDate: lessThan1Day,
      passengers: [{currentStatus: 'CNF'}, {currentStatus: 'RAC'}]
    };
    TrackPnrController._scheduleNextIfNeeded(pnr, notAllCNF);

    // verify
    scheduleCalled.should.equal(true);
    taskName.should.equal(TrackPnrController.AgendaTasks.trackPnrTaskName);
  });

  it('check whether pnr status changed', () => {
    const passengerFromDB = Utils.cloneProperties(RailResponses.onePassengerConfirmed.passengers);
    passengerFromDB[0].currentStatus = 'RAC';

    const passengerFormAPI = Utils.cloneProperties(RailResponses.onePassengerConfirmed.passengers);

    TrackPnrController._isPassengersDetailSame(passengerFromDB, passengerFormAPI).should.eql(false);

    passengerFromDB[0].currentStatus = 'CNF';

    TrackPnrController._isPassengersDetailSame(passengerFromDB, passengerFormAPI).should.eql(true);
  });

  it('verifies if Passenger Details are Same In Db [true]', () => {
    return PnrStatusDao.insertPnrDetails(pnr, RailResponses.onePassengerConfirmed, userToken)
      .then(() =>
        TrackPnrController._arePassengerDetailsSameInDb(pnr, RailResponses.onePassengerConfirmed))
      .should.eventually.equal(true);
  });

  it('verifies if Passenger Details are Same In Db [false]', () => {
    return PnrStatusDao.insertPnrDetails(pnr, RailResponses.onePassengerConfirmed, userToken)
      .then(() =>
        TrackPnrController._arePassengerDetailsSameInDb(pnr, RailResponses.twoPassengersParsed))
      .should.eventually.equal(false);
  });

  it('starts tracking a new pnr', () => {
    const originalCode = TrackPnrController._turnTrackingOn;
    let isCalled = false;
    TrackPnrController._turnTrackingOn = () => {
      isCalled = true;
      return Promise.resolve();
    };

    return TrackPnrController.startTracking(userToken, pnr)
      .then(() => isCalled.should.eql(true))
      .then(() => {
        TrackPnrController._turnTrackingOn = originalCode;
      });
  });

  it('starts tracking an already tracked pnr', () => {
    // prepare
    const userToken2 = 'token2';
    return PnrStatusDao.insertPnrDetails(pnr, RailResponses.onePassengerConfirmed, userToken)

      // execute
      .then(() => TrackPnrController.startTracking(userToken2, pnr))
      .then(() => PnrStatusDao.getPnrDetailsWithTokens(pnr))
      .then((/*{details, userTokens}*/ result) =>
        result.userTokens.should.deep.equal([userToken, userToken2]));
  });

  it('turn tracking ON', () => {
    // prepare
    const originalGetStatus = RailPnrController.getStatus;
    RailPnrController.getStatus = (pnr) => Promise.resolve(RailResponses.twoPassengersParsed);
    const originalCode = TrackPnrController._scheduleNextIfNeeded;
    let scheduleCalled = false;
    TrackPnrController._scheduleNextIfNeeded = () => {
      scheduleCalled = true;
      return Promise.resolve();
    };

    // execute
    return TrackPnrController._turnTrackingOn(pnr, userToken)
      .then(() => PnrStatusDao.isPnrTracked(pnr))
      .then(isTracked => isTracked.should.be.true)
      .then(() => scheduleCalled.should.be.true)

      // cleanup
      .then(() => {
        // restore back the function
        TrackPnrController._scheduleNextIfNeeded = originalCode;
        RailPnrController.getStatus = originalGetStatus;
      });
  });

  it('turn tracking ON [InvalidPnrError]', () => {
    const originalGetStatus = RailPnrController.getStatus;
    RailPnrController.getStatus = (pnr) => Promise.reject(new InvalidPnrError());

    let isErrorThrown = false;
    return TrackPnrController._turnTrackingOn(pnr, userToken)
      .catch((err) => isErrorThrown = err instanceof InvalidPnrError)
      .then(() => isErrorThrown.should.be.true)
      .then(() => RailPnrController.getStatus = originalGetStatus);
  });

  it('turn tracking ON [NetworkError]', () => {
    const originalGetStatus = RailPnrController.getStatus;
    RailPnrController.getStatus = (pnr) => Promise.reject(new Error('some random error'));
    let scheduleCalled = false;
    TrackPnrController._schedule = () => scheduleCalled = true;

    let isErrorThrown = false;
    return TrackPnrController._turnTrackingOn(pnr, userToken)
      .catch(err => isErrorThrown = true)
      .then(() => isErrorThrown.should.be.false)
      .then(() => scheduleCalled.should.be.true)
      .then(() => {
        // restore function
        RailPnrController.getStatus = originalGetStatus;
      });
  });

  it('tracks pnr [change in status, but not CNF]', () => {
    // prepare
    const modifiedPassngr = Utils.cloneProperties(RailResponses.onePassengerNotConfirmed);
    modifiedPassngr.passengers[0].currentStatus = 'RAC 18';
    const originalGetStatus = RailPnrController.getStatus;
    RailPnrController.getStatus = (pnr) => Promise.resolve(modifiedPassngr);
    PushController._pushData = () => Promise.resolve();
    let taskName = undefined;
    let scheduleCalled = false;
    TrackPnrController._schedule = (nextRunAt, task, data) => {
      taskName = task;
      scheduleCalled = true;
    };

    return PnrStatusDao.insertPnrDetails(pnr, RailResponses.onePassengerNotConfirmed, userToken)

      // execute
      .then(() => TrackPnrController._trackPnr(pnr))

      // verify
      .then((/*{details, isSame, allCNF}*/ result) => {
        result.details.should.deep.equal(modifiedPassngr);
        result.isSame.should.be.eql(false);
        result.allCNF.should.be.eql(false);
      })
      .then(() => PnrStatusDao.getPnrDetailsWithTokens(pnr))
      .then((/*{details, userTokens}*/ result) => result.details.should.deep.equal(modifiedPassngr))
      .then(() => scheduleCalled.should.be.true)
      .then(() => taskName.should.equal(TrackPnrController.AgendaTasks.trackPnrTaskName))
      .then(() => {
        // restore original code
        RailPnrController.getStatus = originalGetStatus;
      });
  });

  it('tracks pnr [no change in status]', () => {
    // prepare
    const pnrDetails = RailResponses.onePassengerNotConfirmed;
    const originalGetStatus = RailPnrController.getStatus;
    RailPnrController.getStatus = (pnr) => Promise.resolve(pnrDetails);
    PushController._pushData = () => Promise.resolve();
    let scheduleCalled = false;
    TrackPnrController._schedule = (nextRunAt, taskName, data) => {
      scheduleCalled = true;
      taskName.should.equal(TrackPnrController.AgendaTasks.trackPnrTaskName);
    };

    return PnrStatusDao.insertPnrDetails(pnr, pnrDetails, userToken)

      // execute
      .then(() => TrackPnrController._trackPnr(pnr))

      // verify
      .then((/*{details, isSame, allCNF}*/ result) => {
        result.details.should.deep.equal(pnrDetails);
        result.isSame.should.be.eql(true);
        result.allCNF.should.be.eql(false);
      })
      .then(() => PnrStatusDao.getPnrDetailsWithTokens(pnr))
      .then((/*{details, userTokens}*/ result) => result.details.should.deep.equal(pnrDetails))
      .then(() => scheduleCalled.should.be.true)
      .then(() => {
        // restore original code
        RailPnrController.getStatus = originalGetStatus;
      });
  });

  it('tracks pnr [status changes to CNF]', () => {
    const cnfDetails = RailResponses.onePassengerConfirmed;
    const notCnfDetails = RailResponses.onePassengerNotConfirmed;
    const originalGetStatus = RailPnrController.getStatus;
    RailPnrController.getStatus = (pnr) => Promise.resolve(cnfDetails);
    PushController._pushData = () => Promise.resolve();
    let scheduleCalled = false;
    TrackPnrController._schedule = () => scheduleCalled = true;

    return PnrStatusDao.insertPnrDetails(pnr, notCnfDetails, userToken)

      // execute
      .then(() => TrackPnrController._trackPnr(pnr))

      // verify
      .then((/*{details, isSame, allCNF}*/ result) => {
        result.details.should.deep.equal(cnfDetails);
        result.isSame.should.be.eql(false);
        result.allCNF.should.be.eql(true);
      })
      .then(() => PnrStatusDao.isPnrTracked(pnr))
      .then(isTracked => isTracked.should.be.false)
      .then(() => scheduleCalled.should.be.false)
      .then(() => {
        // restore original code
        RailPnrController.getStatus = originalGetStatus;
      });
  });

  it('tracks pnr [getStatus network error]', () => {
    const pnrDetails = RailResponses.onePassengerNotConfirmed;
    const originalGetStatus = RailPnrController.getStatus;
    RailPnrController.getStatus = (pnr) => Promise.reject([new Error('aggregation error')]);
    let scheduleCalled = false;
    TrackPnrController._schedule = (nextRunAt, taskName, data) => {
      scheduleCalled = true;
      nextRunAt.should.equal('in 1 minute');
      taskName.should.equal(TrackPnrController.AgendaTasks.trackPnrTaskName);
    };

    return PnrStatusDao.insertPnrDetails(pnr, pnrDetails, userToken)

      // execute
      .then(() => TrackPnrController._trackPnr(pnr))

      // verify
      .then(() => scheduleCalled.should.be.true)
      .then(() => {
        // restore original code
        RailPnrController.getStatus = originalGetStatus;
      });
  });

  it('track pnr [getStatus InvalidPnrError]', () => {
    const pnrDetails = RailResponses.onePassengerNotConfirmed;
    const originalGetStatus = RailPnrController.getStatus;
    RailPnrController.getStatus = (pnr) => Promise.reject([new InvalidPnrError()]);
    let scheduleCalled = false;
    TrackPnrController._schedule = () => scheduleCalled = true;

    return PnrStatusDao.insertPnrDetails(pnr, pnrDetails, userToken)

      // execute
      .then(() => TrackPnrController._trackPnr(pnr))

      // verify
      .then(() => scheduleCalled.should.be.false)
      .then(() => PnrStatusDao.isPnrTracked(pnr))
      .then((isTracked) => isTracked.should.be.false)
      .then(() => {
        // restore original code
        RailPnrController.getStatus = originalGetStatus;
      });
  });

  it('gets pnr status with tracking info [false]', () => {
    const pnrDetails = RailResponses.onePassengerNotConfirmed;
    const originalGetStatus = RailPnrController.getStatus;
    RailPnrController.getStatus = (pnr) => Promise.resolve(pnrDetails);
    return TrackPnrController.getStatusWithTrackingInfo(pnr, userToken)
      .then((/*{isTracked}*/ result) => result.isTracked.should.be.false)
      .then(() => {
        // restore original code
        RailPnrController.getStatus = originalGetStatus;
      });
  });

  it('gets pnr status with tracking info [true]', () => {
    const pnrDetails = RailResponses.onePassengerNotConfirmed;
    const originalGetStatus = RailPnrController.getStatus;
    RailPnrController.getStatus = (pnr) => Promise.resolve(pnrDetails);
    return PnrStatusDao.insertPnrDetails(pnr, pnrDetails, userToken)
      .then(() => TrackPnrController.getStatusWithTrackingInfo(pnr, userToken))
      .then((/*{isTracked}*/ result) => result.isTracked.should.be.true)
      .then(() => {
        // restore original code
        RailPnrController.getStatus = originalGetStatus;
      });
  });

  it('stops tracking [multiple users tracking same pnr]', () => {
    const pnrDetails = RailResponses.onePassengerNotConfirmed;
    const userToken2 = 'token2';
    return PnrStatusDao.insertPnrDetails(pnr, pnrDetails, userToken)
      .then(() => PnrStatusDao.addUserToTrackedPnr(userToken2, pnr))
      .then(() => TrackPnrController.stopTracking(userToken, pnr))
      .then(() => PnrStatusDao.getPnrDetailsWithTokens(pnr))
      .then((/*{details, userTokens}*/ result) =>
        result.userTokens.should.deep.equal([userToken2]));
  });

  it('stops tracking [the only user]', () => {
    const pnrDetails = RailResponses.onePassengerNotConfirmed;
    return PnrStatusDao.insertPnrDetails(pnr, pnrDetails, userToken)
      .then(() => TrackPnrController.stopTracking(userToken, pnr))
      .then(() => PnrStatusDao.isPnrTracked(pnr))
      .should.eventually.be.false;
  });
});
