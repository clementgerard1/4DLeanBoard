import TimelineUtils from "../Utils/V_timelineUtils.class.js";
import weekNumber from "./assets/WeekNumber.svg";
import Utils from "../../class/Utils.class.js";

export default {
	props:[
		'time',
	],
	inject : [
		'timeline',
		'model',
	],
	computed: {
		firstday : function(){
			let date = new Date(this.timeline.getStartDate() - 1);
			date.setDate(date.getDate() + (this.time * 7));
			return date.getDate() + " " + Utils.getMonthString(date.getMonth() + 1);
		},
		weeknumber : function(){
			let date = new Date(this.timeline.getStartDate());
			date.setDate(date.getDate() + (this.time * 7));
			return "Semaine " + Utils.getWeekNumber(date);
		}
	},
	template : `

		<div >
			` + weekNumber + `
		</div>

	`,
}