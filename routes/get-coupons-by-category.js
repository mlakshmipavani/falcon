'use strict';

const request = require('request-promise');
const couponDunia = require('../controllers/coupons-by-category');

const userInput = 'Travel';
couponDunia.getCouponsByCategory(userInput);


