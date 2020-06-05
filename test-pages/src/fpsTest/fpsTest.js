module.exports = () => {

	window.addEventListener("load", function(){
		init();
	});
	
}

function init(){

	let fpsLast = null;
	let fpsTime = 0;
	let fpsCount = 0;
	let fpsDisplay = 150;
	const p = document.getElementById("fps");
	const vw = document.getElementById("viewportW");
	const vh = document.getElementById("viewportH");
	const dw = document.getElementById("documentW");
	const dh = document.getElementById("documentH");
	console.log(p, vw, vh, dw, dh);
	window.requestAnimationFrame(fps);

	function fps(){
		const now = new Date().getTime();
		if(fpsLast != null){
			fpsTime += (now - fpsLast);
			fpsCount++;
			if(fpsTime > fpsDisplay){
				p.innerHTML = "fps = " + (fpsCount * (1000 / fpsTime)).toFixed(2);
				fpsTime = 0;
				fpsCount = 0;
			}
		}
		vw.innerHTML = "window.innerWidth = " + window.innerWidth;
		vh.innerHTML = "window.innerHeight = " + window.innerHeight;
		dw.innerHTML = "document.clientWidth = " + document.documentElement.clientWidth;
		dh.innerHTML = "document.clientHeight = " + document.documentElement.clientHeight;
		fpsLast = now;
		window.requestAnimationFrame(fps);
	}

}

