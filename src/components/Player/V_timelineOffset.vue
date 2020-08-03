import "./V_timelineOffset.scss";
import V_timelineUtils from "../Utils/V_timelineUtils.class.js";

export default {
	data : function(){
		return {
				time : this.playerinit,
				startPan : null,
				offset : 0
		}
	},
	props:[
		'nbweek',
		"timeline",
		"model",
		"playerinit",
		"offsettime",
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
		handleOffsetChange : function(event){
			const pourcent = (event.center.x - document.getElementById("timelineOffset").getBoundingClientRect().x) / document.getElementById("timelineOffset").clientWidth;
			const week = Math.max(0, Math.min(this.nbWeeks, Math.trunc(this.nbWeeks * pourcent)));
			if(event.type == "panstart"){
				this.startPan = week;
				this.startOffset = V_timelineUtils.getOffset();
			}
			//console.log(this.startOffset + (week - this.startPan));
			const newOffset = this.startOffset + (week - this.startPan);
			//if(newOffset - (this.time % 6) <= 0 && (newOffset - (this.time % 6)) >= -5){

			//Orignal time dans le offset 
			const nthOffset = (this.time - this.startOffset) % 6;
			const distance = newOffset - this.startOffset;
			console.log(nthOffset, distance);
			const calc = nthOffset - distance;
			if(calc >= 0 && calc <= 5){	
				V_timelineUtils.setOffset(newOffset);
				this.offset = this.startOffset + (week - this.startPan);	
			}
			if(event.type == "panend"){
				this.startPan = null;
			}
		}
	},
	computed : {
		nbWeeks : function(){
			return Math.trunc(this.model.getDuration() / 7);
		},
		startWeekTime : function(){
			console.log(this.time, this.offset);
			return Math.trunc((this.time - this.offset) / 6) * 6 + this.offset;
		}
	},
	created : function(){
		V_timelineUtils.addListener("time", this, this.watchTime);
	},
	template : `
	<div id="timelineOffset" class="timelineOffset">
		<div v-pan="handleOffsetChange" id="sixWeekSelected" v-bind:style="{left : (startWeekTime * (100 / nbWeeks)) + '%', width : ((100 / nbWeeks) * 6) + '%'}">

		</div>
	</div>`,
}