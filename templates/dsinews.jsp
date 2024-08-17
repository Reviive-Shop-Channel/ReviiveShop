<script>
	var wiishop = new wiiShop();
	const unused = wiishop.connecting;
</script>
<!--  -----------------------------------------------------  -->
<!--  Copyright 2005-2014 Acer Cloud Technology, Inc.        -->
<!--  All Rights Reserved.                                   -->
<!--                                                         -->
<!--  This software contains confidential information and    -->
<!--  trade secrets of Acer Cloud Technology, Inc.           -->
<!--  Use, disclosure or reproduction is prohibited without  -->
<!--  the prior express written permission of Acer Cloud     -->
<!--  Technology, Inc.                                       -->
<!--  -----------------------------------------------------  -->
<!--  -----------------------------------------------------  -->
<!--  Copyright 2005-2014 Acer Cloud Technology, Inc.        -->
<!--  All Rights Reserved.                                   -->
<!--                                                         -->
<!--  This software contains confidential information and    -->
<!--  trade secrets of Acer Cloud Technology, Inc.           -->
<!--  Use, disclosure or reproduction is prohibited without  -->
<!--  the prior express written permission of Acer Cloud     -->
<!--  Technology, Inc.                                       -->
<!--  -----------------------------------------------------  -->
<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html xmlns="http://www.w3.org/1999/xhtml">
<!-- start Common.jspf -->
<!-- Flush buffer before setting locale to ensure encoding is preserved -->
<!-- end Common.jspf -->
<head>
  <!--  -----------------------------------------------------  -->
<!--  Copyright 2005-2014 Acer Cloud Technology, Inc.        -->
<!--  All Rights Reserved.                                   -->
<!--                                                         -->
<!--  This software contains confidential information and    -->
<!--  trade secrets of Acer Cloud Technology, Inc.           -->
<!--  Use, disclosure or reproduction is prohibited without  -->
<!--  the prior express written permission of Acer Cloud     -->
<!--  Technology, Inc.                                       -->
<!--  -----------------------------------------------------  -->
<!-- start Header.jspf -->
<!--  -----------------------------------------------------  -->
<!--  Copyright 2005-2014 Acer Cloud Technology, Inc.        -->
<!--  All Rights Reserved.                                   -->
<!--                                                         -->
<!--  This software contains confidential information and    -->
<!--  trade secrets of Acer Cloud Technology, Inc.           -->
<!--  Use, disclosure or reproduction is prohibited without  -->
<!--  the prior express written permission of Acer Cloud     -->
<!--  Technology, Inc.                                       -->
<!--  -----------------------------------------------------  -->
<meta http-equiv="Content-Type" content="text/html;charset=UTF-8" />
<!-- start Header_d.jspf -->

<!--  -----------------------------------------------------  -->
<!--  Copyright 2005-2014 Acer Cloud Technology, Inc.        -->
<!--  All Rights Reserved.                                   -->
<!--                                                         -->
<!--  This software contains confidential information and    -->
<!--  trade secrets of Acer Cloud Technology, Inc.           -->
<!--  Use, disclosure or reproduction is prohibited without  -->
<!--  the prior express written permission of Acer Cloud     -->
<!--  Technology, Inc.                                       -->
<!--  -----------------------------------------------------  -->
<!-- start WindowNames.jspf -->
<script type="text/JavaScript">
<!--
var upWindowName = "UpWindow";
var downWindowName = "DownWindow";


//-->
</script>
<!-- end WindowNames.jspf -->
<link rel="shortcut icon" href="/tss/favicon.ico" /> 
	
<link rel=stylesheet type="text/css" href="/static/dsi/static/dsi/static/dsi/static/css/common.css">
<script type="text/JavaScript">
<!--
var gkong = new Kong;
window.name = downWindowName;
var upWindowObject   = window.open('', upWindowName);

/* #### 2001002 #### Processing is blocked until you can get a upWindowObject. (Wabe@NCL) */
while ( upWindowObject == null )
{
    upWindowObject = window.open('', upWindowName);
}

function isConnectingPage()
{
    var isConnecting = '';
    return (isConnecting == 'true');
}

var downWindowObject = window.open('', downWindowName);
var $ = function(arg) { return document.getElementById(arg); }
window.addEventListener('load',   function(){ 	
	var isConnecting = isConnectingPage();
	setConnectingToServer(isConnecting);
}, false);
window.addEventListener('unload', function(){ gkong.ShowLoadingIcon(); }, false);
//-->
</script>
<!-- end Header_d.jspf -->
<SCRIPT language="JavaScript" src="/static/dsi/static/js//ec.js"></SCRIPT>
<SCRIPT language="JavaScript" src='/static/dsi/static/js//error.js'></SCRIPT>
<SCRIPT language="JavaScript" src="/static/dsi/static/js//oss.js"></SCRIPT>
<SCRIPT language="JavaScript" src="/static/dsi/static/js//base.js"></SCRIPT>

<script type="text/JavaScript">
<!--
var testMode = 'false';

function getMethod()
{
	return 'GET';	
}

function getPostParams()
{
    var params = "";    
   
   return params;
}

function initPageCommon()
{
	var ecsUrl = null;
	var iasUrl = null;
	var ccsUrl = null;
	var ucsUrl = null;
	var currBalance = null;

	init();
	
	// Cancel any ongoing async ops
	ec.cancelOperation();
	

	ecsUrl = 'https://ecs.t.shop.nintendowifi.net/ecs/services/ECommerceSOAP';

	iasUrl = 'https://ias.t.shop.nintendowifi.net/ias/services/IdentityAuthenticationSOAP';

	ccsUrl = 'http://ccs.cdn.t.shop.nintendowifi.net/ccs/download';

	ucsUrl = 'https://ccs.t.shop.nintendowifi.net/ccs/download';


	
	
	ec.setWebSvcUrls(ecsUrl, iasUrl);
	ec.setContentUrls (ccsUrl, ucsUrl);
	
	

	imagesPath = "/static/dsi/static/images/";
	htmlPath = "/static/dsi/static/html";
	ossPath = "https://tss.t.shop.nintendowifi.net/tss/serv/";
	secureOssPath = "https://tss.t.shop.nintendowifi.net/tss/serv/";	

	ecTimeout = new ECTimeout(parseInt("60000"));
	
	
	setEulaUrl("L_03_UA_1.jsp");

    var supportsCreditCard = 'true';
    if (ecSupportsSession()) {
        ec.setSessionValue("supportsCreditCard", supportsCreditCard);
    }

    /* Processing is blocked until upWindow is loaded. (Wabe@NCL) */
    while ( isUpWindowLoaded() == false ) {}

    
    updateHistory();
    showCurrentBalance();
    upWindowObject.scrollTo(0,0);
}
//-->
</script>
<!-- end Header.jspf -->
<!-- <script language="JavaScript" src="/static/dsi/static/js/Common.js"></script> -->
<script language="JavaScript" src="/static/dsi/static/js//kugi/Button.js"></script>
<script language="JavaScript" src="/static/dsi/static/js//kugi/SceneChanger.js"></script>
<script language="JavaScript" src="/static/dsi/static/js//kugi/Transit.js"></script>

<link rel="stylesheet" type="text/css" href="/static/dsi/static/css/preload.css">
<link rel="stylesheet" type="text/css" href="/static/dsi/static/css/button_base.css">
<link rel="stylesheet" type="text/css" href="/static/dsi/static/css/bottom_button.css">
<link rel="stylesheet" type="text/css" href="/static/dsi/static/css/top_button.css">
<link rel="stylesheet" type="text/css" href="/static/dsi/static/css/error.css">

<style type="text/css">
/* ==== W_02_d : parents css ==================== */

/* ---- imgBtn1 : 256x34 ---- */
#btnInfo1 { position : absolute; left :   0px; top :  26px; }

/* ---- imgBtn2 : 256x34 ---- */
#btnInfo2 { position : absolute; left :   0px; top :  60px; }

/* ---- imgBtn3 : 256x34 ---- */
#btnInfo3 { position : absolute; left :   0px; top :  94px; }

/* ---- imgBtn4 : 256x34 ---- */
#btnInfo4 { position : absolute; left :   0px; top : 128px; }

/* .............. */
.button_256x34 {
    width  : 256px;
    height : 34px;
    background-image : url(/static/dsi/static/images//button_autogen/button_256x34_all.gif);
}


/* ==== W_02_d : children css ==================== */

/* ---- info ---- */
.info_text {
	position : absolute;
	left   :  48px;
	top    :   9px;
	width  : 208px;
	height :  24px;
}

.info_new {
	position : absolute;
	left   :   6px;
	top    :  10px;
}

._inner {
    text-align     : left;
}
</style>

<title>Important Info</title>
  
<script type="text/JavaScript">
<!--

var MessageHeadlines = new Array();
var MessageContents = new Array();

            MessageHeadlines[0] = 'About the Nintendo DSi Shop';
			trace(MessageHeadlines[0]);
            MessageContents[0] = 'Welcome to the Nintendo DSi™ Shop, your source for downloading new and unique DSiWare™ games and applications directly to your Nintendo DSi system! To begin, select Start Shopping on the previous page.<p>DSiWare includes many different types of software—from fun and interesting games to useful applications that extend the functionality of your Nintendo DSi system. You can find titles in their respective pricing category or by using one of several search options. Also be sure to check out the Recommended Titles link on the welcome page for our suggestions. New DSiWare software is added to the Nintendo DSi Shop regularly, so be sure to check the catalog often.<p>If you’d like additional details on the Nintendo DSi Shop itself or how to purchase Nintendo DSi Points™, consult the Shopping Guide on the main menu. Enjoy!';
			trace(MessageContents[0]);
        	
            MessageHeadlines[1] = '[NEW]Nintendo DSi Shop Has Closed';
			trace(MessageHeadlines[1]);
            MessageContents[1] = 'It is no longer possible to purchase Nintendo DSiWare in the Nintendo DSi Shop. For a limited time previous purchases can still be re-downloaded, and the Nintendo 3DS Transfer Tool can still be downloaded, allowing you to transfer most Nintendo DSiWare titles to a system in the Nintendo 3DS family.';
			trace(MessageContents[1]);
        	
            MessageHeadlines[2] = '[NEW]DSi Shop Discontinuation';
			trace(MessageHeadlines[2]);
            MessageContents[2] = 'Dear Nintendo fans,<br><br>In early 2017 we plan to close the Nintendo DSi Shop, which has been available on the Nintendo DSi and Nintendo DSi XL systems since 2009. We sincerely thank our loyal customers for supporting the Nintendo DSi Shop, and wish to ensure they can continue to enjoy Nintendo DSiWare.<br><br>If you have Nintendo DSi Points to spend, Nintendo DSiWare you want to re-download or Nintendo DSiWare you’d like to transfer from a Nintendo DSi/Nintendo DSi XL system to a Nintendo 3DS family system, you may want to do so at your earliest convenience, while the service is still available.<br><br>You can still add Nintendo DSi Points until September 30, 2016, and purchase content in the Nintendo DSi Shop until March 31, 2017.  The ability to re-download Nintendo DSiWare games will also stop at some point; we will announce specific details as that time approaches.<br><br>Note that even after the Nintendo DSi Shop closes, most Nintendo DSiWare will continue to be sold in the Nintendo eShop on systems in the Nintendo 3DS family.<br><br>For more information, visit our Support page http://support.nintendo.com/dsi/shopnews.<br><br>Once again, thank you for supporting the Nintendo DSi Shop, and for being such a great fan of Nintendo.<br><br>Sincerely,<br><br>Your Friends at Nintendo';
			trace(MessageContents[2]);
        	


window.addEventListener('DOMContentLoaded', initPage, false );
var upChanger;

var UP_MAIN = 0;

var UP_INFO_1 = 1;

var UP_INFO_2 = 2;

var UP_INFO_3 = 3;


function initPage()
{
	initPageCommon();
    upChanger       = new kugi.SceneChanger( upWindowObject.$("upBase").children, $("up_contents").children );

	
   		//btnInfo1.onmouseup = "kugi.Transit.changeScene( 'upChanger.show( UP_INFO_1 );upWindowObject.scrollTo(0,0);gkong.PlaySE(TWL_SHOP_SE_TRANSIT);', WIPE_ANIM_NONE, WIPE_ANIM_UP )";
        btnInfo1.onmouseup = "onButtonSelected( UP_INFO_1 )";
    
   		//btnInfo2.onmouseup = "kugi.Transit.changeScene( 'upChanger.show( UP_INFO_2 );upWindowObject.scrollTo(0,0);gkong.PlaySE(TWL_SHOP_SE_TRANSIT);', WIPE_ANIM_NONE, WIPE_ANIM_UP )";
        btnInfo2.onmouseup = "onButtonSelected( UP_INFO_2 )";
    
   		//btnInfo3.onmouseup = "kugi.Transit.changeScene( 'upChanger.show( UP_INFO_3 );upWindowObject.scrollTo(0,0);gkong.PlaySE(TWL_SHOP_SE_TRANSIT);', WIPE_ANIM_NONE, WIPE_ANIM_UP )";
        btnInfo3.onmouseup = "onButtonSelected( UP_INFO_3 )";
    

	btnBack.onmouseup = "/W_01.jsp";
    onload_scroll();

}

function onButtonSelected( target_scene )
{
    var _changeInfo = function()
    {
        upChanger.show( target_scene );
        upWindowObject.scrollTo( 0, 0 );
        setTimeout( function() { gkong.PlaySE( TWL_SHOP_SE_TRANSIT ); }, 200 );
    };
    
    kugi.Transit.changeScene( _changeInfo, WIPE_ANIM_NONE, WIPE_ANIM_UP );
}
//-->
</script>

</head>

<!-- body -->
<body>

<!----- Down Contents ----->

<div class="btn_base button_256x34" id="btnInfo1" shpbtn> 
    <script>if(MessageHeadlines[0].indexOf('[NEW]')==0){
				document.write('<img class="info_new" src="/static/dsi/static/images//new_update/new_s_US_EN.gif">');
			}
    </script>
   	<div class="info_text tx12">
		<span class="_inner">
			<script type="text/JavaScript">document.write(MessageHeadlines[0].replace('[NEW]',''));</script>
		</span>
	</div>
</div>
<div class="btn_base button_256x34" id="btnInfo2" shpbtn> 
    <script>if(MessageHeadlines[1].indexOf('[NEW]')==0){
				document.write('<img class="info_new" src="/static/dsi/static/images//new_update/new_s_US_EN.gif">');
			}
    </script>
   	<div class="info_text tx12">
		<span class="_inner">
			<script type="text/JavaScript">document.write(MessageHeadlines[1].replace('[NEW]',''));</script>
		</span>
	</div>
</div>
<div class="btn_base button_256x34" id="btnInfo3" shpbtn> 
    <script>if(MessageHeadlines[2].indexOf('[NEW]')==0){
				document.write('<img class="info_new" src="/static/dsi/static/images//new_update/new_s_US_EN.gif">');
			}
    </script>
   	<div class="info_text tx12">
		<span class="_inner">
			<script type="text/JavaScript">document.write(MessageHeadlines[2].replace('[NEW]',''));</script>
		</span>
	</div>
</div>
<a href="/W_01.jsp">
<div class="btn_base button_left violet_128x28" id="btnBack" shpbtn>
    <span class="btn_inner tx12 cWhite">Back</span>
</div>
</a>

<!----- Up Contents ----->
<div class="preload" id="up_contents">
    <div>
        <div class="tx16 cTitle page_title">Important Info</div>
        <div class="up_message tx16">
            <div class="vh_middle">Please make a selection.</div>
        </div>
    </div>
	<div>
        <div class="tx16 cTitle page_title">Important Info</div>
        <div class="up_message_scrollable">
            <div class="tx12">
			    <script type="text/JavaScript">
					document.write(MessageHeadlines[0].replace("[NEW]", '<img class="info_new" src="/static/dsi/static/images//new_update/new_s_US_EN.gif"><br>'));
				</script>
                <br>
				<script type="text/JavaScript">
					document.write(MessageContents[0].replace("[NEW]", ''));
				</script>
			</div>
        </div>
    </div>
	<div>
        <div class="tx16 cTitle page_title">Important Info</div>
        <div class="up_message_scrollable">
            <div class="tx12">
			    <script type="text/JavaScript">
					document.write(MessageHeadlines[1].replace("[NEW]", '<img class="info_new" src="/static/dsi/static/images//new_update/new_s_US_EN.gif"><br>'));
				</script>
                <br>
				<script type="text/JavaScript">
					document.write(MessageContents[1].replace("[NEW]", ''));
				</script>
			</div>
        </div>
    </div>
	<div>
        <div class="tx16 cTitle page_title">Important Info</div>
        <div class="up_message_scrollable">
            <div class="tx12">
			    <script type="text/JavaScript">
					document.write(MessageHeadlines[2].replace("[NEW]", '<img class="info_new" src="/static/dsi/static/images//new_update/new_s_US_EN.gif"><br>'));
				</script>
                <br>
				<script type="text/JavaScript">
					document.write(MessageContents[2].replace("[NEW]", ''));
				</script>
			</div>
        </div>
    </div>
	</body>
</html>


<style>
	.preload {
		left: 256px;
		display:none !important ;
	}
</style>