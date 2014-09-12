function inputFromPlayer( ix, iy, id )
{
    if( !settable( ix, iy, id ) ){
	return;
    }

    setNode( ix, iy, id );
}

function randomByNone( ix, iy, id )
{
    var x;
    var y;

    do{
	x = Math.floor( Math.random() * MAX_X );
	y = Math.floor( Math.random() * MAX_Y );
	x = ( x == MAX_X ) ? MAX_X - 1 : x;
	y = ( y == MAX_Y ) ? MAX_Y - 1 : y;
    }while( !settable( x, y, id ) );

    setNode( x, y, id );

    console.debug( "ok " );
}

function randomByWeight( ix, iy, id )
{
    var map = [ 120, -20, 20, 5, 5, 20, -20, 120,
		-20, -40, -5, -5, -5, -5, -40, -20,
		20, -5, 15, 3, 3, 15, -5, 20,
		5, -5, 3, 3, 3, 3, -5, 5,
		5, -5, 3, 3, 3, 3, -5, 5,
		20, -5, 15, 3, 3, 15, -5, 20,
		-20, -40, -5, -5, -5, -5, -40, -20,
		120, -20, 20, 5, 5, 20, -20, 120 ];
    var mx = -1;
    var my = -1;

    for( var x = 0; x < MAX_X; ++x ){
	for( var y = 0; y < MAX_Y; ++y ){
	    if( settable( x, y, id ) ){
		if( mx == -1 && my == -1 ){
		    mx = x;
		    my = y;
		    continue;
		}
		if( map[ CoordToIdx( x, y ) ] > map[ CoordToIdx( mx, my ) ] ){
		    mx = x;
		    my = y;
		}
	    }
	}
    }

    setNode( mx, my, id );

    console.debug( "hh" );
}


