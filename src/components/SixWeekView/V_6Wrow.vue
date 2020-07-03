import "./V_6Wrow.scss";
import TimelineUtils from "../Utils/V_timelineUtils.class.js";
import lineOpen from "./assets/lineOpen.svg";
import lineClose from "./assets/lineClose.svg";
import V_Task from "./V_task.vue";
import V_6Wrow_line from "./V_6Wrow_line.vue";

export default {
	components: {
		task : V_Task,
		taskline : V_6Wrow_line
	},
	data : function(){
		return {
			"color" : "BG_" + this.taskteam.getColorClass(),
			"isOpen" : true, 
			"maxheight" : "init"
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
			const tasks = this.timeline.getTasksByTaskTeamAndNthBetweenTwoDates(this.taskteam, this.nth, this.tasktablestart * 7, (this.tasktablestart + 6) * 7 - 1);
			this.isOpen = (tasks.count != 0);
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
		}
	},
	watch: {
		isOpen: function(){
			if(this.isOpen){
				this.$parent.nbopened++;
				this.$parent.nbclosed--;
				this.maxheight = "initial";
			}else{
				this.$parent.nbclosed++;
				this.$parent.nbopened--;
				this.maxheight = "30px";
			}
		},
		tasktablestart: function(){
			const tasks = this.timeline.getTasksByTaskTeamAndNthBetweenTwoDates(this.taskteam, this.nth, this.tasktablestart * 7, (this.tasktablestart + 6) * 7 - 1);
			this.isOpen = (tasks.count != 0);
		}
	},
	created: function(){
		if(this.isOpen){
			this.$parent.nbopened++;
		}else{
			this.$parent.nbclosed++;
		}
	},
	methods: {
		handleOpenPhase : function(){
			this.isOpen = !this.isOpen;
		}
	}
	,
	template : `
	<div class="phaserow">

		<!-- line -->
		<taskline class="phaseLine" v-bind:class="color"></taskline>

		<!-- tasks -->
		<div v-bind:style="{maxHeight : maxheight, height : (tasksize - 30) + 'px'}" class="tasksWrapper">
			<task v-bind:color="color" v-bind:team="_team" nth=0 v-for="(task, i) in tasks" :key="i" v-bind:task="task" v-bind:isOpen="isOpen" v-bind:time="_tasktablestart + i"  ></task>
		</div>

		<!-- button -->
		<div v-bind:class='[isOpen ? "open" : "close"]' v-tap="handleOpenPhase" v-html="icon" class="phaseButton"></div>



	</div>`,
}