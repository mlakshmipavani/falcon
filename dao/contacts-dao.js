'use strict';

const DaoHelper = require('./dao-helper');
const ObjectID = require('mongodb').ObjectID;

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

  /**
   * Use this method to get email addresses to send promotional emails, to the friends of
   * registered users who haven't registered on Yolobots.
   * Result format:
   * {email: string, // email id of the friend who's not on Yolobots
   *  userTokens: Array<{name, email}> // Array of name, email of the people who referred this friend
   * }
   * Note: userTokens are the people who are registered on Yolobots
   */
  static findEmailAndFriends() {
    return DaoHelper.user.distinct('email', {}).then(registeredUsers =>
        DaoHelper.contacts.find({email: {$nin: registeredUsers}}, {email: 1, userTokens: 1, _id: 0})
          .toArray())
      .map((/*{email, userTokens: Array<string>}*/ doc) => {
        return Promise.map(doc.userTokens, (token) =>
            DaoHelper.user.find({_id: ObjectID(token)}, {_id: 0, name: 1, email: 1}).next())
          .then(userDetails => {
            doc.userTokens = userDetails;
            return doc;
          });
      }, {concurrency: 50});

  }
}

// const Promise = require('bluebird');
// const util = require('util');
// Promise.delay(1000).then(() => ContactsDao.findEmailAndFriends())
//   .then(res => console.log(util.inspect(res, {depth: null}))).catch(console.error)
//   .then(() => process.exit(0));
// Output the result to a file, as WebStorm can't show all of output in the console

module.exports = ContactsDao;
