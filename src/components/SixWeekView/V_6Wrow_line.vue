import TimelineUtils from "../Utils/V_timelineUtils.class.js";
import weekNumber from "./assets/WeekNumber.svg";
import Utils from "../../class/Utils.class.js";
import "./V_6Wrow_line.scss";

export default {
	props: [
		"team"
	],
	template : `

		<div class="teamLine"><p class="teamAbr" v-html="team.getAbr()"></p></div>

	`,
}