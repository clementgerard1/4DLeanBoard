module.exports = () => {

	window.addEventListener("load", function(){
		init();
	});
	
}

const events = {
	"click" : false,
	"mousedown" : false,
	"mouseup" : false,
	"mousemove" : false,
	"touchstart" : true,
	"touchend" : false,
	"touchmove" : false,
}

function init(){
	const body = document.getElementsByTagName("body")[0];
	for( let e in events){
		const c = document.createElement("div");
		c.classList.add("control");
		const check = document.createElement("input");
		check.type = "checkbox";
		check.checked = events[e];
		const label = document.createElement("div");
		label.innerHTML = e;
		c.appendChild(check);
		c.appendChild(label);

		let eventFunc = (event) => { log(event, e) }
		
		//Add EventListeners
		if(events[e]){
			body.addEventListener(e, eventFunc);
		}

		check.addEventListener("change", function(){
			events[e] = !events[e];
			if(events[e]){
				body.addEventListener(e, eventFunc);
			}else{
				body.removeEventListener(e, eventFunc);
			}
		});

		document.getElementById("controls").appendChild(c);

	}
}

function log(event, message){
	if(eval("typeof " + message + " === 'function'")){
		message = eval(message + "(event, message)");
	}

	const p = document.createElement("p");
	p.innerHTML = message;
	p.classList.add("log");
	document.getElementById("content").appendChild(p);
}

function click(event, message){
	return message + " X : " + event.clientX + " Y : " + event.clientY;
}

function mouse(event, message){
	return message + " X : " + event.clientX + " Y : " + event.clientY;
}

function mousemove(event, message){
	return mouse(event, message);
}

function mousedown(event, message){
	return mouse(event, message);
}

function mouseup(event, message){
	return mouse(event, message);
}

function touch(event, message){
	let mes = message + "<br/>";
	for(let t in event.changedTouches){
		if(typeof event.changedTouches[t].identifier != "undefined"){
			mes += "TouchId : " + event.changedTouches[t].identifier;
			mes += " ; X : " + event.changedTouches[t].clientX;
			mes += " ; Y : " + event.changedTouches[t].clientY;
			mes += "<br/>";
		}
	}
	return mes;
}

function touchstart(event, message){
	return touch(event, message);
}

function touchend(event, message){
	console.log(event, message);
	return touch(event, message);
}

function touchmove(event, message){
	return touch(event, message);
}