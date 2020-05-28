import Vue from "vue/dist/vue.esm.js";
import Utils from "./class/Utils.class.js";
import Loader from "./class/Loader.class.js";
import Timeline from "./class/Timeline.class.js";
import V_taskTable from "./components/V_taskTable.vue";

window.addEventListener("load", function(){
	init();
});

function init(){

	Promise.all([Utils.loadTextFile("datas/Project1.csv"), Utils.loadTextFile("datas/Project1.ifc")])
	.then( files => Loader.fromCSVandIFC(files[0], files[1]))
	.then( timeline => {
		//Model Loaded and Timeline created
		const model = timeline.getModel();
		const taskTableStart = 10;
		const phase = timeline.getModel().getMilestones()[0].getPhases()[0];
	  const duration = model.getDuration();

		const app = new Vue({
			el : '#content',
			components : {
				tasktable : V_taskTable,
			},
			data:{
				tasktablestart : taskTableStart,
				timeline : timeline,
				model : model,
				duration : duration
	 		},

	 		template : `
	 		<div>
	 			<tasktable v-bind:model="model" v-bind:timeline="timeline" v-bind:tasktablestart="tasktablestart" v-bind:duration="duration"></tasktable>
	 			<input min=0 v-bind:max="duration" type="number" v-model.number="tasktablestart"/>
	 		</div>
	 		`
		});

	})
	.catch( error => console.error(error));

}