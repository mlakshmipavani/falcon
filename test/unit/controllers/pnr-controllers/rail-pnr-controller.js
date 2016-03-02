'use strict';

const RailPnrController = require('../../../../controllers/pnr-controllers/rail-pnr-controller');
const ChkPnrStsApi = require('../../../../controllers/pnr-controllers/chk-pnr-sts-irctc-api');
const CrmTktApi = require('../../../../controllers/pnr-controllers/confirm-tkt-api');

describe('RailPnrController', () => {

  it('should return chkPnrStsApi response', () => {
    ChkPnrStsApi.getStatus = () => Promise.resolve(successApiRes);
    CrmTktApi.getStatus = () => Promise.reject(crmTktApiError);

    //noinspection JSUnresolvedVariable
    return RailPnrController.getStatus('1234567890').should.eventually.deep.equal(successApiRes);
  });

  it('should throw erorr', () => {
    ChkPnrStsApi.getStatus = () => Promise.reject(ChkPnrStsApiError);
    CrmTktApi.getStatus = () => Promise.reject(crmTktApiError);

    return RailPnrController.getStatus('1234567890')
      .catch(e => e.message.should.equal(bothErrorMsg));
  });
});

const successApiRes = {
  trainNumber: '16526',
  trainName: 'KANYAKUMARI EXP',
  boardingDate: '18- 3-2016',
  from: 'KJM',
  to: 'TCR',
  reservedUpto: 'TCR',
  boardingPoint: 'KJM',
  class: '3A',
  passengers: [
    {
      name: '1',
      bookingStatus: 'W/L    2,GNWL',
      currentStatus: 'RAC    8'
    },
    {
      name: '2',
      bookingStatus: 'W/L    3,GNWL',
      currentStatus: 'RAC    9'
    }
  ],
  bookingFare: '1700',
  chartStatus: 'CHART NOT PREPARED'
};

const crmTktApiError = new Error('CrmTktApi unexpected response');
const ChkPnrStsApiError = new Error('ChkPnrStsAPI unexpected response');
const bothErrorMsg = 'aggregate error';
