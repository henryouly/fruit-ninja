let layer = require( '../layer' );
let tween = require( '../lib/tween' );
let timeline = require( '../timeline' );
let Ucren = require( '../lib/ucren' );

let setTimeout = timeline.setTimeout.bind( timeline );
let anim = tween.exponential.co;

let message = require( '../message' );

/**
 * 分数模块
 */

let image; let text1; let text2; let animLength = 500; ;

let imageSx = -94; let imageEx = 6;
let text1Sx = -59; let text1Ex = 41;
let text2Sx = -93; let text2Ex = 7;

exports.anims = [];

exports.set = function() {
	image = layer.createImage( 'default', require('images/score.png'), imageSx, 8, 29, 31 ).hide();
	text1 = layer.createText( 'default', '0', text1Sx, 24, '90-#fc7f0c-#ffec53', '30px' ).hide();
	text2 = layer.createText( 'default', 'BEST 999', text2Sx, 48, '#af7c05', '14px' ).hide();
};

exports.show = function( start ) {
	timeline.createTask({
		start: start, duration: animLength, data: ['show', imageSx, imageEx, text1Sx, text1Ex, text2Sx, text2Ex],
		object: this, onTimeUpdate: this.onTimeUpdate, onTimeStart: this.onTimeStart, onTimeEnd: this.onTimeEnd,
		recycle: this.anims,
	});
};

exports.hide = function( start ) {
	timeline.createTask({
		start: start, duration: animLength, data: ['hide', imageEx, imageSx, text1Ex, text1Sx, text2Ex, text2Sx],
		object: this, onTimeUpdate: this.onTimeUpdate, onTimeStart: this.onTimeStart, onTimeEnd: this.onTimeEnd,
		recycle: this.anims,
	});
};

exports.number = function( number ) {
	text1.attr( 'text', number || 0 );
	image.scale( 1.2, 1.2 );
	setTimeout(function() {
		image.scale( 1, 1 );
	}, 60);
	// message.postMessage( number, "score.change" );
};

// 显示/隐藏 相关

exports.onTimeUpdate = function( time, mode, isx, iex, t1sx, t1ex, t2sx, t2ex ) {
	image.attr( 'x', anim( time, isx, iex - isx, animLength ) );
	text1.attr( 'x', anim( time, t1sx, t1ex - t1sx, animLength ) );
	text2.attr( 'x', anim( time, t2sx, t2ex - t2sx, animLength ) );
};

exports.onTimeStart = function( mode ) {
	if ( mode === 'show' ) {
		[image, text1, text2].invoke( 'show' );
	}
};

exports.onTimeEnd = function( mode ) {
	if ( mode === 'hide' ) {
		[image, text1, text2].invoke( 'hide' ),
		text1.attr( 'text', 0 );
	}
};

module.exports = exports;
