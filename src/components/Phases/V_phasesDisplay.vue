import "./V_phasesDisplay.scss";
import V_phaseItem from "./V_phaseItem.vue";
import V_timelineUtils from "../Utils/V_timelineUtils.class.js";
import V_phasesUtils from "../Utils/V_phasesUtils.class.js";

export default {
	components : {
		phaseitem : V_phaseItem
	},
	props :[
		"timeline",
		"model"
	],
	provide: function(){
		return {
			'timeline' : this.timeline,
			'model' : this.model,
		}
	},
	data : function(){
		return {
			time : null,
			isDisplayed : true,
			playerWidth : "0%",
			width2 : "10px",
		}
	},
	computed : {
		phases : function(){
			if(this.model != null){	
				return this.model.getPhases();
			}
			return null;
		},
		_model : function(){
			return this.model;
		},
		_timeline : function(){
			return this.timeline;
		}
	},
	methods : {
		watchTime : function(time){
			this.time = time;
			this.playerWidth = (((this.time * 7) / this.model.getDuration()) * 100) + "%";
			this.width2 = ((7 / this.model.getDuration()) * 100) + "%";
		},
		displayed : function(bool){
			this.isDisplayed = bool;
		}
	},
	created : function(){
		V_timelineUtils.addListener("time", this, this.watchTime);
		V_phasesUtils.addPhasePanel(this);
	},
	template : `
	<div v-if="isDisplayed" id="phaseF">
		<!-- PhasesFrame -->
		<div class="playerLineWrapper">
			<div class="playerLine" v-bind:style="{ left : playerWidth, width : width2, height : ((phases.length - 1) * 41 - 8) + 'px'}"></div>
		</div>
		<phaseitem v-for="p in phases" :key="p.getId()" v-bind:time="time" v-bind:model="_model" v-bind:timeline="_timeline" v-bind:phase="p"></phaseitem>
	</div>`,
}