'use strict';

const DaoHelper = require('./dao-helper');

class SeriesDao {

  /**
   * Updates the trending series in Db
   * @return {Promise}
   */
  static updateTrending(data) {
    return DaoHelper.trendingSeries.removeMany({})
      .then(() => DaoHelper.trendingSeries.insertMany(data));
  }

  /**
   * Returns the Trending Series from Db
   * @return {Promise}
   */
  static getTrending() {
    return DaoHelper.trendingSeries.find({}, {_id: 0}).toArray();
  }

}

module.exports = SeriesDao;
