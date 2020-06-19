import Vue from "vue/dist/vue.esm.js";
import Utils from "./class/Utils.class.js";
import Loader from "./class/Loader.class.js";
import Timeline from "./class/Timeline.class.js";
import V_player from "./components/Player/V_player.vue";
import V_svgDefs from "./components/SixWeekView/V_SvgDefs.vue";
import V_taskTableFrame from "./components/SixWeekView/V_taskTableFrame.vue";
import V_forgeViewer from "./components/3DViewer/V_forgeViewer.vue";
import openSocket from "socket.io-client";

//Hammer si already on viewer3D.min.js loaded on index.html
//import Hammer from "hammerjs";

import "./index.scss";
import Config from "../config.js";
import "animate.css";
import TouchGesturesUtils from "./components/Utils/V_touchGesturesUtils.class.js";
import V_socketUtils from "./components/Utils/V_socketUtils.class.js";

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

	//Socket Server Connexion
	const socket = openSocket(window.location.host.replace("3000", "3001"));
	V_socketUtils.setSocket(socket);


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
						hammer.on("tap1", binding.value);

						TouchGesturesUtils.updateHammer(el);
					}
				}
			});

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

			Vue.directive("press", {
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
		
						hammer.on("press", binding.value);
						hammer.on("pressup", binding.value);

						TouchGesturesUtils.updateHammer(el);
					}
				}
			});

			Vue.directive("pan", {
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
		
						hammer.on("panstart", binding.value);
						hammer.on("panmove", binding.value);
						hammer.on("panend", binding.value);

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
			player : V_player,
			svgdefs : V_svgDefs,
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
 		<div>
	 		<div id="content">
	 			<div id="viewerFrame">
	 				<forgeviewer id="forgeViewer" v-bind:model="model" v-bind:timeline="timeline" v-bind:manifest="manifest" v-bind:oauth="oauth"></forgeviewer>
	 				<player id="mainPlayer" v-bind:duration="duration" v-bind:model="model" v-bind:timeline="timeline" v-bind:playerinit="playerinit"></player>
	 			</div>
	 			<tasktableframe id="taskTableFrame" v-bind:model="model" v-bind:timeline="timeline" v-bind:playerinit="playerinit" v-bind:duration="duration"></tasktableframe>
	 		</div>
	 		<svgdefs style="width : 0px; height: 0px;"></svgdefs>
	 	</div>
 		`
	});

}