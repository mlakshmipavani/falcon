'use strict';

const Promise = require('bluebird');
const TvDbController = require('./tvdb-controller');
const TraktController = require('./trakt-controller');
const NextEpisodeCacheDao = require('../../dao/next-episode-cache-dao');

class SeriesController {

  /**
   * Returns the next Episode of a Tv Show along with the series info
   * @param tvdbId TVDB Id of the Tv Show
   * @return {Promise<{series: Series, episode: TraktEpisode}>}
   */
  static nextEpisodeWithSeriesInfo(/*string*/ tvdbId) {
    return TvDbController.getSeriesByIds([tvdbId])
      .spread((/*Series*/ series) => {
        return {
          series,
          episode: SeriesController.nextEpisode(series.imdbId)
        };
      })
      .props()
      .then((/*{series: Series, episode: TraktEpisode, comingSeason}*/ nextEpisode) => {
        if (nextEpisode.episode) return nextEpisode;
        return TraktController.findComingSeason(nextEpisode.series.imdbId)
          .then(comingSeason => {
            nextEpisode.comingSeason = comingSeason;
            return nextEpisode;
          });
      });
  }

  static nextEpisodesWithSeriesInfoMulti(/*Array<string>*/ tvdbIds) {
    return Promise.map(tvdbIds, id => SeriesController.nextEpisodeWithSeriesInfo(id));
  }

  /**
   * Returns the next episode of a Tv Show
   * @param imdbId IMDB ID of the Tv Show
   * @return {Promise<TraktEpisode>}
   */
  static nextEpisode(/*string*/ imdbId) {
    return NextEpisodeCacheDao.getNextEpisode(imdbId)
      .then(episode => {
        if (episode) return episode;
        return TraktController.getNextEpisode(imdbId)
          .tap(episode => NextEpisodeCacheDao.saveNextEpisode(imdbId, episode));
      });
  }

  /**
   * Returns the next episodes for multiple Tv Shows
   * @param imdbIds IMDB IDs for multiple Tv Shows
   * @return {Promise<Array<TraktEpisode>>}
   */
  static nextEpisodes(/*Array<string>*/ imdbIds) {
    return Promise.map(imdbIds, id => SeriesController.nextEpisode(id));
  }

  /**
   * Finds an estimate date till when the given data is valid
   * Finds the episode that's coming earliest and sets the expire date to thats
   * @return {Date}
   */
  static findExpireDate(/*Array<{series: Series, episode: TraktEpisode}>*/ nextEpisodes) {
    const dates = nextEpisodes.map(nEp => nEp.episode)
      .filter(ep => ep && ep.first_aired)
      .map(ep => ep.first_aired)
      .sort((a, b) => a.getTime() - b.getTime());
    if (dates.length !== 0) {
      const closest = dates[0];
      const weekFar = new Date();
      weekFar.setDate(weekFar.getDate() + 7); // a week is the max a cache can stay
      return (closest.getTime() < weekFar.getTime()) ? closest : weekFar;
    }

    // set the cache to expire tomorrow
    const now = new Date();
    now.setDate(now.getDate() + 1);
    return now;
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
    return TraktController.search(query);
  }

}

module.exports = SeriesController;

// Promise.delay(1000)
//   .then(() => SeriesController.nextEpisodeWithSeriesInfo('247808'))
//   .then(console.log).catch(console.error);

//traktid for flash : 60300
// tvDbId silicon valley : 277165
// IMDB_ID for siliconValley : tt2575988
// IMDB Suits : tt1632701
// TVDB Suits : 247808
// IMDB Flash : tt3107288
