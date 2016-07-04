'use strict';

const Promise = require('bluebird');
const request = require('request-promise');
const crypto = require('crypto');

function getTimestamp() {
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
    .then(body => body)
    .catch(error => {
      console.log('Error');
    });
}
let ts; /*Timestamp*/
const apiKey = 'D8CFF01E-2DD2-3CAA-ADE4-35E0EC07E351';

class main {
  /*
   gives all the Coupons available
   */
  static getAllCategories() {
    return getTimestamp()
      .then(data => {
        ts = data;
        const queryStringSearch = 'pi=86&ts=' + ts;
        const dataSearch = apiKey + queryStringSearch;
        const csSearch = crypto.createHash('md5').update(dataSearch).digest('hex');
        const url = 'http://coupondunia.in/api/all_categories?' + queryStringSearch + '&cs=' + csSearch;
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

  /* Gives all coupons Based on the category given by user.
   user: string
   note: categoryID is automatically fetched using categoryName
   */
  static getCouponsByCategory(userInput) {
    return getTimestamp()
      .then(data => {
        ts = data;
        const queryStringSearch = 'pi=86&ts=' + ts;
        const dataSearch = apiKey + queryStringSearch;
        const csSearch = crypto.createHash('md5').update(dataSearch).digest('hex');
        const url = 'http://coupondunia.in/api/all_categories?' + queryStringSearch + '&cs=' + csSearch;
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
            const queryString = 'pi=86&ts=' + ts + '&category_id=' + category[0].CategoryID;
            const data = apiKey + queryString;
            const cs = crypto.createHash('md5').update(data).digest('hex');
            const url = 'http://coupondunia.in/api/coupons_by_category?' + queryString + '&cs=' + cs;
            const categoryUrl = {
              method: 'GET',
              url: url,
              json: true,
              headers: {'cache-control': 'no-cache'}
            };
            return Promise.resolve(request(categoryUrl))
          }).then((/*{data: {Coupons}}*/ result) => result.data.Coupons);

      });
  }
}

module.exports = main;

