'use strict';

const Promise = require('bluebird');
const request = require('request-promise');
const xpath = require('xpath');
const Dom = require('xmldom').DOMParser;

const config = require('../../config/config');
const InvalidPnrError = require('./invalid-pnr-error');

class ChkPnrStsApi {

  /**
   * Returns the status of the pnr
   * @param pnr PNR number
   * @returns {Promise<PnrDetails>}
   */
  static getStatus(/*string*/ pnr) {
    const url = config.railway.chkPnrStsIrctcApiUrl + pnr;

    return request.get(url)
      .then(Promise.resolve) // convert to bluebird promise
      .timeout(60000)
      .then(this._extractPnrDetail);
  }

  /**
   * Extracts the data from HTML provided
   * @param html
   * @returns {{trainNumber, trainName, boardingDate, from, to, reservedUpto, boardingPoint, class, passengers, bookingFare, chartStatus}}
   * @private
   */
  static _extractPnrDetail(/*string*/ html) {
    const doc = new Dom({locator: {}, errorHandler: {}}).parseFromString(html);

    const errorString = xpath.select('//div/text()', doc).toString();
    const isInvalid = errorString.indexOf('invalid') > -1;
    if (isInvalid) throw new InvalidPnrError();

    const obj = {};
    obj.trainNumber = xpath.select('//table/h5[1]/a/text()', doc).toString().slice(0, 5).trim();
    if (obj.trainNumber === '')
      throw new Error('ChkPnrStsAPI unexpected response');

    obj.trainName = xpath.select('//table/h5[2]', doc).toString().slice(24, -5).trim();
    obj.boardingDate = xpath.select('//table/h5[3]', doc).toString().slice(27, -5).trim();
    obj.from = xpath.select('//table/h5[4]/a/text()', doc).toString().trim();
    obj.to = xpath.select('//table/h5[5]/a/text()', doc).toString().trim();
    obj.reservedUpto = xpath.select('//table/h5[6]/a/text()', doc).toString().trim();
    obj.boardingPoint = xpath.select('//table/h5[7]/a/text()', doc).toString().trim();
    obj.class = xpath.select('//table/h5[8]', doc).toString().slice(19, -5).trim();

    const tdCount = xpath.select('//table[2]/tr', doc).length;
    obj.passengers = [];

    for (let i = 1; i <= tdCount; i++) {
      const passenger = {};
      const tdValue = xpath.select('//table[2]/tr[' + i + ']/td[1]/text()', doc).toString().trim();
      const tdPassenger = 'Passenger ' + i;
      const tdBookingFare = 'Total Booking Fare';
      const tdChartStatus = 'Charting Status';
      switch (tdValue) {
        case tdPassenger:
          passenger.name =
            xpath.select('//table[2]/tr[' + i + ']/td[1]/text()', doc).toString().slice(10).trim();
          passenger.bookingStatus =
            xpath.select('//table[2]/tr[' + i + ']/td[2]/text()', doc).toString().trim();
          passenger.currentStatus =
            xpath.select('//table[2]/tr[' + i + ']/td[3]/text()', doc).toString().trim();
          obj.passengers.push(passenger);
          break;

        case tdBookingFare:
          obj.bookingFare =
            xpath.select('//table[2]/tr[' + i + ']/td[2]/text()', doc).toString().trim();
          break;

        case tdChartStatus:
          obj.chartStatus =
            xpath.select('//table[2]/tr[' + i + ']/td[2]/text()', doc).toString().trim();
          break;
      }
    }

    return obj;
  }
}

module.exports = ChkPnrStsApi;
