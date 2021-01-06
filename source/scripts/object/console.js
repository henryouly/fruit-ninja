let layer = require( '../layer' );

let x = 16; let y = 0;
let texts = [];

exports.set = function() {

};

exports.clear = function() {
	for (let i = 0, l = texts.length; i < l; i ++) {
		texts[i].remove();
	}
	texts.length = y = 0;
};

exports.log = function(text) {
	y += 20;
	texts.push( layer.createText( 'default', text, x, y ) );
};

module.exports = exports;
