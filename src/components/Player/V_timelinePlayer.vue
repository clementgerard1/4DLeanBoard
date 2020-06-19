import "./V_timelinePlayer.scss";
import V_timelineUtils from "../Utils/V_timelineUtils.class.js";
import V_playerWeek from "./V_playerWeek.vue";

export default {
	components : {
		"playerweek" : V_playerWeek,
	},
	data : function(){
		return {
				time : this.playerinit,
		}
	},
	props:[
		'nbweek',
		"timeline",
		"model",
		"playerinit"
	],
	inject:[
		"timeline",
		"model"
	],
	provide :[
		"timeline",
		"model"
	],
	methods: {
		watchTime : function(time){
			this.time = time;
		}
	},
	created : function(){
		V_timelineUtils.addListener("time", this, this.watchTime);
	},
	template : `
	<div class="timelinePlayer">
		<playerweek class="week" v-bind:time="time" v-for="i in nbweek" :key="i" v-bind:innertime="i-1" v-bind:id="i-1"></playerweek>
	</div>`,
}