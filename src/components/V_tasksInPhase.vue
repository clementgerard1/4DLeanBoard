import V_task from "./V_task.vue";
import "./V_tasksInPhase.scss";

export default {
	data : function(){
		return {
			"status" : false
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
		/*teams : function(){
			const teams = this.timeline.getTaskTeamsBetweenTwoDatesByPhase(this.phase, 0, this.duration);
			return teams;
			//return this.timeline.getTaskTeamsBetweenTwoDates(this.phase, this.tasktablestart, this.tasktablestart + 5);
		},
		tasks : function(){
			const tasks = this.timeline.getTaskTeamsBetweenTwoDatesByPhase(this.phase, 0, this.duration);
			return tasks;
		},*/
		lines : function(){
			const teams = this.timeline.getTaskTeamsBetweenTwoDatesByPhase(this.phase, 0, this.duration);
			const toReturn = [];
			for(let t in teams){
				const tasks = this.timeline.getTasksByTeamAndPhaseBetweenTwoDates(this.phase, teams[t], this.tasktablestart * 7, (this.tasktablestart + 5) * 7);
				for(let i = 0 ; i < tasks.length ; i++){
					toReturn[toReturn.length] = {
						"taskteam" : teams[t],
						"nth" : i
					}
				}
			}
			
			return toReturn;
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
			<task v-bind:time="_time" v-bind:phase="_phase" v-for="line in lines" :key="line.taskteam.getId() + '-' + line.nth" v-bind:team="line.taskteam" v-bind:nth="line.nth"></task>
		</div>`,
}