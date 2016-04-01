'use strict';

const Promise = require('bluebird');
const ObjectID = require('mongodb').ObjectID;
const DaoHelper = require('../../../dao/dao-helper');
const RegistrationController = require('../../../controllers/registration-controller');
const UserDao = require('../../../dao/user-dao');

describe('Registration', () => {

  const googleIdToken = 'asldfkjawoernsdvnasdfasdf';
  const oneSignalUserId = 'd83a24c5-a7ca-41cc-823f-277d51536f4f';

  beforeEach(() => Promise.delay(100).then(() => DaoHelper.db.dropDatabase()));

  it('verifies request options for google token verification', () => {

    const expected = {
      url: 'https://www.googleapis.com/oauth2/v3/tokeninfo',
      qs: {id_token: googleIdToken},
      json: true
    };

    return RegistrationController._getOptionsToLogin(googleIdToken)
      .should.deep.equal(expected);
  });

  it('verifies login procedure', () => {
    // mock
    RegistrationController._login = () => Promise.resolve({
      sub: 'asdfasd',
      given_name: 'Jaydeep',
      email: 'jaydp17@gmail.com'
    });

    // execute
    let token;
    return RegistrationController.login(googleIdToken, oneSignalUserId)
      .tap((/*{token}*/ result) => token = result.token)
      .then((/*{token}*/ result) => DaoHelper.user.find({_id: ObjectID(result.token)}).next())
      .then(userObj => userObj.should.exist)
      .then(() => DaoHelper.oneSignal.find({userToken: token}).next())
      .then(mapping => mapping.should.exist);
  });

  it('removes own entry when syncing', () => {
    const socialId = 'socialId';
    let token = '';
    const contacts = [{
      email: 'jaydp17@gmail.com',
      name: 'jaydeep'
    }, {email: 'parthpatolia@gmail.com', name: 'parth'}];
    return UserDao.newUser(socialId, 'jaydeep', 'jaydp17@gmail.com')
      .then(data => token = data._id.toString())
      .then(() => RegistrationController.contacts(socialId, token, contacts))
      .then(() => DaoHelper.contacts.count({email: contacts[0].email}))
      .should.eventually.equal(0);
  });

});
