'use strict';

const Promise = require('bluebird');
const PushController = require('../../../controllers/push-controller');
const DaoHelper = require('../../../dao/dao-helper');
const OneSignalDao = require('../../../dao/onesignal-dao');
const config = require('../../../config/config');

describe('Push Controller', () => {

  beforeEach(() => {
    // mock
    PushController._pushData = (action, data, playerIds) =>
      Promise.resolve({recipients: playerIds});
    PushController._pushMessage = (message, playerIds) => Promise.resolve({recipients: playerIds});

    return Promise.delay(100).then(() => DaoHelper.db.dropDatabase());
  });

  it('pushes pnr update', () => {
    const userTokens = ['56d1d4f702bdabb3ee7c604c'];
    const oneSignalId = 'abcd-abcd-abcd-abcd';
    const data = {};
    const expected = {recipients: [oneSignalId]};

    return OneSignalDao.map(userTokens[0], oneSignalId)
      .then(() => PushController.pushPnrUpdate(data, userTokens))
      .should.eventually.deep.equal(expected);
  });

  it('pushes hello to all users', () => {
    const userTokens = ['56d1d4f702bdabb3ee7c604c', '56a604d1d4fcbb3ee7c702bd'];
    const oneSignalIds = ['abcd-abcd-abcd-abcd', 'wxyz-wxyz-wxyz-wxyz'];
    const expected = {recipients: oneSignalIds};
    return OneSignalDao.map(userTokens[0], oneSignalIds[0])
      .then(() => OneSignalDao.map(userTokens[1], oneSignalIds[1]))
      .then(() => PushController.pushHelloMsgToAll())
      .should.eventually.deep.equal(expected);
  });

  it('verifies the base request options', () => {
    const oneSignalIds = ['abcd-abcd-abcd-abcd', 'wxyz-wxyz-wxyz-wxyz'];
    const expected = {
      method: 'POST',
      url: 'https://onesignal.com/api/v1/notifications',
      body: {
        app_id: config.oneSignal.appId,
        include_player_ids: oneSignalIds
      },
      json: true
    };
    return PushController._getBaseRequestOptions(oneSignalIds).should.deep.equal(expected);
  });

  it('verifies req options for data', () => {
    const oneSignalIds = ['abcd-abcd-abcd-abcd', 'wxyz-wxyz-wxyz-wxyz'];
    const data = {name: 'StayYolo'};
    const action = 'com.stayyolo.PUSH.ON_PNR_TRACK_UPDATE';
    const expected = PushController._getBaseRequestOptions(oneSignalIds);
    expected.body.data = Object.assign(data, {action});
    expected.body.android_background_data = true;

    return PushController._getRequestOptionsForData(action, data, oneSignalIds)
      .should.deep.equal(expected);
  });

  it('verifies req options for visible notification', () => {
    const oneSignalIds = ['abcd-abcd-abcd-abcd', 'wxyz-wxyz-wxyz-wxyz'];
    const message = 'hey!';
    const expected = PushController._getBaseRequestOptions(oneSignalIds);
    expected.body.contents = {en: message};

    return PushController._getRequestOptions(message, oneSignalIds)
      .should.deep.equal(expected);
  });
});
