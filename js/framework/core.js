var gameNodes;
var targetID;
var curID = NODE_ID_WHITE;
var reversableNodesIndices = new Array();

var algorithmFn = null;
var myAlgorithmFn = null;

function setAlgorithm( fn )
{
    algorithmFn = fn;
}

function setMyAlgorithm( fn )
{
    myAlgorithmFn = fn;
}

function checkReversableNodes( nodes, nx, ny, id )
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
	    }
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
	    }
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
	    }
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
	    }
	}
    }

    // left+down
    if( nx > 0 && ny > 0 && nodes[ CoordToIdx( nx - 1, ny - 1 ) ]._id == reversableID ){
	var x;
	var y;
	var reverse = false;
	for( x = nx - 1, y = ny - 1; x >= 0 && y >= 0; --x, --y ){
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
	    for( ; i < nx && j < ny; ++i, ++j ){
		reversableNodeIndices.push( CoordToIdx( i, j ) );
	    }
	}
    }

    // left+up
    if( nx > 0 && ny < MAX_Y - 1 && nodes[ CoordToIdx( nx - 1, ny + 1 ) ]._id == reversableID ){
	var x;
	var y;
	var reverse = false;
	for( x = nx - 1, y = ny + 1; x >= 0 && y < MAX_Y; --x, ++y ){
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
	    for( ; i < nx && j > ny; ++i, --j ){
		reversableNodeIndices.push( CoordToIdx( i, j ) );
	    }
	}
    }

    // right+down
    if( nx < MAX_X - 1 && ny > 0 && nodes[ CoordToIdx( nx + 1, ny - 1 ) ]._id == reversableID ){
	var x;
	var y;
	var reverse = false;
	for( x = nx + 1, y = ny - 1; x < MAX_X && y >= 0; ++x, --y ){
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
	    for( ; i > nx && j < ny; --i, ++j ){
		reversableNodeIndices.push( CoordToIdx( i, j ) );
	    }
	}
    }

    // right+up
    if( nx < MAX_X - 1 && ny < MAX_Y - 1 && nodes[ CoordToIdx( nx + 1, ny + 1 ) ]._id == reversableID ){
	var x;
	var y;
	var reverse = false;
	for( x = nx + 1, y = ny + 1; x < MAX_X && y < MAX_Y; ++x, ++y ){
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
	    for( ; i > nx && j > ny; --i, --j ){
		reversableNodeIndices.push( CoordToIdx( i, j ) );
	    }
	}
    }
}

function reverseNodes( nodes )
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

function existSetableNode( nodes, id )
{
    var setable = false;

    for( var x = 0; x < MAX_X; ++x ){
	for( var y = 0; y < MAX_Y; ++y ){
	    if( !cannotSet( nodes, x, y, id ) ){
		return true;
	    }
	}
    }

    return false;
}

function cannotSet( nodes, x, y, id )
{
    if( x < 0 || y < 0 || x > MAX_X - 1 || y > MAX_Y - 1 ){
	return SET_NODE_OUT_OF_RANGE;
    }
    if( nodes[ CoordToIdx( x, y ) ]._id != NODE_ID_NONE ){
	return SET_NODE_EXIST;
    }
    
    reversableNodeIndices = new Array();
    checkReversableNodes( nodes, x, y, id );
    if( reversableNodeIndices.length == 0 ){
	return SET_NODE_CAN_NOT_SET;
    }

    return SET_NODE_SUCCEEDED;
}

function setNode( nodes, x, y, id )
{
    if( cannotSet( nodes, x, y, id ) ){
	return;
    }

    nodes[ CoordToIdx( x, y ) ]._id = id;
    reverseNodes( nodes );
//    flipCurID();
}

function flipCurID()
{
    if( curID == NODE_ID_WHITE ){
	curID = NODE_ID_BLACK;
    }
    else if( curID == NODE_ID_BLACK ){
	curID = NODE_ID_WHITE;
    }    
}

