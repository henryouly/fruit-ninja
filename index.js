var startModule = function() {
  require('scripts/main').start();
}

var installPoseDragger = function(dragger) {
  require('scripts/control').installPoseDragger(dragger);
}

export {startModule, installPoseDragger};

