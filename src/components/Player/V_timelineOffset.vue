import "./V_timelineOffset.scss";
import V_timelineUtils from "../Utils/V_timelineUtils.class.js";

export default {
	data : function(){
		return {
				time : this.playerinit,
				startPan : null,
		}
	},
	props:[
		'nbweek',
		"timeline",
		"model",
		"playerinit",
		"offsettime"
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
			console.log(Math.trunc(this.time / 6) + V_timelineUtils.getOffset());
			V_timelineUtils.setOffset(this.startOffset + (week - this.startPan));
			console.log(V_timelineUtils.getOffset());
			if(event.type == "panend"){
				this.startPan = null;
			}
		}
	},
	computed : {
		nbWeeks : function(){
			return Math.trunc(this.model.getDuration() / 7);
		},
		offset : function(){
			return Math.trunc(this.time / 6);
		}
	},
	created : function(){
		V_timelineUtils.addListener("time", this, this.watchTime);
	},
	template : `
	<div id="timelineOffset" class="timelineOffset">
		<div v-pan="handleOffsetChange" id="sixWeekSelected" v-bind:style="{left : (offset * ((100 / nbWeeks) * 6)) + '%', width : ((100 / nbWeeks) * 6) + '%'}">

		</div>
	</div>`,
}