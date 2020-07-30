import "./V_planningMenu.scss";
import V_socketUtils from "../Utils/V_socketUtils.class.js";

import PlanningBar from "./assets/PlanningBar.svg";

export default {
	data : function(){
		return {
			isOpen : false,
			milestoneDisplay : true,
			phasesDisplay : true,
			weeksDisplay : true,
			weekDisplay : false,
			topclose : "0vw",
		}
	},
	computed : {
		top : function(){
			if(!this.isOpen){
				
				return this.topclose;
			}else{
				return "0px";
			}
		}
	},
	mounted : function(){
		window.addEventListener('resize', this.onResize);
		this.onResize();
	},
	methods: {
		onResize : function(){
			this.topclose = (-document.querySelector(".planningMenu").clientWidth * 0.092) + "px";
		},
		handleTap : function(event){
			if(event.target.id == "openPlanningMenu" || event.target.id == "openPlanningMenuButton"){
				this.isOpen = !this.isOpen;
			}
		},
		handleMenuTap : function(id){
			switch(id){
				case 0 : this.milestoneDisplay = !this.milestoneDisplay; break;
				case 1 : this.phasesDisplay = !this.phasesDisplay; this.weekDisplay = false; break;
				case 2 : this.weeksDisplay = !this.weeksDisplay; this.weekDisplay = false; break;
				case 3 : this.weekDisplay = !this.weekDisplay; this.weeksDisplay = false; this.phasesDisplay = false; break;
			}
			V_socketUtils.setPlanningDisplay(this.milestoneDisplay, this.phasesDisplay, this.weeksDisplay, this.weekDisplay);
		}
	},
	template : `
	<div v-tap="handleTap" v-bind:style="{top : top}" class="planningMenu" > ` + PlanningBar + `
		
	</div>`,
}