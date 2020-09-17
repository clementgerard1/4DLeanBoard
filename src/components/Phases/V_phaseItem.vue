import "./V_phaseItem.scss";
import scssVariables from "../SixWeekView/assets/_variables.scss";
import V_socketUtils from "../Utils/V_socketUtils.class.js";
import V_phasesUtils from "../Utils/V_phasesUtils.class.js";
import V_timelineUtils from "../Utils/V_timelineUtils.class.js";
import V_ModelUtils from "../Utils/V_ModelUtils.class.js";
import EditLeft from "./assets/EditingPhaseIndcatorLeft.svg"
import EditRight from "./assets/EditingPhaseIndcatorRight.svg"

export default {
	data : function(){

		const model = V_ModelUtils.getModel();
		const timeline = V_ModelUtils.getTimeline();
		const duration = model.getDuration();
		let phase = null;
		if(model != null){
			phase = model.getPhase(this.phaseId);
		}

		return {
			mounted : false,
			scssvariables : scssVariables,
			descriptionShown : false,
			descriptionTimeout : null,
			pressed : false,
			modifyleft : "",
			modifyright : "",
			deltaleft : 0,
			deltaright : 0,
			panleftstart : 0,
			panrightstart : 0,
			originalStart : null,
			originalEnd : null,
			originalDuration : null,
			model : model,
			timeline : timeline,
			duration : duration,
			phase : phase,
			temp : 0,
		};
	},
	props : [
		"phaseId",
		'time',
		'teamDisplayed',
		"displayPhase",
		'modifymode',
	],
	watch : {
		modifymode : function(){
			this.modifyleft = "";
			this.modifyright = "";
			this.panleftstart = 0;
			this.panrightstart = 0;
			this.originalStart = this.phase.getStartDate();
			this.originalEnd = this.phase.getEndDate();
			this.originalDuration = this.model.getDuration();
		}
	},
	created : function(){
		V_phasesUtils.addItemPhase(this);
		V_ModelUtils.addModelListener((model)=>{
			this.model = model;
			this.timeline = V_ModelUtils.getTimeline();
			this.duration = this.model.getDuration();
			this.phase = model.getPhase(this.phaseId);
			this.temp++;
		})
	},
	computed : {
		temporaryleft : function(){
			this.temp;
			if(this.model != null && this.timeline != null){
				return ((this.timeline.getTime(this.phase.getStartDate()) / this.duration) * 100) + "%";
			}
		},
		temporarywidth : function(){
			this.temp;
			if(this.model != null && this.timeline != null){
				const left = this.timeline.getTime(this.phase.getStartDate()) / this.duration;
				const right = this.timeline.getTime(this.phase.getEndDate()) / this.duration;
				return ((right - left) * 100) + "%";
			}
		},
		left : function(){
			this.temp;
			if(this.model != null && this.timeline != null){
				return ((this.timeline.getTime(this.phase.getStartDate()) / this.duration) * 100) + "%";
			}
		},
		lleft : function(){
			this.temp;
			if(this.model != null && this.timeline != null){
				this.duration;
				return "calc(" + this.left + " + " + this.pourcent + ")";
			}
		},
		leftName : function(){
			this.temp;
			if(this.mounted){
				if(this.model != null && this.timeline != null){
					return "calc( " + ((this.timeline.getTime(this.phase.getStartDate()) / this.duration) * 100) + "% - "  + (document.querySelector("#phaseDisplay-" + this.phase.getId() + " .phaseItemNameLeft, " + "#phaseDisplay-" + this.phase.getId() + " .phaseItemNameRight").clientWidth + 30) + "px)";
				}
			}
			
		},
		width : function(){
			this.temp;
			if(this.model != null && this.timeline != null){
				const left = this.timeline.getTime(this.phase.getStartDate()) / this.duration;
				const right = this.timeline.getTime(this.phase.getEndDate()) / this.duration;
				return ((right - left) * 100) + "%";
			}
		},
		pourcent : function(){
			this.temp;
			const start = Math.ceil(this.timeline.getTime(this.phase.getStartDate()));
			const end = Math.ceil(this.timeline.getTime(this.phase.getEndDate()));
			if((this.time * 7) < start) return "0%";
			if((this.time * 7) > end) return (((end - start) / this.duration) * 100) + "%";
			return (Math.min( ((this.time * 7) - start) / this.duration, 1) * 100) + "%";
		}, 
		antipourcent : function(){
			this.temp;
			const start = Math.ceil(this.timeline.getTime(this.phase.getStartDate()));
			const end = Math.ceil(this.timeline.getTime(this.phase.getEndDate()));
			if((this.time * 7) < start) return (((end - start) / this.duration) * 100) + "%";
			if((this.time * 7) > end) return "0%";
			return (Math.min( (end - (this.time * 7)) / this.duration, 1) * 100) + "%";
		},
		completion : function(){
			this.temp;
			const start = Math.ceil(this.timeline.getTime(this.phase.getStartDate()));
			const end = Math.ceil(this.timeline.getTime(this.phase.getEndDate()));
			return Math.trunc(Math.max(0, Math.min(100, ((((this.time * 7) - start ) / (end - start)) * 100)))) + "%";
		},
		isRight : function(){
			this.temp;
			return (this.timeline.getTime(this.phase.getEndDate()) / this.duration) < 0.6;
		},
		descriptionText : function(){
			const dates = this.phase.getStartDate().getDay() + "/" + this.phase.getStartDate().getMonth() + "/" + this.phase.getStartDate().getFullYear() + "-" + this.phase.getEndDate().getDay() + "/" + this.phase.getEndDate().getMonth() + "/" + this.phase.getEndDate().getFullYear()
			return this.phase.getName() + " - " + this.phase.getRequirementsString() + " - " + dates + " - " + Object.keys(this.phase.getTasks()).length + " tasks";
		},
		// gradient : function(){
		// 	if(this.mounted){
		// 		const teams = this.phase.getTaskTeams();
		// 		if(teams.length > 1){
		// 			console.log(teams);
		// 			let result = "linear-gradient(90deg, ";
		// 			for(let t in teams){
		// 				const hexa = scssVariables[teams[t].getColorClass().replace("BG_", "").toLowerCase()];
		// 				result += "rgba(" + parseInt(hexa.slice(1,3), 16) + ", " + parseInt(hexa.slice(3,5), 16) + ", " + parseInt(hexa.slice(5,7), 16) + ") " + (t / (teams.length-1)) * 100 + "%,"; 
		// 			}
		// 			result = result.slice(0, result.length - 1);
		// 			result += ")";
		// 			console.log(result);
		// 			return result;
		// 		}else{
		// 			return scssVariables[teams[0].getColorClass().replace("BG_", "").toLowerCase()];
		// 		}
				
		// 	}else{
		// 		return null;
		// 	}
		// }
		teams : function(){
			//const toReturn = [];
			const teams = this.phase.getTaskTeams();
			// for(let t in teams){
			// 	if(this.teamDisplayed[teams[t].getId()]){
			// 		toReturn.push(teams[t]);
			// 	}
			// }
			return teams;
		}
	},
	methods:{
		handleDescription : function(){
			this.descriptionShown = true;
			if(this.descriptionTimeout != null) clearTimeout(this.descriptionTimeout);
			this.descriptionTimeout = setTimeout(()=>{
				this.descriptionShown = false;
				this.descriptionTimeout = null;
			}, 5000);
			V_socketUtils.triggerPhaseDescription(this.phase);
		},
		trigger3DPhase : function(event){
			const display = event.type == "press";
			if(display != this.pressed){
				this.pressed = display;
				V_socketUtils.triggerPhaseDisplay(this.phase , display);
			}
		},
		setPressed : function(bool){
			this.pressed = bool;
		},
		handlePanLeft : function(event){
			if(event.type == "panstart"){

				this.originalStart = this.phase.getStartDate();
				this.originalEnd = this.phase.getEndDate();
				this.originalDuration = this.model.getDuration();
				const nexts = this.phase.getFollowingPhases();
				for(let n in nexts){
					this.updateNextOriginalDates(nexts[n]);
				}
				this.deltaleft = 0;
				this.deltaright = 0;

				if(this.modifyleft == ""){
					this.panleftstart = 0;
				} else{
					this.panleftstart = parseInt(this.modifyleft);
				}
			}
			if(this.modifymode){
				if((this.panleftstart + Math.trunc(event.deltaX / 20)) > 0){
					this.modifyleft = '+' + (this.panleftstart + Math.trunc(event.deltaX / 20));
					this.deltaleft = Math.trunc(event.deltaX / 20);
				}else{
					this.modifyleft = (this.panleftstart + Math.trunc(event.deltaX / 20));
					this.deltaleft = Math.trunc(event.deltaX / 20);
				}
			} 

			let modifyleft = this.deltaleft;
			let modifyright = this.deltaright;

			this.phase.setStartDate(this.timeline.addWorkingDaysToDate(this.originalStart, parseInt(modifyleft)));
			this.phase.setEndDate(this.timeline.addWorkingDaysToDate(this.originalEnd, parseInt(modifyright)));


			if(this.phase.getEndDate() > this.model.getEndDate()){
				this.phase.getParent().setEndDate(this.phase.getEndDate());
			}

			V_ModelUtils.dispatchUpdate();


		},
		handlePanRight : function(event){
			if(this.modifymode){
				
				if(event.type == "panstart"){

					this.originalStart = this.phase.getStartDate();
					this.originalEnd = this.phase.getEndDate();
					this.originalDuration = this.model.getDuration();
					const nexts = this.phase.getFollowingPhases();
					for(let n in nexts){
						this.updateNextOriginalDates(nexts[n]);
					}
					this.deltaleft = 0;
					this.deltaright = 0;
					if(this.modifyright == ""){
						this.panrightstart = 0;
					} else{
						this.panrightstart = parseInt(this.modifyright);
					}
				}

				if((this.panrightstart + Math.trunc(event.deltaX / 20)) > 0){
					this.modifyright = '+' + (this.panrightstart + Math.trunc(event.deltaX / 20));
					this.deltaright = Math.trunc(event.deltaX / 20);
				}else{
					this.modifyright = (this.panrightstart + Math.trunc(event.deltaX / 20));
					this.deltaright = Math.trunc(event.deltaX / 20);
				}

			}

			const nexts = this.phase.getFollowingPhases();
			for(let n in nexts){
				this.updateNext(nexts[n]);
			}

			let modifyleft = this.deltaleft;
			let modifyright = this.deltaright;

			this.phase.setStartDate(this.timeline.addWorkingDaysToDate(this.originalStart, parseInt(modifyleft)));
			this.phase.setEndDate(this.timeline.addWorkingDaysToDate(this.originalEnd, parseInt(modifyright)));


			if(this.phase.getEndDate() > this.model.getEndDate()){
				this.phase.getParent().setEndDate(this.phase.getEndDate());
			}

			V_ModelUtils.dispatchUpdate();

		},

		updateNext : function(phase){

			const item = V_phasesUtils.getItemPhaseByPhaseId(phase.getId());

			let modifyleft = this.deltaleft;
			let modifyright = this.deltaright;
			this.temp++;

			const originalStartDate = item.originalStartDate;
			const originalEndDate = item.originalEndDate;

			phase.setStartDate(this.timeline.addWorkingDaysToDate(originalStartDate, parseInt(modifyright)));
			phase.setEndDate(this.timeline.addWorkingDaysToDate(originalEndDate, parseInt(modifyright)));

			const nexts = phase.getFollowingPhases();
			for(let n in nexts){
				this.updateNext(nexts[n]);
			}

			if(phase.getEndDate() > this.model.getEndDate()){
				phase.getParent().setEndDate(phase.getEndDate());
			}

		},

		updateNextOriginalDates : function(phase){
			const item = V_phasesUtils.getItemPhaseByPhaseId(phase.getId());
			item.originalStartDate = item.phase.getStartDate();
			item.originalEndDate = item.phase.getEndDate();
			const nexts = phase.getFollowingPhases();
			for(let n in nexts){
				this.updateNextOriginalDates(nexts[n]);
			}
		}

	},
	mounted : function(){
		this.mounted = true;
	},
	template : `
	<div class="phaseRow" v-bind:id="'phaseDisplay-' + phase.getId()" v-bind:class="[pressed ? 'pressed' : '']">
		<div v-if="descriptionShown" class="phaseDescription">
			<p v-html="descriptionText"></p>
		</div>

		<!-- PhasesFrame -->
		<template v-if="isRight" >
			<div v-if="displayPhase" class="colorDiv" v-bind:style="{width : left}">
				<div class="teamCircles">
					<p v-for="team in teams" class="teamCircle" v-bind:style='[teamDisplayed[team.getId()] ? { opacity : 1, backgroundColor : scssvariables[team.getColorClass().replace("BG_", "").toLowerCase()] } : { opacity : 0.5, backgroundColor : scssvariables[team.getColorClass().replace("BG_", "").toLowerCase()] } ]'></p>
				</div>
			</div>
			<p v-press="trigger3DPhase" v-tap="handleDescription" class="phaseItem" v-bind:style="[(!(completion == '0%') && !(completion == '100%')) ? {left : left, width : width, color : scssvariables['greenbluish_light']} : {left : left, width : width, color : 'black' }]" v-html="completion"></p>
			<p v-press="trigger3DPhase" v-tap="handleDescription" class="phaseItemNameRight" v-bind:style="{ left : left}" v-html="phase.getName()"></p>
			<div v-press="trigger3DPhase" v-tap="handleDescription" v-if="!(completion == '0%')" v-bind:style="{ left : left, width : pourcent}" class="phaseItemFilled"></div>
			<div v-press="trigger3DPhase" v-tap="handleDescription" v-if="!(completion == '100%')" v-bind:style="{ left : lleft, width : antipourcent}" class="phaseItemNotFilled"></div>
			<div v-if="modifymode" v-pan="handlePanLeft" class="phaseItemLeftPan" v-bind:style="{ left : temporaryleft}">
				<p>` + EditLeft + `</p>
				<p v-html="modifyleft"></p>
			</div>
			<div v-if="modifymode" v-pan="handlePanRight" class="phaseItemRightPan" v-bind:style="{ left : 'calc(' + temporaryleft + ' + ' + temporarywidth + ' - 30px)'}">
				<p>` + EditRight + `</p>
				<p v-html="modifyright"></p>
			</div>

			<!-- temporary display on modify mode-->
			<!--<div v-if="modifymode" class="temporaryPhase" v-bind:style="{ left : temporaryleft, width : temporarywidth}"></div>-->

		</template>
		<template v-else="isRight" v-bind:class="[pressed ? 'pressed' : '']">
			<div v-if="displayPhase" class="colorDiv" v-bind:style="{width : left}">
				<div class="teamCircles">
					<p v-for="team in teams" class="teamCircle" v-bind:style='[teamDisplayed[team.getId()] ? { opacity : 1, backgroundColor : scssvariables[team.getColorClass().replace("BG_", "").toLowerCase()] } : { opacity : 0.5, backgroundColor : scssvariables[team.getColorClass().replace("BG_", "").toLowerCase()] } ]'></p>
				</div>
			</div>
			<p v-press="trigger3DPhase" v-tap="handleDescription" class="phaseItemNameLeft" v-bind:style="{ left : leftName}" v-html="phase.getName()"></p>
			<p v-press="trigger3DPhase" v-tap="handleDescription" class="phaseItem" v-bind:style="[(!(completion == '0%') && !(completion == '100%')) ? {left : left, width : width, color : scssvariables['greenbluish_light']} : {left : left, width : width, color : 'black' }]" v-html="completion"></p>
			<div v-press="trigger3DPhase" v-tap="handleDescription" v-if="!(completion == '0%')" v-bind:style="{ left : left, width : pourcent}" class="phaseItemFilled"></div>
			<div v-press="trigger3DPhase" v-tap="handleDescription" v-if="!(completion == '100%')" v-bind:style="{ left : lleft, width : antipourcent}" class="phaseItemNotFilled"></div>
			<div v-if="modifymode" v-pan="handlePanLeft" class="phaseItemLeftPan" v-bind:style="{ left : temporaryleft}">
				<p>` + EditLeft + `</p>
				<p v-html="modifyleft"></p>
			</div>
			<div v-if="modifymode" v-pan="handlePanRight" class="phaseItemRightPan" v-bind:style="{ left : 'calc(' + temporaryleft + ' + ' + temporarywidth + ' - 30px)'}">
				<p>` + EditRight + `</p>
				<p v-html="modifyright"></p>
			</div>

			<!-- temporary display on modify mode-->
			<!--<div v-if="modifymode" class="temporaryPhase" v-bind:style="{ left : temporaryleft, width : temporarywidth}"></div>-->

		</template>
	</div>`,
}