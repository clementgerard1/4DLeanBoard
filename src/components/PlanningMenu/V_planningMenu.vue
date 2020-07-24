import "./V_planningMenu.scss";
import V_socketUtils from "../Utils/V_socketUtils.class.js";

import PlanningBar from "./assets/PlanningBar.svg";

export default {
	data : function(){
		return {
			planningBar : PlanningBar,
		}
	},
	template : `
	<div class="planningMenu" v-html="planningBar">
		
	</div>`,
}