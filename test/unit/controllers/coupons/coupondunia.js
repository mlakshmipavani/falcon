'use strict';

const Promise = require('bluebird');
const Request = require('../../../mock/coupons/request');
const DaoHelper = require('../../../../dao/dao-helper');
const CouponDuniaController = require('../../../../controllers/coupons/coupondunia');
const mockCoupon = require('../../../mock/coupons/mock-coupondunia');

describe('Coupon Controller', () => {

  before(() => Promise.delay(300).then(() => DaoHelper.db.dropDatabase()));

  it('coupons by category', () => {
    //mock
    const origOne = Request.callOne;
    Request.callOne = () => Promise.resolve(mockCoupon.allCategories);

    const origTwo = Request.callTwo;
    Request.callTwo = () => Promise.resolve(mockCoupon.couponsByCategoryRequest);

    return CouponDuniaController.getCouponsByCategory('Travel')
      .then(data => data.should.deep.equal(mockCoupon.couponsByCategoryResult))
      .then(() => {
        Request.callOne = origOne;
        Request.callTwo = origTwo;
      });
  });

  it('all categories', () => {

    //mock
    const orig = Request.callOne;
    Request.callOne = () => Promise.resolve(mockCoupon.allcouponsRequest);

    return CouponDuniaController.getAllCategories()
      .then(data => data.should.deep.equal(mockCoupon.allcouponsResult))
      .then(() => Request.callOne = orig);
  });

  it('TimeStamp Error checking', () => {
    //mock
    const orig = Request.callOne;
    Request.callOne = () => {
      Error('new err');
    };

    return CouponDuniaController.getTimestamp()
      .then(() => Request.callOne = orig);
  });

});
