'use strict';

const Promise = require('bluebird');
const UserDao = require('../../../dao/user-dao');
const DaoHelper = require('../../../dao/dao-helper');
const PushController = require('../../../controllers/push-controller');
const ReferralController = require('../../../controllers/referral-controller');

describe('Referral Controller', () => {

  before(() => Promise.delay(100).then(() => DaoHelper.db.dropDatabase()));

  afterEach(() => DaoHelper.db.dropDatabase());

  it('gets referral url', () => {
    const socialId = '105636227686714774145';
    const utmCampaign = 'BMS_250';
    const expectedUrl = `https://tj3b4.app.goo.gl/?link=https://www.yolobots.com/refer/${socialId}&apn=com.stayyolo.app.dev&amv=150000205&utm_source=${socialId}&utm_medium=referral&utm_campaign=${utmCampaign}`;
    return ReferralController.getReferUrl(socialId, utmCampaign)
      .then(referUrl => referUrl.should.equal(expectedUrl));
  });

  it('referral installed', () => {
    const user1 = {socialId: '105636227686714774145', name: 'Jaydeep'};
    const user2 = {socialId: '100419580072391830446', name: 'Parth'};

    // mock
    const originalCode = PushController.pushReferralInstalled;
    let mockCalled = false;
    const data = {};
    PushController.pushReferralInstalled = (referrerUserToken, newUserName) => {
      mockCalled = true;
      data.referrerUserToken = referrerUserToken;
      data.newUserName = newUserName;
      return Promise.resolve();
    };

    // prepare
    return UserDao.newUser(user1.socialId, user1.name)
      .then(() => UserDao.newUser(user2.socialId, user2.name))

      // execute
      .then(() => ReferralController.referralInstalled(user1.socialId, user2.socialId))

      // verify
      .then(() => mockCalled.should.be.true)
      .then(() => UserDao.findUserWithSocialId(user1.socialId))
      .then(user => user._id.toString().should.equal(data.referrerUserToken))
      .then(() => UserDao.findUserWithSocialId(user2.socialId))
      .then(user => user.name.should.equal(data.newUserName))

      // restore
      .then(() => PushController.pushReferralInstalled = originalCode);
  });

  it('verifies referral/newUser with same socialId', () => {
    const user = {socialId: '105636227686714774145', name: 'Jaydeep'};

    // mock
    const originalCode = PushController.pushReferralInstalled;
    let mockCalled = false;
    PushController.pushReferralInstalled = () => {
      mockCalled = true;
      return Promise.resolve();
    };

    // prepare
    return UserDao.newUser(user.socialId, user.name)

    // execute
      .then(() => ReferralController.referralInstalled(user.socialId, user.socialId))

      // verify
      .then(() => mockCalled.should.be.false)

      // restore
      .then(() => PushController.pushReferralInstalled = originalCode);
  });

  it('checks terms & conditions', () => {
    return ReferralController.termsAndConditions()
      .then(terms => terms.length.should.equal(8));
  });

});
