import "./V_taskTableFrame.scss";
import V_6Wrow from "./V_6Wrow.vue";
import V_6Wrow_header from "./V_6Wrow_header.vue";
import V_taskTableBackground from "./V_taskTableBackground.vue";
import V_taskTableFront from "./V_taskTableFront.vue";
import TimelineUtils from "../Utils/V_timelineUtils.class.js";


export default {
	components: {
		tasktablebackground : V_taskTableBackground,
		tasktablefront : V_taskTableFront,
		row6wheader : V_6Wrow_header,
		row6w : V_6Wrow,
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
			const phases = this.timeline.getPhasesBetweenTwoDates(0, this.duration);
			const lines = [];
			for(let p in phases){
				const taskTeams = phases[p].getTaskTeams();
				for(let t in taskTeams){
					lines[lines.length] = {
						phase : phases[p],
						taskteam : taskTeams[t],
						nb : this.timeline.getMaxSimultaneousTasksByPhaseAndTaskTeamBetweenTwoDates(phases[p], taskTeams[t], 0, this.duration)
					}
				}
			}
			return {
				tasktablestart : taskTableStart,
				time : this.playerinit,
				lines : lines,
				nbopened : 0, //updated on row6w component
				nbclosed : 0,	//updated on row6w component
			};
	},	
	provide: function(){
		return {
			'timeline' : this.timeline,
			'model' : this.model,
		}
	},
	props:[
		'model',
		'timeline',
		'playerinit',
		'duration',
	],
	template : `
		<div class="taskTableFrame">

			<div class="taskTableWrapper">

				<!-- background -->
				<tasktablebackground v-bind:tasktablestart="tasktablestart" v-bind:time="time" v-bind:nbopened="nbopened" v-bind:nbclosed="nbclosed" id="taskTableBackground"></tasktablebackground>

				<!-- core -->
				<row6wheader v-bind:tasktablestart="tasktablestart" v-bind:time="time" ></row6wheader>
				<template v-for="line in lines">
					<row6w v-bind:tasktablestart="tasktablestart" v-bind:time="time" v-for="i in line.nb" :key="line.phase.getId() + '-' + line.taskteam.getId() + '-' + i" v-bind:taskteam="line.taskteam" v-bind:phase="line.phase"></row6w>
				</template>

				<!-- front -->
				<tasktablefront v-bind:tasktablestart="tasktablestart" v-bind:time="time" v-bind:nbopened="nbopened" v-bind:nbclosed="nbclosed" id="taskTableFront"></tasktablefront>
			</div>
	 	</div>
	`,
}