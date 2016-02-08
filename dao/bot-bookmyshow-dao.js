'use strict';

const DaoHelper = require('./dao-helper');

class BotMovieDao {

  static storeCities(/*Array<BmsCity>*/ cities) {
    return DaoHelper.bmsCities.deleteMany({})
      .then(() => DaoHelper.bmsCities.insertMany(cities));
  }

  static storeMovies(/*Array<BmsMovie>*/ movies) {
    return DaoHelper.movies.deleteMany({})
      .then(() => DaoHelper.movies.insertMany(movies));
  }
}

module.exports = BotMovieDao;
