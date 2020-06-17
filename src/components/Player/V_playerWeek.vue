import "./V_playerWeek.scss";
import V_socketUtils from "../Utils/V_socketUtils.class.js";
import V_timelineUtils from "../Utils/V_timelineUtils.class.js";
import V_playerWeek from "./V_playerWeek.vue";

export default {
	components : {
		"playerweek" : V_playerWeek,
	},
	props:[
		'innertime',
		'time',
	],
	computed:{
		selected: function(){
			return this.innertime == this.time;
		},
		highlighted: function(){
			return Math.trunc(this.time / 6) == Math.trunc(this.innertime / 6);
		}
	},
	template : `
	<div class="playerWeek" v-bind:class='{selected : selected, hightlighted : highlighted }'>
		
	</div>`,
}