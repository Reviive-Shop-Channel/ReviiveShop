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
    kugi/Button.js
    
    This module creates only one global symbol called "kugi".
    Next, the object for name space is created and it saves in the "Button" property of a "kugi" object.
    All the utility functions are defined by this name space.
*/

var kugi;
if ( !kugi ) kugi = {};
else if ( typeof kugi != "object" )
    throw new Error("kugi already exists and is not an object");
if ( !kugi.Button ) kugi.Button = {};
else if ( typeof kugi.Button != "object" )
    throw new Error("kugi.Button already exists and is not an object");

kugi.Button = function() {

    /* private const members */
    var TWL_SHOP_SE_ONMOUSEDOWN = 16;
    var TWL_SHOP_SE_ONCLICK     = 17;
    var _eStt_Normal    = 0;
    var _eStt_Selected  = 1;
    
    /* private members */
    var _btns = [];
    var _activeBtn = null;
    var _decideBtn = null;
    var _kong = null;
    var _locked = false;
    var _isPlayedMouseDownSE = false;
    
    /* initialize */
    try {
        _kong = new Kong();
    } catch(e){};
    window.addEventListener('DOMContentLoaded', function(){ _setup(); } , false);
    
    /*
      private functions
    */
    function _setup()
    {
        window.addEventListener('mousedown' , _onMouseDown  , true );
        window.addEventListener('mouseover' , _onMouseOver  , true );
        window.addEventListener('mouseout'  , _onMouseOut   , true );
        window.addEventListener('mouseup'   , _onMouseUp    , true );
        
        var divs = document.evaluate('//div[@shpbtn]', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null );
        var len = divs.snapshotLength;
        for ( var i=0; i<len; i++ )
        {
            kugi.Button.add( divs.snapshotItem(i) );
        }
    }
    
    function _onMouseDown( e )
    {
        var target = _getBtn( e.target );
        if ( target != null )
        {
            if ( _activeBtn   != target &&
                 _decideBtn   != target &&
                 _locked      == false )
            {
                _select( target );
            }
            else
            {
                e.stopPropagation();
            }
        }
    }
    
    function _onMouseOver( e )
    {
        var target = _getBtn( e.target );
        var related = _getBtn( e.relatedTarget );
        
        if ( target != null )
        {
            if ( _activeBtn   == target &&
                 _decideBtn   != target &&
                 related      != target &&
                 _locked      == false )
            {
                _select( target );
            }
            else
            {
                e.stopPropagation();
            }
        }
    }
    
    function _onMouseOut( e )
    {
        var target = _getBtn( e.target );
        var related = _getBtn( e.relatedTarget );
        
        if ( target != null )
        {
            if ( _activeBtn   == target &&
                 _decideBtn   != target &&
                 related      != target &&
                 _locked      == false )
            {
                _unselect( target );
            }
            else
            {
                e.stopPropagation();
            }
        }
    }
    
    function _onMouseUp( e )
    {
        var target = _getBtn( e.target );
        if ( target != null )
        {
            if ( _activeBtn   == target &&
                 _decideBtn   != target &&
                 _locked      == false )
            {
                _decide( target, e );
            }
            else
            {
                e.stopPropagation();
            }
        }
        _activeBtn   = null;
    }
    
    function _decide( btn )
    {
        _resetState();
        kugi.Button.lock();
        if ( _kong )
        {
            _kong.PlaySE( TWL_SHOP_SE_ONCLICK );
            if ( btn.particle &&
                 event &&
                 event.clientX != undefined &&
                 event.clientY != undefined )
            {
                _kong.ShowClickEffect( event.clientX, event.clientY );
            }
        }
        _setBg( btn, _eStt_Selected );
        _decideBtn = btn;
    }
    
    function _select( btn )
    {
        _resetState();
        if ( _kong )
        {
            _kong.PlaySE( TWL_SHOP_SE_ONMOUSEDOWN );
        }
        _setBg( btn, _eStt_Selected );
        _activeBtn   = btn;
        _decideBtn   = null;
    }
    
    function _unselect( btn )
    {
        _resetState();
        _setBg( btn, _eStt_Normal );
    }
    
    function _resetState( all )
    {
        if ( all === true )
        {
            var len = _btns.length;
            for ( var i=0; i<len; i++)
            {
                _setBg( _btns[i], _eStt_Normal );
            }
        }
        else
        {
            if ( _decideBtn != null )
                _setBg( _decideBtn, _eStt_Normal );
            if ( _activeBtn != null )
                _setBg( _activeBtn, _eStt_Normal );
        }
    }
    
    function _setBg( btn, state )
    {
        if ( btn.state != state )
        {
            btn.state = state;
            btn.cell.style.backgroundPosition = "0px " + ( btn.cell.offsetHeight * (-1) * state ) + "px";
        }
    }
    
    function _getBtn( target_obj )
    {
        if ( !target_obj )
            return null;
        
        var len = _btns.length;
        for ( var i=0; i<len; i++)
        {
            if ( _btns[i].base === target_obj )
                return ( _btns[i] );
        }
        
        var parent_node = target_obj.parentNode;
        if ( parent_node != null )
        {
            return ( _getBtn( parent_node ) );
        }
        else
            return null;
    }
    
    return {
    /*
        public functions
    */
    add: function( cell, /* can omit */ base, particle )
    {
        var len = _btns.length;
        for ( var i=0; i<len; i++)
        {
            if ( ( base  && _btns[i].cell === cell && _btns[i].base === base ) ||
                 ( !base && _btns[i].cell === cell && _btns[i].base === cell ) )
            {
                return ( false );
            }
        }
        
        var new_id = _btns.length;
        _btns[ new_id ] = {};
        
        _btns[ new_id ].cell = cell;
        if ( base != undefined )
        {
            _btns[ new_id ].base = base;
        }
        else
        {
            _btns[ new_id ].base = cell;
        }
        
        if ( particle == undefined )
        {
            particle = true;
        }
        _btns[ new_id ].particle = particle;
        
        _btns[ new_id ].state = _eStt_Normal;
        
        return ( true );
    },
    
    remove: function( cell )
    {
        var len = _btns.length;
        for ( var i=0; i<len; i++)
        {
            if ( _btns[i].cell === cell )
            {
                kugi.Button.reset( true );
                _btns.splice( i, 1 );
                return ( true );
            }
        }
        
        return ( false );
    },
    
    reset: function( all )
    {
        _resetState( all );
        kugi.Button.unlock();
        _activeBtn   = null;
        _decideBtn   = null;
    },
    
    lock: function() { _locked = true; },
    unlock: function() { _locked = false; }
    
    }   //end return
}();    //end kugi.Button
