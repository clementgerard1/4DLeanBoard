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
	template : '<div class="task">' + taskSVG + '</div>',
}