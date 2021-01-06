
/**
 * 火焰模块
 * @author zswang, dron
 */

let layer = require( '../layer' ).getLayer( 'fruit' );
let timeline = require( '../timeline' );
let Ucren = require( '../lib/ucren' );

/*
raphael.path('M 27,122 Q 9,42 27,21 45,42 27,122')
	.attr({
		stroke: 'none',
		fill: '180-#D8D380-#EDED7A-#D8D380'
	});
*/

// 缩写
let math = Math; let cos = math.cos; let sin = math.sin;
let trunc = parseInt;
let random = math.random;
let PI = math.PI;

let guid = 0;

/**
 * 添加一个火苗
 * @param{Array} center 中心位置 单位像素
 * @param{Number} angle 运动方向 单位幅度
 * @param{Number} length 运动长度 单位像素
 * @param{Number} life 存活时间 单位毫秒
 */
function appendFlame( center, angle, length, life, flames ) {
	return flames[guid] = {
		id: guid ++,
		birthday: new Date,
		center: center,
		angle: angle,
		length: length,
		life: life,
		path: layer.path().attr({stroke: 'none', fill: trunc( angle * 180 / PI ) + '-#fafad9-#f0ef9c'}),
	};
}

let radius = 15;

function updateFlame( flames, n ) {
	let item = flames[n];

	if ( !item ) {
		return;
	}

	let age; let center; let p1; let p2; let p3; let p4;

	age = 1 - (new Date - item.birthday) / item.life;

	if ( age <= 0 ) {
		item.path.remove();
		delete flames[item.id];
		return;
	}

	let ia; let ic; let il;

	ia = item.angle;
	ic = item.center;
	il = item.length;

	center = [trunc(ic[0] + cos(ia) * il * (1 - age)), trunc(ic[1] + sin(ia) * il * (1 - age))];
	p1 = [trunc(center[0] - cos(ia) * radius * age), trunc(center[1] - sin(ia) * radius * age)];
	p2 = [trunc(center[0] + cos(ia) * radius * age), trunc(center[1] + sin(ia) * radius * age)];
	p3 = [trunc(center[0] - cos(ia + .5 * PI) * radius * .4 * age), trunc(center[1] - sin(ia + .5 * PI) * radius * .4 * age)];
	p4 = [trunc(center[0] - cos(ia - .5 * PI) * radius * .4 * age), trunc(center[1] - sin(ia - .5 * PI) * radius * .4 * age)];

	item.path.attr({path: 'M' + p1 + ' Q' + [p3, p2, p4, p1].join(' ')});
};

function removeFlame( flames, n ) {
	let item = flames[n];

	if ( !item ) {
		return;
	}

	item.path.remove();
	delete flames[n];
};

exports.create = function( ox, oy, start ) {
	let timer1; let timer2;

  	let object = {
  		pos: function( x, y ) {
  		    nx = x;
  		    ny = y;
  		    image.attr( 'x', nx - 21 ).attr( 'y', ny - 21 );
  		},

  		remove: function() {
  		    [timer1, timer2].invoke( 'stop' );
  		    image.remove();

  		    for (let p in flames) {
				removeFlame( flames, p );
			}
  		},
  	};

	var nx = ox; var ny = oy;
	var image = layer.image(require('images/smoke.png'), nx - 21, ny - 21, 43, 43).hide();
	var flames = {};

	timer1 = timeline.setTimeout(function() {
		image.show();
		timer2 = timeline.setInterval(function() {
			if (random() < 0.9) {
				appendFlame( [nx, ny], PI * 2 * random(), 60, 200 + 500 * random(), flames );
			}

			for (let p in flames) {
				updateFlame( flames, p );
			}
		}, Ucren.isIe ? 20 : 40);
	}, start || 0);

	return object;
};

module.exports = exports;
