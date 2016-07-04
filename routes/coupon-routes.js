'use strict';

const couponDunia = require('../controllers/coupons/coupondunia');

/**
 * Sets up all the routes required for couponDunia
 *
 * @param {Server} app
 */
class CouponDuniaRoutes {

  static setup(app) {
    app.get({path: '/allcategories'}, allCategories);
    app.get({path: '/couponcategory'}, couponCategory);
  }

}

function allCategories(req, res) {
  return couponDunia.getAllCategories()
    .then( data => res.json(data));
}

function couponCategory(req, res) {
  const userInput = req.params.category;
  return couponDunia.getCouponsByCategory(userInput)
    .then( data => res.json(data));
}

module.exports = CouponDuniaRoutes;
