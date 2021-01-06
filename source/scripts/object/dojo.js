let rotate = require( '../factory/rotate' );
let tween = require( '../lib/tween' );

exports = rotate.create(require('images/dojo.png'), 41, 240, 175, 175, 1e-5, tween.exponential.co, 500);

module.exports = exports;
