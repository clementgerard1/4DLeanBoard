import "./V_filterPanel.scss";
import V_socketUtils from "../Utils/V_socketUtils.class.js";
import MenuStart from "./assets/MenuStart.svg";

export default {
	data : function(){
		const teams = this.model.getTaskTeams();
		return {
			displayByTeam : false,
			displayTeamSelect : 0, // = All teams
			checkboxes : [],
			teamSelected : "all",
			teams : teams,
			menuOpen : false,
		}
	},
	created: function(){
		V_socketUtils.addFilter();
	},
	props : [
		"model"
	],
	methods:{
		handleMenuTap : function(e){
			this.menuOpen = !this.menuOpen
		}
	},
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
		<div v-tap="handleMenuTap" class="filterMenu">
			` + MenuStart +  `
		</div>
		<div v-if="menuOpen">
			<label for="teamCheckbox">Teams Layout <input type="checkbox" name="teamCheckbox" id="teamCheckbox" value="teams" v-model="checkboxes"></label>
			<select v-model="teamSelected" name="teamSelect" id="teamSelect">
				<option value="all">All</option>
				<option v-for="team in teams" v-bind:value="team.getId()" v-html="team.getName()"></option>
			</select>
		</div>
	</div>`,
}