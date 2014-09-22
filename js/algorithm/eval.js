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

function doMinimax( tnode, id, depth, firstID, result, firstDepth )
{
    if( depth == 0 ){
	var v;
	v = evalState( tnode._elm, id );
//	console.debug( v );
	return v;
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
//		console.debug( "d" + depth + ",id" + id + "," + x + "-" + y );
	    }
	}
    }

    if( tnode._child.length == 0 ){
	return evalState( tnode._elm, id );
    }   
 
    var max = -99999;
    var min = 99999;
    for( var i = 0; i < tnode._child.length; ++i ){
	var nextID = ( id == NODE_ID_WHITE ) ? NODE_ID_BLACK : NODE_ID_WHITE;
	var val = doMinimax( tnode._child[ i ], nextID, depth - 1, firstID, result, firstDepth );
	if( id == firstID && max < val ){
	    if( depth == firstDepth ){
		result.set( tnode._child[ i ]._coord._x, tnode._child[ i ]._coord._y );
//		console.debug( "" + val + "," + result._x + "-" + result._y );
	    }
	    max = val;
	}
	if( id != firstID && min > val ){
	    if( depth == firstDepth ){
		result.set( tnode._child[ i ]._coord._x, tnode._child[ i ]._coord._y );
//	    	console.debug( "" + val + "," + result._x + "-" + result._y );
	    }
	    min = val;
	}
//	if( depth == 3 ){
//	    console.debug( "" + val );
//	}

    }

    if( id == firstID ){
	return max;
    }
    return min;
}

function aiMinimax( nodes, ix, iy, id )
{
    var root = new TreeNode();
    var depth = 2;
    var result = new Coord2D();
    var ret;

    result.set( -1, -1 );
    root._elm = nodes;

    doMinimax( root, id, depth, id, result, depth );
  //  console.debug( "result:" + result._x + "-" + result._y + "@" + id )    

    ret = cannotSet( nodes, result._x, result._y, id )
    if( ret ){
//	console.debug( "err:" + result._x + "-" + result._y + "@" + id );
	return ret;
    }

    setNode( nodes, result._x, result._y, id );

    return SET_NODE_SUCCEEDED;
}

function doNegamax( tnode, id, depth, firstID, result, firstDepth )
{
    if( depth == 0 ){
	return evalState( tnode._elm, id );
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
 
    var max = -99999;
    for( var i = 0; i < tnode._child.length; ++i ){
	var nextID = ( id == NODE_ID_WHITE ) ? NODE_ID_BLACK : NODE_ID_WHITE;
	var val = -doNegamax( tnode._child[ i ], nextID, depth - 1, firstID, result, firstDepth );
	if( max < val ){
	    if( depth == firstDepth ){
		result.set( tnode._child[ i ]._coord._x, tnode._child[ i ]._coord._y );
	    	console.debug( "" + val + "," + result._x + "-" + result._y );
	    }
	    max = val;
	}
    }


    return max;
}

function aiNegamax( nodes, ix, iy, id )
{
    var root = new TreeNode();
    var depth = 4;
    var result = new Coord2D();
    var ret;

    result.set( -1, -1 );
    root._elm = nodes;

    doNegamax( root, id, depth, id, result, depth );
    console.debug( "result:" + result._x + "-" + result._y + "@" + id );
    ret = cannotSet( nodes, result._x, result._y, id )
    if( ret ){
	return ret;
    }

    setNode( nodes, result._x, result._y, id );    

    return SET_NODE_SUCCEEDED;
}

function doAlphaBeta( tnode, id, depth, alpha, beta, result )
{
}

function aiAlphaBeta( nodes, ix, iy, id )
{
    var root = new TreeNode();
    var depth = 4;
    var result = new Coord2D();
    var ret;

    result.set( -1, -1 );
    root._elm = nodes;

    doAlphaBeta( root, id, depth, INT_L_LIMIT, INT_U_LIMIT );
    //doNegamax( root, id, depth, id, result, depth );
    //console.debug( "result:" + result._x + "-" + result._y + "@" + id );
    ret = cannotSet( nodes, result._x, result._y, id )
    if( ret ){
	return ret;
    }

    setNode( nodes, result._x, result._y, id );    

    return SET_NODE_SUCCEEDED;
}
