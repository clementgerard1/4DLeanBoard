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
	computed: {
		task : function(){
			return this.timeline.getTaskByTeamAndPhase(this.time, this.team, this.phase)
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
			return this.task.getName();
		},
		taskteam : function(){
			return this.team.getName();
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
		<div class='task' >` + taskSVG + `
		</div>
	</div>`,
}

/*v-bind:class='phaseColor'*/