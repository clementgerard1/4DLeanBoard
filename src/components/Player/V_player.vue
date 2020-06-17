import "./V_player.scss";
import V_socketUtils from "../Utils/V_socketUtils.class.js";
import V_timelinePlayer from "./V_timelinePlayer.vue";

export default {
	components:{
		timelinePlayer : V_timelinePlayer,
	},
	data : function(){
		return {
				time : this.playerinit,
				maximum : Math.trunc(this.duration / 7)
		}
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
	computed:{
		startdate : function(){
			const date = this.model.getStartDate();
			return date.getDay() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
		},
		enddate : function(){
			const date = new Date(this.model.getStartDate().valueOf() + 864E5 * this.model.getDuration());
			return date.getDay() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
		},
		_duration  : function(){
			return this.duration;
		},
		_playerinit : function(){
			return this.playerinit;
		}
	},
	template : `
	<div class="player">
		<div class="date"><p class="r90">{{startdate}}</p></div>

		<!-- <input id="taskTablePlayer" min=0 v-bind:max="maximum" type="number" v-model.number="time"/> -->
		<timelinePlayer v-bind:playerinit="_playerinit" v-bind:duration="_duration" id="timelinePlayer"></timelinePlayer>
		<div class="date" ><p class="r90">{{enddate}}</p></div>
	</div>`,
}