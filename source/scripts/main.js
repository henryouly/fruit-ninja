var timeline = require( "scripts/timeline" );
var tools = require( "scripts/tools" );
var sence = require( "scripts/sence" );
var Ucren = require( "scripts/lib/ucren" );
var buzz = require( "scripts/lib/buzz" );
var control = require( "scripts/control" );
var csl = require( "scripts/object/console" );
var message = require( "scripts/message" );
var state = require( "scripts/state" );

var game = require( "scripts/game" );

var collide = require( "scripts/collide" );

var setTimeout = timeline.setTimeout.bind( timeline );

var log = function(){
    var time = 1e3, add = 300, fn;
    fn = function( text ){
        setTimeout( function(){ csl.log( text ); }, time );
        time += add;
    };
    fn.clear = function(){
        setTimeout( csl.clear.bind( csl ), time );
        time += add;
    };
    return fn;
}();

exports.start = function(){

    [ timeline, sence, control ].invoke( "init" );

    log( "正在加载鼠标控制脚本" );
    log( "正在加载图像资源" );
	log( "正在加载游戏脚本" );
    log( "正在加载剧情" );
    log( "正在初始化" );
	log( "正在启动游戏..." );
    log.clear();

    setTimeout( sence.switchSence.saturate( sence, "home-menu" ), 3000 );
};

message.addEventListener("slice", function( knife ){
    var fruits = collide.check( knife ), angle;
    if( fruits.length )
        angle = tools.getAngleByRadian( tools.pointToRadian( knife.slice(0, 2), knife.slice(2, 4) ) ),
        fruits.forEach(function( fruit ){
           message.postMessage( fruit, angle, "slice.at" );
        });
});

message.addEventListener("slice.at", function( fruit, angle ){

    if( state( "sence-state" ).isnot( "ready" ) )
        return ;

    if( state( "sence-name" ).is( "game-body" ) ){
        game.sliceAt( fruit, angle );
        return ;
    }

    if( state( "sence-name" ).is( "home-menu" ) ){
        fruit.broken( angle );
        if( fruit.isHomeMenu )
            switch( 1 ){
                case fruit.isDojoIcon:
                    sence.switchSence( "dojo-body" ); break;
                case fruit.isNewGameIcon:
                    sence.switchSence( "game-body" ); break;
                case fruit.isQuitIcon:
                    sence.switchSence( "quit-body" ); break;
            }
        return ;
    }
});

var tip = "";

if( !Ucren.isChrome )
    tip = "$为了获得最佳流畅度，推荐您使用 <span class='b'>Google Chrome</span> 体验本游戏";

if( !buzz.isSupported() )
    tip = tip.replace( "$", "您的浏览器不支持 &lt;audio&gt 播放声效，且" );

tip = tip.replace( "$", "" );

Ucren.Element( "browser" ).html( tip );

module.exports = exports;
