import "./V_6Wrow.scss";
import TimelineUtils from "../Utils/V_timelineUtils.class.js";

export default {
	data : function(){
		return {
		}
	},
	props :[
		"time",
		"index"
	],
	template : `
	<div class="phaserow">
		<div class="phaseLine"></div>
	</div>`,
}