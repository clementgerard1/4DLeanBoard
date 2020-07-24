import "./V_taskTableFrame.scss";
import V_6Wrow from "./V_6Wrow.vue";
import V_6Wrow_header from "./V_6Wrow_header.vue";
import V_taskTableBackground from "./V_taskTableBackground.vue";
import V_taskTableFront from "./V_taskTableFront.vue";
import TimelineUtils from "../Utils/V_timelineUtils.class.js";
import V_socketUtils from "../Utils/V_socketUtils.class.js";
import V_taskTableUtils from "../Utils/V_taskTableUtils.class.js";
import scssVariables from "./assets/_variables.scss";


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
		updateOpening : function(){
			this.nbopened = V_taskTableUtils.getOpenedTeam(); 
			this.nbclosed = V_taskTableUtils.getClosedTeam();
		}
	},
	created : function(){
		V_taskTableUtils.addFrame(this);
		const taskTeams = this.model.getTaskTeams();
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
				for( let n = 0 ; n < lines[lines.length - 1].nb ; n++){
					V_taskTableUtils.setTeam(taskTeams[t], n);
				}
			}
			return {
				tasktablestart : taskTableStart,
				time : this.playerinit,
				lines : lines,
				nbopened : V_taskTableUtils.getOpenedTeam(), //updated on row6w component
				nbclosed : V_taskTableUtils.getClosedTeam(),	//updated on row6w component
				tasksize : 0,
				phasesDisplayed : true,
				nbPhases : this.model.getPhases().length,
			};
	},	
	provide: function(){
		return {
			'timeline' : this.timeline,
			'model' : this.model,
		}
	},
	computed : {
		_duration : function(){
			return this.duration;
		},
		newheight : function(){
			if(this.phasesDisplayed){
				return 'calc(100vh - ' + (parseInt(scssVariables["playerHeight"].replace("px", "")) / 2) + 'px - ' + ((this.nbPhases * 38) + 7) + 'px ) !important';
			}else{
				return 'calc(100vh - ' + scssVariables["playerHeight"] + ') !important';
			}
		}
	},
	watch : {
		tasktablestart : function(){
			this.$forceUpdate();
		}
	},
	props:[
		'model',
		'timeline',
		'playerinit',
		'duration',
	],
	template : `
		<div class="taskTableFrame" v-bind:style="{ height : newheight}">

			<div class="taskTableWrapper">

				<!-- background -->
				<tasktablebackground v-bind:tasksize="tasksize" v-bind:tasktablestart="tasktablestart" v-bind:time="time" v-bind:nbopened="nbopened" v-bind:nbclosed="nbclosed" id="taskTableBackground" v-bind:style="{paddingTop : tasksize + 'px', paddingBottom : tasksize + 'px' }"></tasktablebackground>

				<!-- core -->
				<row6wheader v-bind:duration="_duration" v-bind:tasksize="tasksize" v-bind:tasktablestart="tasktablestart" v-bind:time="time" ></row6wheader>
				<template v-for="line in lines">
					<row6w v-bind:tasksize="tasksize" v-bind:tasktablestart="tasktablestart" v-bind:time="time" v-for="i in line.nb" :key="line.taskteam.getId() + '-' + (tasktablestart + i)" v-bind:taskteam="line.taskteam" v-bind:nth="i-1"></row6w>
				</template>

				<!-- front -->
				<!--<tasktablefront v-bind:tasksize="tasksize" v-bind:tasktablestart="tasktablestart" v-bind:time="time" v-bind:nbopened="nbopened" v-bind:nbclosed="nbclosed" id="taskTableFront" v-bind:style="{paddingTop : tasksize + 'px', paddingBottom : tasksize + 'px' }"></tasktablefront>-->
			</div>
	 	</div>
	`,
}