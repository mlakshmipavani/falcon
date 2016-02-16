'use strict';

const cabTypes = {
  products: [{
    capacity: 4,
    product_id: 'db6779d6-d8da-479f-8ac7-8068f4dade6f',
    price_details: {
      service_fees: [],
      cost_per_minute: 1,
      distance_unit: 'km',
      minimum: 50,
      cost_per_distance: 7,
      base: 35,
      cancellation_fee: 50,
      currency_code: 'INR'
    },
    image: 'http://d1a3f4spazzrp4.cloudfront.net/car-types/mono/mono-ubergo.png',
    display_name: 'uberGO',
    description: 'Smaller. Smarter. Cheaper.'
  },
    {
      capacity: 4,
      product_id: '0dfc35e0-b4be-49a1-b1bf-0bc7217e4b58',
      price_details: {
        service_fees: [],
        cost_per_minute: 1,
        distance_unit: 'km',
        minimum: 75,
        cost_per_distance: 8,
        base: 40,
        cancellation_fee: 75,
        currency_code: 'INR'
      },
      image: 'http://d1a3f4spazzrp4.cloudfront.net/car-types/mono/mono-uberx.png',
      display_name: 'uberX',
      description: 'Your low cost Uber'
    },
    {
      capacity: 6,
      product_id: '1cfdf145-9e9f-44d6-8f93-976e0252ca8d',
      price_details: {
        service_fees: [],
        cost_per_minute: 2,
        distance_unit: 'km',
        minimum: 150,
        cost_per_distance: 17,
        base: 100,
        cancellation_fee: 150,
        currency_code: 'INR'
      },
      image: 'http://d1a3f4spazzrp4.cloudfront.net/car-types/mono/mono-uberxl.png',
      display_name: 'uberXL',
      description: 'Room for everyone'
    }]
};

const times = {
  times: [
    {
      display_name: 'uberGO',
      estimate: 60,
      product_id: 'db6779d6-d8da-479f-8ac7-8068f4dade6f'
    },
    {
      display_name: 'uberX',
      estimate: 120,
      product_id: '0dfc35e0-b4be-49a1-b1bf-0bc7217e4b58'
    }
  ]
};

const prices = {
  prices: [
    {
      display_name: 'uberGo',
      estimate: '₹97-118',
      surge_multiplier: 1.2,
      product_id: 'db6779d6-d8da-479f-8ac7-8068f4dade6f'
    },
    {
      display_name: 'uberX',
      estimate: '₹108-131',
      surge_multiplier: 1,
      product_id: '0dfc35e0-b4be-49a1-b1bf-0bc7217e4b58'
    },
    {
      display_name: 'uberXL',
      estimate: '₹205-225',
      surge_multiplier: 1,
      product_id: '1cfdf145-9e9f-44d6-8f93-976e0252ca8d'
    }
  ]
};

module.exports = {
  cabTypes, times, prices
};
