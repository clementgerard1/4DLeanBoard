import "./V_filterPanel.scss";
import V_socketUtils from "../Utils/V_socketUtils.class.js";

export default {
	data : function(){
		const teams = this.model.getTaskTeams();
		return {
			displayByTeam : false,
			displayTeamSelect : 0, // = All teams
			checkboxes : [],
			teamSelected : "all",
			teams : teams
		}
	},
	created: function(){
		V_socketUtils.addFilter();
	},
	props : [
		"model"
	],
	watch : {
		teamSelected : function(){
			if(this.teamSelected != "all"){
				const team = this.model.getTaskTeamById(this.teamSelected);
				V_socketUtils.setTeamDisplayed(team);
			}else{
				V_socketUtils.setTeamDisplayed(null);
			}
		},
		checkboxes : function(){
			V_socketUtils.setTeamDisplayMode(this.checkboxes.includes("teams"));
		},
	},
	template : `
	<div class="filterPanel">
		<div>
			<label for="teamCheckbox">Teams Layout <input type="checkbox" name="teamCheckbox" id="teamCheckbox" value="teams" v-model="checkboxes"></label>
			<select v-model="teamSelected" name="teamSelect" id="teamSelect">
				<option value="all">All</option>
				<option v-for="team in teams" v-bind:value="team.getId()" v-html="team.getName()"></option>
			</select>
		</div>
		<div>

		</div>
	</div>`,
}