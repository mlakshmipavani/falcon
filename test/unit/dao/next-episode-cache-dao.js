'use strict';

const Promise = require('bluebird');

const DaoHelper = require('../../../dao/dao-helper');
const NextEpisodeCacheDao = require('../../../dao/next-episode-cache-dao');
const mockResponses = require('../../mock/series-notifier/mock-trakt-responses');

describe('Next Episode Cache Dao', () => {

  const seriesImdbId = 'tt3107288';

  before(() => Promise.delay(100).then(() => DaoHelper.db.dropDatabase()));

  after(() => DaoHelper.db.dropDatabase());

  it('saves next episode [empty]', () => {
    return NextEpisodeCacheDao.saveNextEpisode('imdbId', undefined)
      .should.eventually.not.exist;
  });

  it('saves next episode', () => {
    return NextEpisodeCacheDao.saveNextEpisode(seriesImdbId, mockResponses.theFlashNextEpisode)
      .tap(result => result.insertedCount.should.equal(1))
      .then(result => result.ops[0])
      .then(episode => {
        episode.season.should.equal(mockResponses.theFlashNextEpisode.season);
        episode.number.should.equal(mockResponses.theFlashNextEpisode.number);
        episode.title.should.equal(mockResponses.theFlashNextEpisode.title);
      });
  });

  it('get next episode', () => {
    return NextEpisodeCacheDao.getNextEpisode(seriesImdbId)
      .then(episode => {
        episode.season.should.equal(mockResponses.theFlashNextEpisode.season);
        episode.number.should.equal(mockResponses.theFlashNextEpisode.number);
        episode.title.should.equal(mockResponses.theFlashNextEpisode.title);
      });
  });

});
