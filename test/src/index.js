const test1 = require("./test1/test1.js");
const test2 = require("./test2/test2.js");
const test3 = require("./test3/test3.js");
const test4 = require("./test4/test4.js");
const test5 = require("./test5/test5.js");

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