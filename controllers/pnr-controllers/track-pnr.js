'use strict';
const Agenda = require('agenda');
const moment = require('moment');
const Promise = require('bluebird');
const Utils = require('../../utils/Utils');
const RailPnr = require('./rail-pnr-controller');
const DaoHelper = require('../../dao/dao-helper');
const config = require('../../config/config');
const PushController = require('../push-controller');

const url = config.mongoUrl;
const agenda = new Agenda({db: {address: url}});

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

  const pnr = job.attrs.data.pnr;

  return RailPnr.getStatus(pnr)
    .then(pnrFromAPI => {
      //noinspection JSUnresolvedFunction
      return TrackPnrController._checkAndNotify(pnr, pnrFromAPI).thenReturn(pnrFromAPI);
    })
    .then(pnrFromAPI => {
      //noinspection JSUnresolvedFunction
      return TrackPnrController._scheduleNextIfNeeded(pnr, pnrFromAPI);
    })
    .then(done);
});

agenda.on('ready', () => agenda.start());

class TrackPnrController {

  /**
   * Same as RailPnrController.getStatus(), but in the result it also returns a field 'isTracked' that shows
   * if the calling user is tracking this pnr or not
   * @param pnr PNR number
   * @param userToken Token (or _id of the user)
   * @returns {Promise<{}>}
   */
  static getStatusWithTrackingInfo(/*String*/ pnr, /*String*/ userToken) {
    return Promise.join(RailPnr.getStatus(pnr), this._isTrackingOnForUser(userToken, pnr),
      (/*{}*/ pnrStatus, /*boolean*/ isTracked) => {
        //noinspection JSUndefinedPropertyAssignment
        pnrStatus.isTracked = isTracked;
        return pnrStatus;
      });
  }

  /**
   * Initialises tracking for pnr status
   * @param userToken Token of the user who wants to track pnr
   * @param pnr PNR Number to track
   * @returns {Promise<boolean>}
   */
  static startTracking(/*String*/ userToken, /*String*/ pnr) {
    return this._isTrackingPNR(pnr)
      .then(isTracking => {
        if (isTracking) return this._turnTrackingOnForUser(userToken, pnr);
        return this._turnTrackingOnForPnr(userToken, pnr);
      });
  }

  /**
   * Adds a user to the notify list to an already running pnr track
   * @param userToken Token of the user who wants to track pnr
   * @param pnr PNR Number to track
   * @returns {Promise.<boolean>}
   * @private
   */
  static _turnTrackingOnForUser(/*String*/ userToken, /*String*/ pnr) {
    return this._isTrackingOnForUser(userToken, pnr)
      .then(trackingForUser => {
        if (!trackingForUser)
          return DaoHelper.pnrStatus.updateOne({pnr: pnr}, {$addToSet: {userTokens: userToken}})
            .thenReturn(true);
        return false;
      });
  }

  /**
   * Creates a new pnr track job and associates the user to it's notify list
   * @param userToken Token of the user who wants to track pnr
   * @param pnr PNR Number to track
   * @returns {Promise<boolean>}
   * @private
   */
  static _turnTrackingOnForPnr(/*String*/ userToken, /*String*/ pnr) {
    return RailPnr.getStatus(pnr).then(pnrFromAPI => {
      const pnrDetail = {userTokens: [userToken], pnr: pnr, detail: pnrFromAPI};
      return DaoHelper.pnrStatus.insertOne(pnrDetail)
        .then(() => this._scheduleNextIfNeeded(pnr, pnrFromAPI))
        .thenReturn(true);
    });
  }

  /**
   * Stops tracking pnr status for given user
   * @param userToken
   * @param pnr
   */
  static stopTracking(/*String*/ userToken, /*String*/ pnr) {
    return DaoHelper.pnrStatus.findOneAndUpdate({pnr: pnr}, {$pull: {userTokens: userToken}});
  }

  /**
   * checks if pnr is being tracked for any user
   * @param pnr
   * @returns {Promise.<boolean>}
   * @private
   */
  static _isTrackingPNR(/*String*/ pnr) {
    return DaoHelper.pnrStatus.find({pnr: pnr})
      .toArray()
      .then(resultArray => resultArray.length > 0);
  }

  /**
   * checks whether pnr is being tracked or not for given user
   * @param userToken
   * @param pnr
   * @returns {Promise.<boolean>}
   * @private
   */
  static _isTrackingOnForUser(/*String*/ userToken, /*String*/ pnr) {
    return DaoHelper.pnrStatus.find({pnr: pnr}).toArray().then(resultArray => {
      if (resultArray.length > 0)
        return resultArray[0].userTokens.indexOf(userToken) >= 0;
      return false;
    });
  }

  /**
   * it schedules next pnr check if all tickets are not confirmed
   * @param pnr
   * @param pnrFromAPI
   * @private
   */
  static _scheduleNextIfNeeded(pnr, pnrFromAPI) {
    const boardingDate = pnrFromAPI.boardingDate;
    const confirmed = this._isAllConfirmed(pnrFromAPI);
    if (!confirmed) this._schedule(boardingDate, pnr);
  }

  /**
   * Checks whether if all passengers pnrStatus is confirmed or not
   * @param pnr pnr number
   * @param pnrFromAPI pnr Details from irctc
   * @returns {Promise<T>}
   * @private
   */
  static _checkAndNotify(/*String*/ pnr, /*{passengers}*/ pnrFromAPI) {

    return this._getFromDB(pnr)
      .then(pnrFromDBArray => {
        const passengersFromAPI = pnrFromAPI.passengers;
        const passengersFromDB = pnrFromDBArray[0].detail.passengers;
        const isSame = this._isPassengersDetailSame(passengersFromDB, passengersFromAPI);

        if (!isSame) return DaoHelper.pnrStatus.updateOne({pnr: pnr}, {$set: {detail: pnrFromAPI}})
          .then(() => this._notifyAll(pnr, pnrFromAPI));

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
    const passengers = pnrDetail.passengers;
    return passengers.every((passenger) => passenger.currentStatus === 'CNF');
  }

  /**
   * Schedules next call to api based on boarding date
   * @param boardingDate Should be in 'DD-MM-YYYY' format
   * @param pnr
   * @private
   */
  static _schedule(/*String*/ boardingDate, /*String*/ pnr) {
    const nextSchedule = this._getNextSchedule(boardingDate);
    agenda.schedule(nextSchedule, taskName, {pnr: pnr});
  }

  /**
   * Get the new schedule time to check pnr status
   * @param date Date of journey in DD-MM-YYYY format
   * @returns String use this string as argument to agenda.schedule
   * @private
   */
  static _getNextSchedule(/*String*/ date) {
    let nextSchedule = 'in 5 minutes';
    const now = moment();

    const boardingDate = moment(date, 'DD-MM-YYYY');
    const difference = boardingDate.diff(now, 'hours');
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
   * notifies all user about pnr status update
   * @param pnr
   * @param pnrFromAPI
   * @private
   */
  static _notifyAll(/*String*/ pnr, /*{}*/ pnrFromAPI) {
    return DaoHelper.pnrStatus.find({pnr: pnr}).toArray()
      .spread(pnrStatus => {
        //noinspection JSUndefinedPropertyAssignment
        pnrFromAPI.pnr = pnr;
        PushController.pushPnrUpdate(pnrFromAPI, pnrStatus.userTokens);
      });
  }

}

module.exports = TrackPnrController;
