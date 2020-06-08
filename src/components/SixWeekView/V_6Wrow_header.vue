import "./V_6Wrow_header.scss";
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
			let date = new Date(this.timeline.getStartDate());
			date.setDate(date.getDate() + (this.time * 7));
			return date.getDate() + "/" + (date.getMonth() + 1);
		},
		weeknumber : function(){
			let date = new Date(this.timeline.getStartDate());
			date.setDate(date.getDate() + (this.time * 7));
			return Utils.getWeekNumber(date);
		}
	},
	template : `

		<div class="rowHeader">
			<div class="rowHeaderItem" v-for="i in 6">
				` + weekNumber + `
			</div>
	 	</div>

	`,
}