var nodeValues = [ 120, -20, 20, 5, 5, 20, -20, 120,
		   -20, -40, -5, -5, -5, -5, -40, -20,
		   20, -5, 15, 3, 3, 15, -5, 20,
		   5, -5, 3, 3, 3, 3, -5, 5,
		   5, -5, 3, 3, 3, 3, -5, 5,
		   20, -5, 15, 3, 3, 15, -5, 20,
		   -20, -40, -5, -5, -5, -5, -40, -20,
		   120, -20, 20, 5, 5, 20, -20, 120 ];


function evalState( nodes, id )
{
    var value = 0;

    for( var x = 0; x < MAX_X; ++x ){
	for( var y = 0; y < MAX_Y; ++y ){
	    if( nodes[ CoordToIdx( x, y ) ]._id == id ){
		value += nodeValues[ CoordToIdx( x, y ) ];
	    }
	}
    }

    return value;
}

function copyNodes( srcNodes, destNodes )
{
    for( var i = 0; i < srcNodes.length; ++i ){
	destNodes[ i ] = new Node();
	copyNode( srcNodes[ i ], destNodes[ i ] );
    }
}

function aiMaxEval( nodes, ix, iy, id )
{
    var mx = -1;
    var my = -1;
    var maxEval = -99999;

    for( var x = 0; x < MAX_X; ++x ){
	for( var y = 0; y < MAX_Y; ++y ){
	    if( !cannotSet( nodes, x, y, id ) ){
		var copied = new Array();
		var val;
		copyNodes( nodes, copied );
		setNode( copied, x, y, id );
		val = evalState( copied, id );
		if( maxEval < val ){
		    maxEval = val;
		    mx = x;
		    my = y;
		}
	    }
	}
    }

    if( mx == -1 || my == -1 ){
	return;
    }

    if( !cannotSet( nodes, mx, my, id ) ){
	setNode( nodes, mx, my, id );
    }
   
    return SET_NODE_SUCCEEDED;
}

function doMinimax( tnode, id, depth, firstID, result )
{
    if( depth == 0 ){
	return evalState( tnode._elm );
    }

    tnode._child = new Array();

    for( var x = 0; x < MAX_X; ++x ){
	for( var y = 0; y < MAX_Y; ++y ){
	    if( !cannotSet( tnode._elm, x, y, id ) ){
		var newChild = new TreeNode();
		var copied = new Array();
		var coord = new Coord2D();
		copyNodes( tnode._elm, copied );
		setNode( copied, x, y, id );
		newChild._elm = copied;
		coord.set( x, y );
		newChild._coord = coord;
		tnode._child.push( newChild );
	    }
	}
    }
    
    var best = -99999;
    for( var i = 0; i < tnode._child.length; ++i ){
	var nextID = ( id == NODE_ID_WHITE ) ? NODE_ID_BLACK : NODE_ID_WHITE;
	var val = doMinimax( tnode._child[ i ], nextID, depth - 1, firstID, result );
	if( id == firstID && best < val ){
	    result.set( tnode._child[ i ]._coord._x, tnode._child[ i ]._coord._y );
	    best = val;
	}
	if( id != firstID && best < -val ){
	    result.set( tnode._child[ i ]._coord._x, tnode._child[ i ]._coord._y );
	    best = -val;
	}
    }

    return best;
}

function aiMinimax( nodes, ix, iy, id )
{
    var root = new TreeNode();
    var depth = 3;
    var result = new Coord2D();

    result.set( -1, -1 );
    root._elm = nodes;

    doMinimax( root, id, depth, id, result );

    if( cannotSet( nodes, result._x, result._y, id ) ){
	console.debug( "err:" + result._x + "-" + result._y );
    }

    setNode( nodes, result._x, result._y, id );
}


