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
<html>
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
	
<link rel=stylesheet type="text/css" href="/static/dsi/static/css/common.css">
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
<link rel="stylesheet" type="text/css" href="/static/dsi/static/css/preload.css">
<link rel="stylesheet" type="text/css" href="/static/dsi/static/css/button_base.css"/>
<link rel="stylesheet" type="text/css" href="/static/dsi/static/css/bottom_button.css"/>

<!-- <script language="JavaScript" src="/static/dsi/static/js/Common.js"></script> -->
<script language="JavaScript" src="/static/dsi/static/js/kugi/Button.js"></script>
<script language="JavaScript" src="/static/dsi/static/js/kugi/SceneChanger.js"></script>
<script language="JavaScript" src="/static/dsi/static/js/kugi/Transit.js"></script>

<style type="text/css">
/* ----- */
.button_224x28 {
        width  : 224px;
        height : 28px;
        background-image : url(../static/dsi/static/images/button_autogen/button_224x28_all.gif);
}

.button_48x48 {
        width  : 48px;
        height : 48px;
        background-image : url(../static/dsi/static/images/button_autogen/button_48x48_all.gif);
}

.option_256x28 {
        width  : 256px;
        height : 28px;
        background-image : url(../static/dsi/static/images/button_autogen/option_256x28_all.gif);
}

.button_256x44 {
        width  : 256px;
        height : 44px;
        background-image : url(../static/dsi/static/images/button_autogen/button_256x44_all.gif);
}

#recommendFrame  { position : absolute; left : 0px; top : 0px; }

/* ---- 224x28 ---- */
#btnRecommendList { position : absolute; left :  16px; top :   8px; }

/* ---- 48x48 ---- */
#btnRecommend1 { position : absolute; left :  20px; top :  55px; } 
#btnRecommend2 { position : absolute; left :  76px; top :  55px; } 
#btnRecommend3 { position : absolute; left : 132px; top :  55px; } 
#btnRecommend4 { position : absolute; left : 188px; top :  55px; } 

/* ---- 48x48 ---- */
#soft1 { position : absolute; width  : 48px; height : 48px;}
#soft2 { position : absolute; width  : 48px; height : 48px;}
#soft3 { position : absolute; width  : 48px; height : 48px;}
#soft4 { position : absolute; width  : 48px; height : 48px;}

/* ---- 256x28 ---- */
#btnInfo     { position : absolute; left :   0px; top : 120px; }

/* ---- 256x44 ---- */
#btnShopping { position : absolute; left :   0px; top : 148px; }

/* ---- imgBtn2_child1 : 32x32 ---- */
.recommendPict {
	position : absolute;
	left   :   8px;
	top    :   8px;
	width  :  32px;
	height :  32px;
}

/* ==== W_01_d : parents css ==================== */

/* ---- noClick1 : 38x9 ---- */
#new1 { position : absolute; left :  25px; top :  40px; }
/* ---- noClick2 : 38x9 ---- */
#new2 { position : absolute; left :  81px; top :  40px; }
/* ---- noClick3 : 38x9 ---- */
#new3 { position : absolute; left : 137px; top :  40px; }
/* ---- noClick4 : 38x9 ---- */
#new4 { position : absolute; left : 193px; top :  40px; }


/* ==== W_01_d : children css ==================== */
/* ---- btnShopping_child1 : 24x24 ---- */
.btnShopping_child1 {
	position : absolute;
	left   :   7px;
	top    :   9px;
}
/* ---- btnShopping_child2 : 24x24 ---- */
.btnShopping_child2 {
	position : absolute;
	left   : 225px;
	top    :   9px;
}
/* ---- btnShopping_child3 : 190x21 ---- */
.btnShopping_child3 {
	position : absolute;
	left   :  33px;
	top    :  12px;
	width  : 190px;
	height :  21px;
	text-align : center;
}</style>

<title>Welcome to the Nintendo DSi Shop</title>

<script>
window.addEventListener('DOMContentLoaded', initPage, false );

var filterEnabled = 'true';

var upChanger;

/* TitleInfo object prototype */
function TitleInfo(){}
TitleInfo.prototype.titleId = null;
TitleInfo.prototype.titleImage = null;
TitleInfo.prototype.isNew = false;

function initPage()
{
    initPageCommon();
    
    // "showEula" flag is to prevent showing EULA while in non-entry pages (List Account Activities etc.) which calls CheckBalance.jsp 
    if (ecSupportsSession()) {
    	ec.setSessionValue("showEula", "false");
    }
    
    upChanger		= new kugi.SceneChanger(upWindowObject.$("upBase").children, $("up_contents").children );
    
    // initialize and create Recommended Title List
    var titles = initRecommendedTitles();
    if(titles.length > 0){
        showRecommendedTitles(titles, 4);
    }

    btnRecommendList.onmouseup 	= "showPage('B_04.jsp?rec=true')";
    btnInfo.onmouseup 			= "showPage('W_02.jsp')";
    btnShopping.onmouseup 		= "showPage('W_03.jsp')";

    // attach new image to Information button
    var newflag = false;
    

    {
		
        var Msg = "About the Nintendo DSi Shop";
        if(Msg.indexOf("[NEW]")==0){
            newflag = true;
        }
    }
      
    {
		
        var Msg = "[NEW]Nintendo DSi Shop Has Closed";
        if(Msg.indexOf("[NEW]")==0){
            newflag = true;
        }
    }
      
    {
		
        var Msg = "[NEW]DSi Shop Discontinuation";
        if(Msg.indexOf("[NEW]")==0){
            newflag = true;
        }
    }
      

    if ( newflag )
    {
        $("imgNewInfo").innerHTML = '<img src="/static/dsi/static/images//new_update/new_s_US_EN.gif">&nbsp';
    }
    
    onload_no_scroll();
}

function initRecommendedTitles()
{
    var recList = new Array();
    var title;



    return recList;
}

// Display the title at position pos
function showRecommendedTitle(title, pos)
{
    var softElem = document.getElementById("soft" + pos);
    if (softElem != null && title.titleImage != null) {
        softElem.innerHTML="<img class='recommendPict' src='" + title.titleImage + "'/>";
    } else {
        softElem.innerHTML="";
    }

    $("btnRecommend"+pos).onmouseup = "showPage('B_05.jsp?titleId=" + title.titleId + "')";

    if (title.isNew == "true") {
       showElement("new" + pos);
    } else {
       hideElement("new" + pos);
    }
}

function showRecommendedTitles(titles, max)
{
    var i;
    var j=0;
    var k=0;
    var backupList = new Array();

    // Show recommended titles that we don't own
    for (i = 1; i < titles.length; i++)
    {
        var title = titles[i];

        if (title != null)
        {
        	if (filterEnabled == "true")
        	{
        		title.titleLicense = getTitleLicense(title.titleId);
        		if (title.titleLicense == null)
        		{
        			j++;
        		    showRecommendedTitle(title, j);
        		}
        		else
        		{
        			backupList[k] = title;
        			k++;
        		}
        	}
        	else
        	{
        		j++;
        	    showRecommendedTitle(title, j);
        	}
        }
        if (j >= max)
        {
        	return;
        }
    }
  
    if (filterEnabled == "true" && k > 0)
    {
        // Fill with titles that we do own
        for (i = 0; i < k; i++)
        {
            var title = backupList[i];
            if (title != null && title.titleLicense != null)
            {
                j++;
                showRecommendedTitle(title, j);
            }
            if (j >= max)
            {
                return;
            }
        } 
    }
}
</script>

</head>
<body>

<!-- Up Contents -->
<div class="preload" id="up_contents">
    <div>
        <style type='text/css'>
            /* #### 20080917 #### Changed top & width of #shopWelcomeTitle. */

        #shopWelcomeTitle { position : absolute; left : 0px; top : 76px; width : 248px; height: 40px; text-align : right; }
    </style>
        
        <img class="bg_image" src="/static/dsi/static/images//shopx365_welcomePage.gif">
            <div id='shopWelcomeTitle' class='tx16 cBlue'>
            Nintendo DSi Shop</div>
    </div>
</div>

<img id="recommendFrame" src="/static/dsi/static/images//recommendFrame.gif"/>
<div class="btn_base button_224x28" id="btnRecommendList" shpbtn>
    <span class="btn_inner tx12">
        Recommended Titles</span>
</div>

<a href="/W_02.jsp">
<div class="btn_base option_256x28" id="btnInfo" shpbtn>
    <span class="btn_inner tx16 cImportant">
        <span id="imgNewInfo"></span>
        Important Info</span>
</div>
</a>

<a href="/W_03.jsp">
<div class="btn_base button_256x44" id="btnShopping" shpbtn>
    <img class="btnShopping_child1" src="/static/dsi/static/images//icon_bag.png"/>
    <img class="btnShopping_child2" src="/static/dsi/static/images//icon_bag.png"/>
    <div class="btnShopping_child3">
        <span class="vh_middle tx16 cBlue">
            Start Shopping</span>
    </div>
</div>
</a>

</body>

</html>


<style>
	.preload {
		left: 256px;
		display:none !important ;
	}
</style>