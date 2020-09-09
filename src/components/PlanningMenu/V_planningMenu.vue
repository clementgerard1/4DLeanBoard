import "./V_planningMenu.scss";
import V_socketUtils from "../Utils/V_socketUtils.class.js";
import V_planningMenuUtils from "../Utils/V_planningMenuUtils.class.js";

import PlanningBar from "./assets/LvlBarHidden2.svg";

import milestone from "./assets/Milestone.svg";
import phases from "./assets/Phases.svg";
import weeks from "./assets/Weeks.svg";
import week from "./assets/Week.svg";
import gantt from "./assets/GanttChart.svg";

export default {
	data : function(){
		return {
			isOpen : false,
			milestoneDisplay : true,
			phasesDisplay : true,
			weeksDisplay : true,
			weekDisplay : false,
			topclose : "0vw",
			menuopen :false,
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
	created : function(){
		V_planningMenuUtils.addPlanningMenu(this);
	},
	methods: {
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
		},
		setPlanningMenuChange : function(milestone, phases, weeks, week){
			this.milestoneDisplay = milestone;
			this.phasesDisplay = phases;
			this.weeksDisplay = weeks;
			this.weekDisplay = week;
		},

		handleMenuOpen(){
			this.menuopen = !this.menuopen;
		},

	},
	template : `
		<div id="planningMenu"> 
			
			<div class="openMenu" >
				<div v-if="menuopen">
					<div class="modelName"> 
						<div v-tap="()=>handleMenuTap(0)" v-bind:class='[ milestoneDisplay ? "shown" : "hide"]'><p>` + milestone + `Milestones</p></div>
						<div v-tap="()=>handleMenuTap(1)" v-bind:class='[ phasesDisplay ? "shown" : "hide"]'><p>` + phases + `Phases</p></div>
						<div v-tap="()=>handleMenuTap(2)" v-bind:class='[ weeksDisplay ? "shown" : "hide"]'><p>` + weeks + `6 Weeks</p></div>
						<div class="hide"><p>` + week + `Week*</p></div>
						<div v-tap="()=>handleMenuTap(3)" v-bind:class='[ weekDisplay ? "shown" : "hide"]'><p>` + gantt + `Gantt</p></div>

					</div>
				</div>
			`+ PlanningBar + `
			</div>
		</div>`,
}