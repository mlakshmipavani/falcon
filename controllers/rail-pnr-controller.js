'use strict';

var cheerio = require('cheerio');
var request = require('request-promise');

//noinspection Eslint
const options = {
  url: 'http://www.indianrail.gov.in/cgi_bin/inet_pnstat_cgi_2484.cgi',
  form: {
    lccp_pnrno1: 0,// jscs:ignore
    lccp_cap_value: 24357,// jscs:ignore
    lccp_capinp_value: 24357// jscs:ignore
  },
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    Referer: 'http://www.indianrail.gov.in/valid.php',
    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2062.120 Safari/537.36'
  }
};

class RailPnr {

  static getStatus(/* string */ pnr) {
    //noinspection Eslint
    options.form.lccp_pnrno1 = pnr;// jscs:ignore
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
    var $ = cheerio.load(html);
    var getText = (node) => $(node).text().trim();
    let dataArr = $('.table_border_both').toArray();
    var obj = {};
    var i = 0;
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
      let passenger = {};
      passenger.name = getText(dataArr[i++]);
      passenger.bookingStatus = getText(dataArr[i++]);
      passenger.currentStatus = getText(dataArr[i++]);
      obj.passengers.push(passenger);
    }

    obj.chartStatus = getText(dataArr[i]);
    return obj;
  }
}

module.exports = RailPnr;
