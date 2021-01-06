let rotate = require( '../factory/rotate' );
let tween = require( '../lib/tween' );

exports = rotate.create(require('images/new-game.png'), 244, 231, 195, 195, 1e-5, tween.exponential.co, 500);

module.exports = exports;
