'use strict';

var Promise = require('bluebird');
var DaoHelper = require('../../../dao/dao-helper');
var Utils = require('../../../utils/Utils');

var moment = require('moment');
var TrackPnrController = require('../../../controllers/pnr-controllers/track-pnr');

describe('TrackPnr', () => {
  const pnr = 4528171237;
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

  function dropDB() {
    return Promise.delay(100).then(() => DaoHelper.db.dropDatabase());
  }

  before(() => {
    return dropDB();
  });

  afterEach(() => {
    return dropDB();
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

  it('should insert pnr details in DB for further tracking', () => {
    return TrackPnrController._trackAndNotify(userToken, pnr, onePassengerConfirmed)
      .then(() => DaoHelper.pnrStatus.find({pnr: pnr}).toArray())
      .should.eventually.be.of.length(1);
  });

  it('should update pnr details in DB', () => {
    let twoPassenger11Confirmed = Utils.cloneProperties(twoPassenger01Confirmed);
    twoPassenger11Confirmed.passengers[1].currentStatus = 'CNF';

    return DaoHelper.pnrStatus.insertOne({
        userToken: userToken,
        pnr: pnr,
        detail: twoPassenger01Confirmed
      })
      .then((result) => {
        if (!result.insertedCount) throw new Error('not inserted in DB');
      })
      .then(() => TrackPnrController._trackAndNotify(userToken, pnr, twoPassenger11Confirmed))
      .then(() => DaoHelper.pnrStatus.find({pnr: pnr}).toArray())
      .spread(result => result.detail.passengers[1].currentStatus.should.be.equal('CNF'));
  });

});
