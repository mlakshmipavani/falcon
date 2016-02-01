'use strict';
var Agenda = require('agenda');
var moment = require('moment');
var RailPnr = require('./rail-pnr-controller.js');
var DaoHelper = require('../../dao/dao-helper.js');
var config = require('../../config/config');
var ParseController = require('../parse-controller.js');

var url = config.mongoUrl;
var agenda = new Agenda({db: {address: url}});

// this is for testing purpose mocking api response
//var pnrFromAPI = {
//  trainNumber: '*16533',
//  trainName: 'BGKT SBC EXPRES',
//  boardingDate: '17- 2-2016',
//  from: 'ADI',
//  to: 'YPR',
//  reservedUpto: 'YPR',
//  boardingPoint: 'ADI',
//  class: 'SL',
//  passengers: [{
//    name: 'Passenger 1',
//    bookingStatus: 'S9  , 64,GN',
//    currentStatus: 'CnF'
//  }],
//  chartStatus: 'CHART NOT PREPARED'
//};

const taskName = 'trackPnr';

agenda.define(taskName, (job, done) => {

  let userToken = job.attrs.data.userToken;
  let pnr = job.attrs.data.pnr;

  return RailPnr.getStatus(pnr)
    .then(pnrFromAPI => {
      //noinspection JSUnresolvedFunction
      return TrackPnr._trackAndNotify(userToken, pnr, pnrFromAPI).thenReturn(pnrFromAPI);
    })
    .then(pnrFromAPI => {
      //noinspection JSUnresolvedFunction
      return TrackPnr._scheduleNextIfNeeded(userToken, pnr, pnrFromAPI);
    })
    .then(done);
});

agenda.on('ready', () => agenda.start());

class TrackPnr {

  /**
   * Initialises tracking for pnr status
   * @param userToken
   * @param pnr
   */
  static startTracking(/*String*/ userToken, /*String*/ pnr) {
    agenda.schedule('in 2 seconds', taskName, {userToken: userToken, pnr: pnr});
  }

  /**
   * it schedules next pnr check if all tickets are not confirmed
   * @param userToken
   * @param pnr
   * @param pnrFromAPI
   * @private
   */
  static _scheduleNextIfNeeded(userToken, pnr, pnrFromAPI) {
    let boardingDate = pnrFromAPI.boardingDate;
    let confirmed = this._isAllConfirmed(pnrFromAPI);
    if (!confirmed) this._schedule(boardingDate, userToken, pnr);
  }

  /**
   * Checks whether if all passengers pnrStatus is confirmed or not
   * @param userToken userId
   * @param pnr pnr number
   * @param pnrFromAPI pnr Details from irctc
   * @returns {Promise<T>}
   * @private
   */
  static _trackAndNotify(/*String*/ userToken, /*String*/ pnr, /*{passengers}*/ pnrFromAPI) {

    let pnrDetail = {userToken: userToken, pnr: pnr, detail: pnrFromAPI};

    return this._getFromDB(pnr)
      .then(pnrFromDBArray => {
        let isPnrInDB = pnrFromDBArray.length > 0;

        if (!isPnrInDB) return DaoHelper.pnrStatus.insertOne(pnrDetail)
          .then(() => this._notifyUser(userToken, pnrFromAPI));

        let passengersFromAPI = pnrFromAPI.passengers;
        let passengersFromDB = pnrFromDBArray[0].detail.passengers;
        let isSame = this._isPassengersDetailSame(passengersFromDB, passengersFromAPI);

        if (!isSame) return DaoHelper.pnrStatus.updateMany({pnr: pnr}, {$set: {detail: pnrFromAPI}})
          .then(() => this._notifyUser(userToken, pnrFromAPI));

        return Promise.resolve();
      });
  }

  /**
   * Checks whether if all passengers pnrStatus is confirmed or not
   * @param pnrDetail pnr Details from irctc
   * @returns Boolean
   * @private
   */
  static _isAllConfirmed(/*{passengers}*/ pnrDetail) {
    let passengers = pnrDetail.passengers;
    return passengers.every((passenger) => passenger.currentStatus === 'CNF');
  }

  /**
   * Schedules next call to api based on boarding date
   * @param boardingDate Should be in 'DD-MM-YYYY' format
   * @param userToken
   * @param pnr
   * @private
   */
  static _schedule(/*String*/ boardingDate, /*String*/ userToken, /*String*/ pnr) {
    let nextSchedule = this._getNextSchedule(boardingDate);
    agenda.schedule(nextSchedule, taskName, {userToken: userToken, pnr: pnr});
  }

  /**
   * Get the new schedule time to check pnr status
   * @param date Date of journey in DD-MM-YYYY format
   * @returns String use this string as argument to agenda.schedule
   * @private
   */
  static _getNextSchedule(/*String*/ date) {
    let nextSchedule = 'in 5 minutes';
    let now = moment();

    let boardingDate = moment(date, 'DD-MM-YYYY');
    let difference = boardingDate.diff(now, 'hours');
    if (difference < 48 && difference > 24) nextSchedule = 'in 4 hours';
    else if (difference >= 48) nextSchedule = 'in 24 hours';
    else if (difference <= 24) nextSchedule = 'in 30 minutes';
    return nextSchedule;
  }

  /**
   * finds pnr details saved in DB
   * @param pnr pnr Number
   * @returns {Promise<Array<{}>>}
   * @private
   */
  static _getFromDB(/*String*/ pnr) {
    return DaoHelper.pnrStatus.find({pnr: pnr}).toArray();
  }

  /**
   * Checks whether both the passenger details is same or not
   * @param passengersFromDB passenger details saved in DB
   * @param passengersFromAPI passenger details from API response
   * @returns {*|boolean}
   * @private
   */
  static _isPassengersDetailSame(/*Array*/ passengersFromDB, /*Array*/ passengersFromAPI) {
    return passengersFromDB.every((passengerFromDB, i) => {
      return JSON.stringify(passengerFromDB) === JSON.stringify(passengersFromAPI[i]);
    });
  }

  /**
   * Notifies to User about pnr status Update
   * @param userToken
   * @param pnrFromAPI
   * @private
   */
  static _notifyUser(/*String*/ userToken, /*{}*/ pnrFromAPI) {
    ParseController.sendBotPushtoUsers([userToken], pnrFromAPI);
  }

}

module.exports = TrackPnr;
