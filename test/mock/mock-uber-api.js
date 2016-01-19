'use strict';

var restify = require('restify');
var restifyValidator = require('restify-validator');
var Promise = require('bluebird');

var mockUber = restify.createServer({});

mockUber.use(restify.queryParser());
mockUber.use(restify.bodyParser({
  mapParams: true
}));
mockUber.use(restifyValidator);

// estimates/time
mockUber.get('/estimates/time', (req, res) => {

  // error checking
  req.assert('start_latitude', 'latitude is a required param').notEmpty();
  req.assert('start_longitude', 'longitude is a required param').notEmpty();
  req.checkHeader('authorization').notEmpty();

  let errors = req.validationErrors();
  if (errors) throw errors;

  //noinspection Eslint
  res.json({
    times: [
      {
        display_name: 'uberGO',// jscs:ignore
        estimate: 60,
        product_id: 'db6779d6-d8da-479f-8ac7-8068f4dade6f'// jscs:ignore
      },
      {
        display_name: 'uberX',// jscs:ignore
        estimate: 120,
        product_id: '0dfc35e0-b4be-49a1-b1bf-0bc7217e4b58'// jscs:ignore
      }
    ]
  });
});

mockUber.get('/estimates/price', (req, res) => {

  // error checking
  req.assert('start_latitude', 'start latitude is a required param').notEmpty();
  req.assert('start_longitude', 'start longitude is a required param').notEmpty();
  req.assert('end_latitude', 'end latitude is a required param').notEmpty();
  req.assert('end_longitude', 'end longitude is a required param').notEmpty();
  req.checkHeader('authorization').notEmpty();

  let errors = req.validationErrors();
  if (errors) throw errors;

  //noinspection Eslint
  res.json({
    prices: [
      {
        display_name: 'uberGo',// jscs:ignore
        estimate: '₹97-118',
        surge_multiplier: 1.2,// jscs:ignore
        product_id: 'db6779d6-d8da-479f-8ac7-8068f4dade6f'// jscs:ignore
      },
      {
        display_name: 'uberX',// jscs:ignore
        estimate: '₹108-131',
        surge_multiplier: 1,// jscs:ignore
        product_id: '0dfc35e0-b4be-49a1-b1bf-0bc7217e4b58'// jscs:ignore
      },
      {
        display_name: 'uberX',// jscs:ignore
        estimate: '₹108-131',
        surge_multiplier: 1,// jscs:ignore
        product_id: '0bc7217e4b58-b1bf-b4be-49a1-0dfc35e0'// jscs:ignore
      }
    ]
  });
});

// promisify the listen function
mockUber.listen = Promise.promisify(mockUber.listen);
mockUber.close = Promise.promisify(mockUber.close);

/**
 * @type {Server}
 */
module.exports = mockUber;
