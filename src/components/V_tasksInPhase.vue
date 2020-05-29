import V_task from "./V_task.vue";
import "./V_tasksInPhase.css";

export default {
	data : function(){
		return {
		}
	},
	components : {
		task : V_task,
	},
	inject : [
		'timeline',
		'model',
	],
	provide: function(){
		return {
			'timeline' : this.timeline,
			'model' : this.model,
		}
	},
	props : [
		"time",
		"phase",
		"tasktablestart",
		"duration",
	],
	computed: {
		teams : function(){
			return this.timeline.getTaskTeamsBetweenTwoDates(this.phase, 0, this.duration);
			//return this.timeline.getTaskTeamsBetweenTwoDates(this.phase, this.tasktablestart, this.tasktablestart + 5);
		},
		_time : function(){
			return this.time;
		},
		_phase : function(){
			return this.phase;
		}
	},
	template : `
		<div>
			<task v-bind:time="_time" v-bind:phase="_phase" v-for="team in teams" :key="team.id" v-bind:team="team" v-bind:task="team"></task>
		</div>`,
}