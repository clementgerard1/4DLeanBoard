import "./V_taskTableFrame.css";
import V_taskTable from "./V_taskTable.vue";

export default {
	components: {
		tasktable : V_taskTable,
	},
	data: function(){
			let taskTableStart = this.playerinit - 2;
			if(taskTableStart < 0) taskTableStart = 0;
			if(taskTableStart > this.duration - 6) taskTableStart = this.duration - 6;

			let time = taskTableStart + 2;
			if(time < 2){
				time = this.taskTableStart + time;
			}
			if(time > this.duration - 3){
				time = this.duration - (this.duration- time);
			}
			return {
				tasktablestart : taskTableStart,
				time : time
			};
	},
	props:[
		'model',
		'timeline',
		'playerinit',
		'duration'
	],
	computed:{
		_model : function(){ return this.model; },
		_timeline : function(){ return this.timeline; },
		_duration : function(){ return this.duration; }
	},
	watch:{
		time: function(){
			let taskTableStart = this.time - 2;
			if(taskTableStart < 0) taskTableStart = 0;
			if(taskTableStart > this.duration - 6) taskTableStart = this.duration - 6;
			this.tasktablestart = taskTableStart;
		}
	},
	template : `
		<div id="taskTableFrame">
			<tasktable v-bind:model="_model" v-bind:timeline="_timeline" v-bind:tasktablestart="tasktablestart" v-bind:time="time" v-bind:duration="_duration"></tasktable>
	 		<input id="taskTablePlayer" min=0 v-bind:max="_duration" type="number" v-model.number="time"/>
	 	</div>
	`,
}