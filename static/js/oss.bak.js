function loadpage()
{
    var wiiShop = new wiiShop();
    const unused = wiiShop.connecting;
}
function startpage()
{
    var keyboard = new wiiKeyboard();
	var keyboard = new wiiKeyboard();
    var sound = new wiiSound();
    var wiiShop = new wiiShop();
    const unused = wiiShop.connecting;
    shop.enableHRP();
    shop.endWaiting;
    wiiShop.setSCARank(1);
    
    sound.playBGM();
}


function showWiiMenu()
{
    shop.returnToMenu();
}

function sendGiftMail(friend, url, msg, mii) {
    wnwc24 = new wiiNwc24();
    wnwc24.sendGiftMailAsync(friend, url, msg, mii);
}

function trace(message) {
    // TODO: should this become an enum of errors for easier localization?
    //trace("An error occurred: " + message);
    //var form;
    //window.location.href = "/trace?msg="+message;
    var iframe = document.createElement('iframe');
    iframe.src = "/trace?msg="+message;
    iframe.width=0;
    iframe.height=0;
    iframe.style = "display:none;";
    document.body.appendChild(iframe);
        //form = document.createElement("p);
        //form.innerHTML = message;
        //document.body.appendChild(form);

}
/*
 *  Copyright 2005-2014 Acer Cloud Technology, Inc.
 *  All Rights Reserved.
 *
 *  This software contains confidential information and
 *  trade secrets of Acer Cloud Technology, Inc.
 *  Use, disclosure or reproduction is prohibited without
 *  the prior express written permission of Acer Cloud
 *  Technology, Inc.
 */

var ec = new ECommerceInterface ();  // only create one per page

var debug = true;
var wii = true;
var opera = true; // set by vcInitPage()
var msie = false; // set by vcInitPage()
var testLicenseTypes = true;

var opName;
var opDesc;
var htmlPath = "/";
var imagesPath = "/static/images/";
var ossPath = "";
var secureOssPath = "";
var ecTimeout = null;
var ecProgressInterval = 1000; // Timeout for checking progress in milliseconds
var useSyncRegistration = false;
var nwcBusyCheckTimer;
var nwcOnSendMailDone = null;

function ECTimeout(timeout, interval)
{
    this.timeout = timeout; // Timeout in milliseconds (to cancel)
    this.noProgressMillis = 0; // Milliseconds for which no progress was made
    this.lastPhase = 0; // Last progress phase
    this.lastDownloadedSize = 0; // Last downloaded size
}

function ecSupportsSession()
{
    return ("setSessionValue" in ec && "getSessionValue" in ec);
}

function showOldPage(page)
{
    var url = null;
    if (ecSupportsSession()) {
    	url = ec.getSessionValue("history." + page);
    } 
    if (url != null) {
        trace("ShowOldPage: going to " + url);
    	top.location=url;
    } else {
    	window.location = page;
    }
}

function doPost(url, params)
{
    trace("doPost(" + url + ", " + params + ")");
    if (url != null && params != null) {
	    var form;
        form = document.getElementById("PostForm");
        if (form == null) {
            form = document.createElement("form");
            form.action = url;
            form.method = "post";
            form.id="PostForm";
            document.body.appendChild(form);
        }

        var formHTML = "";
        var paramArray = params.split("&");
        var i;
        for (i in paramArray) {
            var param = paramArray[i];
            var index = param.indexOf("=");
            if (index >= 0) {
            	var name = param.substr(0, index);
            	var value = param.substr(index+1);
            	if (name == "token") {
            	    value = ec.getWeakToken ();
                }
                formHTML += '<input type="hidden" name="' + name + '" value="' + value + '"/>';
        }
    }
	formHTML += '<div id="post.commonFields"></div>';
        form.innerHTML = formHTML;
        initCommonFields("post.commonFields");     
        form.submit();
    }
}

function clearHistory() {
    if (ecSupportsSession()) {
    	ec.setSessionValue("history.0", null);
    	ec.setSessionValue("history.-1", null);
        ec.setSessionValue("history.B_02.-1", null);
        ec.setSessionValue("history.B_04.-1", null);
        ec.setSessionValue("history.B_05.-1", null);
        ec.setSessionValue("history.B_06.-1", null);
        ec.setSessionValue("history.B_07.-1", null);
        ec.setSessionValue("history.B_09.-1", null);
        ec.setSessionValue("history.B_21.-1", null);
        ec.setSessionValue("history.B_24.-1", null);
        ec.setSessionValue("history.P_04.-1", null);
        ec.setSessionValue("history.P_20.-1", null);
        ec.setSessionValue("history.B_16.-1", null);
        ec.setSessionValue("history.B_17.-1", null);
        ec.setSessionValue("history.B_28.-1", null);
        ec.setSessionValue("history.B_29.-1", null);
        ec.setSessionValue("history.L_04.-1", null);
        ec.setSessionValue("history.B_30.-1", null);
        ec.setSessionValue("history.B_08.-1", null);
        ec.setSessionValue("history.S_16.-1", null);
        ec.setSessionValue("history.S_30.-1", null);
    }
}

function updateHistory()
{
    if (ecSupportsSession() && top == self) {
        // clear that we used showBack
    	ec.setSessionValue("history.showBack", null);

        var currUrl = getCurrentUrl();
        var page = getCurrentPage();

        // don't update manual page history to prevent ShowBack() loop. use ShowBack('0') instead.
        if (page.indexOf("M_01") == 0) {
            return;
        }

        var currPage = "history." + page;
        var lastPage = ec.getSessionValue("history.0");
        ec.setSessionValue(currPage, currUrl);

        if (currPage == lastPage) {
            return;
        }
        ec.setSessionValue("history.-1", lastPage);
        ec.setSessionValue("history.0", currPage);
        trace("lastPage is " + lastPage);
        trace("currPage is " + currPage);
        trace("currUrl is " + currUrl);
        
        // Hack for page B_02's showBack
        if (page.indexOf("B_04") == 0 || page.indexOf("W_03") == 0) {
            ec.setSessionValue("history.B_02.-1", currPage);
        } else if (page.indexOf("B_02") == 0) {
            var B_02Last = ec.getSessionValue("history.B_02.-1");
            ec.setSessionValue("history.-1", B_02Last);
        }
        
        // Hack for page B_04's showBack
        if (page.indexOf("W_01") == 0 || page.indexOf("B_03") == 0 || page.indexOf("B_01") == 0 || page.indexOf("W_03") == 0 || page.indexOf("B_16") == 0 || page.indexOf("B_17") == 0 || page.indexOf("B_27") == 0 || page.indexOf("S_30") == 0  ) {
            ec.setSessionValue("history.B_04.-1", currPage);
        } else if (page.indexOf("B_04") == 0) {
            var B_04Last = ec.getSessionValue("history.B_04.-1");
            ec.setSessionValue("history.-1", B_04Last);
        }
        
        // Hack for page B_05's showBack
        if (page.indexOf("W_01") == 0 || page.indexOf("B_04") == 0 || page.indexOf("B_02") == 0 || page.indexOf("H_01") == 0) {
            ec.setSessionValue("history.B_05.-1", currPage);
        } else if (page.indexOf("B_05") == 0) {
            var B_05Last = ec.getSessionValue("history.B_05.-1");
            ec.setSessionValue("history.-1", B_05Last);
        }

        // Hack for page B_06's showBack
        if (page.indexOf("B_31") == 0 || page.indexOf("B_05") == 0) {
            ec.setSessionValue("history.B_06.-1", currPage);
        } else if (page.indexOf("B_06") == 0) {
            var B_06Last = ec.getSessionValue("history.B_06.-1");
            ec.setSessionValue("history.-1", B_06Last);
        }

        // Hack for page L_04's showBack
        if (page.indexOf("B_24") == 0 || page.indexOf("S_09") == 0 || page.indexOf("B_31") == 0 || page.indexOf("B_05")
 == 0) {
            ec.setSessionValue("history.L_04.-1", currPage);
        } else if (page.indexOf("L_04") == 0) {
            var L_04Last = ec.getSessionValue("history.L_04.-1");
            ec.setSessionValue("history.-1", L_04Last);
        }

        // Hack for page B_07's showBack
        if (page.indexOf("B_31") == 0 || page.indexOf("B_05") == 0 || page.indexOf("H_03") == 0 || page.indexOf("B_24") == 0) {
            ec.setSessionValue("history.B_07.-1", currPage);
        } else if (page.indexOf("B_07") == 0) {
            var B_07Last = ec.getSessionValue("history.B_07.-1");
            ec.setSessionValue("history.-1", B_07Last);	
        }

        // Hack for page B_09's showBack
        if (page.indexOf("W_01") == 0 || page.indexOf("W_03") == 0 || page.indexOf("B_04") == 0 || page.indexOf("H_01") == 0 ) {
            ec.setSessionValue("history.B_09.-1", currPage);
        } else if (page.indexOf("B_02") == 0) {
            // Assumes history for B_02 has been populated
            var B_02Last = ec.getSessionValue("history.-1");
            if (B_02Last != null && B_02Last.indexOf("history.B_04") == 0) {
              // Have B_09 go back to B_04 instead of B_02
	      ec.setSessionValue("history.B_09.-1", B_02Last);
            } else {
              // Have B_09 go back to B_02
	      ec.setSessionValue("history.B_09.-1", currPage);
	    }
        } else if (page.indexOf("B_09") == 0) {
            var B_09Last = ec.getSessionValue("history.B_09.-1");
            ec.setSessionValue("history.-1", B_09Last);
        }
        
        // Hack for page B_21's showBack
        if (page.indexOf("B_04") == 0 || page.indexOf("H_01") == 0 || page.indexOf("W_01") == 0) {
            ec.setSessionValue("history.B_21.-1", currPage);
        } else if (page.indexOf("B_21") == 0) {
            var B_21Last = ec.getSessionValue("history.B_21.-1");
            ec.setSessionValue("history.-1", B_21Last);
        }
        
        // Hack for page B_24's showBack
        if (page.indexOf("B_04") == 0 || page.indexOf("H_01") == 0) {
            ec.setSessionValue("history.B_24.-1", currPage);
        } else if (page.indexOf("B_24") == 0) {
            var B_24Last = ec.getSessionValue("history.B_24.-1");
            ec.setSessionValue("history.-1", B_24Last);
        }
        
        // Hack for page P_04's showBack
        if (page.indexOf("P_02") == 0 || page.indexOf("P_18") == 0 || page.indexOf("P_19") == 0 || page.indexOf("P_20") == 0) {
            ec.setSessionValue("history.P_04.-1", currPage);
        } else if (page.indexOf("P_04") == 0) {
            var P_04Last = ec.getSessionValue("history.P_04.-1");
            ec.setSessionValue("history.-1", P_04Last);
        }
        
        // Hack for page P_20's showBack
        if (page.indexOf("P_21") == 0 || page.indexOf("P_22") == 0) {
            ec.setSessionValue("history.P_20.-1", currPage);
        } else if (page.indexOf("P_20") == 0) {
            var P_20Last = ec.getSessionValue("history.P_20.-1");
            ec.setSessionValue("history.-1", P_20Last);
        }

        // Hack for page B_16's showBack
        if (page.indexOf("B_23") == 0 || page.indexOf("B_27") == 0) {
            ec.setSessionValue("history.B_16.-1", currPage);
        } else if (page.indexOf("B_16") == 0) {
            var B_16Last = ec.getSessionValue("history.B_16.-1");
            ec.setSessionValue("history.-1", B_16Last);
        }
        
        // Hack for page B_17's showBack
        if (page.indexOf("B_23") == 0 || page.indexOf("B_27") == 0) {
            ec.setSessionValue("history.B_17.-1", currPage);
        } else if (page.indexOf("B_17") == 0) {
            var B_17Last = ec.getSessionValue("history.B_17.-1");
            ec.setSessionValue("history.-1", B_17Last);
        }

        // Hack for page B_28's showBack
        if (page.indexOf("B_05") == 0 || page.indexOf("B_08") == 0) {
            ec.setSessionValue("history.B_28.-1", currPage);
        } else if (page.indexOf("B_28") == 0) {
            var B_28Last = ec.getSessionValue("history.B_28.-1");
            ec.setSessionValue("history.-1", B_28Last);
        }

        // Hack for page B_29's showBack
        if (page.indexOf("B_05") == 0 || page.indexOf("B_08") == 0 || page.indexOf("B_28") == 0) {
            ec.setSessionValue("history.B_29.-1", currPage);
        } else if (page.indexOf("B_29") == 0) {
            var B_29Last = ec.getSessionValue("history.B_29.-1");
            ec.setSessionValue("history.-1", B_29Last);
        }

        // Hack for page B_30's showBack
        if (page.indexOf("B_31") == 0 || page.indexOf("B_05") == 0) {
            ec.setSessionValue("history.B_30.-1", currPage);
        } else if (page.indexOf("B_30") == 0) {
            var B_30Last = ec.getSessionValue("history.B_30.-1");
            ec.setSessionValue("history.-1", B_30Last);
        }

        // Hack for page B_08's showBack
        if (page.indexOf("B_31") == 0 || page.indexOf("B_05") == 0 || page.indexOf("H_03") == 0 || page.indexOf("B_24") == 0) {
            ec.setSessionValue("history.B_08.-1", currPage);
        } else if (page.indexOf("B_08") == 0) {
            var B_08Last = ec.getSessionValue("history.B_08.-1");
            ec.setSessionValue("history.-1", B_08Last);
        }

        // Hack for page S_16's showBack
        if (page.indexOf("W_01") == 0 || page.indexOf("S_01") == 0 ) {
            ec.setSessionValue("history.S_16.-1", currPage);
        } else if (page.indexOf("S_16") == 0) {
            var S_16Last = ec.getSessionValue("history.S_16.-1");
            ec.setSessionValue("history.-1", S_16Last);
        }

        // Hack for page S_30's showBack
        if (page.indexOf("W_01") == 0 || page.indexOf("S_01") == 0 ) {
            ec.setSessionValue("history.S_30.-1", currPage);
        } else if (page.indexOf("S_30") == 0) {
            var S_30Last = ec.getSessionValue("history.S_30.-1");
            ec.setSessionValue("history.-1", S_30Last);
        }
    }
}

function getCurrentPage()
{
    var currPath = location.pathname;
    var page = currPath;
    var i = currPath.lastIndexOf("/");
    if (i >= 0) {
        page = currPath.substr(i+1);
    }
    trace("currPath is " + currPath);
    return page;
}

function isHRPDisablePage()
{
    if (isConnectingPage()) {
    	return true;
    }

    var page = getCurrentPage();

    if (page.indexOf("B_09") == 0 || page.indexOf("B_10") == 0
        || page.indexOf("B_13") == 0
        || page.indexOf("S_09") == 0 || page.indexOf("S_10") == 0
        || page.indexOf("S_02") == 0 || page.indexOf("S_06") == 0
        || page.indexOf("B_19") == 0 || page.indexOf("B_22") == 0
        || page.indexOf("B_26") == 0 || page.indexOf("ReportDownload") == 0 ) {
    	return true;
    } else {
    	return false;
    }
}

function cancel()
{
    ec.cancelOperation();
}

function showBack(index)
{
    var lastUrl = null;
    if (ecSupportsSession()) {
    	var lastPage;
    	if (index != null) {
    	    lastPage = ec.getSessionValue("history." + index);
    	} else {
    	    lastPage = ec.getSessionValue("history.-1");
    	}
    	if (lastPage != null) {
    	    lastUrl = ec.getSessionValue(lastPage);
    	} else {
    	    lastUrl = "javascript:showHome()"; /* Default to W_03 if no other pages before this one */
    	}
    	// signal that this is from showBack()
    	ec.setSessionValue("history.showBack", "true");
    } 
    if (lastUrl != null) {
        trace("showBack: last url was " + lastUrl);
    	top.location=lastUrl;
    } else {
     	history.back();
    }
}

function getURLParam(key){
    var uri = decodeURIComponent(location.href);
    var uri_option = uri.split('?')[1];
    
    if ( typeof(uri_option) == 'undefined' ) return "";
    if ( uri_option == "" ) return "";
 
    var params = uri_option.split('&');
    
    for(var i=0 ; i < params.length ; i++ ){
        var pair = params[i].split("=");
        
        if ( pair[0] == key ) {
            return ( typeof(pair[1]) == 'undefined' )? "" : pair[1] ;
        }
    }

    return "";
}



function addParam(url, param, value)
{
    var setParamStr = param + "=" + encodeURIComponent(value);
    if (url.indexOf("?" + param + "=") >= 0 || 
        url.indexOf("&" + param + "=") >= 0) {
        // param already in url
    } else {
        var paramStart = url.indexOf("?");
        if (paramStart >= 0) {
            url = url.substr(0, paramStart+1) + setParamStr + "&" + url.substr(paramStart+1);
        } else {
            url = url + "?" + setParamStr;
        }
    }
    return url;
}

function addCommonParams(url, includeDeviceParams)
{
    var r = ec.getDeviceInfo ();
    var newUrl = url;
    if (typeof(r) == "object") {
        if (r.country != null) {
            newUrl = addParam(newUrl, "country", r.country);
        }
        if (r.region != null) {
            newUrl = addParam(newUrl, "region", r.region);
        }
        trace("isParentalControlEnabled: " + r.isParentalControlEnabled + ", age: " + r.userAge);
        if (r.userAge != null && r.isParentalControlEnabled) {
            newUrl = addParam(newUrl, "age", r.userAge);
        }
        if (r.language != null) {
            newUrl = addParam(newUrl, "language", r.language);
        }

        if (includeDeviceParams) {
            if (r.accountId != null) {
                newUrl = addParam(newUrl, "accountId", r.accountId);
            }
            if (r.deviceId != null) {
                newUrl = addParam(newUrl, "deviceId", r.deviceId);
            }
            if (r.serial != null) {
                newUrl = addParam(newUrl, "serialNo", r.serial);
            }
        }
   }
    
    if(shop.isCompatibleMode){
        newUrl = addParam(newUrl, "rvconly", "true");
    }
    
   return newUrl;
}

function removeSessionId(url)
{
    url = url.replace(/;jsessionid=(.*)\?/, "?");
    return url;
}

function isRelativePath(url)
{
    return (url.indexOf("javascript:") != 0 && 
            url.indexOf("http:") != 0 && 
            url.indexOf("https:") != 0);
}

function showSecurePage(url, replace) {
    gotoPage(url, replace, true);
}

function showPage(url, replace) {
    // If secure page - show secure page (only list pages that need to use secure GET)
    // Pages that need secure POST are not listed here
    if (url.indexOf("L_04") == 0 /* Keyboard */ || 
        url.indexOf("B_10") == 0 /* PurchaseTitle */ ||
        url.indexOf("P_02") == 0 /* Keyboard */ ||
        url.indexOf("W_03") == 0 /* getWeakToken */ ||
        url.indexOf("S_02") == 0 /* Keyboard */ ||
        url.indexOf("S_09") == 0 /* Keyboard */ ||
        url.indexOf("S_14") == 0 /* Keyboard */) {
        gotoPage(url, replace, true);
    } else {
        gotoPage(url, replace, false);
    }
}

function gotoPage(url, replace, secure) {
    // Currently sessions are not used 
    // Keep session id if we need to use sessions
    trace("gotoPage: page " + url);
    url = removeSessionId(url);
    if (url.indexOf("javascript:") != 0) {
        url = url.replace(/&amp;/g, "&");
        url = addCommonParams(url);     
    }
    if (isRelativePath(url)) {
        if (secure) {
            // Make sure to use secure url
            url = secureOssPath + url;
        } else {
            // Make sure to use non-secure url
            url = ossPath + url;
        }
    }
    trace("gotoPage: going to page " + url);
    if (replace) {
        location.replace(url);
    } else {
        top.location=url;
    }
}

function replacePage(url)
{
    showPage(url, true);
}

function showHelp(index)
{
    if (snd && "playBGM" in snd) {
        snd.playBGM();
    }

    // Redirect to different help file
    var isShoppingManualEnabled = "true";
    if (ecSupportsSession()) {
        isShoppingManualEnabled = ec.getSessionValue("isShopManEnabled");
    }

    if (isShoppingManualEnabled == "true") {
        var r = ec.getDeviceInfo();
        var shopAppTitleId = r.titleId;
	      if(shop.isCompatibleMode)
	      {
		  if (r.country == 'KR')
	          {
		      shopAppTitleId = "000700024841424B";
		  }
		  else
		  {
		      shopAppTitleId = "0007000248414241";
		  }
	      }
        showManual(shopAppTitleId);
    } else {
        trace("Error: Shop manual is not uploaded! ");
    }
}

function showWelcome() {
    showCheckBalance("W_01.jsp");
}

function showHome(replace) {
    var giftStatus = null;
    if (ecSupportsSession()) {
        giftStatus = ec.getSessionValue("giftStatus");
    }
    // prevent user going to W_03 if some errors happen in the receiving gift loop
    if (giftStatus == "receiving") {
        goGiftLoop();	
    } else {
        showPage("W_03.jsp", replace);
    }
}

function showPoints()
{
    var currUrl = getCurrentUrl();
    var page = getCurrentPage();
    if (page.indexOf("P_") != 0) {
        ec.setSessionValue("history.P_15.-1", currUrl);
    }

    if (snd && "playBGM" in snd) {
        snd.playBGM();
    }

    var supportsCreditCard = "true";
    if (ecSupportsSession()) {
       	supportsCreditCard = ec.getSessionValue("supportsCreditCard");
    }

    var r = ec.getDeviceInfo ();
    if (typeof(r) == "object") {
        if ((r.country == 'KR' && r.region == 'KOR' && r.language == 'ko') || supportsCreditCard!="true") {
              if(shop.isCompatibleMode)
	      {
		  showPage("P_02_WiiU1st.jsp");
	      }
	      else
	      {
		  showPage("P_02.jsp");
	      }
        } else if (r.country == 'TW' && r.region == 'TWN') {
            showPage("P_06.jsp");
        } else {
	      if(shop.isCompatibleMode)
	      {
		  showPage("P_01_WiiU1st.jsp");
	      }
	      else
	      {
		  showPage("P_01.jsp");
	      }
        }
    } else {
        if (supportsCreditCard=="true") {
              if(shop.isCompatibleMode)
	      {
		  showPage("P_01_WiiU1st.jsp");
	      }
	      else
	      {
		  showPage("P_01.jsp");
	      }
        } else {
              if(shop.isCompatibleMode)
	      {
		  showPage("P_02_WiiU1st.jsp");
	      }
	      else
	      {
		  showPage("P_02.jsp");
	      }
        }
    }
}

function showRating(ratingSystem)
{
    if (snd && "playBGM" in snd) {
        snd.playBGM();
    }

    var ratingUrl;
    if (ratingSystem == 'PEGI' || ratingSystem == 'PEGI.FI' || ratingSystem == 'PEGI.PT') {
        var language;
        var r = ec.getDeviceInfo ();
        if (typeof(r) == "object") {
            language = r.language;
        } else {
            language = 'en';
        }
        ratingUrl = ratingSystem + "_" + language + ".html";
    } else {
        ratingUrl = ratingSystem + ".html";
    }

    var url = addParam("B_07.jsp", "ratingUrl", ratingUrl);
    showPage(url);
}

function showVC()
{
    showPage("B_01.jsp");
}

function showSettings()
{
    showPage("S_01.jsp");
}

function showGamecardScreen()
{
    // showPoints();  // sample
    showPage("S_14.jsp");
}

function showConnectScreen()
{
    // showPoints();  // sample
    showPage("S_16.jsp");
}

function getCurrentUrl()
{
    var method = getMethod();
    var currUrl = location.href;
    var page = getCurrentPage();

    if (method == "POST") {
        var params = getPostParams();
        var secureUrl = getSecureUrl(page);
        currUrl = "javascript:doPost('" + secureUrl + "','" + params + "')";
    }
    return currUrl;
}

//titleId = titles.get(i).titleId
function getIsExceptionOfAnimalCrossing(titleId){
    var isDataTitle = (titleId.substr(0,8) == '00010005');
    var isAnimalCrossing = (titleId.substr(0,14) == '00010000525555');
    return isDataTitle || isAnimalCrossing ;
}
function getIsExceptionOfZeldaSkyward(titleId){
    var isDataTitle = (titleId.substr(0,8) == '00010005');
    var isZeldaSkyward = (titleId.substr(0,14) == '00010000534F55');
    return isDataTitle || isZeldaSkyward ;
}

function getOwnedTitleIds()
{
    var titleIds = new Array();
    var titles = ec.getTitleInfos ();
    var inputHTML = "";
    if (typeof(titles) == "object") {
        trace("Number of owned titles (unfiltered): " + titles.length);
        for (i = 0;  i < titles.length;  ++i) {
            var t = titles.get(i);
            trace("Title is " + t.titleId);
            // Filter out titles that are not managed by the shopping channel 
            // Shopping channel manages titles that have nintendo as a partner ID (0001)
            // and has a personalized ETicket
            if (t != null && t.titleId != null && t.titleId.substr(0,4) == '0001') {
                var hasPersonalizedTicket = getHasPersonalizedTicket(t.titleId);
                var isExceptionOfAnimalCrossing = getIsExceptionOfAnimalCrossing(t.titleId);
                var isExceptionOfZeldaSkyward = getIsExceptionOfZeldaSkyward(t.titleId);
                if (hasPersonalizedTicket && !isExceptionOfAnimalCrossing && !isExceptionOfZeldaSkyward){
                    titleIds.push(t.titleId);
                }
            }
        }
    }

    trace("Number of owned titles: " + titleIds.length);
    return titleIds;
}

function isOwnedAnimalCrossing(){
    return isOwnedSpecificTitle(isAnimalCrossing);
}

function isAnimalCrossing(titleId){
    return (titleId.substr(0,14) == '00010000525555');
}

function isZeldaSkyward(titleId){
    return (titleId.substr(0,14) == '00010000534F55');
}

function isOwnedZeldaSkyward(){
    return isOwnedSpecificTitle(isZeldaSkyward);
}

function isOwnedSpecificTitle(filterFunc)
{
    if(filterFunc == null){
        return true;
    }
    var titles = ec.getTitleInfos();
    if(typeof(titles) == "object") {
        for (i = 0; i < titles.length; ++i) {
            var t = titles.get(i);
            if (t != null && t.titleId != null) {
                if(filterFunc(t.titleId) && getHasPersonalizedTicket(t.titleId)){
                    return true;
                }
            }
        }
    }
    return false;
}

function createPostForm(name, page, includeWeakToken, otherFields)
{
    var form;
    form = document.getElementById(name);
    if (form == null) {
        var url = getSecureUrl(page);
        form = document.createElement("form");
        form.action = url;
        form.method = "get";
        form.id=name;
        document.body.appendChild(form);
    }

    var formHTML = "";
    formHTML += '<div id="' + name + '.commonFields"></div>';
    formHTML += otherFields;
    form.innerHTML = formHTML;
    initCommonFields(name + ".commonFields", includeWeakToken);
    return form;
}

function showOwnedTitles() {
    // Use HTTPS
    trace("showOwnedTitles");

    var inputHTML = "";
    var context = getCurrentPage();
    if (context.indexOf('B_01') == 0) {
        // Coming from B_01, only show owned vc titles
        inputHTML += '<input type="hidden" name="vc" value="true"/>';
    }
    inputHTML += '<input type="hidden" name="owned" value="true"/>';

    var titleIds = getOwnedTitleIds();
    for (i in titleIds)
    {
       inputHTML += '<input type="hidden" name="titleId" value="' + titleIds[i] + '"/>';
    }

    var form = createPostForm("ListOwnedTitlesForm", "B_04.jsp", false, inputHTML);
    form.submit();
}

function showHelpeeRegister() {
    // Use HTTPS
    trace("showHelpeeRegister");

    var inputHTML = "";
    inputHTML += '<input type="hidden" name="callerType" value="Helpee"/>';

    var form = createPostForm("HelpeeRegisterForm", "/helpee", true, inputHTML);
    form.submit();
}

function showHelpeeSuccess() {
    // Use HTTPS
    trace("showHelpeeSuccess");

    var inputHTML = "";
    inputHTML += '<input type="hidden" name="callerType" value="Helpee"/>';

    var form = createPostForm("HelpeeRegisterForm", "S_21.jsp", true, inputHTML);
    form.submit();
}

function showHelperRegister() {
    // Use HTTPS
    trace("showHelperRegister");

    var inputHTML = "";
    inputHTML += '<input type="hidden" name="callerType" value="Helper"/>';

    var form = createPostForm("HelperRegisterForm", "S_18.jsp", true, inputHTML);
    form.submit();
}

function showHelperStatus(page) {
    // Use HTTPS
    trace("showHelperStatus");

    var inputHTML = "";
    inputHTML += '<input type="hidden" name="callerType" value="Helper"/>';

    if (page != null) {
        inputHTML += '<input type="hidden" name="p" value="' + page + '"/>';
    }

    var form = createPostForm("HelperStatusForm", "S_20.jsp", true, inputHTML);
    form.submit();
}

function showSCAConfirm() {
    trace("showSCAConfirm");
    var form = createPostForm("SCAConfirm", "S_22.jsp", true, "");
    form.submit();
}

function cssReport(callerType, helperId, helperIdKind, helpeeId, helpeeIdKind, survey, postalCode) {
	trace("callerType:"+callerType);
	trace("helperId:"+helperId);
	trace("helpeeId:"+helpeeId);
	trace("helperIdKind:"+helperIdKind);
	trace("helpeeIdKind:"+helpeeIdKind);
	trace("survey:"+survey);
	trace("postalCode:"+postalCode);
	
	var progress = ec.reportCSS (callerType, helperId, helperIdKind, helpeeId, helpeeIdKind, survey, postalCode);
	                                                 
	opName  = callerType + " Report CSS";
	opDesc  = callerType + " Report CSS";
	finishOp(opName, opDesc, progress, "onCssReportDone");
}

function cssConfirm(callerType, helperId, helperIdKind, helpeeId, helpeeIdKind, confirmation) {
	trace("callerType:"+callerType);
	trace("helperId:"+helperId);
	trace("helpeeId:"+helpeeId);
	trace("helperIdKind:"+helperIdKind);
	trace("helpeeIdKind:"+helpeeIdKind);
	trace("confirmation:"+confirmation);
	
	var notes = "<CssInfo><Helper><DeviceCode>"+helperId+"</DeviceCode></Helper><Helpee><DeviceCode>"+helpeeId+"</DeviceCode></Helpee></CssInfo> ";
	
	var progress = ec.confirmCSS (callerType,
                                 helperId, helperIdKind,
                                 helpeeId, helpeeIdKind,
                                 confirmation, notes);
	opName  = callerType + " Confirm CSS";
	opDesc  = callerType + " Confirm CSS  " + confirmation;
	finishOp(opName, opDesc, progress, "onCssConfirmDone");
}

function reportTMDDownload(titleId, rdFlag, titlePts)
{
    trace("reportTMDDownload");
    var t = ec.getTitleInfo (titleId);
    var r = ec.getDeviceInfo();
    var isTmdPresent = t.isTmdPresent;
    var url = "ReportDownload.jsp?";
    if (isTmdPresent) {
        var tmdVersion = t.version;
        var inputHTML = "";
        inputHTML += '<input type="hidden" name="titleId" value="' + titleId + '"/>';
        inputHTML += '<input type="hidden" name="tmdVersion" value="' + tmdVersion + '"/>';
        inputHTML += '<input type="hidden" name="SD" value="' + sd + '"/>';
        
        if (typeof(r) == "object") {
            if (r.country != null) {
                url = addParam(url,"country",r.country); 
            }
            if (r.region != null) {
                url = addParam(url,"region",r.region);
            }
            if (r.serial != null) {
                url = addParam(url,"Serial",r.serial);
            }
        }
        if (titlePts == "") {
            titlePts = 0;
        }
        var launchcode = "";
        launchcode = shop.launchCode;
        trace("launchcode :::::::: "+launchcode);
        if(launchcode) {
            var tid = ec.getSessionValue("tid");
            if (tid != null && cmpStrIgnoringCase(tid,titleId)){
                trace("tid :::::::: "+tid);
                url = addParam(url,"launchcode",launchcode);
            }
        }
        var form = createPostForm("ReportTMDDownloadForm", url + "&titleId=" + titleId + "&pt=" + titlePts + "&rd=" + rdFlag, true, inputHTML);
        form.submit();
    }
    return isTmdPresent;
}

function cmpStrIgnoringCase(str1, str2){
    if(str1 == str2){
        return true;
    }else if(str1.toUpperCase() == str2.toUpperCase()){
        return true;
    }else{
        return false;
    }
}


function showManual(titleId, page)
{
    trace("showManual");
    nextUrl = addParam("M_01.jsp", 'titleId', titleId);
    if (page != null && page != '') {
        nextUrl = addParam(nextUrl, 'p', page);
    }
    showPage(nextUrl);
}

// Show titles that are now accessible because the user owns another title
function showAccessibleTitles() {
    // Use HTTPS
    trace("showAccessibleTitles");
 
    var inputHTML = "";
    var context = getCurrentPage();
    if (context.indexOf('B_01') == 0) {
        // Coming from B_01, only show premium vc titles
        inputHTML += '<input type="hidden" name="vc" value="true"/>';
    }
    inputHTML += '<input type="hidden" name="accessible" value="true"/>';

    var titleIds = getOwnedTitleIds();
    for (i in titleIds)
    {
       inputHTML += '<input type="hidden" name="titleId" value="' + titleIds[i] + '"/>';
    }    
    var form = createPostForm("ListAccessibleTitlesForm", "B_04.jsp", false, inputHTML);
    form.submit();
}

function sendMail(transId, titleId, friendIndex, friendName, friendCode, onSendMailDone)
{
	var to = friendIndex;
	
	trace("titleId: "+titleId);
	trace("friendIndex: "+friendIndex);
	trace("friendName: "+friendName);
	trace("friendCode: "+friendCode);
	
	if (ecSupportsSession()) {
		var msg = ec.getSessionValue("giftMessage");
		var params = "/startup?initpage=showGiftReceived&transId=" + transId;
		var miiIdx = parseInt(ec.getSessionValue("selectedMiiIdx"));
		trace("selectedMiiIdx::::"+miiIdx);
		if(miiIdx == NaN) {
			miiIdx =  -1;
		}
		trace("miiIdx::::"+miiIdx);
		var giftStatus = ec.getSessionValue("giftStatus");
		trace("giftStatus:"+giftStatus);
		if (giftStatus == "sending") {
			trace("send gift message to friend " + to + "(" + friendName + ", " + friendCode + ") for title " + titleId + " with params " + params);
			trace(" and message " + msg);
			trace(" and miiIdx " + miiIdx);
			nwc24.sendGiftMailAsync( to, params, msg, miiIdx );
		} else if (giftStatus == "receiving") {
			trace("send return message to friend " + to + "(" + friendName + ", " + friendCode + ") for title " + titleId + ", transId " + transId + " with no params ");
			trace(" and message " + msg);
			trace(" and miiIdx " + miiIdx);
			nwc24.sendReturnMailAsync( to, msg, miiIdx );
		} else {
			trace("gift status is not supported. no message to send to friend " + to + "(" + friendName + ", " + friendCode + ") for title " + titleId + ", transId " + transId);
		}
			
		ec.setSessionValue("giftMessage", null);
		ec.setSessionValue("selectedMiiIdx", null);
		nwcOnSendMailDone = onSendMailDone;
		nwcBusyCheckTimer = setInterval("nwcCheckBusy()", 100);
	} else {
		trace("no message to send to friend " + to + "(" + friendName + ", " + friendCode + ") for title " + titleId + ", transId " + transId);
	}
}

var nwcCheckBusyDebugCount=0;
function nwcCheckBusy() {
  trace("nwcCheckBusy called");
  if(nwc24.isBusy()){
    // TODO: update effect
  }else{
    // FORCE WAIT 30 COUNT
    if(nwcCheckBusyDebugCount < 30){
      nwcCheckBusyDebugCount += 1;
      return;
    }
    trace("sendGiftMailAsync done : mailErrNo = " + nwc24.mailErrNo);
    if(nwcOnSendMailDone != null){
      nwcOnSendMailDone(nwc24.mailErrNo);
      // nwcOnSendMailDone(209000);
    }
    clearInterval(nwcBusyCheckTimer);
    nwcBusyCheckTimer = null;
    nwcOnSendMailDone = null;
  }
}

function showGiftMessageSent(titleId, recipient) {
    // Use HTTPS
    trace("showGiftMessageSent");

    var inputHTML = '<input type="hidden" name="titleId" value="' + titleId + '"/>';
    inputHTML += '<input type="hidden" name="recipient" value="' + recipient + '"/>';
    
    var form = createPostForm("MessageSentForm", "B_26.jsp", true, inputHTML);
    form.submit();
}

function showTitle(titleId) {
    // redirect RVL-HAYA (Photo Channel 1.1) to RVL-HAZA (Photo Dummy Channel)
    if (titleId == "0001000248415941") {
    	titleId = "0001000048415A41";
    }
    showPage("B_05.jsp?titleId=" + titleId);
}

function showGiftTitles() {
    // Use HTTPS
    trace("showGiftTitles");
    var inputHTML = '<input type="hidden" name="gift" value="true"/>';
    var form = createPostForm("ListGiftTitlesForm", "B_04.jsp", true, inputHTML);
    form.submit();
}

function showGiftTrans(transId, passParentalControl)
{
    // Use HTTPS
    trace("showGiftTrans");
    trace("transId=="+transId);
    var inputHTML = '<input type="hidden" name="transId" value="' + transId + '"/>';
    if (passParentalControl != null) {
    	inputHTML += '<input type="hidden" name="passParentalControl" value="true" />';
    }
    var form = createPostForm("ShowGiftTransForm", "B_24.jsp", true, inputHTML);
    form.submit();	
}

function showGameCard(passParentalControl)
{
    // Use HTTPS
    trace("showGameCard");
    var inputHTML = "";
    var number = 0;
    if (ecSupportsSession()) {
	inputHTML += '<input type="hidden" name="cardNumber" value="'+ec.getSessionValue("gameCardNum")+'" />';
    }
    
    if (passParentalControl != null) {
    	inputHTML += '<input type="hidden" name="passParentalControl" value="true" />';
    }
    inputHTML += '<input type="hidden" name="cardType" value="gameCard" />';
    if(shop.isCompatibleMode)
    {
        inputHTML += '<input type="hidden" name="rvconly" value="true" />';
    }
    var form = createPostForm("showGameCardForm", getSecureUrl("B_31.jsp"), true, inputHTML);
    form.submit();	
}

function showGiftUsageTrans(transId)
{
    // Use HTTPS
    trace("showGiftUsageTrans");
    var inputHTML = '<input type="hidden" name="transId" value="' + transId + '"/>';
    var form = createPostForm("ShowGiftTransForm", "H_03.jsp", true, inputHTML);
    form.submit();	
}

function goGiftNext(titleId)
{
    var nextUrl = "W_03.jsp";
    if (ecSupportsSession()) {
        var senderIndex = ec.getSessionValue("senderIndex");
        trace("senderIndex: "+senderIndex);
        var redownloadFlag = ec.getSessionValue("redownloadFlag");
        trace("redownloadFlag: "+redownloadFlag);
        var shopEntryPage = ec.getSessionValue("shopEntryPage");
        trace("shopEntryPage: "+shopEntryPage);
        var firstEntry = ec.getSessionValue("firstEntry");

        if ((firstEntry == null) && (shopEntryPage == "showGiftReceived")) {
            // haven't done the pending gift checking, should go to the gift receiving loop
            firstEntry = "true";
            ec.setSessionValue("firstEntry", "false");
        }

        trace("firstEntry: "+firstEntry);

        //don't go to thankyou message page(B_19) if redownload the gift
        if ((redownloadFlag == "true") && (firstEntry == "true")) {
            goGiftLoop();
            return;
        } else if (redownloadFlag == "false") {
            nextUrl = "B_19.jsp";
            nextUrl = addParam(nextUrl, 'recipient', senderIndex);
            nextUrl = addParam(nextUrl, 'titleId', titleId);
        } else {
            var dataMngBackPage = ec.getSessionValue("dataMngBackPage");
            ec.setSessionValue("dataMngBackPage", null);
            if (dataMngBackPage != "" && dataMngBackPage != null) {
                showDataMng(dataMngBackPage);
            }
            var history = ec.getSessionValue("history.-1");
            if ((history != null) && (history != undefined)){
                if (history.indexOf("H_01")>=0) {
                    showBack();
                    return;
                } else {
                    nextUrl = "W_03.jsp";
                }
            } else {
                nextUrl = "W_03.jsp";
            }
        }
        ec.setSessionValue("senderIndex", null);
        ec.setSessionValue("redownloadFlag", null);
    }
    showPage(nextUrl);
}


function goGiftLoop()
{
    var giftListSize = 0;
    if (ecSupportsSession()) {
        var size = ec.getSessionValue("giftListSize");
        var dataMngBackPage = ec.getSessionValue("dataMngBackPage");
        if (size!=null)
            giftListSize = parseInt(size);
        
        // clean up session variables in each loop
        ec.setSessionValue("giftStatus", null);
        ec.setSessionValue("redownloadFlag", null);
        ec.setSessionValue("senderIndex", null);
        ec.setSessionValue("transId", null);
        ec.setSessionValue("transType", null);
        ec.setSessionValue("giftAction", null);
        ec.setSessionValue("dataMngBackPage", null);
    }
    if (dataMngBackPage != "" && dataMngBackPage != null) {
        showDataMng(dataMngBackPage);
    }
    trace("giftListSize: "+giftListSize);
    if (giftListSize <= 0) {
        if (ecSupportsSession()) {
            ec.setSessionValue("giftListSize", null);
        }
        var initialPage = getInitialPage();
        if (initialPage != null) {
            setInitialPage(null);
            showPage(initialPage);
        } else {
            var history = ec.getSessionValue("history.-1");
            if ((history != null) && (history != undefined)) {
                if (history.indexOf("H_01")>=0) {
                    showBack();
                } else {
                    showPage("W_01.jsp");
                }
            } else {
                showPage("W_01.jsp");
            }
        }
    } else {
        showGiftTitles();
    }
}

function showTransactions(page) {
    // Use HTTPS
    trace("showTransactions");
    var inputHTML = "";
    if (page != null) {
        inputHTML += '<input type="hidden" name="p" value="' + page + '"/>';
    }
    initCommonFields("H_01.commonFields");

    var form = createPostForm("ListTransForm", "H_01.jsp", true, inputHTML);
    form.submit();
}

function showReceipt(transactionId, transType) {
    // Use HTTPS
    trace("showReceipt: " + transactionId + ", " + transType);
    var inputHTML = '<input type="hidden" name="transId" value="' + transactionId + '"/>';
    inputHTML += '<input type="hidden" name="transType" value="' + transType + '"/>';
    var form = createPostForm("ReceiptForm", "H_02.jsp", true, inputHTML);
    form.submit();
}

function showCssTrans(transactionId) {
    // Use HTTPS
    trace("showCssTrans: " + transactionId);
    var inputHTML = '<input type="hidden" name="transId" value="' + transactionId + '"/>';
    var form = createPostForm("ReceiptForm", "H_04.jsp", true, inputHTML);
    form.submit();
}

function showCheckBalance(next)
{
    // Use HTTPS
    trace("showCheckBalance " + next);
    var inputHTML = "";
    if (next != null) {
        inputHTML += '<input type="hidden" name="next" value="' + encodeURIComponent(next) + '"/>';
    }
    var form = createPostForm("CheckBalanceForm", "CheckBalance.jsp", true, inputHTML);
    form.submit();
}

function isConnectingToServer()
{
    if (ecSupportsSession()) {
        var connecting = ec.getSessionValue("connecting"); 
        if (connecting == "true") {
           return true;
        }
    }
    
    return false;    
}

function setConnectingToServer(connecting)
{
    if (ecSupportsSession()) {
        if (connecting) {
            ec.setSessionValue("connecting", "true");
            wiiDisableHRP();
            wiiStartWaiting();
        } else {
            ec.setSessionValue("connecting", "false");
            wiiEnableHRP();
            wiiStopWaiting();
        }
    }
}

function isCheckRegisterNeeded()
{
    if (ecSupportsSession()) {
        var accountInvalid = ec.getSessionValue("accountInvalid"); 
        if (accountInvalid == "true") {
           return true;
        }
    }
    
    return false;    
}

function setCheckRegisterNeeded(checkNeeded)
{
    if (ecSupportsSession()) {
        if (checkNeeded) {
            ec.setSessionValue("accountInvalid", "true");            
        } else {
            ec.setSessionValue("accountInvalid", "false");
        }
    }
}

function getShopAppTitleId()
{
    var r = ec.getDeviceInfo();
    var shopAppTitleId = null;
    if (typeof(r) == "object") {
        shopAppTitleId = r.titleId;
    }
    if(shop.isCompatibleMode)
    {
	shopAppTitleId = "0007000248414241";
    }
    return shopAppTitleId;
}

function showCheckRegistered(forceCheck)
{
    trace("showCheckRegistered " + forceCheck);
    // Redirects to CheckRegistered.jsp with important device info	
    var url = "CheckRegistered.jsp";
    var r = ec.getDeviceInfo();
    var shopAppTitleId = getShopAppTitleId();
    if (shopAppTitleId != null) {
        url = url + "?titleId=" + encodeURIComponent(shopAppTitleId);
    }
    
    if (forceCheck) {
        setCheckRegisterNeeded(true);
    }
    
    replacePage(url);
}

function showRegister(action, memberId, password, next)
{
    trace("showRegister");
    // Use HTTPS
    var inputHTML = "";
    if (action != null) {
        inputHTML += '<input type="hidden" name="action" value="' + action + '"/>';
    }
    if (memberId != null) {
        inputHTML += '<input type="hidden" name="loyaltyMemberId" value="' + encodeURIComponent(memberId) + '"/>';
    }
    if (password != null) {
        inputHTML += '<input type="hidden" name="loyaltyPassword" value="' + encodeURIComponent(password) + '"/>';
    }
    if (next != null) {
        inputHTML += '<input type="hidden" name="next" value="' + encodeURIComponent(next) + '"/>';
    }
    var form = createPostForm("RegisterForm", "Register.jsp", false, inputHTML);
    form.submit();
}

function doUnregister()
{
    trace("doUnregister");
    // Use HTTPS
    var inputHTML = "";
    var form = createPostForm("UnregisterForm", "S_10.jsp", false, inputHTML);
    form.submit();
}



function showDataMng(backurl)
{
    if (shop) {
        shop.jumpDataMng(backurl);
    } else {
        showPage("TestSettings.jsp");
    }
}

function isShowUpdateAvailable()
{
    if (shop != null && "returnToUpdate" in shop) {
        return true;
    } else {
        return false;
    }
}

function showUpdate()
{
    if(shop.isCompatibleMode)
    {
	shop.rebootSystem();
    }
    else
    {
    
    if (shop) {
        shop.returnToUpdate();
    } else {
        showPage("404.html");
    }

    }
}

// Default onOpDone
//
function checkProgress(firstTime, operation, description, onDone)
{
    var progress = ec.getProgress();

    currBalance = document.getElementById("currentBalance");
    if(currBalance) {
	    currBalance.innerHTML = getBalance();
    }
                
    if (progress.status == EC_ERROR_NOT_BUSY) {
    	return;
    }

    if (progress.status == EC_ERROR_NOT_DONE) {    
        if (ecTimeout != null) {
            trace(operation + " using timeout " + ecTimeout.timeout);
            trace(operation + " total size " + progress.totalSize);
            trace(operation + " downloaded size " + progress.downloadedSize + " last " + ecTimeout.lastDownloadedSize);
            trace(operation + " phase " + progress.phase + " last " + ecTimeout.lastPhase);
            trace(operation + " no progress millis " + ecTimeout.noProgressMillis);
            if (firstTime) {
                ecTimeout.noProgressMillis = 0;
                ecTimeout.lastDownloadedSize = 0;
                ecTimeout.phase = progress.phase;
            } else {
                var hasProgress = false;
       	        if (progress.totalSize) {
	                // There is a totalSize - see if progress was made
	                hasProgress = (progress.downloadedSize != ecTimeout.lastDownloadedSize);
  	            } else {
  	                hasProgress = (progress.phase != ecTimeout.lastPhase);
	            }
	            if (hasProgress) {
	                ecTimeout.noProgressMillis = 0;
	                ecTimeout.lastDownloadedSize = progress.downloadedSize;
	                ecTimeout.lastPhase = progress.phase;
	            } else {
	                ecTimeout.noProgressMillis += ecProgressInterval;
	            }
                // Don't have timeout for syncetickets (syncing one eticket may take up to 5 seconds)
                if (progress.phase != EC_PHASE_GettingTicketsFromServer) {
		            if (ecTimeout.noProgressMillis >= ecTimeout.timeout) {
                        trace(operation + " has timed out: canceling");
                        ec.cancelOperation();
                    }
                }
            }        
        }
  	    setTimeout ('checkProgress(false,"' + operation + '","' + description
                    + '","' + onDone + '")', ecProgressInterval);
    } else if (progress.status == EC_ERROR_CANCEL_FAILED) {
       trace(operation + " cancel failed");
       var ossErrorCode = getOssErrorCode(progress);
       wiiStopWaiting();
       wiiEnableHRP();
       wiiShowError(ossErrorCode, cET_Server);
    } else {
        eval (onDone+"(progress)");
    }
}

function  onOpDone (progress)
{
    showResult (progress, opName, opDesc);
}

function showResult (progress, operation, description)
{
    if (debug) {
        showProgressResult(progress, operation, description);        
    } 
    trace(operation + " got progress status " + progress.status + ", errCode " + progress.errCode);
    var errDetail = getErrorDetail(progress.status, progress.errCode, progress.errInfo);
    if (errDetail != null) {
        trace(operation + ":" + errDetail);
    }
    if (!isConnectingToServer()) {
        wiiStopWaiting();
    }   
}

function wasOpStarted (progress, msg)
{
     if (progress.status < 0 && progress.status != EC_ERROR_NOT_DONE) {
    	showResult (progress, progress.operation, opDesc);
        return false;
     }
     return true;
}

function finishOp(opName, opDesc, progress, doneFunc)
{
    trace("Doing op " + opName);
    if ( wasOpStarted (progress, opDesc)) {    	
        if (debug) {
            showProgress(true, opName, opDesc, doneFunc);
        } else {
            checkProgress(true, opName, opDesc, doneFunc);
        }
        
        if (!isConnectingToServer()) {
            wiiStartWaiting();
        }
    } else {
        eval(doneFunc+"(progress)");
    }            
}

function getPointsBalance(doneFunc)
{
    var progress;
    if ("checkDeviceStatus" in ec) {
        progress = ec.checkDeviceStatus ();
    } else {
        progress = ec.refreshCachedBalance ();
    }

    opName = "Refresh Points Balance";
    opDesc = "Refreshing Points available for purchases";
    finishOp(opName, opDesc, progress, doneFunc);
}
        
function termsAgreed(nextPage)
{
    if (nextPage == null || nextPage == '') {
        showRegister("register");
    } else {
        showPage(nextPage);
    }
}

function isParentalControlOn(age)
{
    var r = ec.getDeviceInfo ();
    if (typeof(r) == "object") {
    	if (r.isParentalControlEnabled) {
      	    if (r.userAge == null) {
      	        return false;
      	    } else if (age == null) {
    	        return true;
    	    } else {
      	        return age < userAge;
      	    }
    	} else {
            return false;
    	}
    } else {
    	return false;
    }    
}

function isParentalControlPointsOn()
{
    var r = ec.getDeviceInfo ();
    if (typeof(r) == "object") {
    	if (r.netContentRestrictions & SC_NET_CONTENT_RESTRICTION_MASK_SHOPPING) {
      	    return true;
    	} else {
            return false;
    	}
    } else {
    	return false;
    }    
}

function showParentalControlledPage(url, replace)
{
    var parentalControlOn = isParentalControlOn();
    if (parentalControlOn) {
        // Parental control is on - goto parental control page
        showPage("L_04.jsp?next=" + encodeURIComponent(url), replace);
    } else {
        // Parental control is off
        showPage(url, replace);
    }   
}

function checkParentalControlPassword(password)
{
    var r = ec.checkParentalControlPassword (password);
    if (typeof(r) != "boolean") {
        if (r == EC_ERROR_NOT_FOUND) {
            trace("Parental control password is not set");
            return true;
        } else {
            trace("Could not check Parental Control Password");
            return false;
        }
    } else {
        return r;
    }
}
        
// Returns if there is a title update available       
function isTitleUpdateAvailable(titleInfo, latestVersion)
{
    if (typeof(titleInfo) == "object") {
        if (titleInfo.isTmdPresent && latestVersion != null) {
            trace("Title " + titleInfo.titleId + " latest version is " 
                  + latestVersion + ", current version is " + titleInfo.version);
            return (latestVersion > titleInfo.version);
        } else {
            return false;
        } 
    } else {
        return null;
    }
}        

function isTitleOnDevice(titleInfo)
{
    if (typeof(titleInfo) == "object") {
        return titleInfo.isOnDevice;
    } else {
        return null;
    }
}

function getSecureUrl(page)
{
    if (isRelativePath(page)) {
	return secureOssPath + page;
    } else {
	return page;
    }
}

// Returns number of user bytes needed for title
// If there is an update available or the title is not owned
//  then use the title size from the catalog
// Otherwise, the title has been partially downloaded
//  get the remaining size needed from the eclib
function getFsSizeNeeded(titleInfo, catalogTitleSize, latestVersion)
{
    var spaceNeeded = catalogTitleSize;
    if (isTitleUpdateAvailable(titleInfo, latestVersion)) {
        // Update available - use catalog titleSize for space needed
    } else if (typeof(titleInfo) == "object") {
        // No update available - title partly on card
        // get size needed from eclib
        if (titleInfo.isOnDevice) {
            spaceNeeded = 0;
        } else if (titleInfo.isTmdPresent) {
            //spaceNeeded = titleInfo.sizeToDownload;
        }       
    }
    return spaceNeeded;
}
 
// Returns size to download
// If there is an update available or the title is not owned
//  then use the title size from the catalog
// Otherwise, the title has been partially downloaded
//  get the remaining size to download from the eclib
function getSizeToDownload(titleInfo, catalogTitleSize, latestVersion)
{
    var spaceNeeded = catalogTitleSize;
    if (isTitleUpdateAvailable(titleInfo, latestVersion)) {
        // Update available - use catalog titleSize for space needed
    } else if (typeof(titleInfo) == "object") {
        // No update available - title partly on card
        // get size to download from eclib
        if (titleInfo.isTmdPresent) {
            spaceNeeded = titleInfo.sizeToDownload;
        }        
    }
    return spaceNeeded;
}

// Picks a ticket to launch for title        
function getLaunchTicket(titleId)
{
    var tickets = ec.getTicketInfos (titleId);
    var limitedTicket = null;
    if (typeof(tickets) == "object") {
        var n;
        for (n = 0;  n < tickets.length; n++) {
            var ticket = tickets.get(n);
            if (ticket.limits == null || ticket.limits.length == 0) {
                return ticket;
            } else {
                limitedTicket = ticket;
            }               
        }
    } 
        
    return limitedTicket;
}

// Returns whether we have a personalized ticket for title
function getHasPersonalizedTicket(titleId)
{
    // See if we have a personalized ticket for the title
    var tickets = ec.getTicketInfos (titleId);
    trace("getting ticket for title " + titleId);
    if (typeof(tickets) == "object") {
        var n;
        for (n = 0;  n < tickets.length; n++) {
            var ticket = tickets.get(n);
            trace("ticket for title " + titleId + " has deviceId " + ticket.deviceId);
            if (ticket.deviceId != 0) {
            	return true;
            }               
        }
    } 
        
    return false;
}        

// Returns whether we have a limited or unlimited ticket for title
function getTitleLicense(titleId)
{
    // See if we have an unlimited license for the title
    var tickets = ec.getTicketInfos (titleId);
    var hasLimitedTicket = false;
    if (typeof(tickets) == "object") {
        var n;
        for (n = 0;  n < tickets.length; n++) {
            var ticket = tickets.get(n);
            // Only look at personlized tickets
            if (ticket.deviceId != 0) {
                if (ticket.limits == null || ticket.limits.length == 0) {
                    return "Unlimited"
                } else {
                    hasLimitedTicket = true;
                }
            }               
        }
    } 
        
    if (hasLimitedTicket) {
        return "Limited";
    } else {
        return null;
    }       
}        

function getESLicenseType(licenseTypeStr)
{
    return ES_STRING_TO_LICENSE_TYPE[licenseTypeStr];
}

function getTitleTicket(titleId, licenseType)
{
    // Returns ticket for title with the given license type
    var license = licenseType;
    if (typeof(licenseType) == "string") {
        license = getESLicenseType(licenseType);        
    }
    if (license == null) {
        return null;
    }
    var tickets = ec.getTicketInfos (titleId);
    if (typeof(tickets) == "object") {
        var n;
        for (n = 0;  n < tickets.length; n++) {
            var ticket = tickets.get(n);
            // Only look at personlized tickets
            if (ticket.deviceId != 0) {
                if ((ticket.licenseType & ES_LICENSE_MASK) == license) {
                    return ticket;
                }
            }
        }
    } 
    
    return null;
}
        
function getBalance()
{
   return ec.getCachedBalance();
}

function initCommonFields(commonFieldsId, includeWeakToken)
{
    // Common hidden fields for a form
    var commonFields = document.getElementById(commonFieldsId);
    if (commonFields == null) {
        return;
    }

    var r = ec.getDeviceInfo ();
    if (typeof(r) == "object") {    
        var str = '';
        if (r.accountId != null) {
            str = str + '<input type="hidden" name="accountId" value="' + r.accountId + '"/>';
        }
        if (r.deviceId != null) {
            str = str + '<input type="hidden" name="deviceId" value="' + r.deviceId + '"/>';
        }
        if (r.serial != null) {
            str = str + '<input type="hidden" name="serialNo" value="' + r.serial + '"/>';
        }
        if (r.country != null) {
            str = str + '<input type="hidden" name="country" value="' + r.country + '"/>';
        }
        if (r.region != null) {
            str = str + '<input type="hidden" name="region" value="' + r.region + '"/>';
        }
        if (r.userAge != null && r.isParentalControlEnabled) {
            str = str + '<input type="hidden" name="age" value="' + r.userAge + '"/>';
        }
        if (r.language != null) {
            str = str + '<input type="hidden" name="language" value="' + r.language + '"/>';
        }
        
        if (includeWeakToken) {
	        var weakToken = ec.getWeakToken ();
    	    if (weakToken != null) {
        	    str += '<input type="hidden" name="token" value="' + weakToken + '"/>';
	        }
	    }
        commonFields.innerHTML = str;
    } else {
        commonFields.innerHTML = 'error getting device info<BR>';
    }
}

function setLogUrl(url)
{
    if (shop != null) {
        try {
           url = addCommonParams(url);
           shop.getLogUrl = getSecureUrl(url);
        } catch (err) {
        }
    }
}

function postLog(info)
{
    if (info != null) {
	var form;
        form = document.getElementById("LogForm");
        if (form == null) {
            form = document.createElement("form");
            form.action = getSecureUrl("SaveLog.jsp");
            form.method = "post";
            form.id="LogForm";
            document.body.appendChild(form);
        }
    
        var formHTML = "";
        formHTML += '<div id="SaveLog.commonFields"></div>';
        formHTML += '<input type="hidden" name="log" value="' + encodeURIComponent(info) + '"/>';
        form.innerHTML = formHTML;
        initCommonFields("SaveLog.commonFields");
     
        form.submit();
    }
}

// Returns the number of titles downloaded in this session
function getTitlesDownloaded()
{
    var nTitlesDownloaded = null;
    if (ecSupportsSession()) {
        nTitlesDownloaded = ec.getSessionValue("nTitlesDownloaded");
    }
    var n = 0;
    if (nTitlesDownloaded != null) {
    	n = parseInt(nTitlesDownloaded);
    } 
    trace("Downloaded " + n + " titles");
    return n;
}

// Update the number of titles downloaded in this session
function incTitlesDownloaded(titleId)
{
    if (ecSupportsSession()) {
        var n = getTitlesDownloaded();
        if (titleId != "0001000048415A41") {  // ignore HAZA (Photo dummy)
            n = n + 1;
        }
        ec.setSessionValue("nTitlesDownloaded", n.toString());
        trace("Updated downloaded titles to " + n + " titles");
    }
}

// Returns the title to use for F_01 pages
function getF01Title()
{
    if (ecSupportsSession()) {
    	return ec.getSessionValue("F_01.title");
    } else {
    	return null;
    }
}

// Set the title to use for F_01 pages
function setF01Title(title)
{
    if (ecSupportsSession()) {
    	ec.setSessionValue("F_01.title", title);
    }
}

// Show the initial page
// (default is the welcome page, W_01, if no initial page found)
// If checkBalance is set, does check balance before displaying initial page
// If resetToDefault is set, clears the initial page setting after displaying it
function showInitialPage(checkBalance, resetToDefault)
{
    if (resetToDefault == null) { resetToDefault = true; }
    if (checkBalance) {
        showCheckBalance("javascript:showInitialPage(false, " + resetToDefault + ")");
    }  else {
        var initialPage = getInitialPage();
        setSessionState(null);
        clearHistory();
        var giftListSize=0;
        var shopEntryPage;
        var cssWaitingConfirm = "false";
        var scaWaitingActivated = "false";
        if (ecSupportsSession()) {
            var size = ec.getSessionValue("giftListSize");
            cssWaitingConfirm = ec.getSessionValue("cssWaitingConfirm");
            scaWaitingActivated = ec.getSessionValue("scaWaitingActivated");
            giftListSize = parseInt(size);
            shopEntryPage = ec.getSessionValue("shopEntryPage");
        }
        if (shopEntryPage != "showGiftReceived" && cssWaitingConfirm == "true") {
           initialPage = "javascript:showHelpeeRegister()";
           resetToDefault = false;
        } else if (shopEntryPage != "showGiftReceived" && giftListSize > 0) {
           // Show gift pending list first (don't reset to default initial page yet)
           initialPage = "W_04.jsp";
           resetToDefault = false;
        } else if (shopEntryPage != "showGiftReceived" && scaWaitingActivated == "true") {
            initialPage = "javascript:showSCAConfirm()";
            resetToDefault = false;
        } else if (shopEntryPage == "showGiftReceived" && scaWaitingActivated == "true" && initialPage == null) {
            // SCA flow after processing pending gift with channnel jump entry
            initialPage = "javascript:showSCAConfirm()";
            resetToDefault = false;
        } else {
            if (initialPage == null) {
                initialPage = "W_01.jsp";
            }
        }
    
        if (resetToDefault) {
            setInitialPage(null);
        }
        showPage(initialPage);
    }
}

// Returns the initial page to show 
function getInitialPage()
{
    if (ecSupportsSession()) {
    	return ec.getSessionValue("initialPage");
    } else {
    	return null;
    }
}

// Set the initial page to show
function setInitialPage(initialPage)
{
    if (ecSupportsSession()) {
    	ec.setSessionValue("initialPage", initialPage);
    }
}

// Returns the session state
function getSessionState()
{
    if (ecSupportsSession()) {
    	return ec.getSessionValue("state");
    } else {
    	return null;
    }
}

// Set the state
function setSessionState(state)
{
    if (ecSupportsSession()) {
    	ec.setSessionValue("state", state);
    }
}

// Get EULA page
function getEulaUrl()
{
    if (ecSupportsSession()) {
    	return ec.getSessionValue("EULA");
    } else {
    	return null;
    }
}

// Set EULA page
function setEulaUrl(url)
{
    if (ecSupportsSession()) {
	url = addCommonParams(url);
        var path = location.pathname;
        var i = path.lastIndexOf("/");
        if (i >= 0) {
            path = path.substr(0, i+1);
            url = path + url;
        } 
    	ec.setSessionValue("EULA", url);
    }
}

function isSyncETicketNeeded() {
    var r = ec.getDeviceInfo ();
    if (typeof(r) == "object" && r.isNeedTicketSync) {
    	return true;
    } else {
    	return false;
    }
}

function init()
{
    var s = navigator.userAgent.toLowerCase();
    wii = s.indexOf('wii shop channel') + 1;
    opera = s.indexOf('opera') + 1;
    msie = false;
    if (!opera) {
        msie = s.indexOf('msie') + 1;
        wii = false;
    }
    useSyncRegistration = ("getVersion" in ec && "syncRegistration" in ec);
}
				
function extractFromXML(xml, tag)  // parsing tags
{
    if (xml == null) {
        return null;
    }
    var startTag = "<" + tag + ">";
    var endTag = "</" + tag + ">";
    var start = xml.indexOf(startTag);
    var end = xml.indexOf(endTag);
    trace("Beta:  " + start + "  " + end);
    if (start >= 0 && end >= 0) {
        var info = xml.substring(start + startTag.length, end);
        return info; 
    } else {
        return null;
    }           	
}

function isPageJump()
{
	var pageJump = false;
    trace("last page " + ec.getSessionValue("history.-1"));
    trace("shop entry page " + ec.getSessionValue("shopEntryPage"));
    if (ecSupportsSession()) {
    	if ((ec.getSessionValue("history.-1") == null) && 
    		(ec.getSessionValue("shopEntryPage") != null)) {
    		pageJump = true;
    	} 
    } 
    return pageJump;
}

function isFatalError()
{
	var previousPage = ec.getSessionValue("history.-1") ;
	if(previousPage != null && previousPage.indexOf('S_22.jsp') >= 0) {
		return true;
	}

	return false;
}

function encodeHTML(str)
{
    // str = str.replace(/;/g, "&#59;");
    str = str.replace(/&/g, "&amp;");
    str = str.replace(/</g, "&lt;");
    str = str.replace(/>/g, "&gt;");
    str = str.replace(/"/g, "&quot;");
    str = str.replace(/'/g, "&#39;");
    return str;
}

// Get linked loyalty account
function getLoyaltyAccount()
{
    if (ecSupportsSession()) {
    	return ec.getSessionValue("LoyaltyAccount");
    } else {
    	return null;
    }
}

// Set linked loyalty account
function setLoyaltyAccount(loyaltyAccount)
{
    if (ecSupportsSession()) {
    	ec.setSessionValue("LoyaltyAccount", loyaltyAccount);
    }
}

function makeKdown(id)
{
    var scroll_step = 30;
    return function(e){
        var _code = e.keyCode;
        var _obj = document.getElementById(id);
        switch(_code)
        {
            case 175:    //up
            case  38:
                _obj.scrollTop -= scroll_step;
                break;
            case 176:    //down
            case  40:
                _obj.scrollTop += scroll_step;
                break;
        }
    };
}
// Error Check
ossCheck = true;

