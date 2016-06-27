'use strict';
const Promise = require('bluebird');
const mongodb = require('mongodb');

const DaoHelper = require('../../../dao/dao-helper');
const SeriesDao = require('../../../dao/series-dao');

describe('SeriesDao', () => {

  const data = [{s1: 'series1', s2: 'series2'}];

  before(() => {
    return Promise.delay(300).then(() => DaoHelper.db.dropDatabase());
  });

  it('checks if updated', () => {
    return SeriesDao.updateTrending(data)
      .then(() => SeriesDao.getTrending())
      .then(latest => latest[0].s1.should.equal(data[0].s1));
  });
});
