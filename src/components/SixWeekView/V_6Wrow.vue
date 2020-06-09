import "./V_6Wrow.scss";
import TimelineUtils from "../Utils/V_timelineUtils.class.js";
import phaseOpen from "./assets/phaseOpen.svg";
import phaseClose from "./assets/phaseClose.svg";

export default {
	data : function(){
		return {
			"color" : "BG_" + this.phase.getColorClass(),
			"isOpen" : false, 
		}
	},
	props :[
		"time",
		"phase"
	],
	computed:{
		icon : function(){
			if(this.isOpen){
				return phaseOpen;
			}else{
				return phaseClose;
			}
		}
	},
	watch: {
		isOpen: function(){
			if(this.isOpen){
				this.$parent.nbopened++;
				this.$parent.nbclosed--;
			}else{
				this.$parent.nbclosed++;
				this.$parent.nbopened--;
			}
		}
	},
	created: function(){
		if(this.isOpen){
			this.$parent.nbopened++;
		}else{
			this.$parent.nbclosed++;
		}
	}
	,
	template : `
	<div class="phaserow">
		<!-- line -->
		<div class="phaseLine" v-bind:class="color"></div>
		<div v-bind:class='[isOpen ? "open" : "close"]' v-on:click="isOpen = !isOpen" v-html="icon" class="phaseButton"></div>

		<!-- tasks -->

	</div>`,
}