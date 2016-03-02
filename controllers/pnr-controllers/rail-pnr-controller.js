'use strict';

const Promise = require('bluebird');

const ConfirmTktApi = require('./confirm-tkt-api');
const ChkPnrStsIrctcApi = require('./chk-pnr-sts-irctc-api');
const log = require('../../utils/logger').child({
  module: 'railpnr-controller'
});

class RailPnrController {

  /**
   * Returns the status of the pnr
   * @param pnr PNR number
   * @returns {Promise}
   */
  static getStatus(/*string*/ pnr) {
    return Promise.any([ConfirmTktApi.getStatus(pnr), ChkPnrStsIrctcApi.getStatus(pnr)])
      .catch(error => {
        if (process.env.NODE_ENV !== 'test')
          log.error(error, 'Not able to get pnr status from either of API');
        throw error;
      });
  }
}

module.exports = RailPnrController;
