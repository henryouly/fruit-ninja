let rotate = require( '../factory/rotate' );
let tween = require( '../lib/tween' );

exports = rotate.create(require('images/quit.png'), 493, 311, 141, 141, 1e-5, tween.exponential.co, 500);

module.exports = exports;
