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
      bulk.find(query).upsert().updateOne({
        $addToSet: {userTokens: userToken},
        $setOnInsert: {name: contact.name}
      });
    }

    return bulk.execute();
  }

  /**
   * Removes a particular contact from the collection
   * Usage: when a user in contacts becomes a registered user
   * @param email Email id of the user
   * @returns {Promise}
   */
  static removeContact(/*string*/ email) {
    return DaoHelper.contacts.removeOne({email});
  }
}

module.exports = ContactsDao;
