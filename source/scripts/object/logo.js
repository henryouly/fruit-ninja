let displacement = require( '../factory/displacement' );
let tween = require( '../lib/tween' );

exports = displacement.create(require('images/logo.png'), 288, 135, 17, -182, 17, 1, tween.exponential.co, 1e3);

module.exports = exports;
