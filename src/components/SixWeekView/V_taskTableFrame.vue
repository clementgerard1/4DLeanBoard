import "./V_taskTableFrame.scss";
import V_6Wrow from "./V_6Wrow.vue";
import V_6Wrow_header from "./V_6Wrow_header.vue";
import V_taskTableBackground from "./V_taskTableBackground.vue";
import TimelineUtils from "../Utils/V_timelineUtils.class.js";
import V_socketUtils from "../Utils/V_socketUtils.class.js";
import V_taskTableUtils from "../Utils/V_taskTableUtils.class.js";
import scssVariables from "./assets/_variables.scss";

import V_ganttDisplay from "./V_ganttDisplay.vue";

export default {
	components: {
		tasktablebackground : V_taskTableBackground,
		row6wheader : V_6Wrow_header,
		row6w : V_6Wrow,
		ganttdisplay : V_ganttDisplay,
	},
	methods : {
		updateTime : function(time){
			this.time = time;
			this.tasktablestart = Math.floor((this.time - this.offset) / 6) * 6 + this.offset;
		},
		updateOffset : function(offset){
			this.offset = offset;
			this.tasktablestart = Math.floor((this.time - this.offset) / 6) * 6 + this.offset;
		},
		windowUpdate : function(event){
			this.tasksize = (document.querySelector(".taskTableFrame").clientWidth - 80) / 6;
		},
		updateOpening : function(){
			this.nbopened = V_taskTableUtils.getOpenedTeam(); 
			this.nbclosed = V_taskTableUtils.getClosedTeam();
		},
		setPlanningDisplay : function(milestone, phases, weeks, week){
			this.ganttBool = week;
			this.weeksBool = weeks;
			this.phasesDisplayed = phases;
		}
	},
	created : function(){
		V_taskTableUtils.addFrame(this);
		const taskTeams = this.model.getTaskTeams();
		window.addEventListener("resize", this.windowUpdate);
		TimelineUtils.addListener("offset", this, this.updateOffset);
		TimelineUtils.addListener("time", this, this.updateTime);
		V_socketUtils.addW6();
	},
	mounted : function(){
		this.windowUpdate();
	},
	data: function(){
			let taskTableStart = Math.floor(this.playerinit / 6) * 6;
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
				ganttBool : false,
				weeksBool : false,
				offset : 0,
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
				return 'calc(100vh - ' + ((parseInt(scssVariables["playerHeight"].replace("px", "")) / 2) + 6) + 'px - ' + ((this.nbPhases * 41) + 27) + 'px ) !important';
			}else{
				return 'calc(100vh - ' + scssVariables["playerHeight"] + ') !important';
			}
		},
		_ifcProperties : function(){
			const toReturn = [];
			for(let i in this.ifcProperties){
				const infos = JSON.parse(this.ifcProperties[i]);
				for(let f in infos){
					for(let o in infos[f].objs3D){
						if(typeof toReturn[infos[f].objs3D[o].tag] == "undefined") toReturn[infos[f].objs3D[o].tag] = [];
						toReturn[infos[f].objs3D[o].tag].push(infos[f]); 
					}
				}
			}
			return toReturn;
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
		'ifcProperties'
	],
	template : `
		<div class="taskTableFrame" v-bind:style="{ height : newheight}">

			<!-- core -->
			<row6wheader v-if="weeksBool" v-bind:duration="_duration" v-bind:tasksize="tasksize" v-bind:tasktablestart="tasktablestart" v-bind:time="time" ></row6wheader>

			<div class="taskTableWrapper">

				<!-- background -->
				<tasktablebackground v-if="weeksBool" v-bind:tasksize="tasksize" v-bind:tasktablestart="tasktablestart" v-bind:time="time" v-bind:nbopened="nbopened" v-bind:nbclosed="nbclosed" id="taskTableBackground" v-bind:style="{paddingTop : '0px', paddingBottom : tasksize + 'px' }"></tasktablebackground>

				<template v-if="weeksBool" v-for="line in lines">
					<row6w v-bind:ifcProperties="_ifcProperties" v-bind:tasksize="tasksize" v-bind:tasktablestart="tasktablestart" v-bind:time="time" v-for="i in line.nb" :key="line.taskteam.getId() + '-' + (tasktablestart + i)" v-bind:taskteam="line.taskteam" v-bind:nth="i-1"></row6w>
				</template>

				<ganttdisplay v-if="ganttBool" ></ganttdisplay>
			</div>
	 	</div>
	`,
}