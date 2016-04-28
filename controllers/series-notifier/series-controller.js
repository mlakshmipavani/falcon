'use strict';

const Promise = require('bluebird');
const TraktController = require('./trakt-controller');
const TvDbController = require('./tvdb-controller');

class SeriesController {

  /**
   * Returns the next episode of a Tv Show
   * @param imdbId IMDB ID of the Tv Show
   * @return {Promise<TraktEpisode>}
   */
  static nextEpisode(/*string*/ imdbId) {
    return TraktController.getNextEpisode(imdbId);
  }

  /**
   * Updates the Trending Series in Db
   * @return {Promise}
   */
  static updateTrendingData() {
    return TraktController.updateTrendingData();
  }

  /**
   * Searches Tv Shows based on the query provided
   * @param query A piece of text that is matched against the title of the Tv Show
   * @return {Promise<Array<Series>>}
   */
  static search(/*string*/ query) {
    return TvDbController.search(query);
  }

}

module.exports = SeriesController;

//traktid for flash : 60300
// tvDbId silicon valley : 277165
// IMDB_ID for siliconValley : tt2575988
// IMDB Suits : tt1632701
// IMDB Flash : tt3107288
