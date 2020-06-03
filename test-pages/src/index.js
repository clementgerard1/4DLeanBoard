const dataStructure = require("./dataStructure/dataStructure.js");
const privatePropertiesAndMethods = require("./privatePropertiesAndMethods/privatePropertiesAndMethods.js");
const testTouches = require("./testTouches/testTouches.js");
const touchGestures = require("./touchGestures/touchGestures.js");
const animateTests = require("./animateTests/animateTests.js");

for( let n in window.boardClasses){
	eval("window." + n + " = window.boardClasses[n];");
}

for( let m in window.vueClasses){
	eval("window." + m + " = window.vueClasses[m];");
}

const str = window.location.href.split("/");
if(str[str.length-1] != ""){
	eval(str[str.length-1] + "()");
} else if(str[str.length-2] != "" && str[str.length-2] != "localhost:3000"){
	eval(str[str.length-2] + "()");
}