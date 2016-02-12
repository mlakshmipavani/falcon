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

}

module.exports = MovieController;
