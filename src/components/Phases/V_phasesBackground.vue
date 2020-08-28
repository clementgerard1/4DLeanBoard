import "./V_phasesBackground.scss";
import Utils from "../../class/Utils.class.js";

export default {
	computed:{
		weeks : function(){
			const toReturn = [];
			const nbWeek = Math.ceil(this.duration / 7);
			for(let n = 0 ; n < nbWeek ; n++){
				toReturn[n] = n;
			}
			return toReturn;
		}
	},
	props:[
		"time",
		"duration",
		"offset"
	],
	inject:[
		"timeline"
	],
	methods:{
		getClass : function(n){
			const firstTimeWeek = Math.floor((this.time - this.offset) / 6) * 6 + this.offset;
			const calc = n - firstTimeWeek;
			if(n == this.time){
				return "actualWeek";
			}else if(calc >= 0 && calc <= 5){
			 	return "w6Week";
			}else if(n < this.time){
				return "doneWeek";
			}else{
				return "nextWeek";
			}
		},
		getDateClass : function(n){
			const firstTimeWeek = Math.floor((this.time - this.offset) / 6) * 6 + this.offset;
			const calc = n - firstTimeWeek;
			if(this.time == n){
				return "dateActual";
			}else if(calc >= 0 && calc <= 5){
			 	return "date6W";
			}else{
				return "dateOther";
			}
		},
		getNbWeek : function(n){
			return Utils.getWeekNumber(this.timeline.getDateObject(n * 7));
		}
	},
	template : `
	<div class="phaseBackground">
		<div v-for="n in weeks" v-bind:class="getClass(n)"><p v-bind:class="getDateClass(n)" v-html="getNbWeek(n)"></p></div>
	</div>`,
}