const Hammer = require("hammerjs");
require("animate.css");

module.exports = () => {

	window.addEventListener("load", function(){
		init();
	});
	
}

function init(){

	// get a reference to an element
	var stage = document.getElementById('stage');
	 
	// create a manager for that element
	var mc = new Hammer.Manager(stage);
	 
	// create a recognizer
	var tap = new Hammer.Tap();
	 
	// add the recognizer
	mc.add(tap);
	 
	// subscribe to events
	mc.on('tap', function(e) {
	    // do something cool
	    stage.className = 'selected'
	});

}