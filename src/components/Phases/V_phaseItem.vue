import "./V_phaseItem.scss";
import scssVariables from "../SixWeekView/assets/_variables.scss";
import V_socketUtils from "../Utils/V_socketUtils.class.js";

export default {
	data : function(){
		return {
			mounted : false,
			scssvariables : scssVariables,
			descriptionShown : false,
			descriptionTimeout : null,
			pressed : false,
		};
	},
	props : [
		"phase",
		'timeline',
		'model',
		'time',
		'teamDisplayed',
		"displayPhase",
		'modifymode'
	],
	provide : [
		'timeline'
	],
	computed : {
		left : function(){
			if(this.model != null && this.timeline != null){
				return ((this.timeline.getTime(this.phase.getStartDate()) / this.model.getDuration()) * 100) + "%";
			}
		},
		lleft : function(){
			if(this.model != null && this.timeline != null){
				return "calc(" + this.left + " + " + this.pourcent + ")";
			}
		},
		leftName : function(){
			if(this.mounted){
				if(this.model != null && this.timeline != null){
					return "calc( " + ((this.timeline.getTime(this.phase.getStartDate()) / this.model.getDuration()) * 100) + "% - "  + (document.querySelector("#phaseDisplay-" + this.phase.getId() + " .phaseItemNameLeft").clientWidth + 30) + "px)";
				}
			}
			
		},
		width : function(){
			if(this.model != null && this.timeline != null){
				const left = this.timeline.getTime(this.phase.getStartDate()) / this.model.getDuration();
				const right = this.timeline.getTime(this.phase.getEndDate()) / this.model.getDuration();
				return ((right - left) * 100) + "%";
			}
		},
		pourcent : function(){
			const start = Math.ceil(this.timeline.getTime(this.phase.getStartDate()));
			const end = Math.ceil(this.timeline.getTime(this.phase.getEndDate()));
			if((this.time * 7) < start) return "0%";
			if((this.time * 7) > end) return (((end - start) / this.model.getDuration()) * 100) + "%";
			return (Math.min( ((this.time * 7) - start) / this.model.getDuration(), 1) * 100) + "%";
		}, 
		antipourcent : function(){
			const start = Math.ceil(this.timeline.getTime(this.phase.getStartDate()));
			const end = Math.ceil(this.timeline.getTime(this.phase.getEndDate()));
			if((this.time * 7) < start) return (((end - start) / this.model.getDuration()) * 100) + "%";
			if((this.time * 7) > end) return "0%";
			return (Math.min( (end - (this.time * 7)) / this.model.getDuration(), 1) * 100) + "%";
		},
		completion : function(){
			const start = Math.ceil(this.timeline.getTime(this.phase.getStartDate()));
			const end = Math.ceil(this.timeline.getTime(this.phase.getEndDate()));
			return Math.trunc(Math.max(0, Math.min(100, ((((this.time * 7) - start ) / (end - start)) * 100)))) + "%";
		},
		isRight : function(){
			return (this.timeline.getTime(this.phase.getEndDate()) / this.model.getDuration()) < 0.6;
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
			}, 5000)
		},
		trigger3DPhase : function(event){
			const display = event.type == "press";
			this.pressed = display;
			V_socketUtils.triggerPhaseDisplay(this.phase , display);
		},
		handlePan : function(event){
			
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
			<p v-pan="handlePan" v-press="trigger3DPhase" v-tap="handleDescription" class="phaseItem" v-bind:style="[(!(completion == '0%') && !(completion == '100%')) ? {left : left, width : width, color : scssvariables['greenbluish_light']} : {left : left, width : width, color : 'black' }]" v-html="completion"></p>
			<p v-press="trigger3DPhase" v-tap="handleDescription" class="phaseItemNameRight" v-bind:style="{ left : left}" v-html="phase.getName()"></p>
			<div v-pan="handlePan" v-press="trigger3DPhase" v-tap="handleDescription" v-if="!(completion == '0%')" v-bind:style="{ left : left, width : pourcent}" class="phaseItemFilled"></div>
			<div v-pan="handlePan" v-press="trigger3DPhase" v-tap="handleDescription" v-if="!(completion == '100%')" v-bind:style="{ left : lleft, width : antipourcent}" class="phaseItemNotFilled"></div>
		</template>
		<template v-else="isRight" v-bind:class="[pressed ? 'pressed' : '']">
			<div v-if="displayPhase" class="colorDiv" v-bind:style="{width : left}">
				<div class="teamCircles">
					<p v-for="team in teams" class="teamCircle" v-bind:style='[teamDisplayed[team.getId()] ? { opacity : 1, backgroundColor : scssvariables[team.getColorClass().replace("BG_", "").toLowerCase()] } : { opacity : 0.5, backgroundColor : scssvariables[team.getColorClass().replace("BG_", "").toLowerCase()] } ]'></p>
				</div>
			</div>
			<p v-press="trigger3DPhase" v-tap="handleDescription" class="phaseItemNameLeft" v-bind:style="{ left : leftName}" v-html="phase.getName()"></p>
			<p v-pan="handlePan" v-press="trigger3DPhase" v-tap="handleDescription" class="phaseItem" v-bind:style="[(!(completion == '0%') && !(completion == '100%')) ? {left : left, width : width, color : scssvariables['greenbluish_light']} : {left : left, width : width, color : 'black' }]" v-html="completion"></p>
			<div v-pan="handlePan" v-press="trigger3DPhase" v-tap="handleDescription" v-if="!(completion == '0%')" v-bind:style="{ left : left, width : pourcent}" class="phaseItemFilled"></div>
			<div v-pan="handlePan" v-press="trigger3DPhase" v-tap="handleDescription" v-if="!(completion == '100%')" v-bind:style="{ left : lleft, width : antipourcent}" class="phaseItemNotFilled"></div>
		</template>
	</div>`,
}