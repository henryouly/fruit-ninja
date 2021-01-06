let startModule = function() {
	require('scripts/main').start();
};

let installPoseDragger = function(dragger) {
	require('scripts/control').installPoseDragger(dragger);
};

export {startModule, installPoseDragger};

