'use strict';

const request = require('request-promise');
const _array = require('lodash/array');
const _object = require('lodash/object');

const config = require('../../config/config');
const BookMyShowDao = require('../../dao/bot-movie-dao');
const AwsLambda = require('../aws-lambda');
const YoutubeController = require('../youtube-controller');
const log = require('../../utils/logger').child({
  module: 'movie-data-updater'
});

// jaydp17's Mobile phone's User agent
const userAgent = 'Dalvik/2.1.0 (Linux; U; Android 5.1.1; MI 4i Build/LMY48Y)';
const token = '67x1xa33b4x422b361ba'; // this is jaydp17's personal BookMyShow token

class MovieDataUpdater {

  static update() {
    return this._getCityList()
      .map(this._convertLatLngToGeoJSON)
      .then(BookMyShowDao.storeCities)
      .tap((/*{error}*/ result) => {
        if (result.error) {
          log.error(result.error, 'Error occurred while updating BookMyShow Cities');
          throw new Error('Error occurred while updating BookMyShow Cities');
        }
      })
      .then((/*{ops}*/ result) => result.ops)
      .map((/*BmsCity*/ city) => this._getMovieList(city.SubRegionCode), {concurrency: 50})
      .then(_array.flatten)
      .then(BookMyShowDao.storeMovies)
      .then(BookMyShowDao.getAllPosterUrls)
      .map((/*{eventCode, posterUrl}*/ item) => {
        return AwsLambda.getClosestMaterialColor(item.posterUrl, item.eventCode);

        // concurrency has been limited to 50 coz AWS lambda invocation limit = 100
      }, {concurrency: 50})
      .then(BookMyShowDao.updateMovieColors)
      .then(() => BookMyShowDao.getUniqueEventCodes())
      .then(MovieDataUpdater._getRatings)
      .then(BookMyShowDao.updateMovieRatings);
  }

  /**
   * Gets a list of Cities and their codes from BookMyShow
   * @returns {Promise.<Array<BmsCity>>}
   * @private
   */
  static _getCityList() {
    return this._queryForCityList()
      .then(cities => {
        const topCities = cities['Top Cities'];
        const otherCities = cities['Other Cities'];

        // mark Top cities with a boolean
        topCities.map(city => city.isTopCity = true);

        // mark Other cities
        otherCities.map(city => city.isTopCity = false);

        // all cities
        return topCities.concat(otherCities);
      });
  }

  /**
   * Gets a list of movies from BookMyShow in proper format as required by this app
   * @param cityCode Code of the City you require movies for
   * @returns {Promise<Array<BmsMovie>>}
   * @private
   */
  static _getMovieList(/*string*/ cityCode) {
    return this._queryForMovieList(cityCode)
      .map((/*BmsMovie*/ movie) => {
        const obj = {};
        const keys = ['EventCode', 'ImageCode', 'EventTitle', 'GenreArray', 'Language', 'Length',
          'TrailerURL', 'ReleaseDateCode', 'FShareURL'];
        keys.forEach(key => obj[key] = movie[key]);
        obj.PosterUrl = `http://in.bmscdn.com/events/Large/${movie.EventCode}.jpg`;
        if (obj.TrailerURL) {
          const videoId = YoutubeController.getVideoId(obj.TrailerURL);
          obj.TrailerBgUrl = YoutubeController.getWideThumbnailUrl(videoId);
        }

        obj.Language = obj.Language.split(' ')[0]; // removes suffixes like English (3D)
        obj.cityCode = cityCode;
        return obj;
      });
  }

  /**
   * Get the avg rating of movies
   * @param eventCodes Unique eventCodes of all the movies
   * @returns {Promise}
   */
  static _getRatings(/*Array<string>*/ eventCodes) {
    return MovieDataUpdater._queryForRatings(eventCodes)
      .then((/*{}*/ ratings) => _object.mapValues(ratings, 'avgRating'));
  }

  /**
   * Queries bookMyShow servers for movie ratings
   * @param eventCodes Unique eventCodes of all the movies
   * @returns {Promise<>}
   */
  static _queryForRatings(/*Array<String>*/ eventCodes) {
    const data = {EventCodes: eventCodes};
    const options = {
      url: config.bookMyShow.ratingsUrl,
      header: {'User-Agent': userAgent},
      form: {data: JSON.stringify(data)},
      json: true
    };

    return request.post(options)
      .then((/*{ListingData}*/ res) => res.ListingData);
  }

  /**
   * Queries BookMyShow for a list of City codes
   * @returns {Promise<{}>}
   * @private
   */
  static _queryForCityList() {
    const options = {
      url: config.bookMyShow.url,
      header: {'User-Agent': userAgent},
      qs: {
        cmd: 'REGIONLIST',
        f: 'json',
        et: 'ALL',
        t: token
      },
      json: true
    };

    //noinspection JSUnresolvedFunction
    return request(options)
      .then((/*{BookMyShow}*/res) => res.BookMyShow);
  }

  /**
   * Queries BookMyShow for Movies in a particular city
   * @param cityCode Code of the City you require movies for
   * @returns {Promise<Array<BmsMovie>>}
   * @private
   */
  static _queryForMovieList(/*string*/ cityCode) {
    const options = {
      url: config.bookMyShow.url,
      header: {'User-Agent': userAgent},
      qs: {
        cmd: 'GETEVENTLIST',
        f: 'json',
        cc: '',
        et: 'MT',
        dt: '',
        lt: '',
        lg: '',
        rc: '',
        sr: cityCode,
        t: token
      },
      json: true
    };

    //noinspection JSUnresolvedFunction
    return request(options)
      .then((/*{BookMyShow:{arrEvent}}*/res) => res.BookMyShow.arrEvent);
  }

  /**
   * MongoDb is much more efficient with co-ordinates if stored in GeoJSON format
   * @param city The city to convert the co-ordinates
   * @returns {BmsCity}
   */
  static _convertLatLngToGeoJSON(/*BmsCity*/ city) {
    const lat = parseFloat(city.RegionLat);
    const lng = parseFloat(city.RegionLong);
    delete city.RegionLat;
    delete city.RegionLong;

    // in GeoJSON always use <lng, lat>
    if (lat && lng) city.Location = {type: 'Point', coordinates: [lng, lat]};
    return city;
  }

}

const Promise = require('bluebird');
Promise.delay(1000)
  .then(() => MovieDataUpdater.update())
  .then(console.log).catch(console.error);

module.exports = MovieDataUpdater;
