'use strict';

const DaoHelper = require('./dao-helper');

class PnrStatusDao {

  /**
   * Returns true if PNR is being tracked by any user
   * @param pnr PNR number
   * @returns {Promise.<boolean>}
   */
  static isPnrTracked(/*string*/ pnr) {
    return DaoHelper.pnrStatus.count({pnr})
      .then(count => count > 0);
  }

  /**
   * Add a user to an already being tracked pnr
   * @param userToken User Token of the user who wants to track this PNR
   * @param pnr PNR number that's already being tracked
   * @returns {Promise}
   */
  static addUserToTrackedPnr(/*string*/ userToken, /*string*/ pnr) {
    return DaoHelper.pnrStatus.updateOne({pnr}, {$addToSet: {userTokens: userToken}});
  }

  /**
   * Inserts PnrDetails along with a userToken of the user who wants to track the PNR
   * @param pnr PNR Number
   * @param pnrDetails Details of the given PNR
   * @param userToken Token of the user who wants to track the PNR
   * @returns {Promise}
   */
  static insertPnrDetails(/*string*/ pnr, /*PnrDetails*/ pnrDetails, /*string*/ userToken) {
    return DaoHelper.pnrStatus.updateOne({pnr}, {
      $addToSet: {userTokens: userToken},
      $setOnInsert: {details: pnrDetails}
    }, {upsert: true});
  }

  /**
   * Get the PnrDetails and userTokens associated with it
   * @param pnr PNR Number
   * @return {Promise<{details: PnrDetails, userTokens: Array<string>}>}
   */
  static getPnrDetailsWithTokens(/*string*/ pnr) {
    return DaoHelper.pnrStatus.find({pnr}).next();
  }

  /**
   * Updates the PnrDetails in Db
   * @param pnr PNR Number
   * @param pnrDetails Details of the given PNR Number
   * @return {Promise}
   */
  static updatePnrDetails(/*string*/ pnr, /*PnrDetails*/ pnrDetails) {
    return DaoHelper.pnrStatus.updateOne({pnr}, {
      $set: {details: pnrDetails}
    });
  }

  /**
   * Remove a PNR from the collection
   * @param pnr The PNR to remove
   * @return {Promise}
   */
  static removePnrDetails(/*string*/ pnr) {
    return DaoHelper.pnrStatus.removeOne({pnr});
  }
}

module.exports = PnrStatusDao;
