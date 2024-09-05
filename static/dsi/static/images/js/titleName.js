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


var TitleName;
if ( !TitleName ) TitleName = {};
else if ( typeof TitleName != "object" )
    throw new Error("TitleName already exists and is not an object");

/*
  constructor
*/
TitleName = function(){};

/*
  public function
*/
TitleName.prototype.parseTitleName = function(titleName)
{
    var array            = new Array();
    var regex            = new RegExp("\\[\\[(M|L)\\]\\]","i");
    var div_L            = '<div class="tx16 cBlue h_middle">';
    var div_M            = '<div class="tx12 cBlue h_middle">';
    var end_div          = '</div>';
    var index            = -1;

    if((index = titleName.search(regex)) != -1)
    {   
        // The standard rule for head
        if(index != 0)
        {
            titleName = "[[L]]" + titleName;
        }
        
        var output = "";

        // parse and format
        while((index = titleName.search(regex)) != -1)
        {
            var matchStrings = titleName.match(regex);
            
            // push start div
            if (matchStrings[1]=="L" || matchStrings[1]=="l")
            {
                output += div_L;
            } 
            else if (matchStrings[1]=="M" || matchStrings[1]=="m")
            {
                output += div_M;
            }

            // push contents
            titleName = titleName.substring(index + 5);
            if((next_index = titleName.search(regex)) != -1)
            {
                output += titleName.substring(0, next_index) + "<BR>";
                titleName = titleName.substring(next_index);
            } 
            else 
            {
                output += titleName;
            }

            // push end div
            output += end_div;

        }
    }
    else
    {
        output = div_L + titleName + end_div;
    }
    trace("output : " + output);
    return output;
}
