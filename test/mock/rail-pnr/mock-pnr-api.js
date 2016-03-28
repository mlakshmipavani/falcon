'use strict';

const restify = require('restify');
const restifyValidator = require('restify-validator');
const Promise = require('bluebird');

const mockPnr = restify.createServer({});

let apiHitCount = 0;

mockPnr.use(restify.queryParser());
mockPnr.use(restify.bodyParser({
  mapParams: true
}));
mockPnr.use(restifyValidator);

//
mockPnr.get('/confirmTkt/pnr/:abc', (req, res) => {

  apiHitCount += 1;

  let body = 'hello!!!';

  // if testing with client than check the apihitcount to <=2
  if (apiHitCount <= 2)

  //body = undefinedPassenger;
    body = onePassengerNotConfirmed;
  else
    body = onePassengerConfirmed;

  if (apiHitCount <= 2 || apiHitCount > 4) {
    res.writeHead(200, {
      'Content-Length': Buffer.byteLength(body),
      'Content-Type': 'text/html'
    });
    res.write(body);
    res.end();

    // res.json(body);
  } else {
    res.end();
  }
});

// promisify the listen function
mockPnr.listen = Promise.promisify(mockPnr.listen);
mockPnr.close = Promise.promisify(mockPnr.close);
mockPnr.listen(5001);

/**
 * @type {Server}
 */
module.exports = mockPnr;


let onePassengerConfirmed = `    

            
<table width="100%" border="0" cellpadding="0" cellspacing="1" class="table_border" style="font-size: 15px;">
<style>
.heading_table_top {
font-size:20px !important;
padding-top: 20px;
padding-bottom: 20px;
color: rgba(215, 0, 0, 0.87);
}
</style>
<div class='non-printable btn btn-primary btn-large' onclick='window.print();'>Print</div><style>.heading_table_top{font-size:14px;}</style><h5><b>Train Number</b> : <a href="/train/12901">12901 <span class='non-printable'>(Check Train Details)</span></a></h5>
<h5><b>Train Name</b> : GUJARAT MAIL</h5>
<h5><b>Boarding Date</b> : 10- 4-2016</h5>
<h5><b>From</b> :  <a href="/station/BCT">BCT</a></h5>
<h5><b>To</b> :  <a href="/station/ADI">ADI</a></h5>
<h5><b>Reserved Upto</b> :  <a href="/train/12901">ADI</a></h5>
<h5><b>Boarding Point</b> :  <a href="/train/12901">BCT</a></h5>
<h5><b>Class</b> : 3A</h5></table>
<table width="100%" border="0" cellpadding="0" cellspacing="1" class="table_border mdl-js-data-table" id="center_table" style='font-size: 15px;'>
<div class="non-printable">





<script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
<!-- CPNRLinkResp -->
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-2530044916843200"
     data-ad-slot="3096662173"
     data-ad-format="link"></ins>
<script>
(adsbygoogle = window.adsbygoogle || []).push({});
</script>





</div>
<h3>Charting Status: </h3>
<br/>
<thead><th>No.</th><th>Booking Status (Coach No , Berth No., Quota)</th><th>Current Status</th></thead><tr><td>Passenger 1</td><td>B5  ,  1,GN    </td><td>   CNF  </td></tr><tr><td>Charting Status</td><td> CHART NOT PREPARED </td><td></td></tr></table>
</br>PNR Status Details by <a href='http://CheckPNRstatusIRCTC.in/'>http://CheckPNRstatusIRCTC.in/</a></br></br>..`


let onePassengerNotConfirmed = `    

            
<table width="100%" border="0" cellpadding="0" cellspacing="1" class="table_border" style="font-size: 15px;">
<style>
.heading_table_top {
font-size:20px !important;
padding-top: 20px;
padding-bottom: 20px;
color: rgba(215, 0, 0, 0.87);
}
</style>
<div class='non-printable btn btn-primary btn-large' onclick='window.print();'>Print</div><style>.heading_table_top{font-size:14px;}</style><h5><b>Train Number</b> : <a href="/train/12901">12901 <span class='non-printable'>(Check Train Details)</span></a></h5>
<h5><b>Train Name</b> : GUJARAT MAIL</h5>
<h5><b>Boarding Date</b> : 10- 4-2016</h5>
<h5><b>From</b> :  <a href="/station/BCT">BCT</a></h5>
<h5><b>To</b> :  <a href="/station/ADI">ADI</a></h5>
<h5><b>Reserved Upto</b> :  <a href="/train/12901">ADI</a></h5>
<h5><b>Boarding Point</b> :  <a href="/train/12901">BCT</a></h5>
<h5><b>Class</b> : 3A</h5></table>
<table width="100%" border="0" cellpadding="0" cellspacing="1" class="table_border mdl-js-data-table" id="center_table" style='font-size: 15px;'>
<div class="non-printable">





<script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
<!-- CPNRLinkResp -->
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-2530044916843200"
     data-ad-slot="3096662173"
     data-ad-format="link"></ins>
<script>
(adsbygoogle = window.adsbygoogle || []).push({});
</script>





</div>
<h3>Charting Status: </h3>
<br/>
<thead><th>No.</th><th>Booking Status (Coach No , Berth No., Quota)</th><th>Current Status</th></thead><tr><td>Passenger 1</td><td>B5  ,  1,GN    </td><td>   Rac 4  </td></tr><tr><td>Charting Status</td><td> CHART NOT PREPARED </td><td></td></tr></table>
</br>PNR Status Details by <a href='http://CheckPNRstatusIRCTC.in/'>http://CheckPNRstatusIRCTC.in/</a></br></br>..`;


let resInvalid = `

<br/><div class='alert alert-danger' role='alert'>
	  <span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span>
	  <span class='sr-only'>Error:</span>
	  PNR: 4594594958. You have entered an invalid PNR Number.
	</div><br/><form action='/pnrstatus.php' class='validate' id='easy' method='get' name='contact' onsubmit='return checkform()' style='padding-bottom:20px;'>

		      <input class='form-control' id='pnrno' name='pnrno' pattern='-?[0-9]*(\.[0-9]+)?' style='max-width:200px;display:inline;' tabindex='1' type='number' placeholder='Your PNR Number' maxlength='10' value="4594594958">
		      <input class='btn btn-primary btn-large' name='p' tabindex='2' type='submit' value='Get PNR Status'>

		      <div>Enter PNR Number (10-Digits).</div>
               </form>..`;


const crmOnePassenger0 = {
  ShowBlaBlaAd: true,
  PnrAlternativeAdPosition: 1,
  Pnr: '4528171237',
  TrainNo: '*16526',
  TrainName: 'KANYAKUMARI EXP',
  Doj: '18- 3-2016',
  From: 'KJM ',
  To: 'TCR ',
  ReservationUpto: 'TCR ',
  BoardingPoint: 'KJM ',
  Class: ' 3A',
  ChartPrepared: false,
  BoardingStationName: 'Krishnarajapuram',
  ReservationUptoName: 'Thrissur City',
  PassengerCount: 2,
  PassengerStatus: [{
    Number: 1,
    PercentageProbability: 0,
    Prediction: null,
    ConfirmTktStatus: 'Confirm',
    Coach: null,
    Berth: 0,
    Status: null,
    BookingStatus: 'W/L    2,GNWL',
    CurrentStatus: 'RAC    8'
  }, {
    Number: 2,
    PercentageProbability: 0,
    Prediction: null,
    ConfirmTktStatus: 'Confirm',
    Coach: null,
    Berth: 0,
    Status: null,
    BookingStatus: 'W/L    3,GNWL',
    CurrentStatus: 'RAC    9'
  }],
  Error: null
};

const crmOnePassenger1 = {
  ShowBlaBlaAd: true,
  PnrAlternativeAdPosition: 1,
  Pnr: '4528171237',
  TrainNo: '*16526',
  TrainName: 'KANYAKUMARI EXP',
  Doj: '18- 3-2016',
  From: 'KJM ',
  To: 'TCR ',
  ReservationUpto: 'TCR ',
  BoardingPoint: 'KJM ',
  Class: ' 3A',
  ChartPrepared: false,
  BoardingStationName: 'Krishnarajapuram',
  ReservationUptoName: 'Thrissur City',
  PassengerCount: 2,
  PassengerStatus: [{
    Number: 1,
    PercentageProbability: 0,
    Prediction: null,
    ConfirmTktStatus: 'Confirm',
    Coach: null,
    Berth: 0,
    Status: null,
    BookingStatus: 'W/L    2,GNWL',
    CurrentStatus: 'CNF'
  }, {
    Number: 2,
    PercentageProbability: 0,
    Prediction: null,
    ConfirmTktStatus: 'Confirm',
    Coach: null,
    Berth: 0,
    Status: null,
    BookingStatus: 'W/L    3,GNWL',
    CurrentStatus: 'CNF'
  }],
  Error: null
};

