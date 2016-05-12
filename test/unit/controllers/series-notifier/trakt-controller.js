'use strict';

const Promise = require('bluebird');
const assert = require('chai').assert;

const DaoHelper = require('../../../../dao/dao-helper');
const TraktController = require('../../../../controllers/series-notifier/trakt-controller');
const mockResponses = require('../../../mock/series-notifier/mock-trakt-responses');
const SeriesDao = require('../../../../dao/series-dao');

describe('Trakt Controller', () => {

  before(() => Promise.delay(100).then(() => DaoHelper.db.dropDatabase()));

  afterEach(() => DaoHelper.db.dropDatabase());

  it('searches \'flash\'', () => {
    const originalCode = TraktController._searchQuery;
    TraktController._searchQuery = () => Promise.resolve(mockResponses.flashSearchResults);

    return TraktController.search('Flash')
      .tap(results => results.length.should.not.equal(0))
      .get(0)
      .then(result => result.tvDbId.should.equal('279121'))
      .then(() => TraktController._searchQuery = originalCode);
  });

  it('gets next episode', () => {
    const originalCode = TraktController._getShowSeasons;
    TraktController._getShowSeasons = () => Promise.resolve(mockResponses.theFlashAllSeasons);
    const now = new Date(2016, 4, 12);

    return TraktController._getNextEpisode('ttasdfasdf', now)
      .tap(episode => {
        episode.season.should.equal(mockResponses.theFlashNextEpisode.season);
        episode.number.should.equal(mockResponses.theFlashNextEpisode.number);
        episode.title.should.equal(mockResponses.theFlashNextEpisode.title);
      })
      .then(() => TraktController._getShowSeasons = originalCode);
  });

  it('updates trending data', () => {
    const originalCode = TraktController._trendingShowsQuery;
    TraktController._trendingShowsQuery = () => Promise.resolve(mockResponses.trendingSeriesRaw);

    return TraktController.updateTrendingData()
      .then(() => SeriesDao.getTrending())
      .tap(data => data.length.should.equal(20))
      .map(eachItem => eachItem.tvDbId)
      .tap(tvdbIds => tvdbIds.should.deep.equal(mockResponses.trendingSeriesTvDbIds))
      .then(() => TraktController._trendingShowsQuery = originalCode);
  });

  it('finds up coming season', () => {
    const originalCode = TraktController._getShowSeasons;
    TraktController._getShowSeasons = () => Promise.resolve(mockResponses.theFlashAllSeasonInfo);
    const now = new Date(2016, 4, 12);
    return TraktController._findComingSeason('ttasdasdf', now)
      .then(season => {
        season.number.should.equal(3);
        assert.isNotNull(season.first_aired);
      })
      .then(() => TraktController._getShowSeasons = originalCode);
  });

  it('finds running season', () => {
    const originalCode = TraktController._getShowSeasons;
    TraktController._getShowSeasons = () => Promise.resolve(mockResponses.theFlashAllSeasons);
    const now = new Date(2016, 4, 12);

    return TraktController._findRunningSeason('ttasdfadf', now)
      .then(season => season.should.have.property('number', 2))
      .then(() => TraktController._getShowSeasons = originalCode);
  });

  it('finds the next episode', () => {
    const now = new Date(2016, 4, 12);
    return TraktController._findNextEpisode(mockResponses.theFlashAllSeasons[1].episodes, now)
      .should.have.property('number', 22);
  });

  it('keeps only required fields', () => {
    assert.isUndefined(TraktController._keepOnlyRequiredFields(undefined));
    return TraktController._keepOnlyRequiredFields(mockResponses.theFlashSeason2)
      .should.deep.equal(mockResponses.theFlashSeason2Parsed);
  });

  it('corrects empty fields', () => {
    assert.isUndefined(TraktController._correctEmptyFields(undefined));
    return TraktController._correctEmptyFields({number: 3}).should.deep.equal({
      title: 'Episode 3',
      number: 3
    });
  });

  it('converts string to date', () => {
    const obj = {first_aired: '2016-04-25T02:00:00.000Z'};
    TraktController._convertAirDate(obj);
    obj.first_aired.getDate().should.equal(25);
    obj.first_aired.getMonth().should.equal(3); // as it is zero indexed
    obj.first_aired.getFullYear().should.equal(2016);
  });

  it('verifies getNextEpisode w/o date', () => {
    const imdbId = 'ttasdfasdf';
    const originalCode = TraktController._getNextEpisode;
    TraktController._getNextEpisode = (imdb, date) => {
      imdb.should.equal(imdbId);
      const now = new Date();
      date.getDate().should.equal(now.getDate());
      date.getMonth().should.equal(now.getMonth());
      date.getFullYear().should.equal(now.getFullYear());
      return Promise.resolve();
    };

    return TraktController.getNextEpisode(imdbId)
      .then(() => TraktController._getNextEpisode = originalCode);
  });

  it('verifies findComingSeason w/o date', () => {
    const imdbId = 'ttasdfasdf';
    const originalCode = TraktController._findComingSeason;
    TraktController._findComingSeason = (imdb, date) => {
      imdb.should.equal(imdbId);
      const now = new Date();
      date.getDate().should.equal(now.getDate());
      date.getMonth().should.equal(now.getMonth());
      date.getFullYear().should.equal(now.getFullYear());
      return Promise.resolve();
    };

    return TraktController.findComingSeason(imdbId)
      .then(() => TraktController._findComingSeason = originalCode);
  });

});
