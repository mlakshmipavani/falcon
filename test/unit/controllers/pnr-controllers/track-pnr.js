'use strict';

const agenda = require('../../../../utils/agenda');
const Promise = require('bluebird');
const DaoHelper = require('../../../../dao/dao-helper');
const Utils = require('../../../../utils/Utils');

const moment = require('moment');
const TrackPnrController = require('../../../../controllers/pnr-controllers/track-pnr');
const RailPnrController = require('../../../../controllers/pnr-controllers/rail-pnr-controller.js');
const PushController = require('../../../../controllers/push-controller');

describe('TrackPnrController', () => {
  const pnrConfirmed = '4528171237';
  const pnrNotConfirmed = '1231231231';
  const userToken = '7405484154';

  const onePassengerConfirmed = {
    trainNumber: '*16533',
    trainName: 'BGKT SBC EXPRES',
    boardingDate: '17- 2-2016',
    from: 'ADI',
    to: 'YPR',
    reservedUpto: 'YPR',
    boardingPoint: 'ADI',
    class: 'SL',
    passengers: [{
      name: 'Passenger 1',
      bookingStatus: 'S9  , 64,GN',
      currentStatus: 'CNF'
    }],
    chartStatus: 'CHART NOT PREPARED'
  };

  const onePassengerNotConfirmed = {
    trainNumber: '*16533',
    trainName: 'BGKT SBC EXPRES',
    boardingDate: '17- 2-2016',
    from: 'ADI',
    to: 'YPR',
    reservedUpto: 'YPR',
    boardingPoint: 'ADI',
    class: 'SL',
    passengers: [{
      name: 'Passenger 1',
      bookingStatus: 'S9  , 64,GN',
      currentStatus: 'RAC'
    }],
    chartStatus: 'CHART NOT PREPARED'
  };

  const twoPassenger01Confirmed = {
    trainNumber: '*16533',
    trainName: 'BGKT SBC EXPRES',
    boardingDate: '17- 2-2016',
    from: 'ADI',
    to: 'YPR',
    reservedUpto: 'YPR',
    boardingPoint: 'ADI',
    class: 'SL',
    passengers: [
      {
        name: 'Passenger 1',
        bookingStatus: 'S9  , 64,GN',
        currentStatus: 'CNF'
      },
      {
        name: 'Passenger 2',
        bookingStatus: 'S9  , 64,GN',
        currentStatus: 'RAC'
      }],
    chartStatus: 'CHART NOT PREPARED'
  };

  beforeEach(() => {
    // mock
    RailPnrController.getStatus = (pnr) => {
      if (pnr === pnrConfirmed)
        return Promise.resolve(onePassengerConfirmed);
      else if (pnr === pnrNotConfirmed)
        return Promise.resolve(onePassengerNotConfirmed);
    };

    PushController._pushData = (action, data, playerIds) =>
      Promise.resolve({recipients: playerIds});

    return Promise.delay(100).then(() => DaoHelper.db.dropDatabase());
  });

  it('should check whether all passengers pnr status is confirmed', () => {
    //noinspection BadExpressionStatementJS
    TrackPnrController._isAllConfirmed(onePassengerConfirmed).should.be.true;

    //noinspection BadExpressionStatementJS
    TrackPnrController._isAllConfirmed(twoPassenger01Confirmed).should.be.false;
  });

  it('should get next schedule for checking pnr status from pnr api', () => {
    const lessThan1Day = moment().add('22', 'hours').format('DD-MM-YYYY');
    TrackPnrController._getNextSchedule(lessThan1Day).should.equal('in 30 minutes');

    const moreThan1Day = moment().add('2', 'day').format('DD-MM-YYYY');
    TrackPnrController._getNextSchedule(moreThan1Day).should.equal('in 4 hours');

    const moreThan2Day = moment().add('3', 'day').format('DD-MM-YYYY');
    TrackPnrController._getNextSchedule(moreThan2Day).should.equal('in 24 hours');
  });

  it('should check whether pnr status changed Or not', () => {
    const passengerFromDB = Utils.cloneProperties(onePassengerConfirmed.passengers);
    passengerFromDB[0].currentStatus = 'RAC';

    const passengerFormAPI = Utils.cloneProperties(onePassengerConfirmed.passengers);

    //noinspection BadExpressionStatementJS
    TrackPnrController._isPassengersDetailSame(passengerFromDB, passengerFormAPI).should.be.false;

    passengerFromDB[0].currentStatus = 'CNF';

    //noinspection BadExpressionStatementJS
    TrackPnrController._isPassengersDetailSame(passengerFromDB, passengerFormAPI).should.be.true;
  });

  it('should update pnr details in DB', () => {
    const twoPassenger11Confirmed = Utils.cloneProperties(twoPassenger01Confirmed);
    twoPassenger11Confirmed.passengers[1].currentStatus = 'CNF';

    return DaoHelper.pnrStatus.insertOne({
        userTokens: [userToken],
        pnr: pnrConfirmed,
        details: twoPassenger01Confirmed
      })
      .then((result) => {
        if (!result.insertedCount) throw new Error('not inserted in DB');
      })
      .then(() => TrackPnrController._checkAndNotify(pnrConfirmed, twoPassenger11Confirmed))
      .then(() => DaoHelper.pnrStatus.find({pnr: pnrConfirmed}).toArray())
      .spread(result => result.details.passengers[1].currentStatus.should.be.equal('CNF'));
  });

  it('should insert details in DB and start tracking', () => {
    return TrackPnrController.startTracking(userToken, pnrNotConfirmed)
      .then(() => DaoHelper.pnrStatus.find({pnr: pnrNotConfirmed}).toArray())
      .should.eventually.be.of.length(1);
  });

  it('should not start tracking again', () => {
    return TrackPnrController.startTracking(userToken, pnrConfirmed)
      .then(() => TrackPnrController.startTracking(userToken, pnrConfirmed))
      .should.eventually.be.false;
  });

  it('should start tracking already tracking pnr for different user ', () => {
    return TrackPnrController.startTracking(userToken, pnrConfirmed)
      .then(() => TrackPnrController.startTracking('9990913081', pnrConfirmed))
      .then(result => result.should.be.true)
      .then(() => DaoHelper.pnrStatus.find({pnr: pnrConfirmed}).toArray())
      .spread(pnrStatus => pnrStatus.userTokens)
      .then(userTokens => userTokens.indexOf('9990913081') > -1)
      .should.eventually.be.true;
  });

  it('should stop tracking for user', () => {
    return TrackPnrController.startTracking(userToken, pnrConfirmed)
      .then(() => TrackPnrController.startTracking('9990913081', pnrConfirmed))
      .then(() => TrackPnrController.stopTracking(userToken, pnrConfirmed))
      .then(() => DaoHelper.pnrStatus.find({pnr: pnrConfirmed}).toArray())
      .spread(pnrStatus => pnrStatus.userTokens.indexOf(userToken) > -1)
      .then(result => result.should.be.false)
      .then(() => TrackPnrController.stopTracking('9990913081', pnrConfirmed))
      .then(() => DaoHelper.pnrStatus.find({pnr: pnrConfirmed}).toArray())
      .then(pnrStatusArray => pnrStatusArray.length.should.be.equal(0))
      .then(() => DaoHelper.agendaJobs.find({data: {pnr: pnrConfirmed}}).toArray())
      .then(pnrStatus => pnrStatus.length.should.be.equal(0));

  });

  it('gets pnr status with tracking info [false]', () => {
    return TrackPnrController.getStatusWithTrackingInfo(pnrConfirmed, userToken)
      .should.eventually.have.property('isTracked', false);
  });

  it('gets pnr status with tracking info [true]', () => {
    return TrackPnrController.startTracking(userToken, pnrConfirmed)
      .then(() => TrackPnrController.getStatusWithTrackingInfo(pnrConfirmed, userToken))
      .should.eventually.have.property('isTracked', true);
  });

  it('should start tracking again if api response is undefined', () => {
    let apiHitCount = 0;
    let ScheduleCalled = false;
    agenda.schedule = (nextSchedule, taskName, data) => {
      if (taskName === 'trackAgain')
        ScheduleCalled = true;
    };

    RailPnrController.getStatus = (pnr) => {
      apiHitCount += 1;
      if (apiHitCount <= 1)
        return Promise.resolve(undefined);
      else
        return Promise.resolve(onePassengerNotConfirmed);
    };

    return TrackPnrController.startTracking(userToken, pnrNotConfirmed)
      .then(() => ScheduleCalled.should.be.true);
  });

});
