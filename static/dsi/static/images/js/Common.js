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

try { var gkong = new Kong(); } catch(e){}
function $(e){return document.getElementById(e)}

/*
var upWindowName = "UpWindow";
var downWindowName = "DownWindow";

var instanceName = 'tss';
upWindowName = upWindowName + '.' + instanceName;
downWindowName = downWindowName + '.' + instanceName;

var upWindowObject;
var downWindowObject;
*/

while ( !upWindowObject ) { upWindowObject   = window.open('', upWindowName); }
while ( !downWindowObject ) { downWindowObject   = window.open('', downWindowName); }
