import "./V_phaseItem.scss";
import scssVariables from "../SixWeekView/assets/_variables.scss";

export default {
	data : function(){
		return {
			mounted : false,
		};
	},
	props : [
		"phase",
		'timeline',
		'model',
		'time'
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
					return "calc( " + ((this.timeline.getTime(this.phase.getStartDate()) / this.model.getDuration()) * 100) + "% - "  + (document.querySelector("#phaseDisplay-" + this.phase.getId() + " .phaseItemNameLeft").clientWidth + 10) + "px)";
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
			return (this.timeline.getTime(this.phase.getEndDate()) / this.model.getDuration()) < 0.5;
		}
	},
	mounted : function(){
		this.mounted = true;
	},
	template : `
	<div class="phaseRow" v-bind:id="'phaseDisplay-' + phase.getId()" >
		<!-- PhasesFrame -->
		<template v-if="isRight">
			<p class="phaseItem" v-bind:style="{ left : left, width : width}" v-html="completion"></p>
			<p class="phaseItemNameRight" v-bind:style="{ left : left}" v-html="phase.getName()"></p>
			<div v-if="!(completion == '0%')" v-bind:style="{ left : left, width : pourcent}" class="phaseItemFilled"></div>
			<div v-if="!(completion == '100%')" v-bind:style="{ left : lleft, width : antipourcent}" class="phaseItemNotFilled"></div>
		</template>
		<template v-else="isRight">

			<p class="phaseItemNameLeft" v-bind:style="{ left : leftName}" v-html="phase.getName()"></p>
			<p class="phaseItem" v-bind:style="{ left : left, width : width}" v-html="completion"></p>
			<div v-if="!(completion == '0%')" v-bind:style="{ left : left, width : pourcent}" class="phaseItemFilled"></div>
			<div v-if="!(completion == '100%')" v-bind:style="{ left : lleft, width : antipourcent}" class="phaseItemNotFilled"></div>
		</template>
	</div>`,
}