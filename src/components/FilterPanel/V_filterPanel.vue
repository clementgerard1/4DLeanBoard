import "./V_filterPanel.scss";
import V_socketUtils from "../Utils/V_socketUtils.class.js";
import V_filterMenuUtils from "../Utils/V_filterMenuUtils.class.js";
import MenuStart from "./assets/MenuStart.svg";
import Menu3D from "./assets/Menu3D.svg";
import MenuPlanning from "./assets/MenuPlanning.svg";
import MenuDisplay from "./assets/MenuDisplay.svg";
import scssVariables from "../SixWeekView/assets/_variables.scss";

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
				display : true,
				color : scssVariables[teams[t].getColorClass().replace("BG_", "").toLowerCase()]
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

			archicond : true,
			structcond : true,
			mepcond : true,
			constructcond : true,

			simpleplaycond : false,
			milestonescond : false,
			phasescond : false,
			weekscond : true,

			basicdisplaycond : true,
			teamdisplaycond : false,
			colorTeams : colorTeams,

		}
	},
	computed: {
		offsetclass : function(){
			return "offset3D";
		}
	},
	created: function(){
		V_filterMenuUtils.addFilter(this);
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

		handleArchiTap : function(e){
			V_socketUtils.setIfcMenuChange(!this.archicond, this.structcond, this.mepcond, this.constructcond);
		},
		handleStructTap : function(e){
			V_socketUtils.setIfcMenuChange(this.archicond, !this.structcond, this.mepcond, this.constructcond);
		},
		handleMEPTap : function(e){
			V_socketUtils.setIfcMenuChange(this.archicond, this.structcond, !this.mepcond, this.constructcond);
		},
		handleConstructTap : function(e){
			V_socketUtils.setIfcMenuChange(this.archicond, this.structcond, this.mepcond, !this.constructcond);
		},

		handleSimplePlayTap : function(e){
			V_socketUtils.setPlanningMenuChange(1);
		},
		handleMilestonesTap : function(e){
			V_socketUtils.setPlanningMenuChange(2);
		},
		handlePhasesTap : function(e){
			V_socketUtils.setPlanningMenuChange(3);
		},
		handleWeeksTap : function(e){
			V_socketUtils.setPlanningMenuChange(4);
		},

		handleBasicDisplay : function(e){
			V_socketUtils.setTeamDisplayMode(false);
		},

		handleTeamDisplay : function(e){
			V_socketUtils.setTeamDisplayMode(true);
		},

		handleTeamSelected : function(e){
			const team = this.model.getTaskTeamById(parseInt(e.target.id.replace("teamitem-", "")));
			V_socketUtils.setTeamDisplayed(team, !this.colorTeams[team.getId()].display);
		},

		setIfcMenuChange : function(archi, struct, mep, construct){
			this.archicond = archi;
			this.structcond = struct;
			this.mepcond = mep;
			this.constructcond = construct;
		},

		setPlanningMenuChange : function(choice){
			switch (choice){
				case 1 : this.simpleplaycond = true; this.milestonescond = false; this.phasescond = false; this.weekscond = false; break;
				case 2 : this.simpleplaycond = false; this.milestonescond = true; this.phasescond = false; this.weekscond = false; break;
				case 3 : this.simpleplaycond = false; this.milestonescond = false; this.phasescond = true; this.weekscond = false; break;
				case 4 : this.simpleplaycond = false; this.milestonescond = false; this.phasescond = false; this.weekscond = true; break;
			}
		},

		setDisplayMenuChange : function(choice){
			switch (choice){
				case 1 : this.basicdisplaycond = true; this.teamdisplaycond = false; break;
				case 2 : this.basicdisplaycond = false; this.teamdisplaycond = true; break;
			}

		},

		setTeamsSelected : function(teams){
			for(let t in this.colorTeams){
				if(typeof this.colorTeams[t] != "undefined" && typeof this.colorTeams[t].team != "undefined" && typeof teams[this.colorTeams[t].team.getId()] != "undefined"){
					this.colorTeams[t].display = true;
				}else{
					this.colorTeams[t].display = false;
				}
			}
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
		<div class="subMenuContainer">
			<div v-bind:class="offsetclass"></div>

			<div key="menuDisplay" class="menuDisplay" v-if="menuDisplayOpen">
				<div v-if="teamdisplaycond">
					<div class="offsetTeamDisplay"></div>
					<div>
						<div v-tap="handleTeamSelected" class="teamItems" v-for="team in colorTeams" v-bind:id="'teamitem-' + team.team.getId()" :key="'teamDisplay' + team.team.getId()">
							<standardbutton v-bind:color="team.color" v-bind:id="'teamitem-' + team.team.getId()" v-bind:condition="team.display"></standardbutton>
							<p v-bind:id="'teamitem-' + team.team.getId()" v-html="team.team.getName()"></p>
						</div>
					</div>
				</div>
				<div key="menuDisplayTeam" v-tap="handleTeamDisplay">
					<standardbutton v-bind:condition="teamdisplaycond"></standardbutton>
					<p>Firm colors</p>
				</div>
				<div key="menuDisplayBasic" v-tap="handleBasicDisplay">
					<standardbutton v-bind:condition="basicdisplaycond"></standardbutton>
					<p>Basic colors</p>
				</div>
			</div>

		</div>
		<div class="mainMenu">
			<div v-tap="handleMenuTap" class="filterMenu">
				` + MenuStart +  `
			</div>
			<div class="itemContainer" v-if="menuOpen">
				<div class="menuItem" v-tap="handleDisplayTap">
					` + MenuDisplay +  `
				</div>
			</div>
		</div>
	</div>`,
}