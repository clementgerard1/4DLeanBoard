import "./V_taskTableFrame.scss";
import V_taskTable from "./V_taskTable.vue";
import V_taskTablePhaseRow from "./V_taskTablePhaseRow.vue";
import TimelineUtils from "./utils/V_timelineUtils.class.js";

export default {
	components: {
		tasktable : V_taskTable,
		tasktablephaserow : V_taskTablePhaseRow,
	},
	methods : {
		updateTime : function(time){
			this.time = time;
			this.tasktablestart = Math.trunc(this.time / 6) * 6;
		}
	},
	created : function(){
		TimelineUtils.addListener("time", this, this.updateTime);
	},
	data: function(){
			let taskTableStart = Math.trunc(this.playerinit / 6) * 6;
			return {
				tasktablestart : taskTableStart,
				time : this.playerinit,
				maximum : Math.trunc(this.duration / 7)
			};
	},
	props:[
		'model',
		'timeline',
		'playerinit',
		'duration'
	],
	computed:{
		_time : function(){ 
			return this.time;
		},
		_model : function(){ return this.model; },
		_timeline : function(){ return this.timeline; },
		_duration : function(){ return this.duration; }
	},
	template : `
		<div id="taskTableFrame">
			<tasktable v-bind:model="_model" v-bind:timeline="_timeline" v-bind:tasktablestart="tasktablestart" v-bind:time="_time" v-bind:duration="_duration"></tasktable>
	 	</div>
	`,
}