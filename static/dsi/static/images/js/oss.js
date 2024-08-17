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

var opName;
var opDesc;
var htmlPath = "../html";
var imagesPath = "../images";
var ossPath = "";
var secureOssPath = "";
var ecTimeout = null;
var ecProgressInterval = 1000; // Timeout for checking progress in milliseconds
var useSyncRegistration = false;
var deviceInfo = null;
var refreshDeviceInfo = false;

var WAIT_FOR_TOP = 25;
var WAIT_FOR_TOP_LIMIT = 200;
var upWindowTimer;
var waitUpWindowTotal=0;

function getChachedDeviceInfo()
{
  if ( deviceInfo == null || refreshDeviceInfo)
  {
    trace("refresh device info.........");
    deviceInfo = ec.getDeviceInfo();
    refreshDeviceInfo=false;
  } else {
    trace("get device info from cache..........");
  }
  return deviceInfo;
}

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
    	showPage(page);
    }
}

function clearHistory() {
    if (ecSupportsSession()) {
    	ec.setSessionValue("history.0", null);
    	ec.setSessionValue("history.-1", null);
        ec.setSessionValue("history.B_04.-1", null);
        ec.setSessionValue("history.B_05.-1", null);
        ec.setSessionValue("history.B_09.-1", null);
        ec.setSessionValue("history.B_32.-1", null);
    }
}

function updateHistory()
{
    if (ecSupportsSession() && top == self) {
        // clear that we used showBack
    	ec.setSessionValue("history.showBack", null);

    	var method = getMethod();
        var currUrl = location.href;
        currUrl = currUrl.replace("_u.jsp", ".jsp");
        currUrl = currUrl.replace("_d.jsp", ".jsp");

        var currPath = location.pathname;
        currPath = currPath.replace("_u.jsp", ".jsp");
        currPath = currPath.replace("_d.jsp", ".jsp");

        var currSearch = location.search;
        var page = currPath;
        var i = currPath.lastIndexOf("/");
        if (i >= 0) {
            page = currPath.substr(i+1);
        }

        // don't update manual page history to prevent ShowBack() loop. use ShowBack('0') instead.
        // don't update history for up window pages
        if (page.indexOf("M_01") == 0 || page.indexOf("C_01") == 0 ) {
            return;
        }
        
        trace("currPath is " + currPath);
	
	if (method == "POST") {
	    var params = getPostParams();
	    var secureUrl = getSecureUrl(page);
	    currUrl = "javascript:doPostForms('" + secureUrl + "','" + params + "')";
	}
	
        var currPage = "history." + page;
        var lastPage = ec.getSessionValue("history.0");
        ec.setSessionValue(currPage, currUrl);

        if (currPage == lastPage) {
            return;
        }
        ec.setSessionValue("history.-1", lastPage);
        ec.setSessionValue("history.0", currPage);
//        trace("lastPage is " + lastPage);
//        trace("currPage is " + currPage);
//        trace("currUrl is " + currUrl);
        
        // Hack for page B_04's showBack
        if (page.indexOf("W_01") == 0 || page.indexOf("B_01") == 0 || page.indexOf("W_03") == 0 || page.indexOf("B_16") == 0 || page.indexOf("B_17") == 0 || page.indexOf("B_32") == 0) {
            ec.setSessionValue("history.B_04.-1", currPage);
        } else if (page.indexOf("B_04") == 0) {
            var B_04Last = ec.getSessionValue("history.B_04.-1");
            ec.setSessionValue("history.-1", B_04Last);
        }
        
        // Hack for page B_05's showBack
        if (page.indexOf("W_01") == 0 || page.indexOf("B_04") == 0 || page.indexOf("H_01") == 0) {
            ec.setSessionValue("history.B_05.-1", currPage);
        } else if (page.indexOf("B_05") == 0) {
            var B_05Last = ec.getSessionValue("history.B_05.-1");
            ec.setSessionValue("history.-1", B_05Last);
        }

        // Hack for page B_09's showBack
        if (page.indexOf("W_01") == 0 || page.indexOf("B_04") == 0 || page.indexOf("H_01") == 0 ) {
            ec.setSessionValue("history.B_09.-1", currPage);
        } else if (page.indexOf("B_09") == 0) {
            var B_09Last = ec.getSessionValue("history.B_09.-1");
            ec.setSessionValue("history.-1", B_09Last);
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
    return page;
}


function isNoPointsPage()
{
    if (isConnectingPage()) {
    	return true;
    }

    var page = getCurrentPage();

    if (page.indexOf("F_01") == 0 || page.indexOf("F_02") == 0
        || page.indexOf("F_03") == 0
        || page.indexOf("L_01") == 0 || page.indexOf("L_02") == 0
        || page.indexOf("L_03") == 0
        || page.indexOf("S_02") == 0 || page.indexOf("S_04") == 0
        || page.indexOf("S_05") == 0 || page.indexOf("S_06") == 0 || page.indexOf("S_07") == 0 
        || page.indexOf("S_08") == 0 || page.indexOf("S_09") == 0 || page.indexOf("S_10") == 0
        || page.indexOf("W_01") ==0 || page.indexOf("W_02") ==0 || page.indexOf("W_05") ==0
        || page.indexOf("B_10") ==0 || page.indexOf("ReportDownload") ==0 || page.indexOf("B_13") ==0 ) {
    	return true;
    } else {
    	return false;
    }
}

function isHRPDisablePage()
{
    if (isConnectingPage()) {
    	return true;
    }

    var page = getCurrentPage();

    if (page.indexOf("B_09") == 0 || page.indexOf("B_09_dash") == 0 || page.indexOf("B_10") == 0
        || page.indexOf("B_13") == 0
        || page.indexOf("S_09") == 0 || page.indexOf("S_10") == 0
        || page.indexOf("S_02") == 0 || page.indexOf("S_06") == 0) {
    	return true;
    } else {
    	return false;
    }
}

function cancel()
{
    ec.cancelOperation();
}

function isC01Page(page)
{
    if (page.indexOf("B_07") >= 0) {
    	return false;
    } else {
    	return true;
    }
}

function isC01Loaded()
{
    var loadedC01 = false;
    
    if ( ecSupportsSession() )
    {
        var session = ec.getSessionValue("loadedC01");
        if ( session == "true" )
        {
            loadedC01 = true;
        }
    }
    else if ( upWindowObject )
    {
        if ( upWindowObject.document.title == "C-01_u" )
        {
            loadedC01 = true;
        }
    }
    return loadedC01;
}

function isUpWindowLoaded()
{
    var loadedUpWindow;
    
    if ( ecSupportsSession() )
    {
        var session = ec.getSessionValue("loadedUpWindow");
        if ( session == "true" )
        {
            loadedUpWindow = true;
        }
        else
        {
            loadedUpWindow = false;
        }
    }
    else
    {
        trace("Warning! EC does not support a session value. loadedUpWindow return true.");
        loadedUpWindow = true;
    }
    return loadedUpWindow;
}

/*
function loadedUpWindow(showScrollButtons) {
	clearTimeout( upWindowTimer );
	CheckUpWindowFinished(showScrollButtons);
}


function CheckUpWindowFinished(showScrollButtons) {
	if (ecSupportsSession()) {
		var loadedUpWindow = ec.getSessionValue("loadedUpWindow");
		trace("loadedUpWindow================"+waitUpWindowTotal);

		if ( loadedUpWindow=="true" || waitUpWindowTotal >= WAIT_FOR_TOP_LIMIT)
		{
	    		clearTimeout( upWindowTimer );
	    		upWindowObject   = window.open('', upWindowName);
	    		initPage();
	    		
	    		if (waitUpWindowTotal > 0) {
	    			// onload_scroll and onload_no_scroll will play sound
		    		afterChangeDOMforManualTransition(ACD_NO_SE);
		    	}
		    	
		    	if (showScrollButtons == true) {
			    	onload_scroll();
			} else {
				onload_no_scroll();
			}
	    		
	    	} else {
 			if (waitUpWindowTotal == 0) {
				beforeChangeDOMforManualTransition();
			}
	    		waitUpWindowTotal++;
	    		upWindowTimer = setTimeout( "CheckUpWindowFinished("+showScrollButtons+")", WAIT_FOR_TOP );
	    	}
	} else {
		clearTimeout( upWindowTimer );
		initPage();
	}
}
*/

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
        if (lastUrl.indexOf("javascript:") == 0) {
        	lastUrl=lastUrl.replace("javascript:", "");
        	eval(lastUrl);
        } else {
		showPage(lastUrl);
	}
    } else {
     	historyBack();
    }
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
    var r = getChachedDeviceInfo();
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


function showSecurePage(url) {
    gotoPage(url, true);
}

function showPage(urlD, urlU, animD, animU) {
      
    // If secure page - show secure page (only list pages that need to use secure GET)
    // Pages that need secure POST are not listed here    
    if (urlD !=null && urlD != "") {
    	if (urlD.indexOf("L_04") == 0 /* Keyboard */ || 
	    urlD.indexOf("B_10") == 0 /* PurchaseTitle */ ||
	    urlD.indexOf("P_02") == 0 /* Keyboard */ ||
	    urlD.indexOf("W_03") == 0 /* getWeakToken */ ||
	    urlD.indexOf("S_02") == 0 /* Keyboard */ ||
	    urlD.indexOf("S_09") == 0 /* Keyboard */ ) {
    	    gotoPage(urlD, true, urlU, animD, animU);
    	}
    	else {
    	    gotoPage(urlD, false, urlU, animD, animU);
    	}
    } else {
    	gotoPage(urlD, false, urlU, animD, animU);
    }
}

function gotoPage(urlD, secure, urlU, animD, animU) {
    
    gkong.ShowLoadingIcon();
    
    var WAIT_FOR_SETURL = 200;
    var isC01 = isC01Page(urlD);
    
    var _setUrl = function()
    {
        if ( gkong )
            gkong.SetTransition( animU, animD );
        
        trace("urlU = " + urlU );
        trace("urlD = " + urlD );
        if ( urlU != undefined && urlU != null && urlU != "" )
        {
            trace("window.open urlU");
            window.open( urlU, upWindowName);
        }
        if ( urlD != undefined && urlD != null && urlD != "" )
        {
            trace("window.open urlD");
            window.open( urlD, downWindowName);
        }
    };
    
    if (animU == null || animU=="") {
    	animU = WIPE_ANIM_TRANS;
    }
    
    if (animD == null || animD=="") {
    	animD = WIPE_ANIM_TRANS;
    }

    if (urlD != null && urlD != "") {
    	if ( isC01 ) {
	    	if (urlU != null && urlU != "" && urlU != "C_01_u.jsp") {
			trace("gotoPage: require top page C_01_u.jsp. reset top page from "+ urlU +" to C_01_u.jsp. ");
		}
	    	urlU="C_01_u.jsp";
    	}
    }
    
    // Currently sessions are not used 
    // Keep session id if we need to use sessions
    trace("gotoPage: page " + urlU +" and "+urlD);
    urlU = removeSessionId(urlU);
    urlD = removeSessionId(urlD);
    if (urlU != null && urlU != "" && urlU.indexOf("javascript:") != 0) {
        urlU = urlU.replace(/&amp;/g, "&");
        urlU = addCommonParams(urlU);
    }
    if (urlD != null && urlD != "" && urlD.indexOf("javascript:") != 0) {
        urlD = urlD.replace(/&amp;/g, "&");
        urlD = addCommonParams(urlD);
    }
    if (urlU != null && urlU != "" && isRelativePath(urlU)) {
    	if (secure) {
    	    // Make sure to use secure url
    	    urlU = secureOssPath + urlU;
    	} else {
	    // Make sure to use non-secure url
       	    urlU = ossPath + urlU;
       	}    
    }    
    if (urlD != null && urlD != "" && isRelativePath(urlD)) {
    	if (secure) {
    	    // Make sure to use secure url
    	    urlD = secureOssPath + urlD;
    	} else {
	    // Make sure to use non-secure url
       	    urlD = ossPath + urlD;
       	}    
    }
    
    if (urlD != null && urlD != "") {
    	
    	var loadedC01 = isC01Loaded();
        if ( isC01 )
        {
    		// urlU has been initialized to C_01_u at the beginning
    		if ( loadedC01 ) {
    			trace("gotoPage: have loaded C-01. only going to page "+urlD);
    			urlU = null;
    			setTimeout( _setUrl, WAIT_FOR_SETURL );
    		} else {
    			trace("gotoPage: haven't loaded C-01. going to page " + urlU +" and "+urlD);
    			setTimeout( _setUrl, WAIT_FOR_SETURL );
    		}
    	} else {
    		if (urlU == null || urlU == "") {
    			trace("gotoPage: not a C-01 page and top page is not provided. only going to page "+urlD);
    			urlU = null;
    			setTimeout( _setUrl, WAIT_FOR_SETURL );
    		} else {
    			trace("gotoPage: not a C-01 page and top page is provided. going to page " + urlU +" and "+urlD);
    			setTimeout( _setUrl, WAIT_FOR_SETURL );
    		}
    	}
    } else if (urlU != null && urlU != "") {
    	trace("gotoPage: only provide urlU. only going to top page "+urlU);
	    setTimeout( _setUrl, WAIT_FOR_SETURL );
    } else {
    	trace("gotoPage: neither urlU nor urlD is provided. do nothing. ");
    	gkong.HideLoadingIcon();
    }
}


function showHelp(index)
{
    // Redirect to different help file
    var isShoppingManualEnabled = "true";
    if (ecSupportsSession()) {
        isShoppingManualEnabled = ec.getSessionValue("isShopManEnabled");
    }

    if (isShoppingManualEnabled == "true") {
        gkong.ShowLoadingIcon();
        var r = getChachedDeviceInfo();
        var shopAppTitleId = r.titleId;
        showManual(shopAppTitleId);
    } else {
    	trace("Error: Shop manual is not uploaded! ");
    }
}

function showWelcome() {
    showCheckBalance("javascript:showPage('W_01.jsp')");
}

function showHome() {
    showPage("W_03.jsp");
}

function showPoints()
{
    var currUrl = getCurrentUrl();
    ec.setSessionValue("history.P_15.-1", currUrl);

    var supportsCreditCard = "true";
    if (ecSupportsSession()) {
        supportsCreditCard = ec.getSessionValue("supportsCreditCard");
    }

    gkong.ShowLoadingIcon();
    var r = getChachedDeviceInfo();
    if (typeof(r) == "object") {
        if (supportsCreditCard!="true") {
                showPage("P_02.jsp");
        } else if (r.country == 'TW' && r.region == 'TWN') {
                showPage("P_06.jsp");
        } else {
                showPage("P_01.jsp");
        }
    } else {
        if(supportsCreditCard=="true") {
            showPage("P_01.jsp");
        } else {
            showPage("P_02.jsp");
        }
    }
}

function getCurrentUrl()
{
    var method = getMethod();
    var currUrl = location.href;
    var currPath = location.pathname;
    var page = currPath;
    var i = currPath.lastIndexOf("/");
    if (i >= 0) {
        page = currPath.substr(i+1);
    }
    if (method == "POST") {
        var params = getPostParams();
        var secureUrl = getSecureUrl(page);
        currUrl = "javascript:doPostForms('" + secureUrl + "','" + params + "')";
    }
    return currUrl;
}


function showSettings()
{
    showPage("S_01.jsp");
}

function showRating(ratingUrl)
{
    if (ecSupportsSession()) {
        ec.setSessionValue("history.B_07.urlU", ratingUrl);
    }
    gotoPage("B_07.jsp", false, ratingUrl);
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
            if (t != null && t.titleId != null && (t.titleId.substr(0,4) == '0001' || t.titleId.substr(0,4) == '0003')) {
            	var hasPersonalizedTicket = getHasPersonalizedTicket(t.titleId);
            	var isDataTitle = (t.titleId.substr(0,8) == '00010005');
            	if (hasPersonalizedTicket && !isDataTitle)
            	{
	                titleIds.push(t.titleId);
                }
            } 
        }
    }
    
    trace("Number of owned titles: " + titleIds.length);
    return titleIds;
}
/*
function createPostForm(name, page, includeWeakToken, otherFields)
{
    var form;
    form = document.getElementById(name);
    if (form == null) {
    	var url = getSecureUrl(page);
        form = document.createElement("form");
        form.action = url;
        form.method = "post";
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
*/

function showOwnedTitles() {
    // Use HTTPS
    trace("showOwnedTitles");
    
    //Show a loading icon, because getOwnedTitleIds() takes a lot of time.
    gkong.ShowLoadingIcon();
    
    var formDown = createPostForm( "ListOwnedTitlesForm", "B_04.jsp" );
    addHiddenCommonParams( formDown, false );
    addHiddenParam( formDown, "owned", "true" );
    
    var context = getCurrentPage();
    if (context.indexOf('B_01') == 0)
    {
        addHiddenParam( formDown, "vc", "true" );
    }
    
    var titleIds = getOwnedTitleIds();
    var len = titleIds.length;
    for (var i=0; i < len; i++)
    {
        addHiddenParam( formDown, "titleId", titleIds[i] );
    }
    submitForms( formDown );
}

function getTitleVersion(titleInfo){
    if (typeof(titleInfo) == "object" && titleInfo.isTmdPresent) { 
    	return titleInfo.version;
    }  else { 
    	return null; 
    } 
}

function reportTMDDownload( titleId, titleInfo, rdFlag, titlePts ) {
    trace("reportTMDDownload");
    var tmdVersion = getTitleVersion( titleInfo );
    
    if (tmdVersion == null)
    {
        trace("!!!!!!!!!! WARNING !!!!!!!!!!!");
        trace("warning: no tmd version!! skip reportTMDDownload! ");
        trace("!!!!!!!!!! WARNING !!!!!!!!!!!");
        return false;
    }
    else
    {
        AP = ec.getSessionValue("AP");
        if (AP == "") {
            var formDown = createPostForm( "ReportTMDDownloadForm", "ReportDownload.jsp" );
        } else {
            var rcountry = "";
            var rregion = "";
            var rserial = "";
            var r = getChachedDeviceInfo();
            if (typeof(r) == "object") {
                if (r.country != null) {
                    rcountry = r.country;
                }
                if (r.region != null) {
                    rregion = r.region;
                }
                if (r.serial != null) {
                    rserial = r.serial;
                }
            }
            if (titlePts == "") {
                titlePts = 0;
            }
            var formDown = createPostForm( "ReportTMDDownloadForm", "ReportDownload.jsp?region=" + rregion + "&country=" + rcountry + "&titleId=" + titleId + "&pt=" + titlePts + "&ap=" + AP + "&rd=" + rdFlag + "&Serial=" + rserial );
        }
        addHiddenCommonParams( formDown, true );
        addHiddenParam( formDown, "titleId", titleId );
        addHiddenParam( formDown, "tmdVersion", tmdVersion );
        submitForms( formDown );
        return true;
    }
}

function showManual(titleId)
{
    trace("showManual");
    
    ec.setSessionValue("history.manual.urlU", upWindowObject.location.href);
    ec.setSessionValue("history.manual.urlD", getCurrentUrl());
    
    nextUrl = addParam("M_01.jsp", 'titleId', titleId);
    showPage(nextUrl);
}

// Show titles that are now accessible because the user owns another title
function showAccessibleTitles()
{
    // Use HTTPS
    trace("showAccessibleTitles");
    
    var formDown = createPostForm( "ListAccessibleTitlesForm", "B_04.jsp" );
    addHiddenCommonParams( formDown, false );
    addHiddenParam( formDown, "accessible", "true" );
    
    var context = getCurrentPage();
    if (context.indexOf('B_01') == 0)
    {
        // Coming from B_01, only show premium vc titles
        addHiddenParam( formDown, "vc", "true" );
    }
    
    var titleIds = getOwnedTitleIds();
    var len = titleIds.length;
    for (var i=0; i < len; i++)
    {
        addHiddenParam( formDown, "titleId", titleIds[i] );
    }
    submitForms( formDown );
}

function showTitle(titleId) {
    showPage("B_05.jsp?titleId=" + titleId);
}

function showTransactions(param_p, param_vp, anim_u, anim_d)
{
    // Use HTTPS
    trace("showTransactions");
    
    var formDown = createPostForm( "ListTransForm", "H_01.jsp" );
    addHiddenCommonParams( formDown, true );
    if (param_p != null)
    {
        addHiddenParam( formDown, "p", param_p );
    }
    if (param_vp != null)
    {
        addHiddenParam( formDown, "vp", param_vp );
    }
    addHiddenParam( formDown, "ps", 30 );
    submitForms( formDown, anim_d, null, anim_u );
}

function showReceipt(transactionId, transType) {
    // Use HTTPS
    trace("showReceipt: " + transactionId + ", " + transType);
    var formDown = createPostForm( "ReceiptForm", "H_02.jsp" );
    addHiddenCommonParams( formDown, true );
    addHiddenParam( formDown, "transId", transactionId );
    addHiddenParam( formDown, "transType", transType );
    submitForms( formDown );
}

function showCheckBalance(next)
{
    // Use HTTPS
    trace("showCheckBalance " + next);
    var formDown = createPostForm( "CheckBalanceForm", "CheckBalance.jsp" );
    addHiddenCommonParams( formDown, true );
    if ( next != null )
    {
        addHiddenParam( formDown, "next", encodeURIComponent(next) );
    }
    submitForms( formDown );
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
    if (ecSupportsSession())
    {
        if (connecting)
        {
            ec.setSessionValue("connecting", "true");
        }
        else
        {
            ec.setSessionValue("connecting", "false");
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
    var r = getChachedDeviceInfo();
    var shopAppTitleId = null;
    if (typeof(r) == "object") {
        shopAppTitleId = r.titleId;
    }
    return shopAppTitleId;
}

function showCheckRegistered(forceCheck)
{
    trace("showCheckRegistered " + forceCheck);
    // Redirects to CheckRegistered.jsp with important device info	
    var url = "CheckRegistered.jsp";
    var rserail = "";
    var AP = "";
    var shopAppTitleId = getShopAppTitleId();
    if (shopAppTitleId != null) {
        url = url + "?titleId=" + encodeURIComponent(shopAppTitleId);
    }
    var r = getChachedDeviceInfo();
    if (typeof(r) == "object") {
        if (r.serial != null) {
            rserial = r.serial;
        }
    }
    if (rserial != "") {
        url = url + "&Serial=" + rserial;
    }
    if (ecSupportsSession()) {
        AP = ec.getSessionValue("AP");
        trace("AP : " + AP);
    }
    url = url + "&ap=" + AP;
 
    if (forceCheck) {
        setCheckRegisterNeeded(true);
    }
    
    showPage(url);
}

function showRegister(action, memberId, password, next)
{
    trace("showRegister");
    // Use HTTPS
    var formDown = createPostForm( "RegisterForm", "Register.jsp" );
    addHiddenCommonParams( formDown, false );
    if (action != null){
        addHiddenParam( formDown, "action", action );
    }
    if (memberId != null) {
        addHiddenParam( formDown, "loyaltyMemberId", encodeURIComponent(memberId) );
    }
    if (password != null) {
        addHiddenParam( formDown, "loyaltyPassword", encodeURIComponent(password) );
    }
    if (next != null) {
        addHiddenParam( formDown, "next", encodeURIComponent(next) );
    }
    submitForms( formDown );
}

function doUnregister()
{
    trace("doUnregister");
    // Use HTTPS
    var formDown = createPostForm( "UnregisterForm", "S_10.jsp" );
    addHiddenCommonParams( formDown, false );
    submitForms( formDown );
}

function showMenu()
{
    if (gkong) {
		/* #### 20081013 #### Changed from gkong.ReturnToMenu() to waitReturnToMenu(). */
	    // gkong.ReturnToMenu();
	    waitReturnToMenu();
    } else {
        showPage("TestSettings.jsp");
    }   
}

// Default onOpDone
//
function checkProgress(firstTime, operation, description, onDone)
{
    var progress = ec.getProgress();
    var totalSize = progress.totalSize;
    var downloaded = 0;
    
    if (operation == "Purchase Title" || operation == "Download"){
        trace("totalSize:::: "+totalSize);
        if (firstTime) {
            gkong.ShowProgressBar( downloaded, totalSize );
            initPrgMessage();
        }
    }
    
    /*
    currBalance = document.getElementById("currentBalance");
    if(currBalance) {
	currBalance.innerHTML = getBalance();
    }
    */
    showCurrentBalance();

    if (progress.status == EC_ERROR_NOT_DONE)
    { 
        if (operation == "Purchase Title" || operation == "Download") {
            downloaded = progress.downloadedSize;
            trace("downloaded:::: "+downloaded);

            if (progress.phase == EC_PHASE_DownloadingContent  && progress.totalSize > 0)  {
                // only update progress bar when downloading a title
                gkong.UpdateProgressBar( downloaded, totalSize );
            }
        }

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
    trace(operation + " got progress status " + progress.status + ", errCode " + progress.errCode);
    var errDetail = getErrorDetail(progress.status, progress.errCode, progress.errInfo);
    if (errDetail != null) {
        trace(operation + ":" + errDetail);
    }
    if (!isConnectingToServer()) {
        //TODO: wiiStopWaiting();
        if (gkong) {
		gkong.HideLoadingIcon();
	}
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
    refreshDeviceInfo=true;
    if ( wasOpStarted (progress, opDesc)) {
        checkProgress(true, opName, opDesc, doneFunc);
       
        if (!isConnectingToServer()) {
            //TODO: wiiStartWaiting();
            if (gkong) {
		gkong.ShowLoadingIcon();
	    }
        }
    } else {
	eval(doneFunc+"(progress)");
    }            
}

function getPointsBalance(doneFunc, refreshOnly)
{
    trace("in getPointsBalance.....");
    var progress;

    if (refreshOnly == false && "checkDeviceStatus" in ec) {
        progress = ec.checkDeviceStatus ();
    } else {
        progress = ec.refreshCachedBalance ();
    }

    opName = "Refresh Points Balance";
    opDesc = "Refreshing Points available for purchases";
    finishOp(opName, opDesc, progress, doneFunc);
}

function termsAgreed(nextPage, newAgreedVersion)
{
    trace("newAgreedVersion in termsAgreed   "+newAgreedVersion);
    if (newAgreedVersion != null && newAgreedVersion != '') {
    	setNewAgreedEulaVersion(newAgreedVersion);
    }
    
    if (nextPage == null || nextPage == '') {
        showRegister("register");
    } else {
        showPage(nextPage);
    }
}

// Returns the new agreed EULA version 
function getNewAgreedEulaVersion()
{
    if (ecSupportsSession()) {
    	return ec.getSessionValue("newAgreedEulaVersion");
    } else {
    	return null;
    }
}

// Set the new agreed EULA version 
function setNewAgreedEulaVersion(newAgreedVersion)
{
    if (ecSupportsSession()) {
    	ec.setSessionValue("newAgreedEulaVersion", newAgreedVersion);
    }
}


function isParentalControlOn(age)
{
    var r = getChachedDeviceInfo();
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
    var r = getChachedDeviceInfo();
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

function showParentalControlledPage(url)
{
    var parentalControlOn = isParentalControlOn();
    if (parentalControlOn) {
        // Parental control is on - goto parental control page
        showPage("L_04.jsp?next=" + encodeURIComponent(url));
    } else {
        // Parental control is off
        showPage(url);
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
    //trace("getting ticket for title " + titleId);
    if (typeof(tickets) == "object") {
        var n;
        for (n = 0;  n < tickets.length; n++) {
            var ticket = tickets.get(n);
            //trace("ticket for title " + titleId + " has deviceId " + ticket.deviceId);
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
            if (ticket.limits == null || ticket.limits.length == 0) {
                return "Unlimited"
            } else {
                hasLimitedTicket = true;
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
            if ((ticket.licenseType & ES_LICENSE_MASK) == license) {
            	return ticket;
            }
        }
    } 
    
    return null;
}
        
function getBalance()
{
   return ec.getCachedBalance();
}

/*
  Find spans with "currentBalance" class in both window.
  And set a current balance there.
  wabe@NCL
*/
function showCurrentBalance()
{
    var _setCurrentBalance = function( target_window )
    {
        var divs = target_window.document.evaluate("//span[contains(@class, 'currentBalance')]",
                                                   target_window.document,
                                                   null,
                                                   XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
                                                   null );
        var len = divs.snapshotLength;
        for ( var i=0; i<len; i++ )
        {
            divs.snapshotItem(i).innerHTML = getBalance();
        }
    };
    
    _setCurrentBalance( upWindowObject );
    _setCurrentBalance( downWindowObject );
}

/*
function initCommonFields(commonFieldsId, includeWeakToken)
{
    // Common hidden fields for a form
    var commonFields = document.getElementById(commonFieldsId);
    if (commonFields == null) {
        return;
    }

    var r = getChachedDeviceInfo();
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
*/

function postLog(info)
{
    var formDown = createPostForm( "LogForm", getSecureUrl("SaveLog.jsp") );
    addHiddenCommonParams( formDown, false );
    addHiddenParam( formDown, "log", encodeURIComponent(info) );
    submitForms( formDown );
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

function showPointsPromotion() {
    trace("showPointsPromotion");
    var formDown = createPostForm( "PointsPromotionForm", "W_05.jsp" );
    addHiddenCommonParams( formDown, true );
    submitForms( formDown );
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
        if (initialPage == null) {
  	    	initialPage = "W_01.jsp";
        }
    
    	var promotionId = null;
    	var promotionRefillPoints = null;
    	var promotionPrice = null;
    	var promotionCurrency = null;
    	
        if (ecSupportsSession()) {
	        promotionId = ec.getSessionValue("pointsPromotionItemId");
	        promotionRefillPoints = ec.getSessionValue("pointsPromotionRefillPoints");
	        promotionPrice = ec.getSessionValue("pointsPromotionItemPrice");
	        promotionCurrency = ec.getSessionValue("pointsPromotionItemCurrency");
	        trace("promotionId     "+promotionId);
	        trace("promotionRefillPoints    "+promotionRefillPoints);
	        trace("promotionPrice       "+promotionPrice);
	        trace("promotionCurrency          "+promotionCurrency);
        }
        
        if ((promotionId != null && promotionId != '') 
        	&& (promotionRefillPoints != null && promotionRefillPoints != '')
        	&& (promotionPrice != null && promotionPrice != '')
        	&& (promotionCurrency != null && promotionCurrency != ''))
        {
           initialPage = "javascript:showPointsPromotion()";
           resetToDefault = false;
        }
        
        if (resetToDefault) {
            setInitialPage(null);
        }
        
        // populate/update the new user agreed EULA version on W-01
        if (initialPage.indexOf("W_01") == 0) {
            var newAgreedEulaVersion = getNewAgreedEulaVersion();
            trace ("newAgreedEulaVersion: "+newAgreedEulaVersion);
            if (newAgreedEulaVersion != null) {
            	setNewAgreedEulaVersion(null);
            	
            	var formDown = createPostForm( "W01Form", "W_01.jsp" );
		addHiddenCommonParams( formDown, true );
		addHiddenParam( formDown, "agreedEulaVersion", newAgreedEulaVersion );
		submitForms( formDown );
	    } else {
	    	 showPage(initialPage);
	    }
        
        } else {
        	 showPage(initialPage);
        }
        
       
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
    var r = getChachedDeviceInfo();
    if (typeof(r) == "object" && r.isNeedTicketSync) {
    	return true;
    } else {
    	return false;
    }
}

function init()
{
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
    //trace("last page " + ec.getSessionValue("history.-1"));
    //trace("shop entry page " + ec.getSessionValue("shopEntryPage"));
    if (ecSupportsSession()) {
    	if ((ec.getSessionValue("history.-1") == null) && 
    		(ec.getSessionValue("shopEntryPage") != null)) {
    		pageJump = true;
    	} 
    } 
    return pageJump;
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


// Error Check
ossCheck = true;
