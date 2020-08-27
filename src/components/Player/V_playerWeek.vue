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
		vacation : function(){
			return this.timeline.isHolidayBetweenTwoDates(this.innertime * 7, this.innertime * 7 + 6);
			//return this.timeline.getTasksBetweenTwoDates(this.innertime * 7, this.innertime * 7 + 6).length == 0;
		},
		selected: function(){
			return this.innertime == this.time;
		},
		highlighted: function(){
			const firstTimeWeek = Math.floor((this.time - this.offset) / 6) * 6 + this.offset;
			const calc = this.innertime - firstTimeWeek;
			return calc >= 0 && calc <= 5;
		},
		built : function(){
			const firstTimeWeek = Math.floor((this.time - this.offset) / 6) * 6 + this.offset;
			const calc = this.innertime - firstTimeWeek;
			return calc < 0;
		},
		tobuild : function(){
			const firstTimeWeek = Math.floor((this.time - this.offset) / 6) * 6 + this.offset;
			const calc = this.innertime - firstTimeWeek;
			return calc > 5;
		},
		// opacityweek : function(){
		// 	if(this.selected){
		// 		return 1;
		// 	}else{
		// 		return 0.5;
		// 	}
		// }
	},
	data : function(){

		let date = new Date(this.timeline.getStartDate());
		date.setDate(date.getDate() + (this.time * 7));
		const weekNumber = Utils.getWeekNumber(this.timeline.getDateObject(this.innertime * 7));
		return {
			weeknumber : weekNumber,
		}
	},
	template : `
	<div class="playerWeek" v-bind:class='{selected : selected, hightlighted : highlighted, built : built, toBuild : tobuild }'>		
		<p v-if="highlighted" v-html="weeknumber">
		</p>

		<img v-if="vacation" src="/imgs/vacationIcon.svg" class="vacationIcon" />
	</div>`,
}