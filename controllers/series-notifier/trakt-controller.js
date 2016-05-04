'use strict';

const config = require('../../config/config');

const Promise = require('bluebird');
const _object = require('lodash/object');
const trakt = require('trakt-api')(config.trakt.apiKey);

const TvDbController = require('./tvdb-controller');
const SeriesDao = require('../../dao/series-dao');
const util = require('util');

class TraktController {

  /**
   * Returns the next episode of a Tv Show
   * @param imdbId IMDB ID of the Tv Show
   * @return {Promise<TraktEpisode>}
   */
  static getNextEpisode(/*string*/ imdbId) {
    let episodeCount = 0;
    return this._findRunningSeason(imdbId)
      .tap((/*{episode_count}*/ season) => episodeCount = season.episode_count)
      .then((/*{episodes}*/ season) => this._findNextEpisode(season.episodes))
      .then(this._keepOnlyRequiredFields)
      .then(this._correctEmptyFields)
      .tap((/*TraktEpisode*/ episode) => {
        // set total episodes in this season
        if (episode) episode.totalEpisodes = episodeCount;
      });
  }

  /**
   * Updates the Trending Series in Db
   * @return {Promise}
   */
  static updateTrendingData() {
    //noinspection JSUnresolvedFunction
    return trakt.showTrending({limit: 20})
      .map((/*{show: {ids: {tvdb}}}*/ shows) => shows.show.ids.tvdb)
      .then(tvdbIds => TvDbController.getSeriesByIds(tvdbIds))
      .filter((/*Series*/ series) => series.running) // keep only running series
      .then(data => SeriesDao.updateTrending(data));
  }

  /**
   * Returns the current running reason or the last season if the next season isn't announced
   * @param imdbId IMDB ID of the TV Show
   * @return {Promise<TraktSeason>}
   */
  static _findRunningSeason(/*string*/ imdbId) {
    const now = new Date();

    //noinspection JSUnresolvedFunction
    return trakt.showSeasons(imdbId, {extended: 'episodes,full'})
      .filter((/*{first_aired}*/ season) => season.first_aired) // remove non aired seasons
      .each(TraktController._convertAirDate)
      .call('sort', (a, b) => b.number - a.number) // sort descending by air date
      .filter((/*{first_aired}*/ season) => season.first_aired <= now) // remove seasons that haven't started yet
      .get(0); // get the first one
  }

  /**
   * Finds the next episode from a given array of Episodes
   * @param episodes All the Episodes of the current running season
   * @return {TraktEpisode}
   * @private
   */
  static _findNextEpisode(/*Array<TraktEpisode>*/ episodes) {
    const now = new Date();
    episodes.forEach(TraktController._convertAirDate);
    const filtered = episodes.sort((a, b) => a.first_aired - b.first_aired) // sort ascending by air date
      .filter((/*{first_aired}*/ season) => season.first_aired > now); // keep only those that haven't aired yet
    return filtered[0];
  }

  /**
   * Keeps only those fields that are required
   * @param episode Episode Details
   * @return {TraktEpisode}
   * @private
   */
  static _keepOnlyRequiredFields(episode) {
    if (!episode) return episode;
    episode = _object.pick(episode, ['season', 'number', 'title', 'overview', 'first_aired']);
    return episode;
  }

  /**
   * Fills in default values in empty fields
   * @param episode Episode Information
   * @return {TraktEpisode}
   * @private
   */
  static _correctEmptyFields(/*TraktEpisode*/ episode) {
    if (!episode) return episode;
    episode.title = episode.title ? episode.title : `Episode ${episode.number}`;
    return episode;
  }

  /**
   * Converts '2016-04-25T02:00:00.000Z' to Date Object
   * @param season Season Object
   */
  static _convertAirDate(/*{first_aired}*/ season) {
    season.first_aired = new Date(season.first_aired);
  }

}

// const imdb = 'tt1632701';
// Promise.delay(0)
//   .then(() => TraktController.getNextEpisode(imdb))
//   .then(data => console.log(util.inspect(data, {depth: null})))
//   .catch(console.error);

module.exports = TraktController;
