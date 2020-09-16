import "./V_filterPanel.scss";
import V_socketUtils from "../Utils/V_socketUtils.class.js";
import V_filterMenuUtils from "../Utils/V_filterMenuUtils.class.js";
import MenuStart from "./assets/MenuStart.svg";
import Menu3D from "./assets/Menu3D.svg";
import MenuVertical from "./assets/MenuVertical.svg";
import ColorPalette from "./assets/ColorPalette2.svg";
import ViewLock from "./assets/ViewLock.svg";
import PrivateLock from "./assets/PrivateLock.svg";
import ConstructionState from "./assets/Construction.svg";
import BlackAndWhite from "./assets/BlackAndWhite.svg";
import Layers from "./assets/Layers.svg";
import Zones from "./assets/ZonesIcon.svg";
import Zone from "./assets/Zone.svg";
import scssVariables from "../SixWeekView/assets/_variables.scss";

import Existant from "./assets/Existant.svg";
import Temporaire from "./assets/Temporaire.svg";
import Nouveau from "./assets/Nouveau.svg";
import Demolition from "./assets/Demolition.svg";
import SafetyHat from "./assets/SafetyHat.svg";

import Layer from "./assets/Layer.svg";

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
			menuOpen : true,
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
				if(layers[l] != "Fille 0" && typeof this.layersArray[layers[l].replace(' ', '')] == "undefined"){
					if(layers[l] == "R-1"){
						this.$set(this.layersArray, layers[l].replace(' ', ''), {
							name : layers[l],
							display : true,
							nth : 1
						});
					}else if(layers[l] == "RDC"){
						this.$set(this.layersArray, layers[l].replace(' ', ''), {
							name : layers[l],
							display : true,
							nth : 3
						});
					}else if(layers[l] == "R+1"){
						this.$set(this.layersArray, layers[l].replace(' ', ''), {
							name : layers[l],
							display : true,
							nth : 4
						});
					}else if(layers[l] == "R+2"){
						this.$set(this.layersArray, layers[l].replace(' ', ''), {
							name : layers[l],
							display : true,
							nth : 5
						});
					}
				}
				
			}
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
			this.handleTeamDisplay();
		},
		handleDisplayTap2 : function(e){
			this.menuDisplayOpen = false
			if(this.menuDisplayOpen){
				this.menuDisplayLayersOpen = false;
				this.menuDisplayZoneOpen = false;
				this.menuDisplayConstructionStateOpen = false;
			}
			this.handleBasicDisplay();
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

		handleTeamSelected : function(teamId){
			const team = this.model.getTaskTeamById(teamId);
			V_socketUtils.setTeamDisplayed(team, !this.colorTeams[team.getId()].display);
		},

		handleZoneSelected : function(zone){
			 V_socketUtils.setZoneDisplayed(zone, !this.zonesArray[zone].display);
		},

		handleConstructSelected : function(state){
			let toReturn = 0;
			switch(state){
				case "Existant" : toReturn = 0; break;
				case "Nouveau" : toReturn = 1; break;
				case "Démolition" : toReturn = 2; break;
				case "Temporaire" : toReturn = 3; break; 
			}
			V_socketUtils.setConstructionStateDisplayed(toReturn, !this.constructionTypes[toReturn].display);
		},

		handleLayerSelected : function(layer){
			V_socketUtils.setLayerDisplayed(layer.replace(" ", ""), !(this.layersArray[layer.replace(" ", "")].display));
		},

		setLayerDisplayed : function(layer, bool){
			if(typeof this.layersArray[layer] == "undefined"){
				if(layer != "Fille 0"){
					if(layer == "R-1"){
						this.layersArray[layer] = {
							name : layer,
							display : true,
							nth : 1
						};
					}else if(layer == "RDC"){
						this.layersArray[layer] = {
							name : layer,
							display : true,
							nth : 3
						};
					}else if(layer == "R+1"){
						this.layersArray[layer] = {
							name : layer,
							display : true,
							nth : 4
						};
					}else if(layer == "R+2"){
						this.layersArray[layer] = {
							name : layer,
							display : true,
							nth : 5
						};
					}
				}
			} 
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
		},

		getConstructionIcon : function(name){
			switch(name){
				case "Existant" : return Existant;
				case "Démolition" : return Demolition;
				case "Temporaire" : return Temporaire;
				case "Nouveau" : return Nouveau;
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
		<div v-if="menuDisplayConstructionStateOpen || menuDisplayLayersOpen || menuDisplayZoneOpen || menuDisplayOpen" class="subMenuContainer">
			<div v-bind:class="offsetclass"></div>
				
			<div key="menuDisplayConstruct" class="menuDisplayConstruct" v-if="menuDisplayConstructionStateOpen">
				<div>
					<div class="offsetConstructDisplay"></div>
					<div>
						<div class="constructsItems" v-for="construct in constructionTypes" :key="construct.name" v-tap="()=>{handleConstructSelected(construct.name)}" >
							<div v-bind:style="[ construct.display ? { opacity : 1} : { opacity : 0.5} ]" v-html="getConstructionIcon(construct.name)"></div>
							<p v-bind:style="[ construct.display ? { opacity : 1} : { opacity : 0.5} ]" v-html="construct.name"></p>
						</div>
					</div>
				</div>
			</div>

			<div key="menuDisplayLayer" class="menuDisplayLayer" v-if="menuDisplayLayersOpen">
				<div>
					<div class="offsetLayerDisplay"></div>
					<div style="display: flex; flex-direction: column-reverse;">
						<div class="layersItems" v-for="layer in layersArray" style="order: layer.nth" :key="layer.name" v-tap="()=>{handleLayerSelected(layer.name)}" >
							<div v-bind:style="[ layer.display ? { opacity : 1} : { opacity : 0.5} ]" >` + Layer + `</div>
							<p v-bind:style="[ layer.display ? { opacity : 1} : { opacity : 0.5} ]" v-html="layer.name"></p>
						</div>
					</div>
				</div>
			</div>

			<div key="menuDisplayZone" class="menuDisplayZone" v-if="menuDisplayZoneOpen">
				<div>
					<div class="offsetZoneDisplay"></div>
					<div>
						<div class="zonesItems" v-for="zone in zonesArray" :key="zone.name" v-tap="()=>{handleZoneSelected(zone.name.replace(' ',''))}">
							<div v-bind:style="[ zone.display ? { opacity : 1} : { opacity : 0.5} ]" >` + Zone + `</div>
							<p v-bind:style="[ zone.display ? { opacity : 1} : { opacity : 0.5} ]" v-html="zone.name"></p>
						</div>
					</div>
				</div>
			</div>



			<div key="menuDisplay" class="menuDisplay" v-if="menuDisplayOpen">
				<div v-if="teamdisplaycond">
					<div class="offsetTeamDisplay"></div>
					<div>
						<div class="teamItems" v-for="team in colorTeams" v-bind:id="'teamitem-' + team.team.getId()" :key="'teamDisplay' + team.team.getId()" v-tap="()=>handleTeamSelected(team.team.getId())" >
							<div v-bind:style="[ team.display ? { opacity : 1, backgroundColor : team.color} : { opacity : 0.5, backgroundColor : team.color} ]" >` + SafetyHat + `</div>
							<p v-bind:id="'teamitem-' + team.team.getId()" v-html="team.team.getName()"></p>
						</div>
					</div>
				</div>
			</div>
			

		</div>
		<div class="mainMenu">
			<div class="itemContainer" v-if="menuOpen">
				<div v-bind:style="[ !teamdisplaycond ? { opacity : 1} : { opacity : 0.5} ]" class="menuItem" id="filterMenuTapId" v-tap="handleDisplayTap2">
					` + BlackAndWhite +  `
				</div>
			</div>
			<div class="itemContainer" v-if="menuOpen">
				<div v-bind:style="[ teamdisplaycond ? { opacity : 1} : { opacity : 0.5} ]" class="menuItem" v-tap="handleDisplayTap">
					` + ColorPalette +  `
				</div>
			</div>

			<div class="itemContainer" v-if="menuOpen">
				<div v-bind:style="[ cameraLocked ? { opacity : 1} : { opacity : 0.5} ]" class="menuItem" v-tap="handleLockCameraDisplay">
					` + PrivateLock +  `
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
		</div>
	</div>`,
}