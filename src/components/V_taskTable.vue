import "./V_taskTable.css";
import V_task from "./V_task.vue";
import Model from "../class/Model.class.js";

export default {
	components: {
		task : V_task,
	},
	data : function(){
		return {
			
		}
	},
	props : [
		'timeline',
		'tasktablestart'
	],
	provide: function(){
		return {
			'timeline' : this.timeline,

		}
	},
	computed: {
		teamsInfos: function(){
			this.tasktablestart = parseInt(this.tasktablestart);
			const teams = this.timeline.getTaskTeams(this.tasktablestart, this.tasktablestart + 5);
			const infos = [];
			for(let t in teams){
				infos[infos.length] = {
					id : teams[t].id,
					team : teams[t]
				};
			}
			return infos;
		}
	},
	template : `
		<div id="taskTable">
			<div class="column played">
				<task v-bind:time="tasktablestart"  v-for="teamI in teamsInfos" :key="teamI.id" v-bind:team="teamI.team"></task>
			</div>
			<div class="column">
				<task v-bind:time="tasktablestart + 1" v-for="teamI in teamsInfos" :key="teamI.id" v-bind:team="teamI.team"></task>
			</div>
			<div class="column">
				<task v-bind:time="tasktablestart + 2" v-for="teamI in teamsInfos" :key="teamI.id" v-bind:team="teamI.team"></task>
			</div>
			<div class="column">
				<task v-bind:time="tasktablestart + 3" v-for="teamI in teamsInfos" :key="teamI.id" v-bind:team="teamI.team"></task>
			</div>
			<div class="column">
				<task v-bind:time="tasktablestart + 4" v-for="teamI in teamsInfos" :key="teamI.id" v-bind:team="teamI.team"></task>
			</div>
			<div class="column">
				<task v-bind:time="tasktablestart + 5" v-for="teamI in teamsInfos" :key="teamI.id" v-bind:team="teamI.team"></task>
			</div>
		</div>
	`,
}