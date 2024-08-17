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
//  keyboard type
//
var cKT_Default     = 0 ;  // (Default)                           標準タイプ
var cKT_Letter      = 1 ;  // (Letter)                            手紙タイプ
var cKT_Num         = 2 ;  // (Numeric)                           テンキー
var cKT_NoLF        = 3 ;  // (without Line Feed)                 改行のないノーマルタイプ
var cKT_LNoLF       = 4 ;  // (Large text w/o Line Feed)          改行のない大きい文字のノーマルタイプ
var cKT_NoLFS       = 5 ;  // (w/o Line Feed and Sign)            Qwertyのみで、改行と記号ウインドウのないタイプ
var cKT_LNoLFS      = 6 ;  // (Large text w/o Line Feed and Sign) ↑のテキストでかい版
var cKT_NumD        = 7 ;  // (Numeric w Dot)                     ドットつき数字キー
var cKT_LNumD       = 8 ;  // (Large text Numeric w Dot)          ドットつき数字キーデカテキスト
var cKT_NumSep      = 9 ;  // (Numeric w Separator)               セパレータつき数字キー
var cKT_PredictNoLF = 10 ; // (Predict w/o Line Feed)             改行なし変換

var kbd = new wiiKeyboard();

//
//  kbd.call( keyboardtype, limitrow=1, secret=false, title="" )
//
