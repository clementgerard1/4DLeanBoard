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
				offset : 0,
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
		},
		watchOffset : function(offset){
			this.offset = offset;
		}
	},
	created : function(){
		V_timelineUtils.addListener("time", this, this.watchTime);
		V_timelineUtils.addListener("offset", this, this.watchOffset);
	},
	template : `
	<div class="timelinePlayer">
		<playerweek class="week" v-bind:offset="offset" v-bind:time="time" v-for="i in nbweek" :key="i" v-bind:innertime="i-1" v-bind:id="i-1"></playerweek>
	</div>`,
}