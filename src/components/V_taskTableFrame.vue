import "./V_taskTableFrame.scss";
import V_taskTable from "./V_taskTable.vue";
import V_taskTablePhaseRow from "./V_taskTablePhaseRow.vue";

export default {
	components: {
		tasktable : V_taskTable,
		tasktablephaserow : V_taskTablePhaseRow,
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
		_model : function(){ return this.model; },
		_timeline : function(){ return this.timeline; },
		_duration : function(){ return this.duration; }
	},
	watch:{
		time: function(){
			/*
			let taskTableStart = this.time - 2;
			if(taskTableStart < 0) taskTableStart = 0;
			if(taskTableStart > this.duration - 6) taskTableStart = this.duration - 6;
			this.tasktablestart = taskTableStart;*/
			this.tasktablestart = Math.trunc(this.time / 6) * 6;
		}
	},
	template : `
		<div id="taskTableFrame">
			<tasktablephaserow></tasktablephaserow>
			<tasktable v-bind:model="_model" v-bind:timeline="_timeline" v-bind:tasktablestart="tasktablestart" v-bind:time="time" v-bind:duration="_duration"></tasktable>
	 		<input id="taskTablePlayer" min=0 v-bind:max="maximum" type="number" v-model.number="time"/>
	 	</div>
	`,
}