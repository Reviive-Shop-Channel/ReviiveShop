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

//========================================
// base.js
//========================================
/* ---------- define ---------- */
//-- define : SE No. (refer to sound_data.sadl)
var TWL_SHOP_SE_ONMOUSEDOWN   =  16; // #define TWL_CMN_SE_TOUCH        16 // 16 // 20
var TWL_SHOP_SE_ONCLICK       =  17; // #define TWL_CMN_SE_DECIDE       17 // 17 // 19
var TWL_SHOP_SE_TRANSIT       =  37; // #define TWL_SHP_SE_LOADED       37 // 35 // 17
var TWL_SHOP_SE_INVALID       =  23; // #define TWL_CMN_SE_INVALID      23 // 23 // NEW
var TWL_SHOP_SE_WARNING       =  36; // #define TWL_SHP_SE_WARNING_PAGE 36 // 34 // NEW

//-- define : keyboard kinds & types of field (see Kong::KbdActive)
var KBD_KIND_TEN          = 0;
var KBD_KIND_QWERTY       = 1;
var KBD_KIND_NO_JAPANESE  = 2;
var KBD_KIND_JAPANESE     = 3;

var KBD_FIELD_NORMAL      = 0;
var KBD_FIELD_4444        = 1;

//-- define : wipe animation types of transition (see Kong::SetTransition)
var WIPE_ANIM_NONE        = 0;
var WIPE_ANIM_TRANS       = 1;
var WIPE_ANIM_TRANS_LEFT  = 2;
var WIPE_ANIM_TRANS_RIGHT = 3;
var WIPE_ANIM_LEFT        = 4;
var WIPE_ANIM_RIGHT       = 5;
var WIPE_ANIM_DOWN        = 6;
var WIPE_ANIM_UP          = 7;
var WIPE_ANIM_OVER_LEFT   = 8;
var WIPE_ANIM_OVER_RIGHT  = 9;

//-- wait maybe required... if no wait, button images will not change before the wipe animation.
var WAIT_FOR_SETURL           = 200;


/* ---------- debug ---------- */
function historyBack() {
	//hideScrollButton();
	setTimeout( function() {
            gkong.SetTransition(WIPE_ANIM_TRANS, WIPE_ANIM_TRANS);
			upWindowObject.history.back();
			downWindowObject.history.back();
	} , WAIT_FOR_SETURL);
}

function dPrint(t) {
	// gkong.print("[[ dPrint ]] " + t + " ---- " + gDebugCounter)
	gkong.print("[[ dPrint ]] " + t );
}

/* ---------- scroll buttons ---------- */
function hideScrollButton() {
    setTimeout ( gkong.HideUpWindowScrollButton, 0 );
}

function showScrollButton() {
	setTimeout ( gkong.ShowUpWindowScrollButton, 0 );
}

/* ---------- onload ---------- */
function onload_scroll() {
	showScrollButton();
	gkong.PlaySE(TWL_SHOP_SE_TRANSIT);
}

function onload_no_scroll() {
	hideScrollButton();
	gkong.PlaySE(TWL_SHOP_SE_TRANSIT);
}

function onload_upWindow() {
	gkong.PlaySE(TWL_SHOP_SE_TRANSIT);
}

/* #### 20080727 #### Added. */
function onload_error_page() {
    clearKeepLoadingIconTimer();
	gkong.HideProgressBar();
	gkong.HideLoadingIcon();
	showScrollButton();
	gkong.PlaySE(TWL_SHOP_SE_WARNING);
}

//This function makes it continue displaying a loading icon.
function onload_please_wait() {
	hideScrollButton();
	keepLoadingIcon( 0 );
}

var gKeepLoadingIconTimer = null;
function keepLoadingIcon( count )
{
    var interval = 500;
    if ( count < 4 )
    {
        gkong.ShowLoadingIcon();
        gKeepLoadingIconTimer = setTimeout( function(){ keepLoadingIcon( ++count ); }, interval );
    }
    else
    {
        clearTimeout( gKeepLoadingIconTimer );
    }
}
function clearKeepLoadingIconTimer()
{
    clearTimeout( gKeepLoadingIconTimer );
    gkong.HideLoadingIcon();
}


/* ---------- restart ---------- */
var WAIT_FOR_RESTART = 300;
function waitRestart()      { setTimeout( function() { gkong.Restart();      }, WAIT_FOR_RESTART ); }
function waitReturnToMenu() { setTimeout( function() { gkong.ReturnToMenu(); }, WAIT_FOR_RESTART ); }

/* ---------- Form ---------- */
function addHiddenParam( formObj, name, value )
{
    if ( typeof formObj != "object" )
        return;
    
    input_obj = document.createElement("input");
    input_obj.type  = "hidden";
    input_obj.name  = name;
    input_obj.value = value;
    formObj.appendChild( input_obj );
}

function addHiddenCommonParams( formObj, includeWeakToken )
{
    if ( typeof formObj != "object" )
        return;
        
    var r = getChachedDeviceInfo();
    if ( typeof r != "object" )
        return;
    
    if (r.accountId != null) {
        addHiddenParam( formObj, "accountId", r.accountId );
    }
    if (r.deviceId != null) {
        addHiddenParam( formObj, "deviceId", r.deviceId );
    }
    if (r.serial != null) {
        addHiddenParam( formObj, "serialNo", r.serial );
    }
    if (r.country != null) {
        addHiddenParam( formObj, "country", r.country );
    }
    if (r.region != null) {
        addHiddenParam( formObj, "region", r.region );
    }
    if (r.userAge != null && r.isParentalControlEnabled) {
        addHiddenParam( formObj, "age", r.userAge );
    }
    if (r.language != null) {
        addHiddenParam( formObj, "language", r.language );
    }
    
    if (includeWeakToken) {
        var weakToken = ec.getWeakToken();
        if (weakToken != null) {
            addHiddenParam( formObj, "token", weakToken );
        }
    }
}

function createPostForm( id, action, target )
{
    var form_obj = $(id);
    if ( form_obj != null )
        return (form_obj);
    
    form_obj = document.createElement("form");
    form_obj.method = "post";
    if ( action != undefined )  form_obj.action = action;
    if ( target != undefined )  form_obj.target = target;
    if ( name != undefined )    form_obj.id     = id;
    
    document.body.appendChild( form_obj );
    
    return( form_obj );
}

function createPostFormWithParams( id, action, params, target )
{
    var form_obj = createPostForm( id, action, target );
    if ( form_obj == null )
        return ( null );
    
    var paramArray = params.split("&");
    var len = paramArray.length;
    for ( var i=0; i < len; i++ )
    {
        var param = paramArray[i];
        var index = param.indexOf("=");
        if (index >= 0) {
        	var name = param.substr(0, index);
        	var value = param.substr(index+1);
        	if (name == "token") {
        	    value = ec.getWeakToken ();
            }
            addHiddenParam( form_obj, name, value );
        }
    }
    
    addHiddenCommonParams( form_obj, false );
    
    return form_obj;
}


function doPostForms( downUrl, params, /* can omit */ upUrl )
{
	var actionUp = null;
	var actionDown = null;
	var formUp = null;
	var formDown = null;
	
	if (downUrl != null && downUrl != "")
	{
    	if (isC01Page(downUrl))
    	{
	    	if (upUrl != null && upUrl != "")
	    	{
			    trace("doPostForms: require top page C-01. reset top page from "+ upUrl +" to C_01_u. ");
		    }
	    	upUrl="C_01_u.jsp";
    	}
    	actionDown = getSecureUrl(downUrl);
    	formDown = createPostFormWithParams("__downForm__", actionDown, params, downWindowName);
	}
	
	if (upUrl != null && upUrl != "")
	{
    	actionUp = getSecureUrl(upUrl);
    	formUp = createPostFormWithParams("__upForm__", actionUp, params, upWindowName);
	}
    
	submitForms( formDown, WIPE_ANIM_TRANS, formUp, WIPE_ANIM_TRANS );
}

function submitForms( formDown, animDown, formUp, animUp )
{
    var isC01 = isC01Page( formDown.getAttribute("action") );
    var loadedC01 = isC01Loaded();

    if ( isC01 == true && loadedC01 == false )
    {
        if ( formUp )
        {
            trace("submitForms: require top page C-01. reset top page from "+ formUp.target +" to C_01_u. ");
        }
        formUp = createPostForm( "__upForm__", getSecureUrl("C_01_u.jsp"), upWindowName );
    }
    
    gkong.ShowLoadingIcon();
    
    var _submit = function()
    {
        if ( animUp == undefined )
            animUp = WIPE_ANIM_TRANS;
        if ( animDown == undefined )
            animDown = WIPE_ANIM_TRANS;
        gkong.SetTransition( animUp, animDown );
        
        if ( typeof formUp == "object" )
        {
            formUp.submit();
        }
        if ( typeof formDown == "object" )
        {
            formDown.submit();
        }
    }
    
    setTimeout( _submit, WAIT_FOR_SETURL );
}

/* ---------- show/hide element ---------- */
function hideElement(element)
{
    var obj = element;
    if (typeof element == "string") {
	   obj = document.getElementById(element);
	}
	if(obj != null) {
		obj.style.display='none';	
	}
}

function showElement(element)
{
    var obj = element;
    if (typeof element == "string") {
	   obj = document.getElementById(element);
	}
	if(obj != null) {
		obj.style.display='';
	}
}
