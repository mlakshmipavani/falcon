'use strict';

const ChkPnrStsApi = require('../../../../controllers/pnr-controllers/chk-pnr-sts-irctc-api');

describe('ChkPnrStsApi', () => {

  const pnr = 4528171237;
  const expectedResponse = {
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

  it('should get the pnr status details out of html', () => {
    //noinspection JSAccessibilityCheck,JSUnresolvedVariable
    return ChkPnrStsApi._extractPnrDetail(apiResponse).should.deep.equal(expectedResponse);
  });
});

const apiResponse = `


<table width="100%" border="0" cellpadding="0" cellspacing="1" class="table_border" style="font-size: 15px;">
<style>
.heading_table_top {
font-size:20px !important;
padding-top: 20px;
padding-bottom: 20px;
color: rgba(215, 0, 0, 0.87);
}
</style>
<div class='non-printable btn btn-primary btn-large' onclick='window.print();'>Print</div><style>.heading_table_top{font-size:14px;}</style><h5><b>Train Number</b> : <a href="/train/16526">16526 <span class='non-printable'>(Check Train Details)</span></a></h5>
<h5><b>Train Name</b> : KANYAKUMARI EXP</h5>
<h5><b>Boarding Date</b> : 18- 3-2016</h5>
<h5><b>From</b> :  <a href="/station/KJM">KJM</a></h5>
<h5><b>To</b> :  <a href="/station/TCR">TCR</a></h5>
<h5><b>Reserved Upto</b> :  <a href="/train/16526">TCR</a></h5>
<h5><b>Boarding Point</b> :  <a href="/train/16526">KJM</a></h5>
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
<thead><th>No.</th><th>Booking Status (Coach No , Berth No., Quota)</th><th>Current Status</th></thead><tr><td>Passenger 1</td><td>W/L    2,GNWL  </td><td>RAC    8</td></tr><tr><td>Passenger 2</td><td>W/L    3,GNWL  </td><td>RAC    9</td></tr><tr><td>Total Booking Fare</td><td>1700</td><td></td></tr><tr><td>Charting Status</td><td> CHART NOT PREPARED </td><td></td></tr></table>
</br>PNR Status Details by <a href='http://CheckPNRstatusIRCTC.in/'>http://CheckPNRstatusIRCTC.in/</a></br></br><div id="example5" class='non-printable'>
<div id="shareme" data-url="http://checkpnrstatusirctc.in/" data-text="Check PNR Status of your train tickets, Train Schedule, Cancelled Trains, Diverted Trains, etc."></div>
</div>
<script>$("#shareme").sharrre({share:{googlePlus:true,facebook:true,twitter:true,digg:true,delicious:true,linkedin:true,},buttons:{googlePlus:{size:"tall",annotation:"bubble"},facebook:{layout:"box_count"},twitter:{count:"vertical"},digg:{type:"DiggMedium"},delicious:{size:"tall"},linkedin:{counter:"top"},pinterest:{media:"http://4.bp.blogspot.com/-k4A9Yzvw4Q0/U8p7od-GCuI/AAAAAAAAFqo/ycG9S8lVaUY/s1600/Indian-Railways-PNR-status-Enquiry.jpg",description:$("#shareme").data("text"),layout:"vertical"}},enableHover:false,enableCounter:false,enableTracking:true});</script>
<style type="text/css">#example5{margin: 0 auto;max-width: 400px; overflow: hidden;}.sharrre .button{float:left;width:60px;}.sharrre .linkedin{width:70px}</style>
`;
