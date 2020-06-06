import Vue from "vue/dist/vue.esm.js";
import Utils from "./class/Utils.class.js";
import Loader from "./class/Loader.class.js";
import Timeline from "./class/Timeline.class.js";
import V_taskTable from "./components/V_taskTable.vue";
import V_taskTableFrame from "./components/V_taskTableFrame.vue";
import V_forgeViewer from "./components/V_forgeViewer.vue";
import Hammer from "hammerjs";
import "./index.scss";
import Config from "../config.js";
import "animate.css";
import TouchGesturesUtils from "./components/utils/V_TouchGesturesUtils.class.js";

window.addEventListener("load", function(){
	init();
});

async function init(){

	//TEST
		let fpsLast = null;
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
		}
	//TEST

	let model = null;
	let playerInit = null;
	let duration = null;
	let manifest = null;
	let oAuth = null;
	let timeline = null;

	await Utils.loadTextFile("datas/Project1v2.json")
	.then( file => Loader.fromJSON(file))
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

			//Création du viewer
			let clientId = Config.autoDeskForgeSettings[Config.autoDeskAccount].clientId;
			let clientSecret = Config.autoDeskForgeSettings[Config.autoDeskAccount].clientSecret;

			if(Config["forgeRenderer"]){
				return Utils.getAutodeskAuth(clientId, clientSecret);
			}else{
				throw new Error("Not an error, just not rendering forge")
			}
		})
	.then(Utils.createForgeBucket)
	.then( oAuth => Utils.uploadIFCFileToForge(oAuth, "datas/Project1.ifc"))
	.then( datas => {

		manifest = datas.manifest;
		oAuth = datas.oAuth;

	})
	.catch( error => console.error(error));


	const app = new Vue({
		el : '#content',
		components : {
			forgeviewer : V_forgeViewer,
			tasktableframe : V_taskTableFrame,
		},
		data:{
			playerinit : playerInit,
			timeline : timeline,
			model : model,
			duration : duration,
			manifest : manifest,
			oauth : oAuth
 		},

 		template : `
 		<div id="content">
 			<forgeviewer v-bind:model="model" v-bind:timeline="timeline" v-bind:manifest="manifest" v-bind:oauth="oauth"></forgeviewer>
 			<tasktableframe v-bind:model="model" v-bind:timeline="timeline" v-bind:playerinit="playerinit" v-bind:duration="duration"></tasktableframe>
 		</div>
 		`
	});

}