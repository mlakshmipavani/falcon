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
mockPnr.post('/', (req, res) => {

  apiHitCount += 1;

  let body = 'hello!!!';
  if (apiHitCount <= 2)
    body = onePassenger0;
  else
    body = onePassenger1;

  res.writeHead(200, {
    'Content-Length': Buffer.byteLength(body),
    'Content-Type': 'text/html'
  });
  res.write(body);
  res.end();
});

// promisify the listen function
mockPnr.listen = Promise.promisify(mockPnr.listen);
mockPnr.close = Promise.promisify(mockPnr.close);

/**
 * @type {Server}
 */
module.exports = mockPnr;

const onePassenger0 = `

<HTML>
<HEAD><head><title>Welcome to Indian Railway Passenger reservation Enquiry</title><link href="http://www.indianrail.gov.in/css/rail-style.css"rel="stylesheet" type="text/css" /><script type="text/javascript" src="http://www.indianrail.gov.in/js/menuContents.js"></script> <script type="text/javascript" src="http://www.indianrail.gov.in/js/subMenu.js"></script></head><body><table width="100%%" border="0" cellspacing="0" cellpadding="0"><tr><td align="center" valign="top"><table width="970" border="0" cellspacing="0" cellpadding="0"><tr><td align="center" valign="top"><table width="970" border="0" cellspacing="0" cellpadding="0"><tr><td><img src="http://www.indianrail.gov.in/images/blank.gif" alt="" width="1" height="4" /></td></tr><tr><td align="left" valign="top"><table width="100%%" border="0" cellspacing="0" cellpadding="0"><tr><td width="92" align="center" valign="middle"><img src="http://www.indianrail.gov.in/images/rail_logo_new_red.gif" vspace="2" alt="Rail Logo"/></td><td width="701" align="center" valign="center"><b><FONT color="#990000" size="4">INDIAN RAILWAYS PASSENGER RESERVATION ENQUIRY</b></FONT></td><td width="84" align="center" valign="middle"><a href="../index.html" onclick="resetButton()" >Home</a><br><a href="../hindex.html" target="_blank">Hindi Version</a></td><td width="76" align="right" valign="middle" ><img src="http://www.indianrail.gov.in/images/cris_red.gif" alt="Cris"  /></td></tr></table></td></tr><tr><td align="center" valign="top"><table width="970" border="0" cellspacing="0" cellpadding="0"><tr><td align="center" valign="top" width="970"><table width="100%%" border="0" cellspacing="0" cellpadding="0"><tr><td width="206" align="left" valign="top"><table width="100%%" border="0" cellspacing="0" cellpadding="0"><tr><td align="left" valign="top"><img src="http://www.indianrail.gov.in/images/blank.gif" alt="" width="1" height="23" /></td></tr><tr><td align="center" valign="top"><table width="100%"><tr><td bgcolor="#c01921"><font size="2" color="#ffffff"><b>Services</b></font></td></tr></table></td></tr><tr><td align="center" valign="top" class="menu-tile_rail"><table width="206" border="0" cellspacing="0" cellpadding="0"><tr><td align="left" valign="top" class="pad_self"><table width="100%%" border="0" cellspacing="0" cellpadding="0"><tr><td align="center" valign="top"><img src="http://www.indianrail.gov.in/images/menu_top_red.gif" alt="" width="197" height="17" /></td></tr><tr><td align="center" valign="top"><table width="197" border="0" cellspacing="0" cellpadding="0"><tr><td align="center" valign="top" class="menu-tile_rail_inside"><table width="178" border="0" cellspacing="0" cellpadding="0"><tr align="left" valign="top"><td class="link-main-menu"><a href="#" class="menuanchorclass someotherclass" rel="anylinkmenu2[over]" rev="lr">Availability  at Major Stations</a></td></tr><tr align="left" valign="top"><td class="link-main-menu"><a href="../train_Schedule.html" onclick="resetButton()">Reserved Train Schedule</a><a href="../stn_code.html"></a></td></tr><td class="link-main-menu"><a href="http://www.enquiry.indianrail.gov.in" target="_blank">National Train Enquiry System</a></td></tr><tr align="left" valign="top"><td class="link-main-menu"><a href="../sms_Service.html" onclick="resetButton()">SMS Service</a></td></tr><tr align="left" valign="top"><td class="link-main-menu"><a href="../inet_curbkg_Enq.html" onclick="resetButton()">Current Booking Availability</a></td></tr><tr align="left" valign="top"><td class="link-main-menu"><a href="../dont_Know_Station_Code.html">Train Berth Availability </a></td></tr></table></td></tr></table></td></tr><tr><td align="center" valign="top"><img src="http://www.indianrail.gov.in/images/menu_bottom.gif" alt="" width="197" height="17" /></td></tr><tr><td align="center" valign="top"><table width="100%%"><tr><td bgcolor="c01921"><font size="2" color="ffffff"><b>Information</b></font></td></tr></table></td></tr><tr><td align="center" valign="top"><table width="197" border="0" cellspacing="0" cellpadding="0"><tr><td align="center" valign="top"><img src="http://www.indianrail.gov.in/images/menu_top_red.gif" alt="" width="197" height="17" /></td></tr><tr><td align="center"valign="top"><table width="197" border="0" cellspacing="0" cellpadding="0"><tr><td align="center" valign="top" class="menu-tile_rail_inside"><table width="178" border="0" cellspacing="0" cellpadding="0"><tr align="left" valign="top"><td class="link-main-menu"><a href="http://www.indianrail.gov.in/CateringCharge.html" target="_blank">Catering Charges</a></td></tr><tr align="left" valign="top"><td class="link-main-menu"><a href="#" class="menuanchorclass someotherclass" rel="anylinkmenu5[over]" rev="lr">Train Type Information</a></td></tr><tr align="left" valign="top"><td class="link-main-menu"><a href="#" class="menuanchorclass someotherclass" rel="anylinkmenu3[over]" rev="lr">View Codes</a></td></tr><tr align="left" valign="top"><td class="link-main-menu"><a href="http://www.indianrailways.gov.in/indianrailways/directorate/coaching/index.jsp" target="_blank">Trains at a Glance </a></td></tr><tr align="left" valign="top"><td class="link-main-menu"><a href="#" class="menuanchorclass someotherclass" rel="anylinkmenu4[over]" rev="lr">Rules</a></td></tr><tr align="left" valign="top"> <td class="link-main-menu"><a href="../international_Tourist.html" onclick="resetButton()">International Tourists</a></td></tr><tr align="left" valign="top"><td class="link-main-menu"><a href="../tatkal_Scheme.html" onclick="resetButton()">Tatkal Scheme</a></td></tr><tr align="left" valign="top"><td class="link-main-menu"><a href="../other_Rly_Sites.html" onclick="resetButton()">Other Railway Websites</a></td></tr></table></td></tr></table></td></tr><tr><td align="center"valign="top"><img src="http://www.indianrail.gov.in/images/menu_bottom.gif" alt="" width="197" height="17" /></td></tr></table></td></tr></table></td></tr></table></td></tr><tr><td align="left" valign="top" width="206"><img src="http://www.indianrail.gov.in/images/main_menu_bottom.gif" alt="" width="206" height="9" /></td></tr></table></td><td width="764" align="left" valign="top"><table width="764" border="0" cellspacing="0" cellpadding="0"><tr><td align="left" valign="top"><table width="764" border="0" cellspacing="0" cellpadding="0"><tr><td align="left" valign="top" ><table width="745" bgcolor="#c01921" border="0" cellspacing="0" cellpadding="0"><tr><td width="67"class="link-main-look" align="center" valign="top" ><a href="../pnr_Enq.html" >PNR Status</a></td><td width="188" valign="top" align="center" class="link-main-look" align="top"><a href="../between_Imp_Stations.html">Train Between Important Stations</a></td><td width="91" align="center" class="link-main-look"  valign="top"><a href="../seat_Avail.html">Seat Availability</a></td><td width="100" align="center" class="link-main-look" valign="top"><a href="../fare_Enq.html">Fare Enquiry</a></td><td width="160" align="center" class="link-main-look" valign="top"><a href="http://www.irctc.co.in"  target="_blank">Internet Reservation</a></td></tr></table></td></tr></table></td></tr><tr><td width="764"align="left" valign="top">

<Title>PNR Current Status Enquiry</Title>
<HEAD>
<style type = "text/css">body {
        background-image:url(http://www.indianrail.gov.in/images/main_bg.gif);
		background-color:#FFFFFF;
		margin: 0px;
        padding: 0px;
		font-family:Verdana, Arial, Helvetica, sans-serif;
		font-size:11px;
		font-weight:normal;
		color:#000000;
		background-repeat:repeat-x;
		scrollbar-darkshadow-color: #00ffff ;
}

.pad_self{
padding-left:1px;
padding-right:1px;
}

.text_rail_top{
		background-image:url(http://www.indianrail.gov.in/images/main_text_top_tile.gif);
		height:8px;
		background-repeat:repeat-x;
}

.text_rail_bottom{
		background-image:url(http://www.indianrail.gov.in/images/main_text_bottom_tile.gif);
		height:8px;
		background-repeat:repeat-x;
}

.text_rail_left{
		background-image:url(http://www.indianrail.gov.in/images/main_text_left_tile.gif);
		width:7px;
		background-repeat:repeat-y;
}

.text_rail_right{
		background-image:url(http://www.indianrail.gov.in/images/main_text_rgt_tile.gif);
		width:7px;
		background-repeat:repeat-y;
}

.text_back_color{
background-color:#FFFFFF;
}

.main_body_text{
font-family:Arial, Helvetica, sans-serif;
font-size:11px;
font-weight:normal;
color:#352e17;
text-align:justify;
line-height:17px;
padding-left:4px;
padding-right:4px;
}

.main_text{
font-family:Arial, Helvetica, sans-serif;
font-size:13px;
font-weight:normal;
color:#352e17;
text-align:justify;
line-height:17px;
padding-left:4px;
padding-right:4px;
}

.inside_heading_text{
font-family:Arial, Helvetica, sans-serif;
font-size:17px;
font-weight:bold;
color:#352e17;
padding-left:3px;

}

input {
    font-family:Arial, Helvetica, sans-serif;
	font-size: 13px;
	font-style: normal;
	font-weight: normal;
	color: #000000;
	text-decoration: none;
	border: 1px solid #352e17;
}

.btn_style {
    background-image:url(http://www.indianrail.gov.in/images/btn_tile.gif);
	height:23px;
    font-family:Arial, Helvetica, sans-serif;
	font-size: 11px;
	font-style: normal;
	font-weight: bold;
	color: #FFFFFF;
	text-decoration: none;
	border: 1px solid #7b070e;
}

.link-click{
   font-family:Arial, Helvetica, sans-serif;
	color:#CD745A;
	text-shadow:#0066CC;
	background-repeat: no-repeat;
	font-size:11px;
	font-weight:bold;
	text-align: left;
	padding-top: 2px;
	padding-bottom: 2px;
	text-decoration:none;
}
.link-click  a{
	color:#FF6600;
	text-shadow:#0066CC;
	text-decoration:none;
}
.link-click  a:hover{
	color:#000000;
	text-shadow:#0066CC;
	text-decoration:none;
}

.border{
border:#7b070e dotted 1px;
}

.text_input {
    font-family:Arial, Helvetica, sans-serif;
	font-size: 11px;
	font-style: normal;
	font-weight: normal;
	color: #000000;
	text-decoration: none;
	border: 1px solid #352e17;
}

/* ######### CGI Table Class ######### */

.Enq_heading{
font-family:Arial, Helvetica, sans-serif;
font-size:14px;
padding-top:3px;
padding-bottom:3px;
color:#a21921;
font-weight:bold;
}

.heading_table_top{
background-color:#a21921;
padding-top:3px;
padding-bottom:3px;
font-family:Arial, Helvetica, sans-serif;
color:#FFFFFF;
font-weight:bold;
font-size:12px;
text-align:center;
}

.heading_table{
background-color:#c4948e;
padding-top:3px;
padding-bottom:3px;
font-family:Arial, Helvetica, sans-serif;
color:#FFFFFF;
font-weight:bold;
font-size:12px;
text-align:center;
}

.table_border{
border:solid #993300 1px;
}


.table_border_both_center{
border:solid #993300 1px;
padding-top:3px;
padding-bottom:3px;
font-family:Arial, Helvetica, sans-serif;
font-size:12px;
text-align:center;
}

.table_border_both_left{
border:solid #993300 1px;
padding-top:3px;
padding-bottom:3px;
font-family:Arial, Helvetica, sans-serif;
font-size:12px;
text-align:left;
}

.table_border_left{
border:solid #993300 1px;
padding-top:3px;
padding-bottom:3px;
padding-left:3px;
font-family:Arial, Helvetica, sans-serif;
font-size:12px;
text-align:left;
}

.table_border_both{
border:solid #993300 1px;
padding-top:3px;
padding-bottom:3px;
padding-left:3px;
font-family:Arial, Helvetica, sans-serif;
font-size:12px;
text-align:center;
}
}

</style>
</HEAD>
 <BODY>
<TABLE width="100%" border="0" cellpadding="0" cellspacing="0">
<tr>
<td width="10" align="left" valign="top"><img src="http://www.indianrail.gov.in/main_text_left_top2.gif" alt="" width="8" height="8"></td>
<td width="100%" align="left" valign="top" class="text_rail_top"><img src="http://www.indianrail.gov.in/blank.gif" alt="" width="1" height="8"></td>
<td width="10" align="right" valign="top"><img src="http://www.indianrail.gov.in/main_text_rgt_top2.gif"alt="" width="8" height="8" ></td>
</tr>
<tr>
<td height="400" align="right" valign="top" class="text_rail_left"></td>
<td width="100%" align="left" valign="top" class="text_back_color"><table border="0" cellPadding="0" cellSpacing="0" width="100%"><tr>
<td align="left" valign="top"><table width="100%" border="0" cellspacing="2" cellpadding="0"><tr>      <td align="middle">        <FONT SIZE = "1">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;        Indian Railways Online Website: <b><a TITLE = "Passenger Reservation System - CONCERT" href="http://www.indianrail.gov.in/index.html" target="_blank">http://www.indianrail.gov.in</b></a>  designed and hosted by CRIS.</FONT>      </td></tr></table></td>
</tr><tr>
<td align="left" valign="top"><table width="100%" border="0" cellspacing="2" cellpadding="0">
<tr>
<td align="center" valign="top" class="inside_heading_text" colspan="4"><br />Passenger Current Status Enquiry </td>
</tr>
<tr>
<td colspan="4"> </td>
</tr>
<tr>
<td colspan="4" align="center" valign="top" class="Enq_heading"> You Queried For :
 PNR Number : 275-7502006(E - TICKET)
</td>
</TR>
<tr>
<td></td>
<td width="20%"> </td>
<td width="29%"> </td>
<td></td></tr><TR><TD colspan="4" class="main_text">
</tr></table>
<table width="100%" border="0" cellpadding="0" cellspacing="1" class="table_border">
<tr>
<td colspan="9" class="heading_table_top">Journey Details</td>
</tr>
<TR class="heading_table">
<td width="11%">Train Number</Td>
<td width="16%">Train Name</td>
<td width="18%">Boarding Date <br>(DD-MM-YYYY)</td>
<td width="7%">From</Td>
<td width="7%">To</Td>
<td width="14%">Reserved Upto</Td>
<td width="21%">Boarding Point</Td>
<td width="6%">Class</Td>
</TR>
<TR>
<TD class="table_border_both">*16533</TD>
<TD class="table_border_both">BGKT SBC EXPRES</TD>
<TD class="table_border_both">17- 2-2016</TD>
<TD class="table_border_both">ADI </TD>
<TD class="table_border_both">YPR </TD>
<TD class="table_border_both">YPR </TD>
<TD class="table_border_both">ADI </TD>
<TD class="table_border_both"> SL</TD>
</TR>
</TABLE>
<BR />
<TABLE align="center"><TR><TD>
<FORM NAME="RouteInfo" METHOD="POST" ACTION="http://www.indianrail.gov.in/cgi_bin/inet_trnpath_cgi.cgi">
<INPUT TYPE="SUBMIT" CLASS="btn_style" VALUE="Get Schedule" NAME="lccp_submitpath"><INPUT TYPE="HIDDEN" NAME="lccp_trn_no" SIZE="5" VALUE="16533"><INPUT  TYPE="HIDDEN" NAME="lccp_month" SIZE="2" VALUE="2"><INPUT  TYPE="HIDDEN" NAME="lccp_day" SIZE="2" VALUE="17"><INPUT TYPE="HIDDEN" NAME="lccp_daycnt" SIZE="1" VALUE="0"></FORM></TD>
</TR></TABLE>
<TABLE width="100%" border="0" cellpadding="0" cellspacing="1" class="table_border" id="center_table" >
<TR>
<td width="25%" class="heading_table_top">S. No.</td>
<td width="45%" class="heading_table_top">Booking Status <br /> (Coach No , Berth No., Quota)</td>
<td width="30%" class="heading_table_top">* Current Status <br />(Coach No , Berth No.)</td>
</TR>
<TR>
<TD class="table_border_both"><B>Passenger 1</B></TD>
<TD class="table_border_both"><B>S9  , 64,GN    </B></TD>
<TD class="table_border_both"><B>   RAC  </B></TD>
</TR>
<TR>
<td class="heading_table_top">Total Booking Fare</td>
<TD colspan="3" align="middle" valign="middle" class="table_border_both">650</TD>
</TR>
<TR>
<td class="heading_table_top">Charting Status</td>
<TD colspan="3" align="middle" valign="middle" class="table_border_both"> CHART NOT PREPARED </TD>
</TR>
<TR>
<td colspan="4"><font color="#1219e8" size="1"><b> * Please Note that in case the Final Charts have not been prepared, the Current Status might upgrade/downgrade at a later stage.</font></b></Td>
</TR>
</TABLE>
<BR>
<table width="100%" border="0"><tr>
<td>
<img src="../images/pnr_result_bottom.jpg" height="120" width="585">
</td>
</tr></table>
<TABLE width="100%" border="1" bordercolor="993300" align="center" cellpadding="0" cellspacing="1" class="table_border_both">
<caption class="Enq_heading">LEGENDS</caption>
<tbody>
<TR>
<TH align="middle" class="heading_table_top">Symbol</TH>
<TH align="middle" class="heading_table_top">Description</TH>
</TR>
<TR>
<TD>CAN / MOD</TD>
<TD>Cancelled or Modified Passenger</TD>
</TR>
<TR>
<TD>CNF / Confirmed</TD>
<TD>Confirmed (Coach/Berth number will be available after chart preparation)</TD>
</TR>
<TR>
<TD>RAC</TD>
<TD>Reservation Against Cancellation</TD>
</TR>
<TR>
<TD>WL #</TD>
<TD>Waiting List Number</TD>
</TR>
<TR>
<TD>RLWL</TD>
<TD>Remote Location Wait List</TD>
</TR>
<TR>
<TD>GNWL</TD>
<TD>General Wait List</TD>
</TR>
<TR>
<TD>PQWL</TD>
<TD>Pooled Quota Wait List</TD>
</TR>
<TR>
<TD>REGRET/WL</TD>
<TD>No More Booking Permitted</TD>
</TR>
<TR>
<TD>RELEASED</TD>
<TD>Ticket Not Cancelled but Alternative Accommodation Provided</TD>
</TR>
<TR>
<TD>R# #</TD>
<TD>RAC Coach Number Berth Number</TD>
</TR>
</tbody>
</TABLE>
<BR>
<BR>
</td>
<td align="left" valign="top" class="pad_self"><table width="100%" border="0" cellpadding="2" cellspacing="2">
<tr>
<td align="right" valign="top"><table width="166" height="606" border="0" cellpadding="0" cellspacing="0" class="border">
<tr>
<td><img src="../images/aadhaar_eng_pnrright.jpg"></td>
</tr></table></td>
</tr></table></td>
</tr></table></td>
<td align="left" valign="top" class="text_rail_right">&nbsp;</td>
</tr>
<tr>
<td width="10" height="8" align="left" valign="top"><img src="http://www.indianrail.gov.in/main_text_left_bottom2.gif" alt="" width="8" height="8" /></td>
<td width="100%" align="left" valign="top" class="text_rail_bottom"><img src="http://www.indianrail.gov.in/blank.gif" alt="" width="1" height="8" /></td>
<td width="10" align="right" valign="top"><img src="http://www.indianrail.gov.in/main_text_right_bottom2.gif" alt="" width="8" height="8" /></td>
</tr>
</table><body>
<FONT size=1>No. of Queries :  0411881402
, &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Server : YAMUNA
, &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Dated : 03-02-2016 Time:23:03:27 Hrs</font></td></tr></table></td></tr> </table></td></tr></table></td></tr></table></td></tr><tr><td align="left"valign="top"><table width="970" border="0" cellspacing="0" cellpadding="0"><tr> <td width="9" align="left" valign="top"><img src="http://www.indianrail.gov.in/images/footer_upper_lft.gif" alt="" width="9" height="49" /></td><td width="100%%" align="left" valign="top" class="footer_upper"><table width="100%%" border="0" cellspacing="1" cellpadding="0"><tr><td align="center" valign="top" class="main_footer_upper"><a href="../index.html"  onclick="resetButton()">Home </a> | <a href="http://www.indianrailways.gov.in/railwayboard/" target="_blank">Ministry of Railways</a> |      <a href="../know_Station_Code.html" onclick="resetButton()">Trains between Stations</a> | <a href="../booking_Location.html" onclick="resetButton()">Booking Locations</a> | <a href="http://www.cris.org.in/" target="_blank">CRIS</a> | <a href="../about_Concert.html"  onclick="resetButton()">CONCERT</a> | <a href="../faq.html"  onclick="resetButton()">FAQ</a> | <a href="../sitemap.html"  onclick="resetButton()">Sitemap</a> | <a href="http://www.trainenquiry.com/Feedback.aspx" target="_blank" onclick="resetButton()">Feedback</a></td></tr><tr><td align="center"valign="top" class="copy_footer" style="padding-top:3px;"><span class="main_footer_copy"><a href="../copyright.html"  onclick="resetButton()">Copyright</a></span> &copy; 2010, Centre For Railway Information Systems, Designed and Hosted by CRIS | <span class="main_footer_copy"><a href="../disclaimer.html" onclick="resetButton()">Disclaimer</a></span><br />Best viewed at 1024 x 768 resolution with Internet Explorer 5.0 or Mozila Firefox 3.5 and higher</td></tr> </table></td><td width="9" align="right" valign="top"><img src="http://www.indianrail.gov.in/images/footer_upper_rgt.gif" alt="" width="9" height="49" /></td></tr></table></td></tr></table></td></tr></table><script type="text/javascript">anylinkmenu.init("menuanchorclass")</script>
</BODY>
</HTML>
`;


const onePassenger1 = `

<HTML>
<HEAD><head><title>Welcome to Indian Railway Passenger reservation Enquiry</title><link href="http://www.indianrail.gov.in/css/rail-style.css"rel="stylesheet" type="text/css" /><script type="text/javascript" src="http://www.indianrail.gov.in/js/menuContents.js"></script> <script type="text/javascript" src="http://www.indianrail.gov.in/js/subMenu.js"></script></head><body><table width="100%%" border="0" cellspacing="0" cellpadding="0"><tr><td align="center" valign="top"><table width="970" border="0" cellspacing="0" cellpadding="0"><tr><td align="center" valign="top"><table width="970" border="0" cellspacing="0" cellpadding="0"><tr><td><img src="http://www.indianrail.gov.in/images/blank.gif" alt="" width="1" height="4" /></td></tr><tr><td align="left" valign="top"><table width="100%%" border="0" cellspacing="0" cellpadding="0"><tr><td width="92" align="center" valign="middle"><img src="http://www.indianrail.gov.in/images/rail_logo_new_red.gif" vspace="2" alt="Rail Logo"/></td><td width="701" align="center" valign="center"><b><FONT color="#990000" size="4">INDIAN RAILWAYS PASSENGER RESERVATION ENQUIRY</b></FONT></td><td width="84" align="center" valign="middle"><a href="../index.html" onclick="resetButton()" >Home</a><br><a href="../hindex.html" target="_blank">Hindi Version</a></td><td width="76" align="right" valign="middle" ><img src="http://www.indianrail.gov.in/images/cris_red.gif" alt="Cris"  /></td></tr></table></td></tr><tr><td align="center" valign="top"><table width="970" border="0" cellspacing="0" cellpadding="0"><tr><td align="center" valign="top" width="970"><table width="100%%" border="0" cellspacing="0" cellpadding="0"><tr><td width="206" align="left" valign="top"><table width="100%%" border="0" cellspacing="0" cellpadding="0"><tr><td align="left" valign="top"><img src="http://www.indianrail.gov.in/images/blank.gif" alt="" width="1" height="23" /></td></tr><tr><td align="center" valign="top"><table width="100%"><tr><td bgcolor="#c01921"><font size="2" color="#ffffff"><b>Services</b></font></td></tr></table></td></tr><tr><td align="center" valign="top" class="menu-tile_rail"><table width="206" border="0" cellspacing="0" cellpadding="0"><tr><td align="left" valign="top" class="pad_self"><table width="100%%" border="0" cellspacing="0" cellpadding="0"><tr><td align="center" valign="top"><img src="http://www.indianrail.gov.in/images/menu_top_red.gif" alt="" width="197" height="17" /></td></tr><tr><td align="center" valign="top"><table width="197" border="0" cellspacing="0" cellpadding="0"><tr><td align="center" valign="top" class="menu-tile_rail_inside"><table width="178" border="0" cellspacing="0" cellpadding="0"><tr align="left" valign="top"><td class="link-main-menu"><a href="#" class="menuanchorclass someotherclass" rel="anylinkmenu2[over]" rev="lr">Availability  at Major Stations</a></td></tr><tr align="left" valign="top"><td class="link-main-menu"><a href="../train_Schedule.html" onclick="resetButton()">Reserved Train Schedule</a><a href="../stn_code.html"></a></td></tr><td class="link-main-menu"><a href="http://www.enquiry.indianrail.gov.in" target="_blank">National Train Enquiry System</a></td></tr><tr align="left" valign="top"><td class="link-main-menu"><a href="../sms_Service.html" onclick="resetButton()">SMS Service</a></td></tr><tr align="left" valign="top"><td class="link-main-menu"><a href="../inet_curbkg_Enq.html" onclick="resetButton()">Current Booking Availability</a></td></tr><tr align="left" valign="top"><td class="link-main-menu"><a href="../dont_Know_Station_Code.html">Train Berth Availability </a></td></tr></table></td></tr></table></td></tr><tr><td align="center" valign="top"><img src="http://www.indianrail.gov.in/images/menu_bottom.gif" alt="" width="197" height="17" /></td></tr><tr><td align="center" valign="top"><table width="100%%"><tr><td bgcolor="c01921"><font size="2" color="ffffff"><b>Information</b></font></td></tr></table></td></tr><tr><td align="center" valign="top"><table width="197" border="0" cellspacing="0" cellpadding="0"><tr><td align="center" valign="top"><img src="http://www.indianrail.gov.in/images/menu_top_red.gif" alt="" width="197" height="17" /></td></tr><tr><td align="center"valign="top"><table width="197" border="0" cellspacing="0" cellpadding="0"><tr><td align="center" valign="top" class="menu-tile_rail_inside"><table width="178" border="0" cellspacing="0" cellpadding="0"><tr align="left" valign="top"><td class="link-main-menu"><a href="http://www.indianrail.gov.in/CateringCharge.html" target="_blank">Catering Charges</a></td></tr><tr align="left" valign="top"><td class="link-main-menu"><a href="#" class="menuanchorclass someotherclass" rel="anylinkmenu5[over]" rev="lr">Train Type Information</a></td></tr><tr align="left" valign="top"><td class="link-main-menu"><a href="#" class="menuanchorclass someotherclass" rel="anylinkmenu3[over]" rev="lr">View Codes</a></td></tr><tr align="left" valign="top"><td class="link-main-menu"><a href="http://www.indianrailways.gov.in/indianrailways/directorate/coaching/index.jsp" target="_blank">Trains at a Glance </a></td></tr><tr align="left" valign="top"><td class="link-main-menu"><a href="#" class="menuanchorclass someotherclass" rel="anylinkmenu4[over]" rev="lr">Rules</a></td></tr><tr align="left" valign="top"> <td class="link-main-menu"><a href="../international_Tourist.html" onclick="resetButton()">International Tourists</a></td></tr><tr align="left" valign="top"><td class="link-main-menu"><a href="../tatkal_Scheme.html" onclick="resetButton()">Tatkal Scheme</a></td></tr><tr align="left" valign="top"><td class="link-main-menu"><a href="../other_Rly_Sites.html" onclick="resetButton()">Other Railway Websites</a></td></tr></table></td></tr></table></td></tr><tr><td align="center"valign="top"><img src="http://www.indianrail.gov.in/images/menu_bottom.gif" alt="" width="197" height="17" /></td></tr></table></td></tr></table></td></tr></table></td></tr><tr><td align="left" valign="top" width="206"><img src="http://www.indianrail.gov.in/images/main_menu_bottom.gif" alt="" width="206" height="9" /></td></tr></table></td><td width="764" align="left" valign="top"><table width="764" border="0" cellspacing="0" cellpadding="0"><tr><td align="left" valign="top"><table width="764" border="0" cellspacing="0" cellpadding="0"><tr><td align="left" valign="top" ><table width="745" bgcolor="#c01921" border="0" cellspacing="0" cellpadding="0"><tr><td width="67"class="link-main-look" align="center" valign="top" ><a href="../pnr_Enq.html" >PNR Status</a></td><td width="188" valign="top" align="center" class="link-main-look" align="top"><a href="../between_Imp_Stations.html">Train Between Important Stations</a></td><td width="91" align="center" class="link-main-look"  valign="top"><a href="../seat_Avail.html">Seat Availability</a></td><td width="100" align="center" class="link-main-look" valign="top"><a href="../fare_Enq.html">Fare Enquiry</a></td><td width="160" align="center" class="link-main-look" valign="top"><a href="http://www.irctc.co.in"  target="_blank">Internet Reservation</a></td></tr></table></td></tr></table></td></tr><tr><td width="764"align="left" valign="top">

<Title>PNR Current Status Enquiry</Title>
<HEAD>
<style type = "text/css">body {
        background-image:url(http://www.indianrail.gov.in/images/main_bg.gif);
		background-color:#FFFFFF;
		margin: 0px;
        padding: 0px;
		font-family:Verdana, Arial, Helvetica, sans-serif;
		font-size:11px;
		font-weight:normal;
		color:#000000;
		background-repeat:repeat-x;
		scrollbar-darkshadow-color: #00ffff ;
}

.pad_self{
padding-left:1px;
padding-right:1px;
}

.text_rail_top{
		background-image:url(http://www.indianrail.gov.in/images/main_text_top_tile.gif);
		height:8px;
		background-repeat:repeat-x;
}

.text_rail_bottom{
		background-image:url(http://www.indianrail.gov.in/images/main_text_bottom_tile.gif);
		height:8px;
		background-repeat:repeat-x;
}

.text_rail_left{
		background-image:url(http://www.indianrail.gov.in/images/main_text_left_tile.gif);
		width:7px;
		background-repeat:repeat-y;
}

.text_rail_right{
		background-image:url(http://www.indianrail.gov.in/images/main_text_rgt_tile.gif);
		width:7px;
		background-repeat:repeat-y;
}

.text_back_color{
background-color:#FFFFFF;
}

.main_body_text{
font-family:Arial, Helvetica, sans-serif;
font-size:11px;
font-weight:normal;
color:#352e17;
text-align:justify;
line-height:17px;
padding-left:4px;
padding-right:4px;
}

.main_text{
font-family:Arial, Helvetica, sans-serif;
font-size:13px;
font-weight:normal;
color:#352e17;
text-align:justify;
line-height:17px;
padding-left:4px;
padding-right:4px;
}

.inside_heading_text{
font-family:Arial, Helvetica, sans-serif;
font-size:17px;
font-weight:bold;
color:#352e17;
padding-left:3px;

}

input {
    font-family:Arial, Helvetica, sans-serif;
	font-size: 13px;
	font-style: normal;
	font-weight: normal;
	color: #000000;
	text-decoration: none;
	border: 1px solid #352e17;
}

.btn_style {
    background-image:url(http://www.indianrail.gov.in/images/btn_tile.gif);
	height:23px;
    font-family:Arial, Helvetica, sans-serif;
	font-size: 11px;
	font-style: normal;
	font-weight: bold;
	color: #FFFFFF;
	text-decoration: none;
	border: 1px solid #7b070e;
}

.link-click{
   font-family:Arial, Helvetica, sans-serif;
	color:#CD745A;
	text-shadow:#0066CC;
	background-repeat: no-repeat;
	font-size:11px;
	font-weight:bold;
	text-align: left;
	padding-top: 2px;
	padding-bottom: 2px;
	text-decoration:none;
}
.link-click  a{
	color:#FF6600;
	text-shadow:#0066CC;
	text-decoration:none;
}
.link-click  a:hover{
	color:#000000;
	text-shadow:#0066CC;
	text-decoration:none;
}

.border{
border:#7b070e dotted 1px;
}

.text_input {
    font-family:Arial, Helvetica, sans-serif;
	font-size: 11px;
	font-style: normal;
	font-weight: normal;
	color: #000000;
	text-decoration: none;
	border: 1px solid #352e17;
}

/* ######### CGI Table Class ######### */

.Enq_heading{
font-family:Arial, Helvetica, sans-serif;
font-size:14px;
padding-top:3px;
padding-bottom:3px;
color:#a21921;
font-weight:bold;
}

.heading_table_top{
background-color:#a21921;
padding-top:3px;
padding-bottom:3px;
font-family:Arial, Helvetica, sans-serif;
color:#FFFFFF;
font-weight:bold;
font-size:12px;
text-align:center;
}

.heading_table{
background-color:#c4948e;
padding-top:3px;
padding-bottom:3px;
font-family:Arial, Helvetica, sans-serif;
color:#FFFFFF;
font-weight:bold;
font-size:12px;
text-align:center;
}

.table_border{
border:solid #993300 1px;
}


.table_border_both_center{
border:solid #993300 1px;
padding-top:3px;
padding-bottom:3px;
font-family:Arial, Helvetica, sans-serif;
font-size:12px;
text-align:center;
}

.table_border_both_left{
border:solid #993300 1px;
padding-top:3px;
padding-bottom:3px;
font-family:Arial, Helvetica, sans-serif;
font-size:12px;
text-align:left;
}

.table_border_left{
border:solid #993300 1px;
padding-top:3px;
padding-bottom:3px;
padding-left:3px;
font-family:Arial, Helvetica, sans-serif;
font-size:12px;
text-align:left;
}

.table_border_both{
border:solid #993300 1px;
padding-top:3px;
padding-bottom:3px;
padding-left:3px;
font-family:Arial, Helvetica, sans-serif;
font-size:12px;
text-align:center;
}
}

</style>
</HEAD>
 <BODY>
<TABLE width="100%" border="0" cellpadding="0" cellspacing="0">
<tr>
<td width="10" align="left" valign="top"><img src="http://www.indianrail.gov.in/main_text_left_top2.gif" alt="" width="8" height="8"></td>
<td width="100%" align="left" valign="top" class="text_rail_top"><img src="http://www.indianrail.gov.in/blank.gif" alt="" width="1" height="8"></td>
<td width="10" align="right" valign="top"><img src="http://www.indianrail.gov.in/main_text_rgt_top2.gif"alt="" width="8" height="8" ></td>
</tr>
<tr>
<td height="400" align="right" valign="top" class="text_rail_left"></td>
<td width="100%" align="left" valign="top" class="text_back_color"><table border="0" cellPadding="0" cellSpacing="0" width="100%"><tr>
<td align="left" valign="top"><table width="100%" border="0" cellspacing="2" cellpadding="0"><tr>      <td align="middle">        <FONT SIZE = "1">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;        Indian Railways Online Website: <b><a TITLE = "Passenger Reservation System - CONCERT" href="http://www.indianrail.gov.in/index.html" target="_blank">http://www.indianrail.gov.in</b></a>  designed and hosted by CRIS.</FONT>      </td></tr></table></td>
</tr><tr>
<td align="left" valign="top"><table width="100%" border="0" cellspacing="2" cellpadding="0">
<tr>
<td align="center" valign="top" class="inside_heading_text" colspan="4"><br />Passenger Current Status Enquiry </td>
</tr>
<tr>
<td colspan="4"> </td>
</tr>
<tr>
<td colspan="4" align="center" valign="top" class="Enq_heading"> You Queried For :
 PNR Number : 275-7502006(E - TICKET)
</td>
</TR>
<tr>
<td></td>
<td width="20%"> </td>
<td width="29%"> </td>
<td></td></tr><TR><TD colspan="4" class="main_text">
</tr></table>
<table width="100%" border="0" cellpadding="0" cellspacing="1" class="table_border">
<tr>
<td colspan="9" class="heading_table_top">Journey Details</td>
</tr>
<TR class="heading_table">
<td width="11%">Train Number</Td>
<td width="16%">Train Name</td>
<td width="18%">Boarding Date <br>(DD-MM-YYYY)</td>
<td width="7%">From</Td>
<td width="7%">To</Td>
<td width="14%">Reserved Upto</Td>
<td width="21%">Boarding Point</Td>
<td width="6%">Class</Td>
</TR>
<TR>
<TD class="table_border_both">*16533</TD>
<TD class="table_border_both">BGKT SBC EXPRES</TD>
<TD class="table_border_both">17- 2-2016</TD>
<TD class="table_border_both">ADI </TD>
<TD class="table_border_both">YPR </TD>
<TD class="table_border_both">YPR </TD>
<TD class="table_border_both">ADI </TD>
<TD class="table_border_both"> SL</TD>
</TR>
</TABLE>
<BR />
<TABLE align="center"><TR><TD>
<FORM NAME="RouteInfo" METHOD="POST" ACTION="http://www.indianrail.gov.in/cgi_bin/inet_trnpath_cgi.cgi">
<INPUT TYPE="SUBMIT" CLASS="btn_style" VALUE="Get Schedule" NAME="lccp_submitpath"><INPUT TYPE="HIDDEN" NAME="lccp_trn_no" SIZE="5" VALUE="16533"><INPUT  TYPE="HIDDEN" NAME="lccp_month" SIZE="2" VALUE="2"><INPUT  TYPE="HIDDEN" NAME="lccp_day" SIZE="2" VALUE="17"><INPUT TYPE="HIDDEN" NAME="lccp_daycnt" SIZE="1" VALUE="0"></FORM></TD>
</TR></TABLE>
<TABLE width="100%" border="0" cellpadding="0" cellspacing="1" class="table_border" id="center_table" >
<TR>
<td width="25%" class="heading_table_top">S. No.</td>
<td width="45%" class="heading_table_top">Booking Status <br /> (Coach No , Berth No., Quota)</td>
<td width="30%" class="heading_table_top">* Current Status <br />(Coach No , Berth No.)</td>
</TR>
<TR>
<TD class="table_border_both"><B>Passenger 1</B></TD>
<TD class="table_border_both"><B>S9  , 64,GN    </B></TD>
<TD class="table_border_both"><B>   CNF  </B></TD>
</TR>
<TR>
<td class="heading_table_top">Total Booking Fare</td>
<TD colspan="3" align="middle" valign="middle" class="table_border_both">650</TD>
</TR>
<TR>
<td class="heading_table_top">Charting Status</td>
<TD colspan="3" align="middle" valign="middle" class="table_border_both"> CHART NOT PREPARED </TD>
</TR>
<TR>
<td colspan="4"><font color="#1219e8" size="1"><b> * Please Note that in case the Final Charts have not been prepared, the Current Status might upgrade/downgrade at a later stage.</font></b></Td>
</TR>
</TABLE>
<BR>
<table width="100%" border="0"><tr>
<td>
<img src="../images/pnr_result_bottom.jpg" height="120" width="585">
</td>
</tr></table>
<TABLE width="100%" border="1" bordercolor="993300" align="center" cellpadding="0" cellspacing="1" class="table_border_both">
<caption class="Enq_heading">LEGENDS</caption>
<tbody>
<TR>
<TH align="middle" class="heading_table_top">Symbol</TH>
<TH align="middle" class="heading_table_top">Description</TH>
</TR>
<TR>
<TD>CAN / MOD</TD>
<TD>Cancelled or Modified Passenger</TD>
</TR>
<TR>
<TD>CNF / Confirmed</TD>
<TD>Confirmed (Coach/Berth number will be available after chart preparation)</TD>
</TR>
<TR>
<TD>RAC</TD>
<TD>Reservation Against Cancellation</TD>
</TR>
<TR>
<TD>WL #</TD>
<TD>Waiting List Number</TD>
</TR>
<TR>
<TD>RLWL</TD>
<TD>Remote Location Wait List</TD>
</TR>
<TR>
<TD>GNWL</TD>
<TD>General Wait List</TD>
</TR>
<TR>
<TD>PQWL</TD>
<TD>Pooled Quota Wait List</TD>
</TR>
<TR>
<TD>REGRET/WL</TD>
<TD>No More Booking Permitted</TD>
</TR>
<TR>
<TD>RELEASED</TD>
<TD>Ticket Not Cancelled but Alternative Accommodation Provided</TD>
</TR>
<TR>
<TD>R# #</TD>
<TD>RAC Coach Number Berth Number</TD>
</TR>
</tbody>
</TABLE>
<BR>
<BR>
</td>
<td align="left" valign="top" class="pad_self"><table width="100%" border="0" cellpadding="2" cellspacing="2">
<tr>
<td align="right" valign="top"><table width="166" height="606" border="0" cellpadding="0" cellspacing="0" class="border">
<tr>
<td><img src="../images/aadhaar_eng_pnrright.jpg"></td>
</tr></table></td>
</tr></table></td>
</tr></table></td>
<td align="left" valign="top" class="text_rail_right">&nbsp;</td>
</tr>
<tr>
<td width="10" height="8" align="left" valign="top"><img src="http://www.indianrail.gov.in/main_text_left_bottom2.gif" alt="" width="8" height="8" /></td>
<td width="100%" align="left" valign="top" class="text_rail_bottom"><img src="http://www.indianrail.gov.in/blank.gif" alt="" width="1" height="8" /></td>
<td width="10" align="right" valign="top"><img src="http://www.indianrail.gov.in/main_text_right_bottom2.gif" alt="" width="8" height="8" /></td>
</tr>
</table><body>
<FONT size=1>No. of Queries :  0411881402
, &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Server : YAMUNA
, &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Dated : 03-02-2016 Time:23:03:27 Hrs</font></td></tr></table></td></tr> </table></td></tr></table></td></tr></table></td></tr><tr><td align="left"valign="top"><table width="970" border="0" cellspacing="0" cellpadding="0"><tr> <td width="9" align="left" valign="top"><img src="http://www.indianrail.gov.in/images/footer_upper_lft.gif" alt="" width="9" height="49" /></td><td width="100%%" align="left" valign="top" class="footer_upper"><table width="100%%" border="0" cellspacing="1" cellpadding="0"><tr><td align="center" valign="top" class="main_footer_upper"><a href="../index.html"  onclick="resetButton()">Home </a> | <a href="http://www.indianrailways.gov.in/railwayboard/" target="_blank">Ministry of Railways</a> |      <a href="../know_Station_Code.html" onclick="resetButton()">Trains between Stations</a> | <a href="../booking_Location.html" onclick="resetButton()">Booking Locations</a> | <a href="http://www.cris.org.in/" target="_blank">CRIS</a> | <a href="../about_Concert.html"  onclick="resetButton()">CONCERT</a> | <a href="../faq.html"  onclick="resetButton()">FAQ</a> | <a href="../sitemap.html"  onclick="resetButton()">Sitemap</a> | <a href="http://www.trainenquiry.com/Feedback.aspx" target="_blank" onclick="resetButton()">Feedback</a></td></tr><tr><td align="center"valign="top" class="copy_footer" style="padding-top:3px;"><span class="main_footer_copy"><a href="../copyright.html"  onclick="resetButton()">Copyright</a></span> &copy; 2010, Centre For Railway Information Systems, Designed and Hosted by CRIS | <span class="main_footer_copy"><a href="../disclaimer.html" onclick="resetButton()">Disclaimer</a></span><br />Best viewed at 1024 x 768 resolution with Internet Explorer 5.0 or Mozila Firefox 3.5 and higher</td></tr> </table></td><td width="9" align="right" valign="top"><img src="http://www.indianrail.gov.in/images/footer_upper_rgt.gif" alt="" width="9" height="49" /></td></tr></table></td></tr></table></td></tr></table><script type="text/javascript">anylinkmenu.init("menuanchorclass")</script>
</BODY>
</HTML>
`;
