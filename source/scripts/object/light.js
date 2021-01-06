/**
 * 炸弹爆炸时的光线
 */

let layer = require( '../layer' );

let maskLayer = layer.getLayer( 'mask' );
layer = layer.getLayer( 'light' );

let Ucren = require( '../lib/ucren' );
let timeline = require( '../timeline' );
let message = require( '../message' );

let random = Ucren.randomNumber;
let pi = Math.PI;
let sin = Math.sin;
let cos = Math.cos;

let lights = [];
let indexs = [];
let lightsNum = 10;

for (let i = 0; i < lightsNum; i ++) {
	indexs[i] = i;
}

exports.start = function( boom ) {
	let x = boom.originX; let y = boom.originY; let time = 0; let idx = indexs.random();

	let i = lightsNum; let b = function() {
	    build( x, y, idx[this] );
	};

	while ( i -- ) {
		timeline.setTimeout( b.bind( i ), time += 100 );
	}

	timeline.setTimeout(function() {
	    this.overWhiteLight();
	}.bind( this ), time + 100);
};

exports.overWhiteLight = function() {
	message.postMessage( 'overWhiteLight.show' );
	this.removeLights();

	let dur = 4e3;
	let mask = maskLayer.rect( 0, 0, 640, 480 ).attr({fill: '#fff', stroke: 'none'});
	let control = {
    	onTimeUpdate: function( time ) {
    		mask.attr( 'opacity', 1 - time / dur );
    	},

    	onTimeEnd: function() {
    	    mask.remove();
    	    message.postMessage( 'game.over' );
    	},
	};

	timeline.createTask({
		start: 0, duration: dur,
		object: control, onTimeUpdate: control.onTimeUpdate, onTimeEnd: control.onTimeEnd,
	});
};

exports.removeLights = function() {
	for (let i = 0, l = lights.length; i < l; i ++) {
		lights[i].remove();
	}
	lights.length = 0;
};


function build( x, y, r ) {
	let a1; let a2; let x1; let y1; let x2; let y2;

	a1 = r * 36 + random( 10 );
	a2 = a1 + 5;

	a1 = pi * a1 / 180;
	a2 = pi * a2 / 180;

	x1 = x + 640 * cos( a1 );
	y1 = y + 640 * sin( a1 );

	x2 = x + 640 * cos( a2 );
	y2 = y + 640 * sin( a2 );

	let light = layer.path( ['M', x, y, 'L', x1, y1, 'L', x2, y2, 'Z'] ).attr({
    	stroke: 'none',
    	fill: '#fff',
	});

	lights.push( light );
}

module.exports = exports;
