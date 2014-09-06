var MAX_X = 8;
var MAX_Y = 8;

var NODE_ID_NONE = 0;
var NODE_ID_WHITE = 1;
var NODE_ID_BLACK = 2;

var nodes;
var targetID;
var curID = NODE_ID_WHITE;

var Coord2D = (function(){
    var obj = function(){};
    obj.prototype = {
	_x : 0,
	_y : 0,
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

var OFFSET = new Coord2D();
var RADIUS = 8.0;
var SIZE = new Coord2D();

function CoordToIdx( x, y )
{
    if( y * MAX_X + x >= MAX_Y * MAX_X ){
	console.debug( "Invalid coord: (x,y)=(" + x + "," + y + ")" );
    }

    return y * MAX_X + x;
}

function reverseNode( nx, ny, id )
{
    var reversableID;

    if( id == NODE_ID_WHITE ){
	reversableID = NODE_ID_BLACK;
    }
    else if( id == NODE_ID_BLACK ){
	reversableID = NODE_ID_WHITE;
    }

    // left
    // neighbor node must be reversable ID
    if( nx > 0 && nodes[ CoordToIdx( nx - 1, ny ) ]._id == reversableID ){
	var x;
	var reverse = false;
	// find same ID
	for( x = nx - 1; x >= 0; --x ){
	    if( nodes[ CoordToIdx( x, ny ) ]._id == NODE_ID_NONE ){
		break;
	    }
	    if( nodes[ CoordToIdx( x, ny ) ]._id == id ){
		reverse = true;
		break;
	    }
	}
	// reverse ID
	if( reverse ){
	    for( var i = x; i < nx; ++i ){
		nodes[ CoordToIdx( i, ny ) ]._id = id;
	    }
	    console.debug( "Reverse X left:" + x + "-" + nx );
	}
    }

    // right
    if( nx < MAX_X - 1 && nodes[ CoordToIdx( nx + 1, ny ) ]._id == reversableID ){
	var x;
	var reverse = false;
	for( x = nx + 1; x < MAX_X; ++x ){
	    if( nodes[ CoordToIdx( x, ny ) ]._id == NODE_ID_NONE ){
		break;
	    }
	    if( nodes[ CoordToIdx( x, ny ) ]._id == id ){
		reverse = true;
		break;
	    }
	}
	if( reverse ){
	    for( var i = x; i > nx; --i ){
		nodes[ CoordToIdx( i, ny ) ]._id = id;
	    }
	    console.debug( "Reverse X right:" + x + "-" + nx );
	}
    }

    // up
    if( ny < MAX_Y - 1 && nodes[ CoordToIdx( nx, ny + 1 ) ]._id == reversableID ){
	var y;
	var reverse = false;
	for( y = ny + 1; y < MAX_Y; ++y ){
	    if( nodes[ CoordToIdx( nx, y ) ]._id == NODE_ID_NONE ){
		break;
	    }
	    if( nodes[ CoordToIdx( nx, y ) ]._id == id ){
		reverse = true;
		break;
	    }
	}
	if( reverse ){
	    for( var i = y; i > ny; --i ){
		nodes[ CoordToIdx( nx, i ) ]._id = id;
	    }
	    console.debug( "Reverse Y up:" + y + "-" + ny );
	}
    }

    // down
    if( ny > 0 && nodes[ CoordToIdx( nx, ny - 1 ) ]._id == reversableID ){
	var y;
	var reverse = false;
	for( y = ny - 1; y >= 0; --y ){
	    if( nodes[ CoordToIdx( nx, y ) ]._id == NODE_ID_NONE ){
		break;
	    }
	    if( nodes[ CoordToIdx( nx, y ) ]._id == id ){
		reverse = true;
		break;
	    }
	}
	if( reverse ){
	    for( var i = y; i < ny; ++i ){
		nodes[ CoordToIdx( nx, i ) ]._id = id;
	    }
	    console.debug( "Reverse Y down:" + y + "-" + ny );
	}
    }
}

function settable( x, y, id )
{
    if( x < 0 || y < 0 || x > MAX_X - 1 || y > MAX_Y - 1 ){
	console.debug( "Out of range: (x,y)=(" + x + "," + y + ")" );
	return false;
    }
    if( nodes[ CoordToIdx( x, y ) ]._id != NODE_ID_NONE ){
	console.debug( "Node already exists: (x,y)=(" + x + "," + y + ")" );
	return false;
    }

    return true;
}

function setNode( x, y, id )
{
    if( !settable( x, y, id ) ){
	return;
    }

    nodes[ CoordToIdx( x, y ) ]._id = id;
    reverseNode( x, y, id );
}

function init( id )
{
    targetID = id;

    OFFSET.set( 20.0, 20.0 );
    SIZE.set( 20.0, 20.0 );

    nodes = new Array();

    for( var y = 0; y < MAX_Y; ++y ){
	for( var x = 0; x < MAX_X; ++x ){
	    var n = new Node();
	    n._id = NODE_ID_NONE;
	    if( x == ( MAX_X / 2 ) ){
		if( y == ( MAX_Y / 2 ) ){
		    n._id = NODE_ID_WHITE;
		}
		else if( y == ( MAX_Y / 2 - 1 ) ){
		    n._id = NODE_ID_BLACK;
		}
	    }
	    else if( x == ( MAX_X / 2 - 1 ) ){
		if( y == ( MAX_Y / 2 ) ){
		    n._id = NODE_ID_BLACK;
		}
		else if( y == ( MAX_Y / 2 - 1 ) ){
		    n._id = NODE_ID_WHITE;
		}
	    }
	    nodes.push( n );
	}
    }

    canvas.addEventListener( 'click', onMouseClicked );

    draw();
}

function pixelToCoord( pv, c )
{
    c._x = Math.floor( ( pv._x + SIZE._x / 2 ) / OFFSET._x );
    c._y = Math.floor( ( pv._y + SIZE._y / 2 )/ OFFSET._y );
}

function onMouseClicked( ev )
{
    var r;
    var mv = new Vector2D();
    var c = new Coord2D();

    r = ev.target.getBoundingClientRect();
    mv._x = ev.clientX - r.left;
    mv._y = ev.clientY - r.top;
    pixelToCoord( mv, c );
    setNode( c._x - 1, c._y - 1, curID );

    draw();

    if( curID == NODE_ID_WHITE ){
	curID = NODE_ID_BLACK;
    }
    else if( curID == NODE_ID_BLACK ){
	curID = NODE_ID_WHITE;
    }
}

function draw()
{
    var canvas = document.getElementById( targetID );
    
    if( canvas == null ){
	return false;
    }

    var context = canvas.getContext( '2d' );

    context.rect( 0, 0, 1000, 1000 );
    context.fillStyle = "rgb(255,255,255)";
    context.fill();

    for( var y = 0; y < MAX_Y; ++y ){
	for( var x = 0; x < MAX_X; ++x ){
	    switch( nodes[ CoordToIdx( x, y ) ]._id ){
	    case NODE_ID_WHITE:
		drawWhiteCircle( context,
				 OFFSET._x + SIZE._x * x,
				 OFFSET._y + SIZE._y * y,
				 RADIUS );

		break;
	    case NODE_ID_BLACK:
		drawBlackCircle( context,
				 OFFSET._x + SIZE._x * x,
				 OFFSET._y + SIZE._y * y,
				 RADIUS );
		break;
	    case NODE_ID_NONE:
	    default:
		break;
	    }	
	}
    }
}

function drawLine( context, x1, y1, x2, y2 )
{
    context.beginPath();
    context.moveTo( x1, y1 );
    context.lineTo( x2, y2 );
    context.closePath();
    context.stroke();
}

function drawWhiteCircle( context, cx, cy, r )
{
    context.beginPath();
    context.arc( cx, cy, r, 0, Math.PI * 2, false );
    context.stroke();
}

function drawBlackCircle( context, cx, cy, r )
{
    context.beginPath();
    context.arc( cx, cy, r, 0, Math.PI * 2, false );
    context.fillStyle = "rgb(0,0,0)"
    context.fill();
}