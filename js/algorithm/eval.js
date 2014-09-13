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

