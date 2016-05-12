'use strict';

const Promise = require('bluebird');
const assert = require('chai').assert;

const DaoHelper = require('../../../../dao/dao-helper');
const Utils = require('../../../../utils/Utils');
const TraktController = require('../../../../controllers/series-notifier/trakt-controller');
const SeriesController = require('../../../../controllers/series-notifier/series-controller');
const mockResponses = require('../../../mock/series-notifier/mock-trakt-responses');
const mockTvDbResponses = require('../../../mock/series-notifier/mock-tvdb-responses');
const NextEpisodeCacheDao = require('../../../../dao/next-episode-cache-dao');
const TvDbController = require('../../../../controllers/series-notifier/tvdb-controller');

describe('Series Controller', () => {

  before(() => Promise.delay(100).then(() => DaoHelper.db.dropDatabase()));

  afterEach(() => DaoHelper.db.dropDatabase());

  const inDays = Utils.inDays;

  it('verifies nextEpisodesWithSeriesInfo [Single]', () => {
    const originalGetSeriesByIds = TvDbController.getSeriesByIds;
    TvDbController.getSeriesByIds = () => Promise.resolve([mockTvDbResponses.theFlashParsed]);

    const originalNextEpisode = SeriesController.nextEpisode;
    SeriesController.nextEpisode = () => Promise.resolve(mockResponses.theFlashNextEpisode);

    return SeriesController.nextEpisodeWithSeriesInfo('tvdb')
      .tap(data => data.series.should.deep.equal(mockTvDbResponses.theFlashParsed))
      .tap(data => data.episode.should.deep.equal(mockResponses.theFlashNextEpisode))
      .then(() => SeriesController.nextEpisode = originalNextEpisode)
      .then(() => TvDbController.getSeriesByIds = originalGetSeriesByIds);
  });

  it('verifies nextEpisodesWithSeriesInfo [Singe - no next episode]', () => {
    const originalGetSeriesByIds = TvDbController.getSeriesByIds;
    TvDbController.getSeriesByIds = () => Promise.resolve([mockTvDbResponses.theFlashParsed]);

    const originalNextEpisode = SeriesController.nextEpisode;
    SeriesController.nextEpisode = () => Promise.resolve(undefined);

    const originalComingSeason = TraktController.findComingSeason;
    TraktController.findComingSeason = () => Promise.resolve({
      number: 3,
      first_aired: '2016-10-05T00:00:00.000Z'
    });

    return SeriesController.nextEpisodeWithSeriesInfo('tvdb')
      .tap(data => data.series.should.deep.equal(mockTvDbResponses.theFlashParsed))
      .tap(data => assert.isUndefined(data.episode))
      .tap(data => data.comingSeason.number.should.equal(3))
      .tap(data => assert.isDefined(data.comingSeason.first_aired))
      .then(() => SeriesController.nextEpisode = originalNextEpisode)
      .then(() => TvDbController.getSeriesByIds = originalGetSeriesByIds)
      .then(() => TraktController.findComingSeason = originalComingSeason);
  });

  it('verifies nextEpisodesWithSeriesInfo [Multi]', () => {
    const originalCode = SeriesController.nextEpisodeWithSeriesInfo;
    SeriesController.nextEpisodeWithSeriesInfo = (id) => Promise.resolve(id);

    const tvDbIds = ['123435', '789342'];
    return SeriesController.nextEpisodesWithSeriesInfoMulti(tvDbIds)
      .then(results => results.should.deep.equal(tvDbIds))
      .then(() => SeriesController.nextEpisodeWithSeriesInfo = originalCode);
  });

  it('verifies nextEpisode', () => {
    const now = new Date(2016, 4, 12);
    const originalCode = TraktController._getShowSeasons;
    TraktController._getShowSeasons = () => Promise.resolve(mockResponses.theFlashAllSeasons);
    const originalNextEpisode = TraktController._getNextEpisode;
    TraktController._getNextEpisode = (imdbId) => originalNextEpisode(imdbId, now);

    const originalGetCacheEp = NextEpisodeCacheDao.getNextEpisode;
    let cacheUsed = false;
    NextEpisodeCacheDao.getNextEpisode = (imdbId) => {
      return originalGetCacheEp(imdbId).tap(ep => {
        if (ep) cacheUsed = true;
      });
    };

    return SeriesController.nextEpisode('tt3107288')
      .then(episode => {
        episode.season.should.equal(mockResponses.theFlashNextEpisode.season);
        episode.number.should.equal(mockResponses.theFlashNextEpisode.number);
        episode.title.should.equal(mockResponses.theFlashNextEpisode.title);
      })
      .then(() => cacheUsed.should.be.false)

      // query again
      .then(() => SeriesController.nextEpisode('tt3107288'))
      .then(episode => {
        episode.season.should.equal(mockResponses.theFlashNextEpisode.season);
        episode.number.should.equal(mockResponses.theFlashNextEpisode.number);
        episode.title.should.equal(mockResponses.theFlashNextEpisode.title);
      })
      .then(() => cacheUsed.should.be.true)

      // restore code
      .then(() => TraktController._getShowSeasons = originalCode)
      .then(() => TraktController._getNextEpisode = originalNextEpisode);
  });

  it('verifies nextEpisodes [multi]', () => {
    const originalCode = SeriesController.nextEpisode;
    SeriesController.nextEpisode = (id) => Promise.resolve(id);

    const imDbIds = ['ttasdfasdf', 'ttlqwerqwer'];
    return SeriesController.nextEpisodes(imDbIds)
      .then(result => result.should.deep.equal(imDbIds))
      .then(() => SeriesController.nextEpisode = originalCode);
  });

  it('finds expire date [closest]', () => {
    const nextEpisodes = [
      {episode: {first_aired: inDays(1)}},
      {episode: {first_aired: inDays(2)}},
      {episode: {first_aired: inDays(3)}}
    ];

    const expireDate = SeriesController.findExpireDate(nextEpisodes);
    expireDate.getDate().should.equal(inDays(1).getDate());
  });

  it('finds expire date [max 7 days]', () => {
    const nextEpisodes = [
      {episode: {first_aired: inDays(10)}},
      {episode: {first_aired: inDays(12)}},
      {episode: {first_aired: inDays(30)}}
    ];

    const expireDate = SeriesController.findExpireDate(nextEpisodes);
    expireDate.getDate().should.equal(inDays(7).getDate());
  });

  it('finds expire date [next day if not dates]', () => {
    const expireDate = SeriesController.findExpireDate([]);
    expireDate.getDate().should.equal(inDays(1).getDate());
  });

  it('updates trending data', () => {
    const originalCode = TraktController.updateTrendingData;
    let ran = false;
    TraktController.updateTrendingData = () => Promise.resolve(ran = true);

    return SeriesController.updateTrendingData()
      .then(() => ran.should.be.true)
      .then(() => TraktController.updateTrendingData = originalCode);
  });

  it('searches tv shows', () => {
    const originalCode = TraktController.search;
    TraktController.search = (q) => Promise.resolve(q);

    const query = 'flash';
    return SeriesController.search(query)
      .then(q => q.should.equal(query))
      .then(() => TraktController.search = originalCode);
  });

});
