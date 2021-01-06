/**
 * game logic
 */
let timeline = require( 'scripts/timeline' );
let Ucren = require( 'scripts/lib/ucren' );
let sound = require( 'scripts/lib/sound' );
let fruit = require( 'scripts/factory/fruit' );
let score = require( 'scripts/object/score' );
let message = require( 'scripts/message' );
let state = require( 'scripts/state' );
let lose = require( 'scripts/object/lose' );
let gameOver = require( 'scripts/object/game-over' );
let knife = require( 'scripts/object/knife' );
// var sence = require( "scripts/sence" );
let background = require( 'scripts/object/background' );
let light = require( 'scripts/object/light' );

let scoreNumber = 0;

let random = Ucren.randomNumber;

let volleyNum = 2; let volleyMultipleNumber = 5;
let fruits = [];
let gameInterval;

let snd;
let boomSnd;

// fruit barbette
var barbette = function() {
	if ( fruits.length >= volleyNum ) {
		return;
	}

	let startX = random( 640 ); let endX = random( 640 ); let startY = 600;
	let f = fruit.create( startX, startY ).shotOut( 0, endX );

	fruits.push( f );
	snd.play();

	barbette();
};

// start game
exports.start = function() {
	snd = sound.create( 'sound/throw' );
	boomSnd = sound.create( 'sound/boom' );
	timeline.setTimeout(function() {
		state( 'game-state' ).set( 'playing' );
		gameInterval = timeline.setInterval( barbette, 1e3 );
	}, 500);
};

exports.gameOver = function() {
	state( 'game-state' ).set( 'over' );
	gameInterval.stop();

	gameOver.show();

	// timeline.setTimeout(function(){
	//     // sence.switchSence( "home-menu" );
	//     // TODO: require 出现互相引用时，造成死循环，这个问题需要跟进，这里暂时用 postMessage 代替
	//     message.postMessage( "home-menu", "sence.switchSence" );
	// }, 2000);

	scoreNumber = 0;
	volleyNum = 2;
	fruits.length = 0;
};

exports.applyScore = function( score ) {
	if ( score > volleyNum * volleyMultipleNumber ) {
		volleyNum ++,
		volleyMultipleNumber += 50;
	}
};

exports.sliceAt = function( fruit, angle ) {
	let index;

	if ( state( 'game-state' ).isnot( 'playing' ) ) {
		return;
	}

	if ( fruit.type != 'boom' ) {
		fruit.broken( angle );
		if ( index = fruits.indexOf( fruit ) ) {
			fruits.splice( index, 1 );
		}
		score.number( ++ scoreNumber );
		this.applyScore( scoreNumber );
	} else {
		boomSnd.play();
		this.pauseAllFruit();
		background.wobble();
		light.start( fruit );
	}
};

exports.pauseAllFruit = function() {
	gameInterval.stop();
	knife.pause();
	fruits.invoke( 'pause' );
};

// message.addEventListener("fruit.fallOff", function( fruit ){
// 	var index;
// 	if( ( index = fruits.indexOf( fruit ) ) > -1 )
// 	    fruits.splice( index, 1 );
// });

message.addEventListener('fruit.remove', function( fruit ) {
	let index;
	if ( ( index = fruits.indexOf( fruit ) ) > -1 ) {
		fruits.splice( index, 1 );
	}
});

let eventFruitFallOutOfViewer = function( fruit ) {
	if ( fruit.type != 'boom' ) {
		lose.showLoseAt( fruit.originX );
	}
};

state( 'game-state' ).hook( function( value ) {
	if ( value == 'playing' ) {
		message.addEventListener( 'fruit.fallOutOfViewer', eventFruitFallOutOfViewer );
	} else {
		message.removeEventListener( 'fruit.fallOutOfViewer', eventFruitFallOutOfViewer );
	}
} );

message.addEventListener('game.over', function() {
	exports.gameOver();
	knife.switchOn();
});

message.addEventListener('overWhiteLight.show', function() {
	knife.endAll();
	for (let i = fruits.length - 1; i >= 0; i --) {
		fruits[i].remove();
	}
	background.stop();
});

message.addEventListener('click', function() {
	state( 'click-enable' ).off();
	gameOver.hide();
	message.postMessage( 'home-menu', 'sence.switchSence' );
});

module.exports = exports;
