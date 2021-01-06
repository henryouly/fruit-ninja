/**
 *
 */

let layer = require( '../layer' );
let timeline = require( '../timeline' ).use( 'flash' ).init( 10 );
let tween = require( '../lib/tween' );
let sound = require( '../lib/sound' );

let image; let snd; let xDiff = 0; let yDiff = 0;

let anim = tween.quadratic.cio;
let anims = [];
let dur = 100;

exports.set = function() {
	image = layer.createImage( 'flash', require('images/flash.png'), 0, 0, 358, 20 ).hide();
	snd = sound.create( require('sound/splatter.ogg') );
};

exports.showAt = function( x, y, an ) {
	image.rotate( an, true ).scale( 1e-5, 1e-5 ).attr({
		x: x + xDiff,
		y: y + yDiff,
	}).show();

	anims.clear && anims.clear();

	snd.play();

	timeline.createTask({
		start: 0, duration: dur, data: [1e-5, 1],
		object: this, onTimeUpdate: this.onTimeUpdate,
		recycle: anims,
	});

	timeline.createTask({
		start: dur, duration: dur, data: [1, 1e-5],
		object: this, onTimeUpdate: this.onTimeUpdate,
		recycle: anims,
	});
};

exports.onTimeUpdate = function( time, a, b, z ) {
	image.scale( z = anim( time, a, b - a, dur ), z );
};

module.exports = exports;
