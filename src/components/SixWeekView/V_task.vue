import taskSVG from "./assets/task.svg";
import taskStatusSVG from "./assets/taskStatus.svg";
import V_taskTableUtils from "../Utils/V_taskTableUtils.class.js";
import V_4DUtils from "../Utils/V_4DUtils.class.js";
import "./V_task.scss";

export default {
	data : function(){
		return {
			"r1" : false, 
			"r2" : false,
			"r3" : false,
			"r4" : false,
			"r5" : false,
			"r6" : false,
			"r7" : false,
			"selected" : false,
			"state" :false,
			"stateDiv" : null
		}
	},
	inject : [
		'timeline',
		'model',
	],
	props : [
		"team",
		"nth",
		'time',
		'phase'
	],
	created: function(){
		V_taskTableUtils.addTask(this);
	},
	updated: function(){
		if(this.task != null && this.selected){
			V_4DUtils.highlightTask(this.task.getObject4D());
		}
	},
	computed: 
		{
		task : function(){
			return this.timeline.getTaskByPhaseTeamAndNthBetweenTwoDates(this.phase, this.team, (this.time * 7), (this.time * 7) + 6, this.nth);
		},
		notEmpty : function(){
			return this.task != null;
		},
		tid : function(){
			return this.task.getId();
		},
		dr : function(){
			return this.task.getDuration();
		},
		taskname : function(){
			const startWeek = this.timeline.getDateObject(this.time * 7);
			const endWeek = this.timeline.getDateObject(this.time * 7 + 6);
			const duration = this.task.getDuration();
			const startTask = this.task.getStartDate();
			const offset = (startTask.getTime() - startWeek.getTime())  / (1000 * 3600 * 24);

			if(offset >= 0 && (offset + duration) < 7){
				return this.task.getName();
			}else{
				let nbWeeks = null;
				let index = null;
				if(offset >= 0){
					index = 1;
					nbWeeks = Math.ceil((duration + offset) / 7);
				}else{
					index = Math.ceil(Math.abs(offset) / 7) + 1;
					nbWeeks = Math.ceil((duration + offset) / 7) + 1;
				}
				return "(" + index +  "/" + nbWeeks + ")" + this.task.getName();
			}
		},
		taskteam : function(){
			return this.task.getTaskTeam().getName();
		},
		color: function(){
			if(this.timeline.isActiveBetweenTwoDate(this.phase, this.time * 7, this.time * 7 + 6)){
				return "BG_" + this.phase.getColorClass();
			}else{
				return "default";
			}
		},
		taskId: function(){
			if(this.task != null){
				return this.task.getId();
			}else{
				return "noTask";
			}
		}
	},
	watch:{
		time : function(){
			if(this.task != null){
				this.selected = V_taskTableUtils.isTokenOwner(this);
			}
		}
	},
	methods:{
		handleTap: function(event){
			if(this.notEmpty){
				if(!this.state){
					this.state = true;
					this.stateDiv.classList.add('animate__flipInY');
					
				}else{
					const that = this;
					this.stateDiv.classList.remove('animate__flipInY');
					this.stateDiv.classList.add('animate__flipOutY');
					this.stateDiv.addEventListener('animationend', (e) => {
							if(e.animationName == "flipOutY"){	
						  		that.state = false;
						  		this.stateDiv.classList.remove('animate__flipOutY');
						  	}
					});
				}
			}
		},
		handleDoubleTap: function(event){
			if(this.notEmpty){
				if(this.task != null){
					V_taskTableUtils.getToken(this);
				}
			}
		},
		setSelectedValue(bool){
			this.selected = bool;
		}
	},
	mounted: function(){
		if(this.task != null){
			this.stateDiv = document.getElementById(this.task.getId() + "-" + this.time);
		}
	},
	template : `
	<div v-tap='handleDoubleTap' v-doubletap='handleTap' v-bind:class='[selected ? "selected" : "", "task", color]'>
		<div v-if="notEmpty" class='taskclass animate__animated animate__flipInY'>` + taskSVG + `</div>
		<div v-if="notEmpty" v-show="state" v-bind:id="taskId + '-' + time" class="taskstate animate__animated animate__faster">` + taskStatusSVG + `</div>
	</div>`,
}

/*v-bind:class='phaseColor'*/