import "./V_player.scss";
import V_socketUtils from "../Utils/V_socketUtils.class.js";
import V_timelinePlayer from "./V_timelinePlayer.vue";
import V_timelineOffset from "./V_timelineOffset.vue";
import V_playerInfos from "./V_playerInfos.vue";
import V_playerUtils from "../Utils/V_playerUtils.class.js";
import V_timelineUtils from "../Utils/V_timelineUtils.class.js";
import scssVariables from "../SixWeekView/assets/_variables.scss";
import V_ModelUtils from "../Utils/V_ModelUtils.class.js";

import Utils from "../../class/Utils.class.js";

export default {
	components:{
		timelinePlayer : V_timelinePlayer,
		"playerinfos" : V_playerInfos,
		timelineOffset : V_timelineOffset,
	},
	data : function(){

		const model = V_ModelUtils.getModel();
		const timeline = V_ModelUtils.getTimeline();
		const duration = model.getDuration();

		const date = model.getStartDate();
		const startdate =  date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();

		const date2 = new Date(model.getStartDate().valueOf() + 864E5 * model.getDuration());
		const enddate =  date2.getDate() + "/" + (date2.getMonth() + 1) + "/" + date2.getFullYear();

		return {
				time : this.playerinit,
				duration : duration,
				maximum : Math.trunc(this.duration / 7),
				displayM : true,
				offset : 0,
				milestoneSelected : null,
				startTimeout : null,
				endTimeout : null,
				highlighted : [],
				model : model,
				timeline : timeline,
				startdate : startdate,
				enddate : enddate,
		}
	},
	created : function(){
		V_playerUtils.addPlayer(this);
		V_socketUtils.addPlayer();
		V_timelineUtils.addListener("offset", this, this.watchOffset);
		V_ModelUtils.addModelListener((model)=>{
			this.model = model;
			this.timeline = V_ModelUtils.getTimeline();
			this.duration = this.model.getDuration();
		})
	},
	watch : {
		time : function(){
			V_socketUtils.setTime(this.time);
		},
		duration : function(){
			const date = this.model.getStartDate();
			this.startdate =  date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();

			const date2 = new Date(this.model.getStartDate().valueOf() + 864E5 * this.model.getDuration());
			this.enddate =  date2.getDate() + "/" + (date2.getMonth() + 1) + "/" + date2.getFullYear();
		}
	},
	props:[
		'playerinit',
	],
	methods:{
		handleStartButtonTap : function(){
			const button = document.getElementById("startDateButton");
			button.style.backgroundColor = scssVariables["greenbluish_light"];
			button.style.filter = "drop-shadow(1px 1px 15px #97D7C7)";
			V_socketUtils.setTime(0);
			if(this.startTimeout != null){
				clearTimeout(this.startTimeout);
				this.startTimeout = null;
			}
			this.startTimeout = setTimeout( () => {
				button.style.backgroundColor = "rgba(0,0,0,0)";
				button.style.filter = "unset";
			}, 1000);

		},
		handleEndButtonTap : function(){
			const button = document.getElementById("endDateButton");
			button.style.backgroundColor = scssVariables["greenbluish_light"];
			button.style.filter = "drop-shadow(1px 1px 15px #97D7C7)";
			V_socketUtils.setTime(Math.trunc((this.duration - 1) / 7));
			if(this.endTimeout != null){
				clearTimeout(this.endTimeout);
				this.endTimeout = null;
			}
			this.endTimeout = setTimeout( () => {
				button.style.backgroundColor = "rgba(0,0,0,0)";
				button.style.filter = "unset";
			}, 1000);
		},
		displayMilestones : function(bool){
			this.displayM = bool;
		},
		watchOffset : function(offset){
			this.offset = offset;
		},
		highlightTask : function(task, display){
			if(display){
				this.highlighted = this.timeline.getWeeks(task);
			}else{
				this.highlighted = [];
			}
		}
	},
	computed:{
		nbweek  : function(){
			return Math.ceil(this.duration / 7);
		},
		_playerinit : function(){
			return this.playerinit;
		},
		milestoneSelectedText : function(){
			if(this.milestoneSelected != null){
				const date = this.milestoneSelected.getEndDate();
				return this.milestoneSelected.getName() + " - " + date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear();
			}
		}
	},
	template : `
	<div v-show="displayM" class="player">
		<div v-if="milestoneSelected != null" class="milestoneInfos">
			<p v-html="milestoneSelectedText" >Nom de la milestone - EndDate</p>
		</div>
		<timelineOffset v-bind:duration="duration" v-bind:offsettime="offset" v-bind:playerinit="_playerinit" v-bind:nbweek="nbweek" id="timelineOffset"></timelineOffset>
		<div class="backgroundPlayer">
			<div v-tap="handleStartButtonTap" id="startDateButton" class="date"><p class="r90" v-html="startdate"></p></div>
			<timelinePlayer v-bind:highlighted="highlighted" v-bind:playerinit="_playerinit" v-bind:nbweek="nbweek" id="timelinePlayer"></timelinePlayer>
			<div v-tap="handleEndButtonTap" id="endDateButton" class="date" ><p class="r90" v-html="enddate"></p></div>
		</div>
		<playerinfos v-bind:displayM="displayM" v-bind:playerinit="_playerinit" class="svgPlayer" v-bind:nbweek="nbweek"></playerinfos>

	</div>`,
}