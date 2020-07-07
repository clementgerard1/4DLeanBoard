import "./V_filterPanel.scss";
import V_socketUtils from "../Utils/V_socketUtils.class.js";
import MenuStart from "./assets/MenuStart.svg";
import Menu3D from "./assets/Menu3D.svg";
import MenuPlanning from "./assets/MenuPlanning.svg";
import MenuDisplay from "./assets/MenuDisplay.svg";

import StandardButton from "./V_standardButton.vue";

export default {
	components: {
		standardbutton : StandardButton,
	},
	data : function(){
		const teams = this.model.getTaskTeams();
		const colorTeams = {};
		for(let t in teams){
			colorTeams[teams[t].getId()] = {
				team : teams[t],
				display : true
			};
		}
		return {
			displayByTeam : false,
			displayTeamSelect : 0, // = All teams
			checkboxes : [],
			teamSelected : "all",
			teams : teams,
			menuOpen : false,
			menu3DOpen : false,
			menuPlanningOpen : false,
			menuDisplayOpen : false,

			menuArchitecture : true,
			menuStructure : false,
			menuMEP : false,
			menuConstruction : false,

			menuSimplePlay : false,
			menuMilestones : false,
			menuPhases : false,
			menu6W : true,

			menuBasicColor : true,
			menuTeamColor : true,

			colorTeams : colorTeams,

		}
	},
	computed: {
		offsetclass : function(){
			if(this.menu3DOpen){
				return "offset3D";
			}
			if(this.menuPlanningOpen){
				return "offsetPlanning";
			}
			if(this.menuDisplayOpen){
				return "offsetDisplay";
			}
			return "offset";
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
			if(!this.menuOpen){
				this.menu3DOpen = false;
				this.menuPlanningOpen = false;
				this.menuDisplayOpen = false;
			}
		}, 
		handle3DTap : function(e){
			this.menu3DOpen= !this.menu3DOpen
			if(this.menu3DOpen){
				this.menuPlanningOpen = false;
				this.menuDisplayOpen = false;
			}
		}, 
		handlePlanningTap : function(e){
			this.menuPlanningOpen = !this.menuPlanningOpen
			if(this.menuPlanningOpen){
				this.menu3DOpen = false;
				this.menuDisplayOpen = false;
			}
		}, 
		handleDisplayTap : function(e){
			this.menuDisplayOpen = !this.menuDisplayOpen
			if(this.menuDisplayOpen){
				this.menu3DOpen = false;
				this.menuPlanningOpen = false;
			}
		},
		handleArchitectureTap : function(e){

		}
	},
	/*watch : {
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
	},*/
	template : `
	<div class="filterPanel">
		<div class="mainMenu">
			<div v-tap="handleMenuTap" class="filterMenu">
				` + MenuStart +  `
			</div>
			<div class="itemContainer" v-if="menuOpen">
				<div class="menuItem" v-tap="handle3DTap">
					` + Menu3D +  `
				</div>
				<div class="menuItem" v-tap="handlePlanningTap">
					` + MenuPlanning +  `
				</div>
				<div class="menuItem" v-tap="handleDisplayTap">
					` + MenuDisplay +  `
				</div>
			</div>
		</div>
		<div class="subMenuContainer">
			<div v-bind:class="offsetclass"></div>
			<div class="menu3D" v-if="menu3DOpen">
				<div>
					<standardbutton v-bind:condition="true"></standardbutton>
					<p>Architecture</p>
				</div>
				<div>
					<standardbutton v-bind:condition="false"></standardbutton>
					<p>Structure</p>
				</div>
				<div>
					<standardbutton v-bind:condition="false"></standardbutton>
					<p>MEP</p>
				</div>
				<div>
					<standardbutton v-bind:condition="true"></standardbutton>
					<p>Construction</p>
				</div>
			</div>
			<div class="menuPlanning" v-if="menuPlanningOpen">
				<div>
					<standardbutton v-bind:condition="true"></standardbutton>
					<p>Simple Play</p>
				</div>
				<div>
					<standardbutton v-bind:condition="false"></standardbutton>
					<p>Milestones</p>
				</div>
				<div>
					<standardbutton v-bind:condition="false"></standardbutton>
					<p>Phases</p>
				</div>
				<div>
					<standardbutton v-bind:condition="true"></standardbutton>
					<p>6 weeks</p>
				</div>
			</div>
			<div class="menuDisplay" v-if="menuDisplayOpen">
				<div>
					<standardbutton v-bind:condition="false"></standardbutton>
					<p>Basic colors</p>
				</div>
				<div>
					<standardbutton v-bind:condition="true"></standardbutton>
					<p>Firm colors</p>
				</div>
				<div>
					<div class="offsetTeamDisplay" v-if="menuTeamColor"></div>
					<div>
						<div class="teamItems" v-for="team in colorTeams">
							<standardbutton v-bind:condition="team.display"></standardbutton>
							<p v-html="team.team.getName()"></p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>`,
}