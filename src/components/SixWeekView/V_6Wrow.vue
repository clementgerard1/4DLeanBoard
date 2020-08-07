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
		let maxheight = "initial";
		if(!isOpen){
			maxheight = "30px";
		}
		return {
			"color" : "BG_" + this.taskteam.getColorClass(),
			"isOpen" : isOpen, 
			"isVisible" : true,
			"teamDescription" : false,
			"maxheight" : maxheight
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
			console.log(this.tasktablestart, this.nth);
			const tasks = this.timeline.getTasksByTaskTeamAndNthBetweenTwoDates(this.taskteam, this.nth, this.tasktablestart * 7, (this.tasktablestart + 6) * 7 - 1);
			//console.log(tasks.count, this.nth);
			//this.isOpen = (tasks.count != 0);
			this.isVisible = !(tasks.count == 0  && this.nth != 0);
			return tasks.array;
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
	watch: {
		isOpen: function(){
			if(this.isOpen){
				this.maxheight = "initial";
			}else{
				this.maxheight = "30px";
			}
		}
	},
	created: function(){
		V_taskTableUtils.addRow(this);
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
		}
	}
	,
	template : `
	<div class="phaserow">

		<!-- line -->
		<taskline v-show="isVisible" class="phaseLine" v-tap="handleOpenPhase" v-bind:time="_time" v-bind:nth="_nth" v-bind:team="_team" v-bind:class="color" v-bind:teamdescription="teamDescription" v-bind:style='zIndex'></taskline>

		<!-- tasks -->
		<div v-show="isVisible" v-bind:style="{maxHeight : maxheight, height : (tasksize - 30) + 'px'}" class="tasksWrapper">
			<task v-bind:style="{maxHeight : maxheight}" v-bind:maxheight="maxheight" v-bind:color="color" v-bind:team="_team" nth=0 v-for="(task, i) in tasks" :key="i" v-bind:isopen="isOpen" v-bind:task="task" v-bind:isOpen="isOpen" v-bind:time="_tasktablestart + i"  ></task>
		</div>

		<!-- button -->
		<div v-show="isVisible" v-bind:class='[isOpen ? "open" : "close"]' v-tap="handleOpenPhase" v-html="icon" class="phaseButton"></div>



	</div>`,
}