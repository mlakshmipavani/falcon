'use strict';

const Promise = require('bluebird');
const ContactDao = require('../../../dao/contacts-dao');
const DaoHelper = require('../../../dao/dao-helper');

describe('Contact Dao', () => {

  const token1 = 'token1';
  const token2 = 'token2';

  const contact1 = {email: 'jaydp17@gmail.com', name: 'jaydp'};
  const contact2 = {email: 'parthpatolia@gmail.com', name: 'parth'};

  before(() => {
    return Promise.delay(100).then(() => DaoHelper.db.dropDatabase());
  });

  it('Save 2 contacts', () => {
    return ContactDao.saveContacts(token1, [contact1, contact2])
      .then(() => DaoHelper.contacts.find({email: {$in: [contact1.email, contact2.email]}}))
      .call('toArray')
      .map((/*Contact*/ contact) => contact.userTokens.should.deep.equal([token1]));
  });

  it('Save overlapping contact', () => {
    return ContactDao.saveContacts(token2, [contact2])
      .then(() => DaoHelper.contacts.find({email: contact2.email}).toArray())
      .spread((/*Contact*/ contact) => contact.userTokens.should.deep.equal([token1, token2]));
  });

  it('Removes a contact', () => {
    return ContactDao.removeContact(contact2.email)
      .then(() => DaoHelper.contacts.count({email: contact2.email}))
      .should.eventually.equal(0);
  });

});
