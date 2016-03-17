'use strict';

const DaoHelper = require('./dao-helper');

class BotMovieDao {

  /**
   * Finds movies of given languages in a given city
   * @param langArr An array of languages (Eg. ['Hindi', 'English']
   * @param cityCode Code for the city interested in
   * @returns {Promise}
   */
  static getMovies(/*Array<string>*/ langArr, /*string*/ cityCode) {
    return DaoHelper.movies.find({Language: {$in: langArr}, cityCode}).toArray();
  }

  static getCities() {
    return DaoHelper.bmsCities.find()
      .project({SubRegionCode: 1, SubRegionName: 1, isTopCity: 1})
      .toArray();
  }

  /**
   * Returns the nearest BmsCity
   * @param lat Latitude of the user
   * @param lng Longitude of the user
   * @returns {Promise<BmsCity>}
   */
  static getNearestCity(/*number*/ lat, /*number*/ lng) {
    // in GeoPoint (data structure by MongoDB) always lng comes before lat
    const query = {Location: {$near: {$geometry: {type: 'Point', coordinates: [lng, lat]}}}};
    return DaoHelper.bmsCities.find(query).next();
  }

  static getLanguages() {
    return DaoHelper.movies.distinct('Language', {});
  }

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
  static updateMovieColors(/*Array<{color, eventCode, no_poster}>*/ movieColors) {
    var bulk = DaoHelper.movies.initializeUnorderedBulkOp();
    for (let mc of movieColors) {
      let query = {EventCode: mc.eventCode};
      if (mc.no_poster) bulk.find(query).remove();
      else {
        let update = {color: mc.color};
        bulk.find(query).update({$set: update});
      }
    }

    return bulk.execute();
  }
}

module.exports = BotMovieDao;
