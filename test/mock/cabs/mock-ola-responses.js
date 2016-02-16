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
        surcharge: []
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
      eta: 10,
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
    }],
  ride_estimate: {}
};

module.exports = {
  response
};
