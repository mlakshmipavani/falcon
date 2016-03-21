'use strict';

const DaoHelper = require('./dao-helper');

/**
 * Stores contacts of every registered user so that they can later be used for marketing
 */
class ContactsDao {

  /**
   * Stores contacts of a particular user
   * @param userToken Token of the user
   * @param contacts Contacts that the user has sent
   * @returns {Promise}
   */
  static saveContacts(/*string*/ userToken, /*Array<{email, name}>*/ contacts) {
    const bulk = DaoHelper.contacts.initializeUnorderedBulkOp();
    for (const contact of contacts) {
      const query = {email: contact.email};
      const update = {name: contact.name};
      bulk.find(query).upsert().updateOne({
        $set: update,
        $setOnInsert: {userToken}
      });
    }

    return bulk.execute();
  }
}

module.exports = ContactsDao;
