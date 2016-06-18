'use strict';

const Promise = require('bluebird');
const ReferralRoutes = require('../../../routes/referral-routes');
const ReferralController = require('../../../controllers/referral-controller');

describe('Referral Routes', () => {

  it('verifies setup', () => {
    // prepare
    const routes = [];
    const app = {
      get: (route, cb) => routes.push({route, cb}),
      post: (route, cb) => routes.push({route, cb})
    };

    // execute
    ReferralRoutes.setup(app);

    // verify
    routes[0].route.path.should.equal('/referral/url');
    routes[0].cb.should.equal(ReferralRoutes.getReferUrl);
    routes[1].route.path.should.equal('/referral/from/:socialId');
    routes[1].cb.should.equal(ReferralRoutes.referralFrom);
    routes[2].route.path.should.equal('/referral/t&c');
    routes[2].cb.should.equal(ReferralRoutes.termsAndConditions);
  });

  it('gets refer url', () => {
    const req = {
      params: {utm_campaign: 'BMS_250'},
      username: '100419580072391830446'
    };
    const data = {};
    const res = {
      cache: (type, obj) => data.cache = [type, obj],
      json: (obj) => data.json = obj
    };
    const expectedUrl = `https://tj3b4.app.goo.gl/?link=https://www.yolobots.com/refer/${req.username}&apn=com.stayyolo.app.dev&amv=150000205&utm_source=${req.username}&utm_medium=referral&utm_campaign=${req.params.utm_campaign}`;

    // execute
    return ReferralRoutes.getReferUrl(req, res)
      .then(() => data.cache[0].should.equal('private'))
      .then(() => data.cache[1].should.deep.equal({maxAge: 43200}))
      .then(() => data.json.should.deep.equal({success: true, url: expectedUrl}));
  });

  it('gets refer url [error]', () => {
    // prepare
    const data = {};
    const req = {params: {}};
    const res = {json: (obj) => data.json = obj};

    // mock
    const originalCode = ReferralController.getReferUrl;
    ReferralController.getReferUrl = () => Promise.reject(new Error('expected'));

    // execute
    return ReferralRoutes.getReferUrl(req, res)

    // verify
      .then(() => data.json.should.deep.equal({success: false, error: 'expected'}))

      // restore
      .then(() => ReferralController.getReferUrl = originalCode);
  });

  it('verifies referral from', () => {
    // prepare
    const originalCode = ReferralController.referralInstalled;
    const req = {
      params: {socialId: '105636227686714774145'},
      username: '100419580072391830446'
    };
    const res = {json: (obj) => data.json = obj};
    let data;

    // mock
    ReferralController.referralInstalled = (referrerSocialId, newUserSocialId) => {
      data = {referrerSocialId, newUserSocialId};
      return Promise.resolve();
    };

    // execute
    return ReferralRoutes.referralFrom(req, res)

    // verify
      .then(() => data.referrerSocialId.should.equal(req.params.socialId))
      .then(() => data.newUserSocialId.should.equal(req.username))
      .then(() => data.json.should.deep.equal({success: true}))

      // restore
      .then(() => ReferralController.referralInstalled = originalCode);
  });

  it('verifies referralFrom [empty referrerSocialId]', () => {
    // prepare
    const data = {};
    const req = {
      params: {},
      username: '100419580072391830446'
    };
    const res = {json: (obj) => data.json = obj};

    // mock
    const logger = ReferralRoutes.getLogger();
    const originalCode = logger.error;
    logger.error = () => undefined;

    // execute
    ReferralRoutes.referralFrom(req, res);

    // verify
    data.json.should.deep.equal({success: false, error: 'socialId is empty'});

    // restore
    logger.error = originalCode;
  });

  it('verifies referralFrom [error]', () => {
    // mock
    const originalCode = ReferralController.referralInstalled;
    ReferralController.referralInstalled = () => Promise.reject(new Error('expected'));
    const logger = ReferralRoutes.getLogger();
    const originalLogger = logger.error;
    logger.error = () => undefined;

    // prepare
    const data = {};
    const req = {
      params: {socialId: '105636227686714774145'},
      username: '100419580072391830446'
    };
    const res = {json: (obj) => data.json = obj};

    // execute
    return ReferralRoutes.referralFrom(req, res)

    // verify
      .then(() => data.json.should.deep.equal({success: false, error: 'expected'}))

      // restore
      .then(() => ReferralController.referralInstalled = originalCode)
      .then(() => logger.error = originalLogger);
  });

  it('verifies t&c', () => {
    const data = {};
    const res = {
      cache: (type, obj) => data.cache = [type, obj],
      json: (obj) => data.json = obj
    };

    return ReferralRoutes.termsAndConditions({}, res)
      .then(() => data.cache[0].should.equal('private'))
      .then(() => data.cache[1].should.deep.equal({maxAge: 43200}))
      .then(() => ReferralController.termsAndConditions())
      .then(tc => data.json.should.deep.equal(tc));
  });

  it('verifies t&c [error]', () => {
    // mock
    const originalCode = ReferralController.termsAndConditions;
    ReferralController.termsAndConditions = () => Promise.reject(new Error('expected'));
    const logger = ReferralRoutes.getLogger();
    const originalLogger = logger.error;
    logger.error = () => undefined;

    // prepare
    const data = {};
    const res = {
      send: (err) => data.err = err
    };

    // execute
    return ReferralRoutes.termsAndConditions({}, res)

    // verify
      .then(() => data.err.message.should.equal('expected'))

      // restore
      .then(() => logger.error = originalLogger)
      .then(() => ReferralController.termsAndConditions = originalCode);
  });

});
