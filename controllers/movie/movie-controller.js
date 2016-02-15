'use strict';

const BookMyShowController = require('../../dao/bot-bookmyshow-dao');

class MovieController {

  /**
   * Finds movies of given languages in a given city
   * @param langArr An array of languages (Eg. ['Hindi', 'English']
   * @param cityCode Code for the city interested in
   * @returns {Promise}
   */
  static getMovies(/*Array<string>*/ langArr, /*string*/ cityCode) {
    return BookMyShowController.getMovies(langArr, cityCode)
      .map((eachMovie) => {
        delete eachMovie.cityCode;
        delete eachMovie.Language;
        return eachMovie;
      });
  }

  static getCites() {
    return BookMyShowController.getCities();
  }

  /**
   * Gets all the unique languages keeping English and Hindi at the top
   * @returns {Promise<string>}
   */
  static getLanguages() {
    const english = 'English';
    const hindi = 'Hindi';
    return BookMyShowController.getLanguages().reduce((finalObj, eachLang) => {
      if (eachLang !== english && eachLang !== hindi) finalObj.push(eachLang);
      return finalObj;
    }, ['English', 'Hindi']);
  }

}

module.exports = MovieController;
