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
			"schedule" : Schedule,
			"leaderName" : this.team.getLeader().name,
			"leaderEmail" : this.team.getLeader().email,
			"leaderPhone" : this.team.getLeader().phone,
			"dates" : this.timeline.getStartEndDateByTeam(this.team),
		}
	},
	props: [
		"team",
		"teamdescription",
		"time"
	],
	methods: {
		handleTap : function(){
			this.$parent.teamDescription = !this.$parent.teamDescription;
		}
	},
	inject : [
		'timeline',
		'model',
	],
	computed : {
		doneStatus : function(){
			return this.timeline.getNbTaskDoneByTeamAndTime(this.team, this.time * 7);
		}
	},
	template : `

		<div class="teamLine">
			<div class="teamAbr" v-tap="handleTap">
				<p v-html="team.getAbr()"></p>
			</div>
			<div v-if="teamdescription" class="teamDescription">
				<p class="teamName" v-html="team.getName()" ></p>
				<div class="teamIcon" v-html="checklisticon"></div>
				<p class="doneStatus" v-html="doneStatus"></p>
				<div class="teamIcon" v-html="schedule"></div>
				<p class="teamDates" v-html="dates"></p>
				<div class="manIcon" v-html="admin"></div>
				<p class="leaderName" v-html="leaderName"></p>
				<p class="leaderEmail" v-html="leaderEmail"></p>
				<p class="leaderPhone" v-html="leaderPhone"></p>
			</div>
		</div>

	`,
}