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

/*
  title_manager.js
*/

var TitleManager;
if ( !TitleManager ) TitleManager = {};
else if ( typeof TitleManager != "object" )
    throw new Error("TitleManager already exists and is not an object");

/*
    constructor
*/
TitleManager = function( titleId, titleSize, titleVersion )
{
    /*
        private properties
    */
    function Nand( fs_total, fs_used )
    {
        var FsBlocks = function( total, used )
        {
            this.total = total;
            this.used  = used;
            this.avail = this.total - this.used;
        };
        var TwlBlocks = function( total, used )
        {
            this.total = Math.floor( _fsblock2Twlblock( total ) );
            this.used  = Math.ceil( _fsblock2Twlblock( used ) );
            this.avail = this.total - this.used;
        };
        
        this.fs  = new FsBlocks( fs_total, fs_used );
        this.twl = new TwlBlocks( fs_total, fs_used );
    }
    function Title( fs_size )
    {
        this.fs = fs_size;
        this.twl = Math.ceil( _fsblock2Twlblock( fs_size ) );
    }
    
    var TWL_BLOCK_SIZE        = 128 * 1024;
    var TWL_TMP_FS_BLOCKS     = 1024;   // 16MB
    var TWL_RESERVE_FS_BLOCKS = 64;     // 1MB
    
    var FS_BLOCK_SIZE   = 0;
    var _userArea       = new Nand( 0, 0 );
    var _sysArea        = new Nand( 0, 0 );
    var _newTitle       = new Title( 0 );
    var _currentTitle   = new Title( 0 );
    
    var _deviceInfo = null;
    var _titleInfo  = null;
    
    var _self = this;
    /*
        private methods
    */
    function _fsblock2Twlblock( fs )
    {
        return ( fs * FS_BLOCK_SIZE / TWL_BLOCK_SIZE );
    }
    function _getNeededTitle()
    {
        if ( _self.isUpdate() )
        {
            return ( _newTitle.fs - _currentTitle.fs );
        }
        else if ( _titleInfo.isOnDevice )
        {
            return 0;
        }
        else
        {
            return _newTitle.fs;
        }
    };
    
    /*
        privileged methods
    */
    this.getAvailUserBlocks = function()
    {
        return _userArea.twl.avail;
    };
    this.getNeededTitleBlocks = function()
    {
        return Math.ceil( _fsblock2Twlblock( _getNeededTitle() ) );
    };
    
    // タイトルをダウンロードする空き容量があるかどうかを判定する
    // ダウンロード可能な場合は 0 を
    // 不可能な場合は(ユーザ領域に)必要な空きブロック数を正値で返す
    this.checkDonwloadSpace = function()
    {
        var retval = 0;
        
        if ( _userArea.fs.used + _getNeededTitle() > _userArea.fs.total )
        {
            retval = Math.max( retval, _getNeededTitle() );
        }
        
        if ( _self.isUpdate() )
        {
            
            var sys_used  = _sysArea.fs.used + TWL_TMP_FS_BLOCKS + TWL_RESERVE_FS_BLOCKS;
            var sys_total = _sysArea.fs.total;
            var usr_used  = _userArea.fs.used;
            var usr_total = _userArea.fs.total;
            
            // sys_used が userArea を侵食している場合は、侵食した分を user_used から差し引く
            if ( sys_used > sys_total )
            {
                var usr_over = sys_used - sys_total;
                usr_used -= usr_over;
            }
            
            // update_space = FSi_GetFreeSystemAreaSize()
            var update_space = ( sys_total + usr_total ) - _sysArea.fs.used - usr_used;
            
            if ( _newTitle.fs > update_space )
            {
                var sys_avail = Math.max( _sysArea.fs.total - _sysArea.fs.used, TWL_TMP_FS_BLOCKS + TWL_RESERVE_FS_BLOCKS );
                retval = Math.max( retval, _newTitle.fs - ( sys_avail ) );
            }
            
            //debug
            trace("sys_used:     " + sys_used );
            trace("sys_total:    " + sys_total );
            trace("usr_used:     " + usr_used );
            trace("usr_total:    " + usr_total );
            trace("update_space: " + update_space );
        }
        
        //debug
        trace("retval:       " + retval );
        
        return ( Math.ceil( _fsblock2Twlblock( retval ) ) );
    };
    this.isUpdate = function()
    {
        if ( _titleInfo.isTmdPresent && titleVersion != null )
        {
            return ( titleVersion > _titleInfo.version );
        }
        else
        {
            return false;
        }
    };
    
    /* get functions */
    this.getDeviceInfo = function()
    {
        return _deviceInfo;
    };
    this.getTitleInfo = function()
    {
        return _titleInfo;
    };
    
    /* refresh funcstions */
    this.refreshDeviceInfo = function()
    {
        _deviceInfo = getChachedDeviceInfo();
        //_deviceInfo = ec.getDeviceInfo();
        
        if ( typeof _deviceInfo == "object" )
        {
            FS_BLOCK_SIZE = _deviceInfo.blockSize;
            delete( _newTitle );
            delete( _userArea );
            delete( _sysArea );
            _newTitle = new Title( titleSize / FS_BLOCK_SIZE );
            _userArea = new Nand( _deviceInfo.totalBlocks, _deviceInfo.usedBlocks );
            _sysArea  = new Nand( _deviceInfo.totalSysBlocks, _deviceInfo.usedSysBlocks );
        }
    };
    this.refreshTitleInfo = function()
    {
        _titleInfo = ec.getTitleInfo( titleId );
        
        if ( typeof _titleInfo == "object" )
        {
            delete( _currentTitle );
            _currentTitle = new Title( _titleInfo.occupiedUserBlocks );
        }
    };
    
    /*
        initialize code
    */
    titleId += "";      //typeof titleId is String.
    titleSize -= 0;     //typeof titleSize is Nulber.
    titleVersion -= 0;  //typeof titleVersion is Nulber.
    
    this.refreshDeviceInfo();
    this.refreshTitleInfo();
}
/*
    public methods
*/
// none public methods
