'use strict';

const request = require('request-promise');
const xpath = require('xpath');
const Dom = require('xmldom').DOMParser;

const config = require('../../config/config');

class ChkPnrStsApi {

  /**
   * Returns the status of the pnr
   * @param pnr PNR number
   * @returns {Promise}
   */
  static getStatus(/*string*/ pnr) {
    const url = config.railway.chkPnrStsIrctcApiUrl + pnr;

    return request.get(url)
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
    const obj = {};

    obj.trainNumber = xpath.select('//table/h5[1]/a', doc).toString().slice(23, 28);
    if (obj.trainNumber === '')
      throw new Error('ChkPnrStsAPI unexpected response');

    obj.trainName = xpath.select('//table/h5[2]', doc).toString().slice(24, -5);
    obj.boardingDate = xpath.select('//table/h5[3]', doc).toString().slice(27, -5);
    obj.from = xpath.select('//table/h5[4]/a', doc).toString().slice(23, -4);
    obj.to = xpath.select('//table/h5[5]/a', doc).toString().slice(23, -4);
    obj.reservedUpto = xpath.select('//table/h5[6]/a', doc).toString().slice(23, -4);
    obj.boardingPoint = xpath.select('//table/h5[7]/a', doc).toString().slice(23, -4);
    obj.class = xpath.select('//table/h5[8]', doc).toString().slice(19, -5);

    const count = xpath.select('//table[2]/tr', doc).length - 2;
    obj.passengers = [];
    for (let i = 1; i <= count; i++) {
      const passenger = {};
      passenger.name =
        xpath.select('//table[2]/tr[' + i + ']/td[1]', doc).toString().slice(14, -5);
      passenger.bookingStatus =
        xpath.select('//table[2]/tr[' + i + ']/td[2]', doc).toString().slice(4, -7);
      passenger.currentStatus =
        xpath.select('//table[2]/tr[' + i + ']/td[3]', doc).toString().slice(4, -5).trim();
      obj.passengers.push(passenger);
    }

    obj.bookingFare =
      xpath.select('//table[2]/tr[' + (count + 1) + ']/td[2]', doc).toString().slice(4, -5);
    obj.chartStatus =
      xpath.select('//table[2]/tr[' + (count + 2) + ']/td[2]', doc).toString().slice(5, -6);
    return obj;
  }
}

module.exports = ChkPnrStsApi;
