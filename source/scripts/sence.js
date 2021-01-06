let Ucren = require( 'scripts/lib/ucren' );
let sound = require( 'scripts/lib/sound' );
let fruit = require( 'scripts/factory/fruit' );
let flash = require( 'scripts/object/flash' );

let state = require( 'scripts/state' );
var message = require( 'scripts/message' );

// the fixed elements
let background = require( 'scripts/object/background' );
let fps = require( 'scripts/object/fps' );

// the home page elements
let homeMask = require( 'scripts/object/home-mask' );
let logo = require( 'scripts/object/logo' );
let ninja = require( 'scripts/object/ninja' );
let homeDesc = require( 'scripts/object/home-desc' );

let dojo = require( 'scripts/object/dojo' );
let newGame = require( 'scripts/object/new-game' );
let quit = require( 'scripts/object/quit' );
let newSign = require( 'scripts/object/new' );
let peach; let sandia; let boom;

// the elements in game body
let score = require( 'scripts/object/score' );
let lose = require( 'scripts/object/lose' );

// the game logic
let game = require( 'scripts/game' );

// the elements in 'developing' module
let developing = require( 'scripts/object/developing' );
let gameOver = require( 'scripts/object/game-over' );

// commons
var message = require( 'scripts/message' );
let timeline = require( 'scripts/timeline' );
let setTimeout = timeline.setTimeout.bind( timeline );
let setInterval = timeline.setInterval.bind( timeline );

let menuSnd;
let gameStartSnd;

// initialize sence
exports.init = function() {
	menuSnd = sound.create( require('sound/menu.ogg') );
	gameStartSnd = sound.create( require('sound/start.ogg') );
	[background, homeMask, logo, ninja, homeDesc, dojo, newSign, newGame, quit, score, lose, developing, gameOver, flash].invoke( 'set' );
	// setInterval( fps.update.bind( fps ), 500 );
};

// switch sence
exports.switchSence = function( name ) {
	let curSence = state( 'sence-name' );
	let senceState = state( 'sence-state' );

	if ( curSence.is( name ) ) {
		return;
	}

	let onHide = function() {
		curSence.set( name );
		senceState.set( 'entering' );
		switch ( name ) {
		case 'home-menu': this.showMenu( onShow ); break;
		case 'dojo-body': this.showDojo( onShow ); break;
		case 'game-body': this.showNewGame( onShow ); break;
		case 'quit-body': this.showQuit( onShow ); break;
		}
	}.bind( this );

	var onShow = function() {
		senceState.set( 'ready' );

		if ( name == 'dojo-body' || name == 'quit-body' ) {
			exports.switchSence( 'home-menu' );
		}
	};

	senceState.set( 'exiting' );

	if ( curSence.isunset() ) onHide();
	else if ( curSence.is( 'home-menu' ) ) this.hideMenu( onHide );
	else if ( curSence.is( 'dojo-body' ) ) this.hideDojo( onHide );
	else if ( curSence.is( 'game-body' ) ) this.hideNewGame( onHide );
	else if ( curSence.is( 'quit-body' ) ) this.hideQuit( onHide );
};

// to enter home page menu
exports.showMenu = function( callback ) {
	let callee = arguments.callee;
	let times = callee.times = ++ callee.times || 1;

	peach = fruit.create( 'peach', 137, 333, true );
	sandia = fruit.create( 'sandia', 330, 322, true );
	boom = fruit.create( 'boom', 552, 367, true, 2500 );

	[peach, sandia, boom].forEach(function( f ) {
		f.isHomeMenu = 1;
	});
	peach.isDojoIcon = sandia.isNewGameIcon = boom.isQuitIcon = 1;

	let group = [
    	[homeMask, 0],
    	[logo, 0],

    	[ninja, 500],
    	[homeDesc, 1500],

    	[dojo, 2000],
    	[newGame, 2000],
    	[quit, 2000],

		[newSign, 2000],

		[peach, 2000],
		[sandia, 2000],
		[boom, 2000],
	];

	group.invoke( 'show' );
	[peach, sandia].invoke( 'rotate', 2500 );

	menuSnd.play();
	setTimeout( callback, 2500 );
};

// to exit home page menu
exports.hideMenu = function( callback ) {
	[newSign, dojo, newGame, quit].invoke( 'hide' );
	[homeMask, logo, ninja, homeDesc].invoke( 'hide' );
	[peach, sandia, boom].invoke( 'fallOff', 150 );

	menuSnd.stop();
	setTimeout( callback, fruit.getDropTimeSetting() );
};

// to enter game body
exports.showNewGame = function( callback ) {
	score.show();
	lose.show();
	game.start();

	gameStartSnd.play();
	setTimeout( callback, 1000 );
};

// to exit game body
exports.hideNewGame = function( callback ) {
	score.hide();
	lose.hide();

	gameStartSnd.stop();
	setTimeout( callback, 1000 );
};

// to enter dojo mode
exports.showDojo = function( callback ) {
	developing.show( 250 );
	setTimeout( callback, 1500 );
};

// to exit dojo mode
exports.hideDojo = function( callback ) {
	// TODO:
	setTimeout( callback, 1000 );
};

// to enter quit page
exports.showQuit = function( callback ) {
	developing.show( 250 );
	setTimeout( callback, 1500 );
};

// to exit quit page
exports.hideQuit = function( callback ) {
	// TODO:
	setTimeout( callback, 1000 );
};

message.addEventListener('sence.switchSence', function( name ) {
	exports.switchSence( name );
});

module.exports = exports;
