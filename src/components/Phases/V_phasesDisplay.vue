import "./V_phasesDisplay.scss";
import V_phaseItem from "./V_phaseItem.vue";
import V_timelineUtils from "../Utils/V_timelineUtils.class.js";

export default {
	components : {
		phaseitem : V_phaseItem
	},
	props :[
		"timeline",
		"model"
	],
	provide: function(){
		return {
			'timeline' : this.timeline,
			'model' : this.model,
		}
	},
	data : function(){
		return {
			time : null,
			displayed : true,
		}
	},
	computed : {
		phases : function(){
			if(this.model != null){	
				return this.model.getPhases();
			}
			return null;
		},
		_model : function(){
			return this.model;
		},
		_timeline : function(){
			return this.timeline;
		}
	},
	methods : {
		watchTime : function(time){
			this.time = time;
		},
	},
	created : function(){
		V_timelineUtils.addListener("time", this, this.watchTime);
	},
	template : `
	<div v-if="displayed" id="phaseF">
		<!-- PhasesFrame -->
		<phaseitem v-for="p in phases" :key="p.getId()" v-bind:time="time" v-bind:model="_model" v-bind:timeline="_timeline" v-bind:phase="p"></phaseitem>
	</div>`,
}