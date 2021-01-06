var Ucren = require( "scripts/lib/ucren" );
var knife = require( "scripts/object/knife" );
var message = require( "scripts/message" );
var state = require( "scripts/state" );

var canvasLeft, canvasTop;

canvasLeft = canvasTop = 0;

exports.init = function(){
	this.fixCanvasPos();
	this.installDragger();
	this.installClicker();
};

exports.installDragger = function(){
    var dragger = new Ucren.BasicDrag({ type: "calc" });

    dragger.on( "returnValue", function( dx, dy, x, y, kf ){
    	if( kf = knife.through( x - canvasLeft, y - canvasTop ) )
            message.postMessage( kf, "slice" );
    });

    dragger.on( "startDrag", function(){
        knife.newKnife();
    });

    dragger.bind( document.documentElement );
};

exports.installPoseDragger = function(dragger) {
  dragger.on( 'returnValue', function( dx, dy, x, y, kf, part) {
    // 此处姿势关键点坐标系本身与游戏画布坐标系对齐，不需要修正
    if ( kf = knife.through( x, y ) ) {
      // DEBUG
      // console.log("part=" + part + " dx=" + dx + " dy=" + dy + " x=" + x + " y=" + y);
      message.postMessage( kf, 'slice' );
    }

    // 游戏结束后挥手回到主界面
    if ( state( 'click-enable' ).ison() ) {
      message.postMessage( 'click' );
    }
  });
  dragger.on( 'startDrag', function() {
    knife.newKnife();
  });
};

exports.installClicker = function(){
    Ucren.addEvent( document, "click", function(){
        if( state( "click-enable" ).ison() )
        	message.postMessage( "click" );
    });
};

exports.fixCanvasPos = function(){
	var de = document.documentElement;

	var fix = function( e ){
	    canvasLeft = ( de.clientWidth - 640 ) / 2;
	    canvasTop = ( de.clientHeight - 480 ) / 2 - 40;
	};

	fix();

	Ucren.addEvent( window, "resize", fix );
};

module.exports = exports;

