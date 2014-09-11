var Coord2D = (function(){
    var obj = function(){};
    obj.prototype = {
	_x : 0,
	_y : 0,
	initialize : function( x, y ){
	    this._x = x;
	    this._y = y;
	},
	set : function( x, y ){
	    this._x = x;
	    this._y = y;
	},
	equal : function( rhs ){
	    return ( this._x == rhs._x ) && ( this._y == rhs._y );
	}
    };
    return obj;
})();

var Vector2D = (function(){
    var obj = function(){};
    obj.prototype = {
	_x : 0.0,
	_y : 0.0
    };
    return obj;
})();

var Node = (function(){
    var obj = function(){};
    obj.prototype = {
	_id : NODE_ID_NONE,
    };
    return obj;
})();

function CoordToIdx( x, y )
{
    if( y * MAX_X + x >= MAX_Y * MAX_X ){
	console.debug( "Invalid coord: (x,y)=(" + x + "," + y + ")" );
    }

    return y * MAX_X + x;
}

