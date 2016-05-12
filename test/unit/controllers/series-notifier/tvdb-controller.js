'use strict';

const Promise = require('bluebird');

const config = require('../../../../config/config');
const DaoHelper = require('../../../../dao/dao-helper');
const mockResponses = require('../../../mock/series-notifier/mock-tvdb-responses');
const parsedResponses = require('../../../mock/series-notifier/tvdb-parsed-responses');
const TvDbController = require('../../../../controllers/series-notifier/tvdb-controller');

describe('TvDb Controller', () => {

  before(() => Promise.delay(100).then(() => DaoHelper.db.dropDatabase()));

  afterEach(() => DaoHelper.db.dropDatabase());

  it('verify search', () => {
    const originalSeriesByName = TvDbController._getSeriesByName;
    TvDbController._getSeriesByName = () => Promise.resolve(mockResponses.searchResponse);
    const getSeriesByIdsCode = TvDbController.getSeriesByIds;
    TvDbController.getSeriesByIds = (arr) => {
      arr.should.deep.equal(['78650', '279121', '272094', '82452', '254867']);
      return Promise.resolve(parsedResponses.searchResponse);
    };

    return TvDbController.search('The flash')
      .then(data => data.should.deep.equal(parsedResponses.searchResponse))
      .then(() => TvDbController.getSeriesByIds = getSeriesByIdsCode)
      .then(() => TvDbController._getSeriesByName = originalSeriesByName);
  });

  it('sorts shows by running flag', () => {
    const objects = [{running: false}, {running: true}];
    const result = TvDbController._sortShowsByRunning(objects);
    return result.should.deep.equal([{running: true}, {running: false}]);
  });

  it('parse data from TvDb', () => {
    const result = TvDbController._parseData(mockResponses.gameOfThrones);
    return result.should.deep.equal(mockResponses.gameOfThronesParsed);
  });

  it('filters data', () => {
    TvDbController._filterData(null).should.equal(false);
    TvDbController._filterData(undefined).should.equal(false);
    (TvDbController._filterData({id: '12'}) === undefined).should.equal(true);
    TvDbController._filterData(mockResponses.gameOfThrones).should.equal(true);
  });

  it('catches empty data', () => {
    TvDbController._catchEmptyData(null).should.deep.equal([]);
    const data = [1, 2, 3];
    TvDbController._catchEmptyData(data).should.deep.equal(data);
  });

  it('verifies getSeriesByIds', () => {
    const originalCode = TvDbController._getSeriesById;
    TvDbController._getSeriesById = (id) => {
      if (id === mockResponses.gameOfThrones.id)
        return Promise.resolve(mockResponses.gameOfThrones);
      else if (id === mockResponses.theFlash.id)
        return Promise.resolve(mockResponses.theFlash);
      else throw new Error('WTF happened!');
    };

    return TvDbController
      .getSeriesByIds([mockResponses.gameOfThrones.id, mockResponses.theFlash.id])
      .then(results => results.should.deep.equal(
        [mockResponses.gameOfThronesParsed, mockResponses.theFlashParsed]))
      .then(() => TvDbController._getSeriesById = originalCode);
  });

});
