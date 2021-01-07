let timeline = require( 'scripts/timeline' );
let tools = require( 'scripts/tools' );
let sence = require( 'scripts/sence' );
let Ucren = require( 'scripts/lib/ucren' );
let buzz = require( 'scripts/lib/buzz' );
let control = require( 'scripts/control' );
let csl = require( 'scripts/object/console' );
let message = require( 'scripts/message' );
let state = require( 'scripts/state' );

let game = require( 'scripts/game' );

let collide = require( 'scripts/collide' );

let setTimeout = timeline.setTimeout.bind( timeline );

let log = function() {
	let time = 1e3; let add = 300; let fn;
	fn = function( text ) {
		setTimeout( function() {
			csl.log( text );
		}, time );
		time += add;
	};
	fn.clear = function() {
		setTimeout( csl.clear.bind( csl ), time );
		time += add;
	};
	return fn;
}();

exports.start = function() {
	[timeline, sence, control].invoke( 'init' );

	log( '正在加载鼠标控制脚本' );
	log( '正在加载图像资源' );
	log( '正在加载游戏脚本' );
	log( '正在加载剧情' );
	log( '正在初始化' );
	log( '正在启动游戏...' );
	log.clear();

	setTimeout( sence.switchSence.saturate( sence, 'home-menu' ), 3000 );
};

message.addEventListener('slice', function( knife ) {
	let fruits = collide.check( knife ); let angle;
	if ( fruits.length ) {
		angle = tools.getAngleByRadian( tools.pointToRadian( knife.slice(0, 2), knife.slice(2, 4) ) ),
		fruits.forEach(function( fruit ) {
			message.postMessage( fruit, angle, 'slice.at' );
		});
	}
});

message.addEventListener('slice.at', function( fruit, angle ) {
	if ( state( 'sence-state' ).isnot( 'ready' ) ) {
		return;
	}

	if ( state( 'sence-name' ).is( 'game-body' ) ) {
		game.sliceAt( fruit, angle );
		return;
	}

	if ( state( 'sence-name' ).is( 'home-menu' ) ) {
		fruit.broken( angle );
		if ( fruit.isHomeMenu ) {
			switch ( 1 ) {
			case fruit.isDojoIcon:
				sence.switchSence( 'dojo-body' ); break;
			case fruit.isNewGameIcon:
				sence.switchSence( 'game-body' ); break;
			case fruit.isQuitIcon:
				sence.switchSence( 'quit-body' ); break;
			}
		}
		return;
	}
});

module.exports = exports;
