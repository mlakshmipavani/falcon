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

  /**
   * Returns a list of {eventCode, posterUrl}
   * Note: eventCode is unique
   * @returns {Promise<Array<{eventCode, posterUrl}>>}
   */
  static getAllPosterUrls() {
    return DaoHelper.movies.aggregate([{
      $group: {
        _id: {
          eventCode: '$EventCode',
          posterUrl: '$PosterUrl'
        }
      }
    }, {$project: {eventCode: '$_id.eventCode', _id: 0, posterUrl: '$_id.posterUrl'}}]).toArray();
  }

  /**
   * Adds a color field to each movie document
   * @param movieColors An array of colors mapped to eventCodes
   * @returns {Promise}
   */
  static updateMovieColors(/*Array<{color, eventCode}>*/ movieColors) {
    var bulk = DaoHelper.movies.initializeUnorderedBulkOp();
    for (let mc of movieColors) {
      let query = {EventCode: mc.eventCode};
      let update = {color: mc.color};
      bulk.find(query).update({$set: update});
    }

    return bulk.execute();
  }
}

module.exports = BotMovieDao;
