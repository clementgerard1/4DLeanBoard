import TimelineUtils from "../Utils/V_timelineUtils.class.js";
import V_socketUtils from "../Utils/V_socketUtils.class.js";
import V_taskTableUtils from "../Utils/V_taskTableUtils.class.js";
import V_ModelUtils from "../Utils/V_ModelUtils.class.js";
import Utils from "../../class/Utils.class.js";
import CheckList from "./assets/CheckList.svg";
import Schedule from "./assets/Schedule.svg";
import AdminSettingsMale from "./assets/AdminSettingsMale.svg";
import "./V_6Wrow_line.scss";

export default {
	data : function(){

		const model = V_ModelUtils.getModel();
		const timeline = V_ModelUtils.getTimeline();
		const duration = model.getDuration();

		return {
			"checklisticon" : CheckList,
			"admin" : AdminSettingsMale,
			"schedule" : Schedule,
			"leaderName" : this.team.getBoss().getName(),
			"leaderEmail" : this.team.getBoss().getEmail(),
			"leaderPhone" : this.team.getBoss().getPhone(),
			"dates" : timeline.getStartEndDateByTeam(this.team),
			"pressed" : false,
			"model" : model,
			"duration" : duration,
			"timeline": timeline,
		}
	},
	props: [
		"team",
		"teamdescription",
		"time",
		"nth",
		"taskheight"
	],
	methods: {
		handleTap : function(){
			//this.setTeamDisplay(this.team.getId(), this.nth, !this.$parent.teamDescription);
			V_socketUtils.setTeamDisplay(this.team.getId(), this.nth, !this.$parent.teamDescription);
		},
		setTeamDisplay : function(teamId, nth, bool){
			if(this.team.getId() == teamId && this.nth == nth){
				this.$parent.teamDescription = bool;
			}
		},
		trigger3DTeam : function(event){
			const display = event.type == "press";
			this.pressed = display;
			V_socketUtils.triggerTeamDisplay(this.team , display);

		}
	},
	created : function(){
		V_taskTableUtils.addLine(this);
		this.setTeamDisplay(this.team.getId(), this.nth, V_taskTableUtils.getInfosLine(this.team.getId(), this.nth));
		V_ModelUtils.addModelListener((model)=>{
			this.model = model;
			this.timeline = V_ModelUtils.getTimeline();
			this.duration = this.model.getDuration();
		});
	},
	computed : {
		doneStatus : function(){
			return this.timeline.getNbTaskDoneByTeamAndTime(this.team, this.time * 7);
		}
	},
	template : `

		<div class="teamLine" v-bind:style="[nth != 0 ? { left : '24px', height : taskheight } : { height : taskheight }]">
			<div v-press="trigger3DTeam" v-if="nth == 0" class="teamAbr" v-tap="handleTap">
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