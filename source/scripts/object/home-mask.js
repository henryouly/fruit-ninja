let displacement = require( '../factory/displacement' );
let tween = require( '../lib/tween' );

exports = displacement.create(require('images/home-mask.png'), 640, 183, 0, -183, 0, 0, tween.exponential.co, 1e3);

module.exports = exports;
