'use strict';

const moment = require('moment');
const Promise = require('bluebird');

const Utils = require('../../utils/Utils');
const agenda = require('../../utils/agenda');
const RailPnrController = require('./rail-pnr-controller');
const PushController = require('../push-controller');
const InvalidPnrError = require('./invalid-pnr-error');
const PnrStatusDao = require('../../dao/pnr-status-dao');

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

const AgendaTasks = {
  trackPnrTaskName: 'trackPnr',
  trackPnr: (job, done) => {
    const pnr = job.attrs.data.pnr;
    return TrackPnrController._trackPnr(pnr).then(() => done());
  },

  trackAgainTaskName: 'trackAgain',
  trackAgain: (job, done) => {
    const userToken = job.attrs.data.userToken;
    const pnr = job.attrs.data.pnr;
    return TrackPnrController.startTracking(userToken, pnr).then(() => done());
  }
};

agenda.define(AgendaTasks.trackPnrTaskName, AgendaTasks.trackPnr);
agenda.define(AgendaTasks.trackAgainTaskName, AgendaTasks.trackAgain);

class TrackPnrController {

  /**
   * Same as RailPnrController.getStatus(), but in the result it also returns a field 'isTracked' that shows
   * if the calling user is tracking this pnr or not
   * @param pnr PNR number
   * @param userToken Token (or _id of the user)
   * @returns {Promise<{}>}
   */
  static getStatusWithTrackingInfo(/*String*/ pnr, /*String*/ userToken) {
    return Promise.join(
      RailPnrController.getStatus(pnr),
      PnrStatusDao.isUserTrackingPnr(userToken, pnr),
      (/*{}*/ pnrStatus, /*boolean*/ isTracked) => {
        //noinspection JSUndefinedPropertyAssignment
        pnrStatus.isTracked = isTracked;
        return pnrStatus;
      });
  }

  static startTracking(/*string*/ userToken, /*string*/ pnr) {
    return PnrStatusDao.isPnrTracked(pnr)
      .then((/*boolean*/ isTracked) => {
        if (isTracked) return PnrStatusDao.addUserToTrackedPnr(userToken, pnr);
        else return this._turnTrackingOn(pnr, userToken);
      });
  }

  /**
   * Stops tracking pnr status for given user
   * @param userToken Token of the user who wants to stop tracking
   * @param pnr PNR number he was tracking
   */
  static stopTracking(/*string*/ userToken, /*string*/ pnr) {
    return PnrStatusDao.pullUserOut(userToken, pnr);
  }

  static _turnTrackingOn(/*string*/ pnr, /*string*/ userToken) {
    return RailPnrController.getStatus(pnr)
      .tap((/*PnrDetails*/ details) => PnrStatusDao.insertPnrDetails(pnr, details, userToken))
      .then((/*PnrDetails*/ details) => this._scheduleNextIfNeeded(pnr, details))
      .catch(err => {
        if (!(err instanceof InvalidPnrError))
          this._schedule('in 1 minute', AgendaTasks.trackAgainTaskName, {pnr, userToken});
        else throw err;
      });
  }

  static _trackPnr(/*string*/ pnr) {
    return RailPnrController.getStatus(pnr)
      .then((/*PnrDetails*/ pnrDetails) => {
        return this._arePassengerDetailsSameInDb(pnr, pnrDetails).then((/*boolean*/ isSame) => {
          return {details: pnrDetails, isSame, allCNF: this._areAllConfirmed(pnrDetails)};
        });
      })
      .tap((/*{details: PnrDetails, isSame: boolean, allCNF: boolean}*/ result) => {
        if (!result.isSame) return PnrStatusDao.updatePnrDetails(pnr, result.details);
      })
      .tap((/*{details: PnrDetails, isSame: boolean, allCNF: boolean}*/ result) => {
        if (!result.isSame) return this._notifyAllUsers(pnr);
      })
      .tap((/*{details: PnrDetails, isSame: boolean, allCNF: boolean}*/ result) => {
        if (result.allCNF) return PnrStatusDao.removePnrDetails(pnr);
      })
      .tap((/*{details: PnrDetails, isSame: boolean, allCNF: boolean}*/ result) => {
        return this._scheduleNextIfNeeded(pnr, result.details);
      })
      .catch(err => {
        if (err.some(e => e instanceof InvalidPnrError)) return PnrStatusDao.removePnrDetails(pnr);
        else this._schedule('in 1 minute', AgendaTasks.trackPnrTaskName, {pnr});
      });
  };

  static _arePassengerDetailsSameInDb(/*string*/ pnr, /*PnrDetails*/ pnrDetails) {
    return PnrStatusDao.getPnrDetailsWithTokens(pnr)
      .then(pnrFromDb =>
        this._isPassengersDetailSame(pnrDetails.passengers, pnrFromDb.details.passengers));
  }

  /**
   * Checks whether both the passenger details is same or not
   * @param passengersFromDB passenger details saved in DB
   * @param passengersFromAPI passenger details from API response
   * @returns {boolean}
   */
  static _isPassengersDetailSame(/*Array*/ passengersFromDB, /*Array*/ passengersFromAPI) {
    return passengersFromDB.every((passengerFromDB, i) => {
      return JSON.stringify(passengerFromDB) === JSON.stringify(passengersFromAPI[i]);
    });
  }

  static _scheduleNextIfNeeded(/*string*/ pnr, /*PnrDetails*/ pnrDetails) {
    const boardingDate = pnrDetails.boardingDate;
    const allConfirmed = this._areAllConfirmed(pnrDetails);
    if (!allConfirmed) {
      const nextRunAt = this._getNextSchedule(boardingDate);
      this._schedule(nextRunAt, AgendaTasks.trackPnrTaskName, {pnr});
    }
  }

  static _areAllConfirmed(/*PnrDetails*/ pnrDetails) {
    const passengers = pnrDetails.passengers;
    return passengers.every(passenger => passenger.currentStatus === 'CNF');
  }

  static _getNextSchedule(/*string*/ boardingDate) {
    if (process.env.NODE_ENV === 'development') return 'in 1 minute';
    let nextRunAt = 'in 5 minutes';
    const now = moment();
    const journeyDate = moment(boardingDate, 'DD-MM-YYYY');
    const diff = journeyDate.diff(now, 'hours');
    if (diff < 48 && diff >= 24) nextRunAt = 'in 4 hours';
    else if (diff >= 48) nextRunAt = 'in 24 hours';
    else if (diff < 24) nextRunAt = 'in 30 minutes';
    return nextRunAt;
  }

  /**
   * Schedules a task in Agenda
   * @param nextRunAt When to run next
   * @param taskName Name of the task to schedule
   * @param data Data to pass to the task
   */
  static _schedule(/*string*/ nextRunAt, /*string*/ taskName, data) {
    agenda.schedule(nextRunAt, taskName, data);
  }

  static _notifyAllUsers(/*string*/ pnr) {
    return PnrStatusDao.getPnrDetailsWithTokens(pnr)
      .then((/*{details, userTokens}*/ result) => {
        result.details.pnr = pnr;
        return PushController.pushPnrUpdate(result.details, result.userTokens);
      });

  }

  static get AgendaTasks() {
    return AgendaTasks;
  }
}

module.exports = TrackPnrController;
