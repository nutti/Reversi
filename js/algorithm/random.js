function aa( id )
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
