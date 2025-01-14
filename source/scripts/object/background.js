let Ucren = require( '../lib/ucren' );
let layer = require( '../layer' );
let timeline = require( '../timeline' );
let image; let time;

let random = Ucren.randomNumber;

exports.set = function() {
	image = layer.createImage( 'default', require('images/background.jpg'), 0, 0, 640, 480 );
};

exports.wobble = function() {
	time = timeline.setInterval( wobble, 50 );
};

exports.stop = function() {
	time.stop();
	image.attr({x: 0, y: 0});
};

function wobble() {
	let x; let y;
	x = random( 12 ) - 6;
	y = random( 12 ) - 6;
	image.attr({x: x, y: y});
};

module.exports = exports;
