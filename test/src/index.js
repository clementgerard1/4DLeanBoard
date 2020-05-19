const test1 = require("./test1/test1.js");

const str = window.location.href.split("/");
if(str[str.length-1] != ""){
	eval(str[str.length-1] + "()");
} else if(str[str.length-2] != "" && str[str.length-2] != "localhost:3000"){
	eval(str[str.length-2] + "()");
}

console.log("HEY");