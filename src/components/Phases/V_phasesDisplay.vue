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

		
		const toReturn = {};
		const teams = this.model.getTaskTeams();
		for(let t in teams){
			toReturn[teams[t].getId()] = true;
		}
		const teamDisplayStatus = toReturn;
		return {
			time : null,
			isDisplayed : true,
			playerWidth : "0%",
			width2 : "10px",
			temp : 0,
			teamDisplayStatus : teamDisplayStatus
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
		},
		displayedPhases : function(){
			this.temp;
			const toReturn = [];
			for(let p in this.phases){
				const teams = this.phases[p].getTaskTeams();
				let display = true;
				let count = 0;
				for(let t in teams){
					if(!this.teamDisplayStatus[teams[t].getId()]) {
						count++;
					}
				}
				if(count != teams.length) toReturn.push(this.phases[p]);
			}
			return toReturn;
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
		},
		displayTeam : function(teamId, bool){
			this.$set(this.teamDisplayStatus, teamId, bool);
			// const temp = {};
			// this.teamDisplayStatus = Object.assign(temp, this.teamDisplayStatus);
			this.temp++;
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
			<div class="playerLine" v-bind:style="{ left : playerWidth, width : width2, height : ((phases.length - 1) * 41 + 23) + 'px'}"></div>
		</div>
		<phaseitem v-bind:teamDisplayed="teamDisplayStatus" v-for="p in displayedPhases" :key="p.getId()" v-bind:time="time" v-bind:model="_model" v-bind:timeline="_timeline" v-bind:phase="p"></phaseitem>
	</div>`,
}