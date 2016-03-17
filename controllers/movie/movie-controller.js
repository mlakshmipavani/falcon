'use strict';

const GeoIp = require('../others/geoip');
const BotMovieDao = require('../../dao/bot-movie-dao');

class MovieController {

  /**
   * Finds movies of given languages in a given city
   * @param langArr An array of languages (Eg. ['Hindi', 'English']
   * @param clientIp IP Address of the user
   * @returns {Promise}
   */
  static getMovies(/*Array<string>*/ langArr, /*string*/ clientIp) {
    return GeoIp.getDetails(clientIp)
      .then(details => BotMovieDao.getNearestCity(details.latitude, details.longitude))
      .then((/*BmsCity*/city) => city.SubRegionCode)
      .then((/*string*/ cityCode) => this._getMovies(langArr, cityCode));
  }

  static _getMovies(/*Array<string>*/ langArr, /*string*/ cityCode) {
    return BotMovieDao.getMovies(langArr, cityCode)
      .map((eachMovie) => {
        delete eachMovie.cityCode;
        delete eachMovie.Language;
        return eachMovie;
      });
  }

  static getCites() {
    return BotMovieDao.getCities();
  }

  /**
   * Gets all the unique languages keeping English and Hindi at the top
   * @returns {Promise<string>}
   */
  static getLanguages() {
    const english = 'English';
    const hindi = 'Hindi';
    return BotMovieDao.getLanguages().reduce((finalObj, eachLang) => {
      if (eachLang !== english && eachLang !== hindi) finalObj.push(eachLang);
      return finalObj;
    }, ['English', 'Hindi']);
  }

}

module.exports = MovieController;
