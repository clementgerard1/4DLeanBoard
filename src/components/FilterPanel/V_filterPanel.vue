import "./V_filterPanel.scss";
import V_socketUtils from "../Utils/V_socketUtils.class.js";
import V_filterMenuUtils from "../Utils/V_filterMenuUtils.class.js";
import MenuStart from "./assets/MenuStart.svg";
import Menu3D from "./assets/Menu3D.svg";
import MenuVertical from "./assets/MenuVertical.svg";
import ColorPalette from "./assets/ColorPalette.svg";
import ConstructionState from "./assets/Layers.svg";
import Layers from "./assets/Layers.svg";
import Zones from "./assets/Layers.svg";
import scssVariables from "../SixWeekView/assets/_variables.scss";

import temp from "./assets/temp.svg";

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

		const zones = this.model.getZones();
		const zonesArray = {};
		for(let l in zones){
			zonesArray[zones[l]] = {
				name : zones[l],
				display : true,
			};
		}

		const constructionTypes = [{ 	
				name : "Existant",
				display : true,
			},
			{ 	
				name : "Nouveau",
				display : true,
			},
			{ 	
				name : "Démolition",
				display : true,
			},
			{ 	
				name : "Temporaire",
				display : true,
			}
		];

		return {
			displayByTeam : false,
			displayTeamSelect : 0, // = All teams
			checkboxes : [],
			teamSelected : "all",
			teams : teams,
			menuOpen : false,
			menuDisplayOpen : false,
			menuDisplayLayersOpen : false,
			menuDisplayZoneOpen : false,
			menuDisplayConstructionStateOpen : false,

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

			zonesArray : zonesArray,

			constructionTypes : constructionTypes,

			cameraLocked : false,
			layersArray : {},
		}
	},
	computed: {
		offsetclass : function(){
			return "offset3D";
		},
	},
	watch : {
		layers : function(){
			const layers = this.layers;
			const layersArray = {};
			for(let l in layers){
				layersArray[layers[l].replace(' ', '')] = {
					name : layers[l],
					display : true,
				};
			}
			this.layersArray = layersArray;
		}
	},
	created: function(){
		V_filterMenuUtils.addFilter(this);
		V_socketUtils.addFilter();
	},
	props : [
		"model",
		"layers"
	],
	methods:{
		handleMenuTap : function(e){
			this.menuOpen = !this.menuOpen
			if(!this.menuOpen){
				this.menuDisplayOpen = false;
				this.menuDisplayLayersOpen = false;
				this.menuDisplayZoneOpen = false;
			}
		}, 
		handleDisplayTap : function(e){
			this.menuDisplayOpen = !this.menuDisplayOpen
			if(this.menuDisplayOpen){
				this.menuDisplayLayersOpen = false;
				this.menuDisplayZoneOpen = false;
				this.menuDisplayConstructionStateOpen = false;
			}
		},

		handleLayerTap : function(e){
			this.menuDisplayLayersOpen = !this.menuDisplayLayersOpen;
			if(this.menuDisplayLayersOpen){
				this.menuDisplayOpen = false;
				this.menuDisplayZoneOpen = false;
				this.menuDisplayConstructionStateOpen = false;
			}
		},
		handleZoneTap : function(e){
			this.menuDisplayZoneOpen = !this.menuDisplayZoneOpen;
			if(this.menuDisplayZoneOpen){
				this.menuDisplayOpen = false;
				this.menuDisplayLayersOpen = false;
				this.menuDisplayConstructionStateOpen = false;
			}
		},
		handleConstructionStateTap : function(e){
			this.menuDisplayConstructionStateOpen = !this.menuDisplayConstructionStateOpen;
			if(this.menuDisplayConstructionStateOpen){
				this.menuDisplayOpen = false;
				this.menuDisplayLayersOpen = false;
				this.menuDisplayZoneOpen = false;
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

		handleLockCameraDisplay : function(e){
			V_socketUtils.setLockCameraDisplay(!this.cameraLocked);
		},

		setCameraLocked : function(bool){
			this.cameraLocked = bool;
		},

		handleTeamSelected : function(e){
			const team = this.model.getTaskTeamById(parseInt(e.target.id.replace("teamitem-", "")));
			V_socketUtils.setTeamDisplayed(team, !this.colorTeams[team.getId()].display);
		},

		handleZoneSelected : function(e){
			 const zone = e.target.id.replace("zoneitem-", "");
			 V_socketUtils.setZoneDisplayed(zone, !this.zonesArray[zone].display);
		},

		handleConstructSelected : function(e){
			const state = e.target.id.replace("constructitem-", "");
			let toReturn = 0;
			switch(state){
				case "Existant" : toReturn = 0; break;
				case "Nouveau" : toReturn = 1; break;
				case "Démolition" : toReturn = 2; break;
				case "Temporaire" : toReturn = 3; break; 
			}
			V_socketUtils.setConstructionStateDisplayed(toReturn, !this.constructionTypes[toReturn].display);
		},

		handleLayerSelected : function(e){
			const layer = e.target.id.replace("layeritem-", "");
			V_socketUtils.setLayerDisplayed(layer, !this.layersArray[layer].display);
		},

		setLayerDisplayed : function(layer, bool){

			console.log(this.layersArray, layer, bool);
			this.layersArray[layer].display = bool;
		},

		setZoneDisplayed : function(zone, bool){
			this.zonesArray[zone].display = bool;
		},

		setConstructionStateDisplayed : function(constructionState, bool){
			this.constructionTypes[constructionState].display = bool;
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
		},

		setLayersSelected : function(layers){
			for(let l in this.layersArray){

				if(typeof this.layers[this.layersArray[l].name] == "undefined"){
					this.layersArray[l].display = false;
				}else{
					this.layersArray[l].display = true;
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
				
			<div key="menuDisplayConstruct" class="menuDisplayConstruct" v-if="menuDisplayConstructionStateOpen">
				<div v-tap="handleConstructSelected" class="constructsItems" v-for="construct in constructionTypes" :key="construct.name">
					<standardbutton v-bind:id="'constructitem-' + construct.name.replace(' ', '')" v-bind:condition="construct.display"></standardbutton>
					<p v-html="construct.name"></p>
				</div>
			</div>

			<div key="menuDisplayLayer" class="menuDisplayLayer" v-if="menuDisplayLayersOpen">
				<div v-tap="handleLayerSelected" class="layersItems" v-for="layer in layersArray" :key="layer.name">
					<standardbutton v-bind:id="'layeritem-' + layer.name.replace(' ', '')" v-bind:condition="layer.display"></standardbutton>
					<p v-html="layer.name"></p>
				</div>
			</div>

			<div key="menuDisplayZone" class="menuDisplayZone" v-if="menuDisplayZoneOpen">
				<div v-tap="handleZoneSelected" class="zonesItems" v-for="zone in zonesArray" :key="zone.name">
					<standardbutton v-bind:id="'zoneitem-' + zone.name.replace(' ', '')" v-bind:condition="zone.display"></standardbutton>
					<p v-html="zone.name"></p>
				</div>
			</div>

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
				` + MenuVertical +  `
			</div>
			<div class="itemContainer" v-if="menuOpen">
				<div class="menuItem" v-tap="handleDisplayTap">
					` + ColorPalette +  `
				</div>
			</div>
			<div class="itemContainer" v-if="menuOpen">
				<div class="menuItem" v-tap="handleLayerTap">
					` + Layers +  `
				</div>
			</div>
			<div class="itemContainer" v-if="menuOpen">
				<div class="menuItem" v-tap="handleConstructionStateTap">
					` + ConstructionState +  `
				</div>
			</div>
			<div class="itemContainer" v-if="menuOpen">
				<div class="menuItem" v-tap="handleZoneTap">
					` + Zones +  `
				</div>
			</div>
			<div class="itemContainer" v-if="menuOpen">
				<div class="menuItem" v-tap="handleLockCameraDisplay">
					` + temp +  `
				</div>
			</div>
		</div>
	</div>`,
}