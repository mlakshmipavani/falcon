'use strict';

const config = require('../../config/config');

const Promise = require('bluebird');
const _object = require('lodash/object');
const _array = require('lodash/array');
const trakt = require('trakt-api')(config.trakt.apiKey);

const TvDbController = require('./tvdb-controller');
const SeriesDao = require('../../dao/series-dao');
const util = require('util');

class TraktController {

  /**
   * Searches Tv Shows based on the query provided
   * @param query A piece of text that is matched against the title of the Tv Show
   * @return {Promise<Array<Series>>}
   */
  static search(/*string*/ query) {
    return TraktController._searchQuery(query)
      .map((/*{show}*/ result) => result.show)
      .filter((/*{title, year, status}*/ show) => show.title && show.year && show.status)
      .map((/*{ids: {tvdb}}*/ show) => show.ids.tvdb)
      .filter(id => id) // remove null/undefined ids
      .then(ids => _array.uniq(ids)) // make them unique
      .then(TvDbController.getSeriesByIds)
      .then(TvDbController._sortShowsByRunning);
  }

  /**
   * Searches the query on Trakt.tv server and returns the raw response
   * @param query The text to search
   * @return {Promise.<*>}
   * @private
   */
  static _searchQuery(/*string*/ query) {
    //noinspection JSUnresolvedFunction
    return Promise.resolve(trakt.searchShow(query));
  }

  /**
   * Returns the next episode of a Tv Show
   * @param imdbId IMDB ID of the Tv Show
   * @return {Promise<TraktEpisode>}
   */
  static getNextEpisode(/*string*/ imdbId) {
    return TraktController._getNextEpisode(imdbId, new Date());
  }

  /**
   * Returns the next episode of a Tv Show
   * @param imdbId IMDB ID of the Tv Show
   * @param now A date object that represents the current date/time
   * @return {Promise<TraktEpisode>}
   */
  static _getNextEpisode(/*string*/ imdbId, /*Date*/ now) {
    let episodeCount = 0;
    return this._findRunningSeason(imdbId, now)
      .tap((/*{episode_count}*/ season) => episodeCount = season.episode_count)
      .then((/*{episodes}*/ season) => this._findNextEpisode(season.episodes, now))
      .then(this._keepOnlyRequiredFields)
      .then(this._correctEmptyFields);

    // if you wanna send the episode count, then unComment the below code
    // .tap((/*TraktEpisode*/ episode) => {
    // // set total episodes in this season
    // if (episode) episode.totalEpisodes = episodeCount;
    // });
  }

  /**
   * Updates the Trending Series in Db
   * @return {Promise}
   */
  static updateTrendingData() {
    return TraktController._trendingShowsQuery()
      .map((/*{show: {ids: {tvdb}}}*/ shows) => shows.show.ids.tvdb)
      .then(tvdbIds => TvDbController.getSeriesByIds(tvdbIds))
      .filter((/*Series*/ series) => series.running) // keep only running series
      .then(data => SeriesDao.updateTrending(data));
  }

  /**
   * Queries Trakt Server for trending shows
   * @return {Promise}
   * @private
   */
  static _trendingShowsQuery() {
    //noinspection JSUnresolvedFunction
    return trakt.showTrending({limit: 20});
  }

  /**
   * Finds the next up coming season of the TvShow
   * @param imdbId IMDB Id of the TvShow
   * @return {Promise<{number, first_aired}>}
   */
  static findComingSeason(/*string*/ imdbId) {
    return TraktController._findComingSeason(imdbId, new Date());
  }

  /**
   * Finds the next up coming season of the TvShow
   * @param imdbId IMDB Id of the TvShow
   * @param now A date object that represents the current date/time
   * @return {Promise<{number, first_aired}>}
   * @private
   */
  static _findComingSeason(/*string*/ imdbId, /*Date*/ now) {
    return TraktController._getShowSeasons(imdbId, 'full')
      .call('sort', (a, b) => b.number - a.number) // sort descending by air date
      .get(0)
      .then((/*{number, first_aired}*/ season) => {
        if (!season) return season;
        if (season.first_aired) {
          season.first_aired = new Date(season.first_aired);
          if (season.first_aired.getTime() - (now.getTime()) > 0) // is first_aired date in future
            return {number: season.number, first_aired: season.first_aired};
          return {number: season.number + 1}; // if it's in past that means the next season info hasn't been added yet
        } else return {number: season.number};
      });
  }

  /**
   * Returns the current running reason or the last season if the next season isn't announced
   * @param imdbId IMDB ID of the TV Show
   * @param now A date object that represents the current date/time
   * @return {Promise<TraktSeason>}
   */
  static _findRunningSeason(/*string*/ imdbId, /*Date*/ now) {
    return TraktController._getShowSeasons(imdbId, 'episodes,full')
      .filter((/*{first_aired}*/ season) => season.first_aired) // remove non aired seasons
      .each(TraktController._convertAirDate)
      .call('sort', (a, b) => b.number - a.number) // sort descending by season number
      .filter((/*{first_aired}*/ season) => season.first_aired <= now) // remove seasons that haven't started yet
      .get(0); // get the first one
  }

  /**
   * Queries Trakt.tv server for getting the seasons of a show
   * @param imdbId The IMDB id of the show
   * @param extendedString The string to tell trakt.tv how much info to return
   * @return {Promise}
   * @private
   */
  static _getShowSeasons(/*string*/ imdbId, /*string*/ extendedString) {
    //noinspection JSUnresolvedFunction
    return trakt.showSeasons(imdbId, {extended: extendedString});
  }

  /**
   * Finds the next episode from a given array of Episodes
   * @param episodes All the Episodes of the current running season
   * @param now A date object that represents the current date/time
   * @return {TraktEpisode}
   * @private
   */
  static _findNextEpisode(/*Array<TraktEpisode>*/ episodes, /*Date*/ now) {
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
   * @return {undefined}
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
