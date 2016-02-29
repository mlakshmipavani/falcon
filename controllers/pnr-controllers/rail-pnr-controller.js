'use strict';

/**
 * Gets the PNR status from IndianRail.gov
 * The magic number 24357 is actually provided by IndianRail.gov
 * It is present in the from returned from http://www.indianrail.gov.in/valid.php
 * Ideally that number should be fetched from /valid.php every time, but just to save time it has
 * been hard coded here.
 * So in future if this code stops working, first check if the code is the same, if not update the
 * magic number.
 * Secondly, http://www.indianrail.gov.in/cgi_bin/inet_pnstat_cgi_2484.cgi
 * the 4 numeric digits in the url also change sometimes, so that's the second thing to check when
 * things go south. This url is also present in the form returned by /valid.php
 */
const cheerio = require('cheerio');
const request = require('request-promise');
const config = require('../../config/config');

//noinspection Eslint
const options = {
  url: config.railway.pnrUrl,
  form: {
    lccp_pnrno1: 0,
    lccp_cap_value: 24357,
    lccp_capinp_value: 24357
  },
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    Referer: 'http://www.indianrail.gov.in/valid.php',
    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2062.120 Safari/537.36'
  }
};

class RailPnrController {

  /**
   * Returns the status of the pnr
   * @param pnr PNR number
   * @returns {{}}
   */
  static getStatus(/* string */ pnr) {
    options.form.lccp_pnrno1 = pnr;
    return request.post(options)
      .then(this._parseHtml);
  }

  /**
   * Extracts the data from HTML provided
   * @param html
   * @returns {{}}
   * @private
   */
  static _parseHtml(/* string */ html) {
    const $ = cheerio.load(html);
    const getText = (node) => $(node).text().trim();
    const dataArr = $('.table_border_both').toArray();
    const obj = {};
    let i = 0;
    obj.trainNumber = getText(dataArr[i++]);
    obj.trainName = getText(dataArr[i++]);
    obj.boardingDate = getText(dataArr[i++]);
    obj.from = getText(dataArr[i++]);
    obj.to = getText(dataArr[i++]);
    obj.reservedUpto = getText(dataArr[i++]);
    obj.boardingPoint = getText(dataArr[i++]);
    obj.class = getText(dataArr[i++]);
    obj.passengers = [];

    while (getText(dataArr[i]).startsWith('Passenger')) {
      const passenger = {};
      passenger.name = getText(dataArr[i++]);
      passenger.bookingStatus = getText(dataArr[i++]).replace(/\s+/g, ' '); // replaces multiple spaces with one
      passenger.currentStatus = getText(dataArr[i++]).replace(/\s+/g, ' ');
      obj.passengers.push(passenger);
    }

    obj.bookingFare = getText(dataArr[i++]);
    obj.chartStatus = getText(dataArr[i]);

    if (obj.trainNumber === '') return undefined;

    return obj;
  }
}

module.exports = RailPnrController;
