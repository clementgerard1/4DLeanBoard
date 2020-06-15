import Vue from "vue/dist/vue.esm.js";
import Utils from "./class/Utils.class.js";
import Loader from "./class/Loader.class.js";
import Timeline from "./class/Timeline.class.js";
import V_player from "./components/Player/V_player.vue";
import V_svgDefs from "./components/SixWeekView/V_SvgDefs.vue";
import V_taskTableFrame from "./components/SixWeekView/V_taskTableFrame.vue";

//Hammer si already on viewer3D.min.js loaded on index.html
import Hammer from "hammerjs";

import "./indexW6.scss";
import Config from "../config.js";
import "animate.css";
import TouchGesturesUtils from "./components/Utils/V_touchGesturesUtils.class.js";

window.addEventListener("load", function(){
	init();
});

async function init(){

	//FPS TEST 
	//Need add p with fps id on index.html
	/*	let fpsLast = null;
		let fpsTime = 0;
		let fpsCount = 0;
		let fpsDisplay = 150;
		const p = document.getElementById("fps");
		window.requestAnimationFrame(fps);

		function fps(){
			const now = new Date().getTime();
			if(fpsLast != null){
				fpsTime += (now - fpsLast);
				fpsCount++;
				if(fpsTime > fpsDisplay){
					p.innerHTML = (fpsCount * (1000 / fpsTime)).toFixed(2);
					fpsTime = 0;
					fpsCount = 0;
				}
			}
			fpsLast = now;
			window.requestAnimationFrame(fps);
		}*/
	//FIN FPS TEST

	let model = null;
	let playerInit = null;
	let duration = null;
	let manifest = null;
	let oAuth = null;
	let timeline = null;

	await Promise.all([Utils.loadTextFile("datas/Project1v2.json"), Utils.loadTextFile("datas/Project1.ifc")])
	.then( files => {
			return Loader.fromJSONandIFC(files[0], files[1]);
		})
	.then( tl => {
			//Model Loaded and Timeline created
			timeline = tl;
			model = timeline.getModel();
			playerInit = 0;
			const phase = timeline.getModel().getMilestones()[0].getPhases()[0];
		  	duration = model.getDuration();

	  	//Touch gestures
	  	Vue.directive("tap", {
				bind: function(el, binding) 
				{
					if(el.getAttribute("hammerid") == null){
						el.setAttribute("hammerid", Utils.getId("hammer"));
					}
					if (typeof binding.value === "function") {
						let hammer = TouchGesturesUtils.getHammer(el);

						if(hammer == null){
							hammer = new Hammer(el);
							TouchGesturesUtils.addHammer(el, hammer);
						} 

						const singleTap = new Hammer.Tap({
								event: 'tap1'
						});
						singleTap.recognizeWith(hammer.recognizers)
						hammer.add([singleTap]);
						hammer.on("tap1", function(){binding.value();});

						TouchGesturesUtils.updateHammer(el);
					}
				}
			});

			//Touch gestures
	  	Vue.directive("doubletap", {
				bind: function(el, binding) 
				{
					if(el.getAttribute("hammerid") == null){
						el.setAttribute("hammerid", Utils.getId("hammer"));
					}
					if (typeof binding.value === "function") {
						let hammer = TouchGesturesUtils.getHammer(el);
						if(hammer == null){
							hammer = new Hammer(el);
							TouchGesturesUtils.addHammer(el, hammer);
						} 
						
						const doubleTap = new Hammer.Tap(
							{event: 'tap2', taps: 2, interval: 300, posThreshold: 150, threshold: 50 }
						);
						doubleTap.recognizeWith(hammer.recognizers)
						hammer.add(doubleTap);
						hammer.on("tap2", binding.value);

						TouchGesturesUtils.updateHammer(el);
					}
				}
			});
		})
	.catch( error => console.error(error));


	const app = new Vue({
		el : '#content',
		components : {
			tasktableframe : V_taskTableFrame,
			svgdefs : V_svgDefs,
		},
		data:{
			playerinit : playerInit,
			timeline : timeline,
			model : model,
			duration : duration,
 		},

 		template : `
 		<div>
	 		<div id="content">
	 			<tasktableframe id="taskTableFrame" v-bind:model="model" v-bind:timeline="timeline" v-bind:playerinit="playerinit" v-bind:duration="duration"></tasktableframe>
	 		</div>
	 		<svgdefs style="width : 0px; height: 0px;"></svgdefs>
	 	</div>
 		`
	});

}