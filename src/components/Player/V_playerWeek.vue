import "./V_playerWeek.scss";
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
		},
		built : function(){
			return Math.trunc(this.time / 6) > Math.trunc(this.innertime / 6);
		},
		tobuild : function(){
			return Math.trunc(this.time / 6) < Math.trunc(this.innertime / 6);
		}
	},
	template : `
	<div class="playerWeek" v-bind:class='{selected : selected, hightlighted : highlighted, built : built, toBuild : tobuild }'>
		
	</div>`,
}