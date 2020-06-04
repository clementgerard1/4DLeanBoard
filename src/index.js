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

window.addEventListener("load", function(){
	init();
});

async function init(){

	let model = null;
	let playerInit = null;
	let duration = null;
	let manifest = null;
	let oAuth = null;
	let timeline = null;

	await Utils.loadTextFile("datas/Project1.json")
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
				bind: function(el, binding) {
					if (typeof binding.value === "function") {
						const mc = new Hammer(el);
						var tap = new Hammer.Tap();
						mc.add(tap);
						mc.on("tap", binding.value);
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