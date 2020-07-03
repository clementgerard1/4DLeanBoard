import "./V_taskTableFrame.scss";
import V_6Wrow from "./V_6Wrow.vue";
import V_6Wrow_header from "./V_6Wrow_header.vue";
import V_taskTableBackground from "./V_taskTableBackground.vue";
import V_taskTableFront from "./V_taskTableFront.vue";
import TimelineUtils from "../Utils/V_timelineUtils.class.js";
import V_socketUtils from "../Utils/V_socketUtils.class.js";


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
		},
		windowUpdate : function(event){
			this.tasksize = (document.querySelector(".taskTableFrame").clientWidth - 80) / 6;
		},
	},
	created : function(){
		window.addEventListener("resize", this.windowUpdate);
		TimelineUtils.addListener("time", this, this.updateTime);
		V_socketUtils.addW6();
	},
	mounted : function(){
		this.windowUpdate();
	},
	data: function(){
			let taskTableStart = Math.trunc(this.playerinit / 6) * 6;
			const phases = this.timeline.getPhasesBetweenTwoDates(0, this.duration - 1);
			const lines = [];
			const taskTeams = this.model.getTaskTeams();

			for(let t in taskTeams){
				lines[lines.length] = {
					taskteam : taskTeams[t],
					nb : this.timeline.getMaxSimultaneousTasksByTaskTeamBetweenTwoDates(taskTeams[t], 0, this.duration - 1)
				}
			}
			return {
				tasktablestart : taskTableStart,
				time : this.playerinit,
				lines : lines,
				nbopened : 0, //updated on row6w component
				nbclosed : 0,	//updated on row6w component
				tasksize : 0,
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
				<tasktablebackground v-bind:tasksize="tasksize" v-bind:tasktablestart="tasktablestart" v-bind:time="time" v-bind:nbopened="nbopened" v-bind:nbclosed="nbclosed" id="taskTableBackground" v-bind:style="{paddingTop : tasksize + 'px', paddingBottom : tasksize + 'px' }"></tasktablebackground>

				<!-- core -->
				<row6wheader v-bind:tasksize="tasksize" v-bind:tasktablestart="tasktablestart" v-bind:time="time" ></row6wheader>
				<template v-for="line in lines">
					<row6w v-bind:tasksize="tasksize" v-bind:tasktablestart="tasktablestart" v-bind:time="time" v-for="i in line.nb" :key="line.taskteam.getId() + '-' + i" v-bind:taskteam="line.taskteam" v-bind:nth="i-1"></row6w>
				</template>

				<!-- front -->
				<tasktablefront v-bind:tasksize="tasksize" v-bind:tasktablestart="tasktablestart" v-bind:time="time" v-bind:nbopened="nbopened" v-bind:nbclosed="nbclosed" id="taskTableFront" v-bind:style="{paddingTop : tasksize + 'px', paddingBottom : tasksize + 'px' }"></tasktablefront>
			</div>
	 	</div>
	`,
}