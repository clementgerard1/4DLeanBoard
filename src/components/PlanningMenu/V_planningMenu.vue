import "./V_planningMenu.scss";
import V_socketUtils from "../Utils/V_socketUtils.class.js";

import PlanningBar from "./assets/PlanningBar.svg";

export default {
	data : function(){
		return {
			planningBar : PlanningBar,
			isOpen : false,
		}
	},
	computed : {
		top : function(){
			if(!this.isOpen){
				return "-112px";
			}else{
				return "0px";
			}
		}
	},
	methods: {
		handleTap : function(){
			this.isOpen = !this.isOpen;
		}
	},
	template : `
	<div v-tap="handleTap" v-bind:style="{top : top}" class="planningMenu" v-html="planningBar">
		
	</div>`,
}