'use strict';

const Promise = require('bluebird');
const request = require('request-promise');
const config = require('../../config/config');

class CrmTktApi {

  /**
   * Returns the status of the pnr
   * @param pnr PNR number
   * @returns {Promise<PnrDetails>}
   */
  static getStatus(/*String*/ pnr) {
    const url = config.railway.confirmtktApiUrl + pnr;

    return request.get({url, json: true})
      .then(Promise.resolve)
      .timeout(2000)
      .then(this._extractPnrDetail);
  }

  /**
   * Extracts the data from response
   * @param res
   * @returns {{trainNumber, trainName, boardingDate, from, to, reservedUpto, boardingPoint, class, passengers, bookingFare, chartStatus}}
   * @private
   */
  static _extractPnrDetail(/* {TrainNo, TrainName, Doj, From, To, ReservationUpto, BoardingPoint, Class, PassengerStatus, ChartPrepared} */
                           res) {
    const obj = {};

    if (res.TrainNo === null)
      throw new Error('CrmTktApi unexpected response');

    obj.trainNumber = res.TrainNo;
    obj.trainName = res.TrainName;
    obj.boardingDate = res.Doj;
    obj.from = res.From;
    obj.to = res.To;
    obj.reservedUpto = res.ReservationUpto;
    obj.boardingPoint = res.BoardingPoint;
    obj.class = res.Class;
    obj.passengers = [];

    /** @type {Array<{Number, BookingStatus, CurrentStatus}>} */
    const passengerDetail = res.PassengerStatus;
    passengerDetail.forEach((passengerFromApi) => {
      const passenger = {};
      passenger.name = '' + passengerFromApi.Number;
      passenger.bookingStatus = passengerFromApi.BookingStatus;
      passenger.currentStatus = passengerFromApi.CurrentStatus;
      obj.passengers.push(passenger);
    });

    obj.bookingFare = 'Not Known';
    if (res.ChartPrepared)
      obj.chartStatus = 'Chart Prepared';
    else
      obj.chartStatus = 'Chart Not Prepared';

    return obj;
  }
}

module.exports = CrmTktApi;
