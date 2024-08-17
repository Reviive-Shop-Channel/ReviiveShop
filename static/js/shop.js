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

//
//  shopping channel
//

var shop = new wiiShop() ;

//  shop.title            : Localized strings of "Reviive Shop Channel"
//  shop.menuBtn          : Localized strings of "Wii Menu"
//  shop.retryBtn         : Localized strings of "Try Again"
//  shop.returnToMenu()   : Return to Wii Menu
//  shop.getLogUrl        : The variable is set to the log-get-URL. The default is "http://oss.shop.wii.com/oss/getLog"
//  shop.beginWaiting()   : begin to display the waiting icon.
//  shop.endWaiting()     : end to display the waiting icon.

//  shop.jumpDataMng()    : Jump to Data Management screen in Wii option
//  shop.launchCode()  : Get launch code value
//  shop.returnToUpdate() : Return to Update screen screen in Wii option


//  shop.setWallpaper( wallpaper )  : change the wallpaper on given arg.
var cWP_Dots  = 0 ; // default
var cWP_Black = 1 ; // BLACK SCREEN
var cWP_White = 2 ; // white screen
var cWP_VLine = 3 ; // blue fade line horizontal

//  shop.enableHRP()
//  shop.disableHRP()   : Enable/disable HBM,reset,power-off

//  shop.connecting     : The connecting message strings.
//
//  shop.error( errorcode, errortype ) : jump to local error html.
//
var cET_Internet = 0 ;
var cET_Server   = 1 ;
var cET_Online   = 2 ;

function wiiStartWaiting()
{
    if (shop != null && "beginWaiting" in shop) {
        shop.beginWaiting();
    }
}

function wiiStopWaiting()
{
    if (shop != null && "endWaiting" in shop) {
        shop.endWaiting();
    }
}

function wiiEnableHRP()
{
    if (shop != null && "enableHRP" in shop) {
        shop.enableHRP();
    }
}

function wiiDisableHRP()
{
    if (shop != null && "disableHRP" in shop) {
        shop.disableHRP();
    }
}

function wiiShowError(errCode, errType)
{
    if (shop != null && "error" in shop) {
        shop.error(errCode, errType);
    }
}

function wiiCloseManual()
{
	if ( shop != null && "closeManual" in shop ) {
		shop.closeManual();
	}
	showBack('0');
}

function wiiSetSCARank(scaRank)
{
    if ( shop != null && "setSCARank" in shop ) {
        shop.setSCARank(scaRank);
    }
}

// Error Check
shopCheck = true;
