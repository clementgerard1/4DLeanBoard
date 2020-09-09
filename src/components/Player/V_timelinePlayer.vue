import "./V_timelinePlayer.scss";
import V_timelineUtils from "../Utils/V_timelineUtils.class.js";
import V_playerWeek from "./V_playerWeek.vue";
import V_ModelUtils from "../Utils/V_ModelUtils.class.js";


export default {
	components : {
		"playerweek" : V_playerWeek,
	},
	data : function(){

		const model = V_ModelUtils.getModel();
		const timeline = V_ModelUtils.getTimeline();

		return {
				time : this.playerinit,
				offset : 0,
				model : model,
				timeline : timeline
		}
	},
	props:[
		'nbweek',
		"playerinit",
		"highlighted"
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
		V_ModelUtils.addModelListener((model)=>{
			this.model = model;
			this.timeline = V_ModelUtils.getTimeline();
		})
	},
	computed : {
		_highlighted : function(){
			return this.highlighted;
		}
	},
	template : `
	<div class="timelinePlayer">
		<playerweek v-bind:highlightedpress="_highlighted" class="week" v-bind:offset="offset" v-bind:time="time" v-for="i in nbweek" :key="i" v-bind:innertime="i-1" v-bind:id="i-1"></playerweek>
	</div>`,
}