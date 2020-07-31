import "./V_player.scss";
import V_socketUtils from "../Utils/V_socketUtils.class.js";
import V_timelinePlayer from "./V_timelinePlayer.vue";
import V_timelineOffset from "./V_timelineOffset.vue";
import V_playerInfos from "./V_playerInfos.vue";
import V_playerUtils from "../Utils/V_playerUtils.class.js";
import V_timelineUtils from "../Utils/V_timelineUtils.class.js";

export default {
	components:{
		timelinePlayer : V_timelinePlayer,
		"playerinfos" : V_playerInfos,
		timelineOffset : V_timelineOffset,
	},
	data : function(){
		return {
				time : this.playerinit,
				maximum : Math.trunc(this.duration / 7),
				displayM : true,
				offset : 0,
		}
	},
	created : function(){
		V_playerUtils.addPlayer(this);
		V_socketUtils.addPlayer();
		V_timelineUtils.addListener("offset", this, this.watchOffset);
	},
	watch : {
		time : function(){
			V_socketUtils.setTime(this.time);
		}
	},
	props:[
		'playerinit',
		'duration',
		"timeline",
		"model"
	],
	provide : function(){
		return {
			'timeline' : this.timeline,
			'model' : this.model,
		}
	},
	methods:{
		handleStartButtonTap : function(){
			V_socketUtils.setTime(0);
		},
		handleEndButtonTap : function(){
			V_socketUtils.setTime(Math.trunc((this.duration - 1) / 7));
		},
		displayMilestones : function(bool){
			this.displayM = bool;
		},
		watchOffset : function(offset){
			this.offset = offset;
		}
	},
	computed:{
		startdate : function(){
			const date = this.model.getStartDate();
			return date.getDay() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
		},
		enddate : function(){
			const date = new Date(this.model.getStartDate().valueOf() + 864E5 * this.model.getDuration());
			return date.getDay() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
		},
		nbweek  : function(){
			return Math.ceil(this.duration / 7);
		},
		_playerinit : function(){
			return this.playerinit;
		}
	},
	template : `
	<div class="player">

		<timelineOffset v-bind:offsettime="offset" v-bind:playerinit="_playerinit" v-bind:nbweek="nbweek" id="timelineOffset"></timelineOffset>
		<div class="backgroundPlayer">
			<div v-tap="handleStartButtonTap" class="date"><p class="r90">{{startdate}}</p></div>
			<timelinePlayer v-bind:playerinit="_playerinit" v-bind:nbweek="nbweek" id="timelinePlayer"></timelinePlayer>
			<div v-tap="handleEndButtonTap" class="date" ><p class="r90">{{enddate}}</p></div>
		</div>
		<playerinfos v-bind:displayM="displayM" v-bind:playerinit="_playerinit" class="svgPlayer" v-bind:nbweek="nbweek"></playerinfos>

	</div>`,
}