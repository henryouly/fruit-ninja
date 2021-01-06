let layer = require( '../layer' );
let Ucren = require( '../lib/ucren' );
let timeline = require( '../timeline' ).use( 'fruit' ).init( 1 );
let timeline2 = require( '../timeline' ).use( 'fruit-apart' ).init( 1 );
let tween = require( '../lib/tween' );
let message = require( '../message' );
let flame = require( '../object/flame' );
let flash = require( '../object/flash' );
let juice = require( '../factory/juice' );

let ie = Ucren.isIe;
let safari = Ucren.isSafari;

/**
 * 水果模块模型
 */

let zoomAnim = tween.exponential.co;
let rotateAnim = tween.circular;
let linearAnim = tween.linear;
let dropAnim = tween.quadratic.ci;
let fallOffAnim = tween.quadratic.co;

let random = Ucren.randomNumber;
let min = Math.min;
let average = function( a, b ) {
	return ( ( a + b ) / 2 ) >> 0;
};

let dropTime = 1200; let dropXScope = 200; let shadowPos = 50;

let infos = {
	// type: [ imageSrc, width, height, radius, fixAngle, isReverse, juiceColor ]
	boom: [require('images/fruit/boom.png'), 66, 68, 26, 0, 0, null],
	peach: [require('images/fruit/peach.png'), 62, 59, 37, -50, 0, '#e6c731'],
	sandia: [require('images/fruit/sandia.png'), 98, 85, 38, -100, 0, '#c00'],
	apple: [require('images/fruit/apple.png'), 66, 66, 31, -54, 0, '#c8e925'],
	banana: [require('images/fruit/banana.png'), 126, 50, 43, 90, 0, null],
	basaha: [require('images/fruit/basaha.png'), 68, 72, 32, -135, 0, '#c00'],
};

let parts = {
	apple: [require('images/fruit/apple-1.png'), require('images/fruit/apple-2.png')],
	banana: [require('images/fruit/banana-1.png'), require('images/fruit/banana-2.png')],
	basaha: [require('images/fruit/basaha-1.png'), require('images/fruit/basaha-2.png')],
	peach: [require('images/fruit/peach-1.png'), require('images/fruit/peach-2.png')],
	sandia: [require('images/fruit/sandia-1.png'), require('images/fruit/sandia-2.png')],
};

// TODO: 是否水果全开？
let types = ['peach', 'sandia', 'apple', 'banana', 'basaha'];
// var types = [ "sandia", "boom" ];
let rotateSpeed = [60, 50, 40, -40, -50, -60];

let fruitCache = [];

function ClassFruit(conf) {
	let info = infos[conf.type]; let radius = info[3];

	this.type = conf.type;
	this.originX = conf.originX;
	this.originY = conf.originY;
	this.radius = radius;
	this.startX = conf.originX;
	this.startY = conf.originY;
	this.radius = radius;

	this.anims = [];

	if ( this.type === 'boom' ) {
		this.flame = flame.create( this.startX - radius + 4, this.startY - radius + 5, conf.flameStart || 0 );
	}
}

ClassFruit.prototype.set = function( hide ) {
	let inf = infos[this.type]; let radius = this.radius;

	this.shadow = layer.createImage( 'fruit', require('images/shadow.png'), this.startX - radius, this.startY - radius + shadowPos, 106, 77 );
	this.image = layer.createImage( 'fruit', inf[0], this.startX - radius, this.startY - radius, inf[1], inf[2] );

	if ( hide ) {
		this.image.hide(),
		this.shadow.hide();
	}

	return this;
};

ClassFruit.prototype.pos = function( x, y ) {
	if ( x == this.originX && y == this.originY ) {
		return;
	}

	let r = this.radius;

	this.originX = x;
	this.originY = y;

	this.image.attr({x: x -= r, y: y -= r});
	this.shadow.attr({x: x, y: y + shadowPos});

	if ( this.type === 'boom' ) {
		this.flame.pos( x + 4, y + 5 );
	}
};

ClassFruit.prototype.show = function( start ) {
	timeline.createTask({
		start: start, duration: 500, data: [1e-5, 1, 'show'],
		object: this, onTimeUpdate: this.onScaling, onTimeStart: this.onShowStart,
		recycle: this.anims,
	});
};

ClassFruit.prototype.hide = function( start ) {
	if ( this.type !== 'boom' ) // if it is not a boom, it can't to be hide.
	    {
		return;
	}

	this.anims.clear();
	this.flame.remove();
	timeline.createTask({
		start: start, duration: 500, data: [1, 1e-5, 'hide'],
		object: this, onTimeUpdate: this.onScaling, onTimeEnd: this.onHideEnd,
		recycle: this.anims,
	});
};

ClassFruit.prototype.rotate = function( start, speed ) {
	this.rotateSpeed = speed || rotateSpeed[random( 6 )];
	this.rotateAnim = timeline.createTask({
		start: start, duration: -1,
		object: this, onTimeUpdate: this.onRotating,
		recycle: this.anims,
	});
};

ClassFruit.prototype.broken = function( angle ) {
	if ( this.brokend ) return;
	this.brokend = true;

	let index;
	if ( ( index = fruitCache.indexOf( this ) ) > -1 ) {
		fruitCache.splice( index, 1 );
	}

	if ( this.type !== 'boom' ) {
		flash.showAt( this.originX, this.originY, angle ),
		juice.create( this.originX, this.originY, infos[this.type][6] ),
	    this.apart( angle );
	} else {
		this.hide();
	}
};

ClassFruit.prototype.pause = function() {
	if ( this.brokend ) {
		return;
	}
	this.anims.clear();
	if ( this.type == 'boom' ) {
		this.flame.remove();
	}
};

// 分开
ClassFruit.prototype.apart = function( angle ) {
	this.anims.clear();
	this.image.hide();
	this.shadow.hide();
	this.aparted = true;

	let inf = infos[this.type]; let preSrc = inf[0].replace( '.png', '' ); let radius = this.radius;
	let create = layer.createImage.saturate( layer, this.startX - radius, this.startY - radius, inf[1], inf[2] );

	angle = ( ( angle % 180 ) + 360 + inf[4] ) % 360;

	this.bImage1 = create( 'fruit', parts[this.type][0] );
	this.bImage2 = create( 'fruit', parts[this.type][1] );

	[this.bImage1, this.bImage2].invoke( 'rotate', angle );

	this.apartAngle = angle;
	timeline2.createTask({
		start: 0, duration: dropTime, object: this,
		onTimeUpdate: this.onBrokenDropUpdate, onTimeStart: this.onBrokenDropStart, onTimeEnd: this.onBrokenDropEnd,
		recycle: this.anims,
	});
};

// 抛出
ClassFruit.prototype.shotOut = function() {
	let sign = [-1, 1];
	return function( start, endX ) {
		this.shotOutStartX = this.originX;
		this.shotOutStartY = this.originY;
		this.shotOutEndX = average( this.originX, endX );
		this.shotOutEndY = min( this.startY - random( this.startY - 100 ), 200 );
		this.fallOffToX = endX;

		timeline.createTask({
			start: start, duration: dropTime, object: this,
			onTimeUpdate: this.onShotOuting, onTimeStart: this.onShotOutStart, onTimeEnd: this.onShotOutEnd,
			recycle: this.anims,
		});

		if ( this.type != 'boom' ) {
			this.rotate( 0, ( random( 180 ) + 90 ) * sign[random( 2 )] );
		}

		return this;
	};
}();

// 掉落
ClassFruit.prototype.fallOff = function() {
	let sign = [-1, 1];
	let signIndex = 0;
	return function( start, x ) {
		if ( this.aparted || this.brokend ) {
			return;
		}

		let y = 600;

		if ( typeof x !== 'number' ) {
			x = this.originX + random( dropXScope ) * sign[( signIndex ++ ) % 2];
		}

		this.fallTargetX = x;
		this.fallTargetY = y;

		timeline.createTask({
			start: start, duration: dropTime, object: this,
			onTimeUpdate: this.onFalling, onTimeStart: this.onFallStart, onTimeEnd: this.onFallEnd,
			recycle: this.anims,
		});
	};
}();

ClassFruit.prototype.remove = function() {
	let index;

	this.anims.clear();

	if ( this.image ) {
		this.image.remove(),
		this.shadow.remove();
	}

	if ( this.bImage1 ) {
		this.bImage1.remove(),
		this.bImage2.remove();
	}

	if ( this.type === 'boom' ) {
		this.flame.remove();
	}

	if ( ( index = fruitCache.indexOf( this ) ) > -1 ) {
		fruitCache.splice( index, 1 );
	}

	for (let name in this) {
		if ( typeof this[name] === 'function' ) {
			this[name] = function( name ) {
			    return function() {
				    throw new Error( 'method ' + name + ' has been removed' );
				};
			}( name );
		} else delete this[name];
	}

	message.postMessage( this, 'fruit.remove' );
};

// 显示/隐藏 相关

ClassFruit.prototype.onShowStart = function() {
	this.image.show();
	// this.shadow.show();
};

ClassFruit.prototype.onScaling = function( time, a, b, z ) {
	this.image.scale( z = zoomAnim( time, a, b - a, 500 ), z );
	this.shadow.scale( z, z );
};

ClassFruit.prototype.onHideEnd = function() {
	this.remove();
};

// 旋转相关

ClassFruit.prototype.onRotateStart = function() {

};

ClassFruit.prototype.onRotating = function( time ) {
	this.image.rotate( ( this.rotateSpeed * time / 1e3 ) % 360, true );
};

// 裂开相关

ClassFruit.prototype.onBrokenDropUpdate = function( time ) {
	let radius = this.radius;
	this.bImage1.attr({
		x: linearAnim( time, this.brokenPosX - radius, this.brokenTargetX1, dropTime ),
		y: dropAnim( time, this.brokenPosY - radius, this.brokenTargetY1 - this.brokenPosY + radius, dropTime ),
	}).rotate( linearAnim( time, this.apartAngle, this.bImage1RotateAngle, dropTime ), true );
	this.bImage2.attr({
		x: linearAnim( time, this.brokenPosX - radius, this.brokenTargetX2, dropTime ),
		y: dropAnim( time, this.brokenPosY - radius, this.brokenTargetY2 - this.brokenPosY + radius, dropTime ),
	}).rotate( linearAnim( time, this.apartAngle, this.bImage2RotateAngle, dropTime ), true );
};

ClassFruit.prototype.onBrokenDropStart = function() {
	this.brokenTargetX1 = -( random( dropXScope ) + 75 );
	this.brokenTargetX2 = random( dropXScope + 75 );
	this.brokenTargetY1 = 600;
	this.brokenTargetY2 = 600;
	this.brokenPosX = this.originX;
	this.brokenPosY = this.originY;
	this.bImage1RotateAngle = - random( 150 ) - 50;
	this.bImage2RotateAngle = random( 150 ) + 50;

	for (var f, i = fruitCache.length - 1; i >= 0; i --) {
		if ( fruitCache[i] === this ) {
			fruitCache.splice( i, 1 );
		}
	}
};

ClassFruit.prototype.onBrokenDropEnd = function() {
	this.remove();
};

// 抛出相关

ClassFruit.prototype.onShotOuting = function( time ) {
	this.pos(
		linearAnim( time, this.shotOutStartX, this.shotOutEndX - this.shotOutStartX, dropTime ),
		fallOffAnim( time, this.shotOutStartY, this.shotOutEndY - this.shotOutStartY, dropTime ),
	);
};

ClassFruit.prototype.onShotOutStart = function() {
	// body...
};

ClassFruit.prototype.onShotOutEnd = function() {
	this.fallOff( 0, this.fallOffToX );
};

// 掉落相关

ClassFruit.prototype.onFalling = function( time ) {
	let y;
	this.pos(
		linearAnim( time, this.brokenPosX, this.fallTargetX - this.brokenPosX, dropTime ),
		y = dropAnim( time, this.brokenPosY, this.fallTargetY - this.brokenPosY, dropTime ),
	);
	this.checkForFallOutOfViewer( y );
};

ClassFruit.prototype.onFallStart = function() {
	this.brokenPosX = this.originX;
	this.brokenPosY = this.originY;
};

ClassFruit.prototype.onFallEnd = function() {
	message.postMessage( this, 'fruit.fallOff' );
	this.remove();
};

// privates

ClassFruit.prototype.checkForFallOutOfViewer = function( y ) {
	if ( y > 480 + this.radius ) {
		this.checkForFallOutOfViewer = Ucren.nul,
		this.rotateAnim && this.rotateAnim.stop(),
	    message.postMessage( this, 'fruit.fallOutOfViewer' );
	}
};

exports.create = function( type, originX, originY, isHide, flameStart ) {
	if ( typeof type == 'number' ) // 缺省 type
	{
		isHide = originY,
		originY = originX,
	    originX = type,
	    type = getType();
	}

	let fruit = new ClassFruit({type: type, originX: originX, originY: originY, flameStart: flameStart}).set( isHide );
	fruitCache.unshift( fruit );

	return fruit;
};

exports.getFruitInView = function() {
	return fruitCache;
};

exports.getDropTimeSetting = function() {
	return dropTime;
};

function getType() {
	if ( random( 8 ) == 4 ) {
		return 'boom';
	} else {
		return types[random( 5 )];
	}
}

module.exports = exports;
