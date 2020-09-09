import "./V_playerWeek.scss";
import Utils from "../../class/Utils.class.js";
import V_playerWeek from "./V_playerWeek.vue";
import V_ModelUtils from "../Utils/V_ModelUtils.class.js";

export default {
	components : {
		"playerweek" : V_playerWeek,
	},
	props:[
		'innertime',
		'time',
		'offset',
		'highlightedpress'
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
		highlightedP : function(){
			if(this.highlightedpress.indexOf(this.innertime) != -1) return true;
			return false;
		}
	},
	data : function(){

		const model = V_ModelUtils.getModel();
		const timeline = V_ModelUtils.getTimeline();
		
		let date = new Date(timeline.getStartDate());
		date.setDate(date.getDate() + (this.time * 7));
		const weekNumber = Utils.getWeekNumber(timeline.getDateObject(this.innertime * 7));
		return {
			weeknumber : weekNumber,
			model : model,
			timeline : timeline,
		}
	},
	created : function(){
		V_ModelUtils.addModelListener((model)=>{
			this.model = model;
			this.timeline = V_ModelUtils.getTimeline();
		})
	},
	template : `
	<div class="playerWeek" v-bind:class='{ presshighlighted :  highlightedP, selected : selected, hightlighted : highlighted, built : built, toBuild : tobuild }'>		
		<p v-if="highlighted" v-html="weeknumber">
		</p>

		<img v-if="vacation" src="/imgs/vacationIcon.svg" class="vacationIcon" />
	</div>`,
}