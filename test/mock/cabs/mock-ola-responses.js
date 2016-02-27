'use strict';

const response = {
  categories: [{
    id: 'mini',
    display_name: 'Mini',
    currency: 'INR',
    distance_unit: 'kilometre',
    time_unit: 'minute',
    eta: 2,
    distance: '0.2',
    image: 'http://d1foexe15giopy.cloudfront.net/mini.png',
    fare_breakup: [{
      type: 'flat_rate',
      minimum_distance: '4',
      minimum_time: '5',
      base_fare: '80',
      cost_per_distance: '10',
      waiting_cost_per_minute: '0',
      ride_cost_per_minute: '1',
      surcharge: []
    },
      {
        type: 'airport_rate',
        minimum_distance: '30',
        minimum_time: '0',
        base_fare: '540',
        cost_per_distance: '13',
        waiting_cost_per_minute: '2',
        ride_cost_per_minute: '0',
        surcharge: []
      }]
  },
    {
      id: 'sedan',
      display_name: 'Sedan',
      currency: 'INR',
      distance_unit: 'kilometre',
      time_unit: 'minute',
      eta: 9,
      distance: '1.2',
      image: 'http://d1foexe15giopy.cloudfront.net/sedan.png',
      fare_breakup: [{
        type: 'flat_rate',
        minimum_distance: '4',
        minimum_time: '5',
        base_fare: '100',
        cost_per_distance: '13',
        waiting_cost_per_minute: '0',
        ride_cost_per_minute: '1',
        surcharge: [{
          name: 'Surcharge',
          type: 'multiplier',
          description: 'Surcharge',
          value: 1.2
        }]
      },
        {
          type: 'airport_rate',
          minimum_distance: '30',
          minimum_time: '0',
          base_fare: '600',
          cost_per_distance: '16',
          waiting_cost_per_minute: '2',
          ride_cost_per_minute: '0',
          surcharge: []
        }]
    },
    {
      id: 'prime',
      display_name: 'Prime',
      currency: 'INR',
      distance_unit: 'kilometre',
      time_unit: 'minute',
      eta: -1,
      distance: '1.4',
      image: 'http://d1foexe15giopy.cloudfront.net/prime.png',
      fare_breakup: [{
        type: 'flat_rate',
        minimum_distance: '4',
        minimum_time: '5',
        base_fare: '100',
        cost_per_distance: '14',
        waiting_cost_per_minute: '0',
        ride_cost_per_minute: '1',
        surcharge: [{
          name: 'Surcharge',
          type: 'multiplier',
          description: 'Surcharge',
          value: 1.2
        }]
      },
        {
          type: 'airport_rate',
          minimum_distance: '30',
          minimum_time: '0',
          base_fare: '600',
          cost_per_distance: '16',
          waiting_cost_per_minute: '2',
          ride_cost_per_minute: '0',
          surcharge: [{
            name: 'Surcharge',
            type: 'multiplier',
            description: 'Surcharge',
            value: 1.2
          }]
        }]
    },
    {
      id: 'auto',
      display_name: 'Auto',
      currency: 'INR',
      distance_unit: 'kilometre',
      time_unit: 'minute',
      eta: 2,
      distance: '0.0',
      image: 'http://d1foexe15giopy.cloudfront.net/auto.png',
      fare_breakup: [
        {
          type: 'flat_rate',
          minimum_distance: '1',
          minimum_time: '0',
          base_fare: '25',
          cost_per_distance: '13',
          waiting_cost_per_minute: '0',
          ride_cost_per_minute: '0',
          convenience_charge: '5',
          night_time_charges: '1.5x',
          night_time_duration: 'from 10:00 PM to 05:00 AM',
          surcharge: []
        }
      ]
    }],
  ride_estimate: {}
};

const parsedOutput = [
  {
    name: 'Mini',
    eta: 2,
    surgeMultiplier: 1,
    surgeFixed: 0,
    productId: 'mini',
    minFare: 100,
    maxFare: 110
  },
  {
    name: 'Sedan',
    eta: 9,
    surgeMultiplier: 1.2,
    surgeFixed: 0,
    productId: 'sedan',
    minFare: 148,
    maxFare: 160
  }];

module.exports = {
  response,
  parsedOutput
};
