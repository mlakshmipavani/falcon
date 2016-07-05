'use strict';

const CouponDunia = require('../controllers/coupons/coupondunia');

/**
 * Sets up all the routes required for couponDunia
 *
 * @param {Server} app
 */
class CouponDuniaRoutes {

  static setup(app) {
    app.get({path: '/allcategories'}, (req, res)=> {
      return CouponDunia.getAllCategories()
        .then(data => res.json(data));
    });
    app.get({path: '/couponcategory'}, (req, res)=> {
      const UserInput = req.params.category;
      return CouponDunia.getCouponsByCategory(UserInput)
        .then(data => res.json(data));
    });
  }
  
}

module.exports = CouponDuniaRoutes;
