import "./V_6Wrow.scss";
import TimelineUtils from "../Utils/V_timelineUtils.class.js";
import phaseOpen from "./assets/phaseOpen.svg";
import phaseClose from "./assets/phaseClose.svg";
import V_Task from "./V_task.vue";

export default {
	components: {
		task : V_Task
	},
	data : function(){
		return {
			"color" : "BG_" + this.phase.getColorClass(),
			"isOpen" : true, 
		}
	},
	props :[
		"time",
		"phase",
		"taskteam",
		"tasktablestart"
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
				return phaseOpen;
			}else{
				return phaseClose;
			}
		},
		_time : function(){
			return this.time;
		},
		_phase : function(){
			return this.phase;
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
			}else{
				this.$parent.nbclosed++;
				this.$parent.nbopened--;
			}
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
		<div class="phaseLine" v-bind:class="color"></div>

		<!-- tasks -->
		<div v-if="isOpen" class="tasksWrapper">
			<task v-bind:team="_team" nth=0 v-bind:phase="_phase" v-for="i in 6" v-bind:time="_time + (i-1)"  ></task>
		</div>

		<!-- button -->
		<div v-bind:class='[isOpen ? "open" : "close"]' v-tap="handleOpenPhase" v-html="icon" class="phaseButton"></div>



	</div>`,
}