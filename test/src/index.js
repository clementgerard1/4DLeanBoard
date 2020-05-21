window.console.log = function(m){
	console.log("bonjour");
}

const test1 = require("./test1/test1.js");
const test2 = require("./test2/test2.js");

for( let n in window.boardClasses){
	eval("window." + n + " = window.boardClasses[n];");
}

const str = window.location.href.split("/");
if(str[str.length-1] != ""){
	eval(str[str.length-1] + "()");
} else if(str[str.length-2] != "" && str[str.length-2] != "localhost:3000"){
	eval(str[str.length-2] + "()");
}