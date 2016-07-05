'use strict';

const Promise = require('bluebird');
const request = require('request-promise');
const crypto = require('crypto');
const apiKey = 'D8CFF01E-2DD2-3CAA-ADE4-35E0EC07E351';
const log = require('../../utils/logger').child({
  module: 'coupondunia'
});


class CouponDuniaController {

  /**
   *Gives the Required Timestamp
   *@return {Promise<T>}
   */
  static getTimestamp() {
    const timeStampRequest = {
      method: 'GET',
      url: 'http://coupondunia.in/api/date',
      json: true,
      headers: {'cache-control': 'no-cache'}
    };
    return Promise.resolve(request(timeStampRequest))
      .then(body => {
        const couponDuniaTime = body.data.timestamp;
        const partnerTime = Date.now();
        return (partnerTime + ( partnerTime - couponDuniaTime ));
      })
      .catch(error => {
        log.error(error);
      });
  }

  /**
   *Gives all the Coupons available
   *@return {Promise<T>}
   */
  static getAllCategories() {
    return this.getTimestamp()
      .then(timestamp => {
        const queryStringSearch = `pi=86&ts=${timestamp}`;
        const dataSearch = apiKey + queryStringSearch;
        const csSearch = crypto.createHash('md5').update(dataSearch).digest('hex');
        const url = `http://coupondunia.in/api/all_categories?${queryStringSearch}&cs=${csSearch}`;
        const searchReq = {
          method: 'GET',
          url: url,
          json: true,
          headers: {'cache-control': 'no-cache'}
        };
        return Promise.resolve(request(searchReq));
      })
      .then((/*{data}*/ result) => result.data)
      .map((/*{Name}*/ categories) => categories.Name);
  }

  /**
   * Gives all coupons Based on the category given by user.
   * @param userInput Category to get coupons
   * @return {Promise<T>}
   */
  static getCouponsByCategory(userInput) {
    return this.getTimestamp()
      .then(timestamp => {
        const queryStringSearch = `pi=86&ts=${timestamp}`;
        const dataSearch = apiKey + queryStringSearch;
        const csSearch = crypto.createHash('md5').update(dataSearch).digest('hex');
        const url = `http://coupondunia.in/api/all_categories?${queryStringSearch}&cs=${csSearch}`;
        const searchReq = {
          method: 'GET',
          url: url,
          json: true,
          headers: {'cache-control': 'no-cache'}
        };
        return Promise.resolve(request(searchReq))
          .then(result => result.data)
          .filter((/*{Name}*/result) => result.Name === userInput)
          .then(/*Array<{CategoryID}>*/ category=> {
            const queryString = `pi=86&ts=${timestamp}&category_id=${category[0].CategoryID}`;
            const data = apiKey + queryString;
            const cs = crypto.createHash('md5').update(data).digest('hex');
            const url = `http://coupondunia.in/api/coupons_by_category?${queryString}&cs=${cs}`;
            const categoryUrl = {
              method: 'GET',
              url: url,
              json: true,
              headers: {'cache-control': 'no-cache'}
            };
            return Promise.resolve(request(categoryUrl));
          }).then((/*{data: {Coupons}}*/ result) => result.data.Coupons);
      });
  }
}

module.exports = CouponDuniaController;

