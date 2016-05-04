'use strict';

const DaoHelper = require('./dao-helper');

class NextEpisodeCacheDao {

  /**
   * Given an IMDB ID of the Tv Show, it returns the next episode of the running Season
   * @param seriesImdbId IMDB ID of the Tv Show
   * @return {Promise<TraktEpisode>}
   */
  static getNextEpisode(/*string*/ seriesImdbId) {
    return DaoHelper.nextEpisodeCache.find({seriesImdbId}, {
      _id: 0,
      seriesImdbId: 0
    }).limit(1).next();
  }

  /**
   * Stores the next episode in the Db
   * @param episode Episode Details
   * @return {Promise}
   */
  static saveNextEpisode(/*string*/ seriesImdbId, /*TraktEpisode*/ episode) {
    if (!episode) return Promise.resolve();
    episode = Object.assign(episode, {seriesImdbId});
    return DaoHelper.nextEpisodeCache.insertOne(episode);
  }

}

module.exports = NextEpisodeCacheDao;
