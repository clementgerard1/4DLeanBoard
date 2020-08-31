import "./V_phasesDisplay.scss";
import V_phaseItem from "./V_phaseItem.vue";
import V_phasesBackground from "./V_phasesBackground.vue";
import V_timelineUtils from "../Utils/V_timelineUtils.class.js";
import V_phasesUtils from "../Utils/V_phasesUtils.class.js";
import V_socketUtils from "../Utils/V_socketUtils.class.js";

export default {
	components : {
		phaseitem : V_phaseItem,
		phasesbackground : V_phasesBackground
	},
	props :[
		"timeline",
		"model",
		"duration",
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
			teamDisplayStatus : teamDisplayStatus,
			displayPhase : false,
			offset : 0,
			highlighted : [],
			modifyMode : false,
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
			const nbWeek = Math.ceil(this.duration / 7);
			this.playerWidth = (((this.time * 7) / this.model.getDuration()) * 98.95) + "%" ;
			this.width2 = ((7 / this.model.getDuration()) * 100) + "%";
		},
		watchOffset : function(offset){
			this.offset = offset;
		},
		displayed : function(bool){
			this.isDisplayed = bool;
		},
		displayTeam : function(teamId, bool){
			this.$set(this.teamDisplayStatus, teamId, bool);
			// const temp = {};
			// this.teamDisplayStatus = Object.assign(temp, this.teamDisplayStatus);
			this.temp++;
		},

		displayMode : function(bool){
			this.displayPhase = bool;
		},
		handlePan : function(event){


			const nbWeek = Math.ceil(this.duration / 7);

			const x = event.srcEvent.clientX - document.getElementById("phaseF").getBoundingClientRect().x - 30;
			const weekWidth = (document.getElementById("phaseF").clientWidth  - 60) / nbWeek;

			if(event.type == "panmove" || event.type == "panstart"){
				if( x > (weekWidth / 2) && x < ((nbWeek-1) * weekWidth + (weekWidth / 2)) ){
					const time = Math.trunc(x / weekWidth);
					if(time != this.time){
						this.setTime(time);
					}
				}
			}

		},
		setTime : function(time){
			V_socketUtils.setTime(time);
		},
		highlightTask(task, display){
			if(display){
				this.highlighted = this.timeline.getWeeks(task);
			}else{
				this.highlighted = [];
			}
		},
		handleModifyMode(event){
			const display = event.type == "press";
			this.modifyMode = display;
		},
		handleDoublePress(event){
			console.log(event);
		}


	},
	created : function(){
		V_timelineUtils.addListener("time", this, this.watchTime);
		V_timelineUtils.addListener("offset", this, this.watchOffset);
		V_phasesUtils.addPhasePanel(this);
	},
	template : `
	<div v-bind:doublepress="handleDoublePress" v-if="isDisplayed" id="phaseF" v-bind:style="{ height : ((phases.length * 36) + 7) + 'px' }">
		<!-- PhasesFrame -->
		<div v-press="handleModifyMode" v-bind:style="[modifyMode ? {backgroundColor : '#00B9F6', height : '60px', opacity : 0.6, width : '60px'} : {backgroundColor : '#00B9F6', opacity : 0.6, height : '24px', width : '24px'}]" id="modifyPhaseButton"></div>
		<phasesbackground v-bind:style="[modifyMode ? {border : '5px solid rgba(0,185,246, 0.6)', width : 'calc(100% + 0px)'}: {border : '0px solid #00B9F6'}]" v-bind:highlighted="highlighted" v-bind:offset="offset" v-bind:time="time" v-bind:duration="duration"></phasesbackground>
		<div class="playerLineWrapper">
			<div v-pan="handlePan" class="playerLine" v-bind:style="{ left : playerWidth, width : width2, height : ((phases.length - 1) * 41 + 23) + 'px'}"></div>
		</div>
		<phaseitem v-bind:teamDisplayed="teamDisplayStatus" v-for="p in displayedPhases" :key="p.getId()" v-bind:time="time" v-bind:model="_model" v-bind:displayPhase="displayPhase" v-bind:timeline="_timeline" v-bind:phase="p"></phaseitem>
	</div>`,
}