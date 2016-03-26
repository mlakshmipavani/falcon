'use strict';

const Promise = require('bluebird');

const DaoHelper = require('../../../dao/dao-helper');
const PnrStatusDao = require('../../../dao/pnr-status-dao');

describe('Pnr Status Dao', () => {

  const pnr = '1234567890';
  const userToken = 'token1';
  const pnrDetails = {};

  before(() => Promise.delay(300).then(() => DaoHelper.db.dropDatabase()));

  afterEach(() => DaoHelper.db.dropDatabase());

  it('inserts PNR Details', () => {
    return PnrStatusDao.insertPnrDetails(pnr, pnrDetails, userToken)
      .should.eventually.have.property('upsertedCount', 1);
  });

  it('checks if PNR is tracked --true', () => {
    return PnrStatusDao.insertPnrDetails(pnr, pnrDetails, userToken)
      .then(() => PnrStatusDao.isPnrTracked(pnr))
      .should.eventually.equal(true);
  });

  it('checks if PNR is tracked --false', () => {
    return PnrStatusDao.isPnrTracked(pnr).should.eventually.equal(false);
  });

  it('adds user to tracked PNR', () => {
    const userToken2 = 'token2';
    return PnrStatusDao.insertPnrDetails(pnr, pnrDetails, userToken)
      .then(() => PnrStatusDao.addUserToTrackedPnr(userToken2, pnr))
      .then(() => DaoHelper.pnrStatus.find({pnr}).next())
      .then((/*{details, userTokens}*/ result) =>
        result.userTokens.should.deep.equal([userToken, userToken2]));
  });

  it('gets PNR details with userTokens', () => {
    return PnrStatusDao.insertPnrDetails(pnr, pnrDetails, userToken)
      .then(() => PnrStatusDao.getPnrDetailsWithTokens(pnr))
      .should.eventually.have.property('pnr', pnr);
  });

  it('updates PNR details', () => {
    const details = {trainNumber: 123};

    //noinspection JSCheckFunctionSignatures
    return PnrStatusDao.insertPnrDetails(pnr, pnrDetails, userToken)
      .then(() => PnrStatusDao.updatePnrDetails(pnr, details))
      .then(() => PnrStatusDao.getPnrDetailsWithTokens(pnr))
      .then((/*{details, userTokens}*/ result) => result.details.should.deep.equal(details));
  });

  it('removes PNR detail', () => {
    return PnrStatusDao.insertPnrDetails(pnr, pnrDetails, userToken)
      .then(() => PnrStatusDao.removePnrDetails(pnr))
      .then(() => PnrStatusDao.isPnrTracked(pnr))
      .should.eventually.equal(false);
  });
});
