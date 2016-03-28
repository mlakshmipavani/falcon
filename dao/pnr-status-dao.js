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
   * Is this particular user tracking a given PNR number
   * @param userToken Token of the user
   * @param pnr PNR Number
   * @return {Promise.<boolean>}
   */
  static isUserTrackingPnr(/*string*/ userToken, /*string*/ pnr) {
    return DaoHelper.pnrStatus.count({pnr, userTokens: userToken})
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

  /**
   * Removes the user from a list if people who are tracking the same PNR
   * If the given user is the only user tracking this PNR then the entire document is removed
   * @param userToken Token of the user to remove
   * @param pnr PNR number the user was tracking
   * @return {Promise}
   */
  static pullUserOut(/*string*/ userToken, /*string*/ pnr) {
    return DaoHelper.pnrStatus.findOneAndUpdate({pnr},
      {$pull: {userTokens: userToken}},
      {returnOriginal: false})
      .then(result => result.value)
      .then((/*{details, userTokens}*/ result) => result.userTokens.length === 0)
      .tap(isEmpty => {
        if (isEmpty) return DaoHelper.pnrStatus.deleteOne({pnr});
      })
      .tap(isEmpty => {
        if (isEmpty) return DaoHelper.agendaJobs.deleteMany({data: {pnr}});
      });
  }
}

module.exports = PnrStatusDao;
