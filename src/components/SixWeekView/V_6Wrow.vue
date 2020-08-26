import "./V_6Wrow.scss";
import TimelineUtils from "../Utils/V_timelineUtils.class.js";
import V_socketUtils from "../Utils/V_socketUtils.class.js";
import lineOpen from "./assets/lineOpen.svg";
import lineClose from "./assets/lineClose.svg";
import V_Task from "./V_task.vue";
import V_6Wrow_line from "./V_6Wrow_line.vue";
import V_taskTableUtils from "../Utils/V_taskTableUtils.class.js";

export default {
	components: {
		task : V_Task,
		taskline : V_6Wrow_line
	},
	data : function(){
		const isOpen = V_taskTableUtils.isOpen(this.taskteam, this.nth);
		return {
			"color" : "BG_" + this.taskteam.getColorClass(),
			"isOpen" : isOpen, 
			"isVisible" : true,
			"teamDescription" : false,
			"headerHeight" : "30px",
			"teamDisplayed" : true
		}
	},
	props :[
		"time",
		"taskteam",
		"tasktablestart",
		"nth",
		"tasksize"
	],
	inject :[
		"timeline",
		"model"
	],
	provide:[
		"timeline",
		"model"
	],
	computed:{
		icon : function(){
			if(this.isOpen){
				return lineOpen;
			}else{
				return lineClose;
			}
		},
		tasks : function(){
			const tasks = this.timeline.getTasksByTaskTeamAndNthBetweenTwoDatesFromMemory(this.taskteam, this.nth, this.tasktablestart * 7, (this.tasktablestart + 6) * 7 - 1);
			//console.log(tasks.count, this.nth);
			//this.isOpen = (tasks.count != 0);
			this.isVisible = !(tasks.count == 0  && this.nth != 0);
			return tasks;
		},
		_time : function(){
			return this.time;
		},
		_tasktablestart : function(){
			return this.tasktablestart;
		},
		_team : function(){
			return this.taskteam;
		},
		_nth : function(){
			return this.nth;
		},
		zIndex : function(){
			if(this.teamDescription){
				return {
					zIndex : 2,
				}
			}else{
				return {
					zIndex : 0,
				}
			}
		}
	},
	created: function(){
		V_taskTableUtils.addRow(this);
	},
	mounted : function(){
		this.watchResize();
		window.addEventListener('resize', this.watchResize);
	},
	methods: {
		handleOpenPhase : function(event){
			if(event.target.tagName != "P" && !(event.target.classList.contains("teamAbr"))){
				this.isOpen = !this.isOpen;
				V_socketUtils.setTeamOpening(this.taskteam, this.nth, this.isOpen); 
			}
		},
		updateOpening : function(){
			this.isOpen = V_taskTableUtils.isOpen(this.taskteam, this.nth);
		},
		watchResize : function(){
			const elem = document.getElementsByClassName("phaserow")[0];
			if(elem != null){
				this.headerHeight = (elem.clientWidth / 40) + "px";
			}
		}
	}
	,
	template : `
	<div v-if="teamDisplayed" class="phaserow" v-bind:style="[ isVisible ? { paddingBottom : (parseFloat(headerHeight.replace('px', '')) / 3)+ 'px' } : {paddingBottom : '0px' }]">

		<!-- line -->
		<taskline v-show="isVisible" class="phaseLine" v-bind:taskheight="headerHeight" v-tap="handleOpenPhase" v-bind:time="_time" v-bind:nth="_nth" v-bind:team="_team" v-bind:class="color" v-bind:teamdescription="teamDescription" v-bind:style='zIndex'></taskline>

		<!-- tasks -->
		<div v-show="isVisible" class="tasksWrapper" v-bind:style="{ top : '-' + headerHeight, marginBottom : '-' + headerHeight} ">
			<task v-bind:headerheight="headerHeight" v-bind:color="color" v-bind:team="_team" nth=0 v-for="(task, i) in tasks.array" :key="i" v-bind:isopen="isOpen" v-bind:task="task" v-bind:isOpen="isOpen" v-bind:time="_tasktablestart + i"  ></task>
		</div>

		<!-- button -->
		<div v-bind:style="{ top : ((parseFloat(headerHeight.replace('px', '')) / 2) - 15) + 'px' }" v-show="isVisible && tasks.count > 0" v-bind:class='[isOpen ? "open" : "close"]' v-tap="handleOpenPhase" v-html="icon" class="phaseButton"></div>



	</div>`,
}