var displacement = require( "../factory/displacement" );
var tween = require( "../lib/tween" );

exports = displacement.create(require("images/home-desc.png"), 161, 91, -161, 140, 7, 127, tween.exponential.co, 500);

module.exports = exports;
