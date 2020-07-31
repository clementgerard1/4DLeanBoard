import "./V_blockPage.scss";
import V_blockUtils from "../Utils/V_blockUtils.class.js";

export default {
	data: function(){
		return {
			isDisplayed : false,
		}
	},
	methods : {
		setDisplay: function(bool){
			this.isDisplayed = bool;
		}
	},
	created : function(){
		V_blockUtils.addBlock(this);
	},
	template : `
	<div v-if="isDisplayed" id="blockPage">
		
	</div>`,
}