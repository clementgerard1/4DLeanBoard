import taskSVG from "./assets/task.svg";
import V_taskTableUtils from "./utils/V_taskTableUtils.class.js";
import V_4DUtils from "./utils/V_4DUtils.class.js";
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
					nbWeeks = Math.trunc((duration + offset) / 7) + 1;
				}else{
					index = Math.ceil(Math.abs(offset) / 7) + 1;
					nbWeeks = Math.trunc((duration + offset) / 7) + 2;
				}
				return "(" + index +  "/" + nbWeeks + ")" + this.task.getName();
			}
		},
		taskteam : function(){
			return this.task.getTaskTeam().getName();
		},
		color: function(){
			if(this.timeline.isActiveBetweenTwoDate(this.phase, this.time * 7, this.time * 7 + 6)){
				return this.phase.getColorClass();
			}else{
				return "default";
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
			if(this.task != null){
				V_taskTableUtils.getToken(this);
			}
		},
		setSelectedValue(bool){
			this.selected = bool;
		}
	},
	template : `
	<div v-tap='handleTap' v-bind:class='[selected ? "selected" : ""]'>
		<div class='task' v-bind:class="color">` + taskSVG + `
		</div>
	</div>`,
}

/*v-bind:class='phaseColor'*/