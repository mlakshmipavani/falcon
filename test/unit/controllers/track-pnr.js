'use strict';

const Promise = require('bluebird');
const DaoHelper = require('../../../dao/dao-helper');
const Utils = require('../../../utils/Utils');

const moment = require('moment');
const TrackPnrController = require('../../../controllers/pnr-controllers/track-pnr');
const RailPnr = require('../../../controllers/pnr-controllers/rail-pnr-controller.js');

describe('TrackPnr', () => {
  const pnr = '4528171237';
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
    RailPnr.getStatus = (pnr) => Promise.resolve(onePassengerConfirmed);

    return Promise.delay(100).then(() => DaoHelper.db.dropDatabase());
  });

  it('should check whether all passengers pnr status is confirmed', () => {
    //noinspection BadExpressionStatementJS
    TrackPnrController._isAllConfirmed(onePassengerConfirmed).should.be.true;

    //noinspection BadExpressionStatementJS
    TrackPnrController._isAllConfirmed(twoPassenger01Confirmed).should.be.false;
  });

  it('should get next schedule for checking pnr status from pnr api', () => {
    let lessThan1Day = moment().add('22', 'hours').format('DD-MM-YYYY');
    TrackPnrController._getNextSchedule(lessThan1Day).should.equal('in 30 minutes');

    let moreThan1Day = moment().add('2', 'day').format('DD-MM-YYYY');
    TrackPnrController._getNextSchedule(moreThan1Day).should.equal('in 4 hours');

    let moreThan2Day = moment().add('3', 'day').format('DD-MM-YYYY');
    TrackPnrController._getNextSchedule(moreThan2Day).should.equal('in 24 hours');
  });

  it('should check whether pnr status changed Or not', () => {
    let passengerFromDB = Utils.cloneProperties(onePassengerConfirmed.passengers);
    passengerFromDB[0].currentStatus = 'RAC';

    let passengerFormAPI = Utils.cloneProperties(onePassengerConfirmed.passengers);

    //noinspection BadExpressionStatementJS
    TrackPnrController._isPassengersDetailSame(passengerFromDB, passengerFormAPI).should.be.false;

    passengerFromDB[0].currentStatus = 'CNF';

    //noinspection BadExpressionStatementJS
    TrackPnrController._isPassengersDetailSame(passengerFromDB, passengerFormAPI).should.be.true;
  });

  it('should update pnr details in DB', () => {
    let twoPassenger11Confirmed = Utils.cloneProperties(twoPassenger01Confirmed);
    twoPassenger11Confirmed.passengers[1].currentStatus = 'CNF';

    return DaoHelper.pnrStatus.insertOne({
        userTokens: [userToken],
        pnr: pnr,
        detail: twoPassenger01Confirmed
      })
      .then((result) => {
        if (!result.insertedCount) throw new Error('not inserted in DB');
      })
      .then(() => TrackPnrController._checkAndNotify(pnr, twoPassenger11Confirmed))
      .then(() => DaoHelper.pnrStatus.find({pnr: pnr}).toArray())
      .spread(result => result.detail.passengers[1].currentStatus.should.be.equal('CNF'));
  });

  it('should insert details in DB and start tracking', () => {
    return TrackPnrController.startTracking(userToken, pnr)
      .then(() => DaoHelper.pnrStatus.find({pnr: pnr}).toArray())
      .should.eventually.be.of.length(1);
  });

  it('should not start tracking again', () => {
    return TrackPnrController.startTracking(userToken, pnr)
      .then(() => TrackPnrController.startTracking(userToken, pnr))
      .should.eventually.be.equal('Already tracking');
  });

  it('should start tracking already tracking pnr for different user ', () => {
    return TrackPnrController.startTracking(userToken, pnr)
      .then(() => TrackPnrController.startTracking('9990913081', pnr))
      .then(result => result.should.be.equal('Trackin Started'))
      .then(() => DaoHelper.pnrStatus.find({pnr: pnr}).toArray())
      .spread(pnrStatus => pnrStatus.userTokens)
      .then(userTokens => userTokens.indexOf('9990913081') > -1)
      .should.eventually.be.true;
  });

  it('should stop tracking for user', () => {
    return TrackPnrController.startTracking(userToken, pnr)
      .then(() => TrackPnrController.startTracking('9990913081', pnr))
      .then(() => TrackPnrController.stopTracking(userToken, pnr))
      .then(() => DaoHelper.pnrStatus.find({pnr: pnr}).toArray())
      .spread(pnrStatus => pnrStatus.userTokens.indexOf(userToken) > -1)
      .should.eventually.be.false;
  });

  it('gets pnr status with tracking info [false]', () => {
    return TrackPnrController.getStatusWithTrackingInfo(pnr, userToken)
      .should.eventually.have.property('isTracked', false);
  });

  it('gets pnr status with tracking info [true]', () => {
    return TrackPnrController.startTracking(userToken, pnr)
      .then(() => TrackPnrController.getStatusWithTrackingInfo(pnr, userToken))
      .should.eventually.have.property('isTracked', true);
  });
});
