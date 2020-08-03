import "./V_playerWeek.scss";
import Utils from "../../class/Utils.class.js";
import V_playerWeek from "./V_playerWeek.vue";

export default {
	components : {
		"playerweek" : V_playerWeek,
	},
	props:[
		'innertime',
		'time',
		'offset'
	],	
	inject:[
		"timeline",
		"model"
	],
	computed:{
		selected: function(){
			return this.innertime == this.time;
		},
		highlighted: function(){
			const firstTimeWeek = (this.time - ((this.time - this.offset)  % 6));
			const calc = this.innertime - firstTimeWeek;
			//console.log(Math.trunc((this.time - (this.offset % 6)) / 6), Math.trunc(this.innertime / 6));
			return calc >= 0 && calc <= 5;
		},
		built : function(){
			const firstTimeWeek = (this.time - ((this.time - this.offset)  % 6));
			const calc = this.innertime - firstTimeWeek;
			return calc < 0;
		},
		tobuild : function(){
			const firstTimeWeek = (this.time - ((this.time - this.offset)  % 6));
			const calc = this.innertime - firstTimeWeek;
			return calc > 5;
		},
		opacityweek : function(){
			if(this.selected){
				return 1;
			}else{
				return 0.5;
			}
		}
	},
	data : function(){
		const weekNumber = Utils.getWeekNumber(this.timeline.getDateObject(this.innertime * 7));
		return {
			weeknumber : weekNumber,
		}
	},
	template : `
	<div class="playerWeek" v-bind:class='{selected : selected, hightlighted : highlighted, built : built, toBuild : tobuild }'>
		<p v-if="highlighted" v-html="weeknumber" v-bind:style="{opacity : opacityweek}">

		</p>
	</div>`,
}