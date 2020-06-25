import DataApi from "../dataServer/DataApi.class.js";
import Vue from "vue/dist/vue.esm.js";
import Utils from "./class/Utils.class.js";
import Loader from "./class/Loader.class.js";
import Timeline from "./class/Timeline.class.js";
import Model from "./class/Model.class.js";
import V_player from "./components/Player/V_player.vue";
import V_filterPanel from "./components/FilterPanel/V_filterPanel.vue";
import V_svgDefs from "./components/SixWeekView/V_SvgDefs.vue";
import V_taskTableFrame from "./components/SixWeekView/V_taskTableFrame.vue";
import V_forgeViewer from "./components/3DViewer/V_forgeViewer.vue";
import V_modelSelect from "./components/V_modelSelect.vue";
import openSocket from "socket.io-client";
import V_timelineUtils from "./components/Utils/V_timelineUtils.class.js";
import V_taskTableUtils from "./components/Utils/V_taskTableUtils.class.js";

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

function init(){

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

	const app = new Vue({
		el : '#content',
		components : {
			filterpanel : V_filterPanel,
			forgeviewer : V_forgeViewer,
			tasktableframe : V_taskTableFrame,
			player : V_player,
			svgdefs : V_svgDefs,
			modelselect : V_modelSelect,
		},
		data:{
			playerinit : null,
			timeline : null,
			model : null,
			duration : null,
			manifest : null,
			oauth : null,
			modelSelected : false,
			selectPanel : false,
			forgeReady : false,
 		},
 		methods:{
 			findGetParameter : function(parameterName) {
			    var result = null,
			        tmp = [];
			    location.search
			        .substr(1)
			        .split("&")
			        .forEach(function (item) {
			          tmp = item.split("=");
			          if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
			        });
			    return result;
			},
			setModel : function(modelName){
				this.selectPanel = false;
				this.loadModel(modelName);
			},
 			loadModel : function(modelName){
 				DataApi.isAvailable().then(available => {
					if(false && available){
						return DataApi.getModel(modelName);
					}else{
						return Promise.all([Utils.loadTextFile("datas/Project1v3.json"), Utils.loadTextFile("datas/Project1.ifc")])
						.then( files => {
							return Loader.fromJSONandIFC(files[0], files[1]);
						})
					}
				})
				.then( mod => {
						//Model Loaded
						this.model = mod;
						if(this.model.getName() == "") this.model.setName("test");
						this.timeline = new Timeline(this.model);
						this.playerInit = 0;

						V_timelineUtils.setTimeline(this.timeline);
						V_taskTableUtils.clearTokens();
						const selected = this.timeline.getTasksBetweenTwoDates(this.playerInit * 7, (this.playerInit * 7) + 7);
						for(let s in selected){
							V_taskTableUtils.setToken(selected[s], true);
						}

						const phase = this.timeline.getModel().getMilestones()[0].getPhases()[0];
					  	this.duration = this.model.getDuration();


						//Socket Server Connexion
						const socket = openSocket(window.location.host.replace("3000", "3001"));
						V_socketUtils.setSocket(socket);
						this.modelSelected = true;

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

					this.manifest = datas.manifest;
					this.oauth = datas.oAuth;
					this.forgeReady = true;
				})
				.catch( error => console.error(error));
 			},
 			handleTap : function(){
 				this.loadModel("test");
 			}
 		},
 		created : function(){
 			DataApi.isAvailable().then(available => {
 				if(available){
		 			const modelName = this.findGetParameter("model");
		 			const type = this.findGetParameter("model"); // 3D, 6W, Player
		 			if(modelName != null){
		 				this.loadModel(modelName);
		 			}else{
		 				this.selectPanel = true;
		 			}
		 		}else{
		 			console.error("DATA SERVER DOESN'T AVAILABLE");
		 			this.loadModel("");
		 		}
		 	});
 		},
 		template : `
 		<div>
	 		<div id="content">

	 			<modelselect id="modelSelect" v-if="selectPanel" v-on:setModel="setModel($event)">
	 				<p v-tap="handleTap"> No selected </p>
	 			</modelselect>

	 			<div v-if="forgeReady" id="viewerFrame">
	 				<filterpanel id="filterPanel" v-bind:model="model"></filterpanel>
	 				<forgeviewer id="forgeViewer" v-bind:model="model" v-bind:timeline="timeline" v-bind:manifest="manifest" v-bind:oauth="oauth"></forgeviewer>
	 				<player id="mainPlayer" v-bind:duration="duration" v-bind:model="model" v-bind:timeline="timeline" v-bind:playerinit="playerinit"></player>
	 			</div>
	 			<tasktableframe v-if="modelSelected" id="taskTableFrame" v-bind:model="model" v-bind:timeline="timeline" v-bind:playerinit="playerinit" v-bind:duration="duration"></tasktableframe>

	 		</div>
	 		<svgdefs style="width : 0px; height: 0px;"></svgdefs>
	 	</div>
 		`
	});

}