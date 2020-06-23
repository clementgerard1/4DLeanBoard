import "./V_filterPanel.scss";
import V_socketUtils from "../Utils/V_socketUtils.class.js";

export default {
	data : function(){
		const contractors = this.model.getContractors();
		return {
			displayByTeam : false,
			displayTeamSelect : 0, // = All contractors
			checkboxes : [],
			contractorSelected : "all",
			contractors : contractors
		}
	},
	created: function(){
		V_socketUtils.addFilter();
	},
	props : [
		"model"
	],
	watch : {
		contractorSelected : function(){
			if(this.contractor != "all"){
				const contractor = this.model.getContractorById(this.contractorSelected);
				V_socketUtils.setContractorDisplayed(contractor);
			}else{
				V_socketUtils.setContractorDisplayed(null);
			}
		},
		checkboxes : function(){
			V_socketUtils.setContractorDisplayMode(this.checkboxes.includes("contractors"));
		}
	},
	template : `
	<div class="filterPanel">
		<div>
	  	<label for="contractorCheckbox">Teams Layout <input type="checkbox" name="contractorCheckbox" id="contractorCheckbox" value="contractors" v-model="checkboxes"></label>
	  	<select v-model="contractorSelected" name="contractorSelect" id="contractorSelect">
			  <option value="all">All</option>
			  <option v-for="contractor in contractors" v-bind:value="contractor.getId()" v-html="contractor.getName()"></option>
			</select>
	  </div>
	  <div>

	  </div>
	</div>`,
}