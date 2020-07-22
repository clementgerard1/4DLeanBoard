import TimelineUtils from "../Utils/V_timelineUtils.class.js";
import Utils from "../../class/Utils.class.js";
import CheckList from "./assets/CheckList.svg";
import Schedule from "./assets/Schedule.svg";
import AdminSettingsMale from "./assets/AdminSettingsMale.svg";
import "./V_6Wrow_line.scss";

export default {
	data : function(){
		return {
			"checklisticon" : CheckList,
			"admin" : AdminSettingsMale,
			"schedule" : Schedule
		}
	},
	props: [
		"team",
		"teamdescription"
	],
	methods: {
		handleTap : function(){
			this.$parent.teamDescription = !this.$parent.teamDescription;
		}
	},
	template : `

		<div class="teamLine">
			<div class="teamAbr" v-tap="handleTap">
				<p v-html="team.getAbr()"></p>
			</div>
			<div v-if="teamdescription" class="teamDescription">
				<p v-html="team.getName()" ></p>
				<div class="teamIcon" v-html="checklisticon"></div>
				<p>XX/XX</p>
				<div class="teamIcon" v-html="schedule"></div>
				<p>XX/XX</p>
			</div>
		</div>

	`,
}