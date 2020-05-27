import taskSVG from "./assets/task.svg";
import "./V_task.css";

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
	computed: {
		task : function(){
			return this.timeline.getTaskByTeam(this.time, this.team)
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
		}/*,
		phaseColor : function(){
			if(this.task != null){
				return this.task.getPhase().getClassColor();

		}*/
	},
	template : "<div ><div class='task' >" + taskSVG + "</div></div>",
}

/*v-bind:class='phaseColor'*/