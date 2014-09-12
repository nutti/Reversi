var OFFSET = new Coord2D();
var RADIUS = 8.0;
var SIZE = new Coord2D();

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
    setAlgorithm( randomByWeight );
    setMyAlgorithm( randomByNone );

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

    if( existSetableNode( curID ) ){
	myAlgorithmFn( c._x - 1, c._y - 1, curID );
	//setNode( c._x - 1, c._y - 1, curID );
    }
    else{
	console.debug( "not exist!! w" );
	flipCurID();
    }

    if( existSetableNode( curID ) ){
	algorithmFn( c._x - 1, c._y - 1, curID );
    }
    else{
	console.debug( "not exist!! b" );
	flipCurID();
    }

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