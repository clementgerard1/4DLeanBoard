import taskSVG from "./assets/task.svg";
import "./V_task.css";

export default {
	data : function(){
		return {
			"tid" : "TID",
			"dr" : "DR",
			"taskName" : "TaskName",
			"taskTeam" : "TaskTeam",
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
	],
	props : [
		"time",
		"team"
	],
	computed: {
		notEmpty : function(){
			const task = this.timeline.getTaskByTeam(this.time, this.team);
			return task != null;
		}
	},
	template : '<div><div class="task">' + taskSVG + '</div></div>',
}