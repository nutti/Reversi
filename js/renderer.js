var MAX_X = 8;
var MAX_Y = 8;

var NODE_ID_NONE = 0;
var NODE_ID_WHITE = 1;
var NODE_ID_BLACK = 2;

var nodes;
var targetID;
var curID = NODE_ID_WHITE;
var reversableNodesIndices = new Array();

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

function checkReversableNodes( nx, ny, id )
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
	    for( var i = x + 1; i < nx; ++i ){
		reversableNodeIndices.push( CoordToIdx( i, ny ) );
//		nodes[ CoordToIdx( i, ny ) ]._id = id;
	    }
	    console.debug( "Reverse X left:" + (x+1) + "-" + nx );
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
	    for( var i = x - 1; i > nx; --i ){
		reversableNodeIndices.push( CoordToIdx( i, ny ) );
//		nodes[ CoordToIdx( i, ny ) ]._id = id;
	    }
	    console.debug( "Reverse X right:" + (x-1) + "-" + nx );
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
	    for( var i = y - 1; i > ny; --i ){
		reversableNodeIndices.push( CoordToIdx( nx, i ) );
//		nodes[ CoordToIdx( nx, i ) ]._id = id;
	    }
	    console.debug( "Reverse Y up:" + (y-1) + "-" + ny );
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
	    for( var i = y + 1; i < ny; ++i ){
		reversableNodeIndices.push( CoordToIdx( nx, i ) );
//		nodes[ CoordToIdx( nx, i ) ]._id = id;
	    }
	    console.debug( "Reverse Y down:" + (y+1) + "-" + ny );
	}
    }

    // left+down
    if( nx > 0 && ny > 0 && nodes[ CoordToIdx( nx - 1, ny - 1 ) ]._id == reversableID ){
	var x;
	var y;
	var reverse = false;
	for( x = nx - 1, y = ny - 1; x >= 0, y >= 0; --x, --y ){
	    if( nodes[ CoordToIdx( x, y ) ]._id == NODE_ID_NONE ){
		break;
	    }
	    if( nodes[ CoordToIdx( x, y ) ]._id == id ){
		reverse = true;
		break;
	    }
	}
	if( reverse ){
	    var i = x + 1;
	    var j = y + 1;
	    for( ; i < nx, j < ny; ++i, ++j ){
		reversableNodeIndices.push( CoordToIdx( i, j ) );
	    }
	    console.debug( "Reverse X-Y left-down:" + (x+1) + "-" + (y+1) );
	}
    }

    // left+up
    if( nx > 0 && ny < MAX_Y - 1 && nodes[ CoordToIdx( nx - 1, ny + 1 ) ]._id == reversableID ){
	var x;
	var y;
	var reverse = false;
	for( x = nx - 1, y = ny + 1; x >= 0, y < MAX_Y; --x, ++y ){
	    if( nodes[ CoordToIdx( x, y ) ]._id == NODE_ID_NONE ){
		break;
	    }
	    if( nodes[ CoordToIdx( x, y ) ]._id == id ){
		reverse = true;
		break;
	    }
	}
	if( reverse ){
	    var i = x + 1;
	    var j = y - 1;
	    for( ; i < nx, j > ny; ++i, --j ){
		reversableNodeIndices.push( CoordToIdx( i, j ) );
	    }
	    console.debug( "Reverse X-Y left-up:" + (x+1) + "-" + (y+1) );
	}
    }

    // right+down
    if( nx < MAX_X - 1 && ny > 0 && nodes[ CoordToIdx( nx + 1, ny - 1 ) ]._id == reversableID ){
	var x;
	var y;
	var reverse = false;
	for( x = nx + 1, y = ny - 1; x < MAX_X, y >= 0; ++x, --y ){
	    if( nodes[ CoordToIdx( x, y ) ]._id == NODE_ID_NONE ){
		break;
	    }
	    if( nodes[ CoordToIdx( x, y ) ]._id == id ){
		reverse = true;
		break;
	    }
	}
	if( reverse ){
	    var i = x - 1;
	    var j = y + 1;
	    for( ; i > nx, j < ny; --i, ++j ){
		reversableNodeIndices.push( CoordToIdx( i, j ) );
	    }
	    console.debug( "Reverse X-Y right-down:" + (x+1) + "-" + (y+1) );
	}
    }

    // right+up
    if( nx < MAX_X - 1 && ny < MAX_Y - 1 && nodes[ CoordToIdx( nx + 1, ny + 1 ) ]._id == reversableID ){
	var x;
	var y;
	var reverse = false;
	for( x = nx + 1, y = ny + 1; x < MAX_X, y < MAX_Y; ++x, ++y ){
	    if( nodes[ CoordToIdx( x, y ) ]._id == NODE_ID_NONE ){
		break;
	    }
	    if( nodes[ CoordToIdx( x, y ) ]._id == id ){
		reverse = true;
		break;
	    }
	}
	if( reverse ){
	    var i = x - 1;
	    var j = y - 1;
	    for( ; i > nx, j > ny; --i, --j ){
		reversableNodeIndices.push( CoordToIdx( i, j ) );
	    }
	    console.debug( "Reverse X-Y right-up:" + (x+1) + "-" + (y+1) );
	}
    }
}

function reverseNodes()
{
    reversableNodeIndices.forEach( (function( elm, idx, array ){
	if( nodes[ elm ]._id == NODE_ID_BLACK ){
	    nodes[ elm ]._id = NODE_ID_WHITE;
	}
	else if( nodes[ elm ]._id == NODE_ID_WHITE ){
	    nodes[ elm ]._id = NODE_ID_BLACK;
	}
    }));
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
    
    reversableNodeIndices = new Array();
    checkReversableNodes( x, y, id );
    if( reversableNodeIndices.length == 0 ){
	console.debug( "Not reversable position: (x,y)=(" + x + "," + y + ")" );
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
    reverseNodes();

    if( curID == NODE_ID_WHITE ){
	curID = NODE_ID_BLACK;
    }
    else if( curID == NODE_ID_BLACK ){
	curID = NODE_ID_WHITE;
    }
}

function init( id )
{
    targetID = id;

    OFFSET.set( 50.0, 50.0 );
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
    c._x = Math.floor( ( pv._x + SIZE._x * 1.5 - OFFSET._x ) / SIZE._x );
    c._y = Math.floor( ( pv._y + SIZE._y * 1.5 - OFFSET._y ) / SIZE._y );
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

    drawGrid( context );
    drawStatus( context );
    drawNodes( context );
 
}

function drawGrid( context )
{
    for( var i = 0; i < MAX_X + 1; ++i ){
	drawLine( context,
		  OFFSET._x - SIZE._x / 2 + i * SIZE._x,
		  OFFSET._y - SIZE._y / 2,
		  OFFSET._x - SIZE._x / 2 + i * SIZE._x,
		  OFFSET._y - SIZE._y / 2 + MAX_Y * SIZE._y );
    }
    for( var i = 0; i < MAX_Y + 1; ++i ){
	drawLine( context,
		  OFFSET._x - SIZE._x / 2,
		  OFFSET._y - SIZE._y / 2 + i * SIZE._y,
		  OFFSET._x - SIZE._x / 2 + MAX_X * SIZE._x,
		  OFFSET._y - SIZE._y / 2 + i * SIZE._y );	
    }
}

function drawNodes( context )
{
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

function getNodeTotalWithID( id )
{
    var num = 0;

    nodes.forEach( (function( elm, idx, array ){
	if( elm._id == id ){
	    ++num;
	}
    }) );

    return num;
}

function drawStatus( context )
{
    context.fillStyle = "black";

    if( curID == NODE_ID_WHITE ){
	context.fillText( "Turn : White", 10, 10 );
    }
    else if( curID == NODE_ID_BLACK ){
	context.fillText( "Turn : Black", 10, 10 );
    }

    var white = getNodeTotalWithID( NODE_ID_WHITE );
    var black = getNodeTotalWithID( NODE_ID_BLACK );
    var none = getNodeTotalWithID( NODE_ID_NONE );
    var total = white + black + none;

    context.fillText( "Num : " + total +
		      " (W:" + white +
		      ", B:" + black +
		      ", N:" + none + ")",
		      10, 20 );
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