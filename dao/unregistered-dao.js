'use strict';

const DaoHelper = require('./dao-helper');
const log = require('../utils/logger');

class UnRegisteredDao {

  /**
   * RegisteredGuy will get notified when any of this unRegisteredList people register
   *
   * This method just stores the mapping in db
   *
   * @param {Array<string>} unRegisteredList - mobile numbers of the unregistered people
   * @param {string} registeredGuy - mobile number of the registered person who should get notified
   * @returns {Promise}
   *
   * @example
   * // this shows that ['919033819605', '919898020383'] are unregistered and whenever it registers
   * // '919409084835' should be notified
   * UnRegisteredDao.addAll(['919033819605', '919898020383'], '919409084835');
   */
  static addAll(unRegisteredList, registeredGuy) {
    const bulk = DaoHelper.unRegistered.initializeUnorderedBulkOp();
    const update = {notifyList: registeredGuy};
    for (const number of unRegisteredList) {
      const query = {mobNumber: number};
      bulk.find(query).upsert().updateOne({$addToSet: update});
    }

    return bulk.execute().then(result => {
      if (result.ok !== 1)
        log.error(result, 'something went south while adding multiple in Unregistered collection');
    });
  }

  /**
   * Find the list of users to be notified when a unregistered user registers
   * @param {string} unRegisteredGuy Mobile number of the unRegistered person
   */
  static getNotificationList(unRegisteredGuy) {
    const query = {mobNumber: unRegisteredGuy};
    return DaoHelper.unRegistered.find(query).limit(1).next()
      .then(doc => doc ? doc.notifyList : undefined);
  }
}

module.exports = UnRegisteredDao;
