import V_4DUtils from "../Utils/V_4DUtils.class.js";
import V_socketUtils from "../Utils/V_socketUtils.class.js";
import V_timelineUtils from "../Utils/V_timelineUtils.class.js";
import V_taskTableUtils from "../Utils/V_taskTableUtils.class.js";
import Config from "../../../config.js";
import "./V_forgeViewer.scss";
import scssVariables from "../SixWeekView/assets/_variables.scss";
import Utils from "../../class/Utils.class.js";

import Scene from "./class/Scene.class.js";
import Memory from "./class/Memory.class.js";

import Tool from "./Tool.js";
import Camera from "./class/Camera.class.js";

import modelBar from "./assets/modelBar.svg";


export default {
	data : function(){
		return {
			scene : null,
			time : null,
			playerinit : null,
			menuopen : false,
			modelShown : []
		}
	},
	props : [
		"urns",
		"oauth",
		"timeline",
		"model",
	],
	methods : {

		createCustumMaterials(){
			const selectedMaterial = new THREE.MeshBasicMaterial({
			    color: scssVariables["select3DColor"],
			    emissive : scssVariables["select3DColor"],
			    specular : scssVariables["select3DColor"],
			    shininess : 0,
			});
			Memory.addMaterial(selectedMaterial, true, "selectedMaterial");

			const nextsWeeksMat = new THREE.MeshBasicMaterial({
				reflectivity: 0.0,
				flatShading: true,
				transparent: true,
				opacity: 0.5,
				color: scssVariables["nextSixWeeks"],
			});
			Memory.addMaterial(nextsWeeksMat, true, "nextsWeeksMat");

			const currWeekMat = new THREE.MeshBasicMaterial({
				reflectivity: 0.0,
				flatShading: true,
				transparent: true,
				opacity: 1,
				color: '#FFFFFF',//scssVariables["currentWeek"],
			});
			Memory.addMaterial(currWeekMat, true, "currWeekMat");

			const sixWeeksMat = new THREE.MeshBasicMaterial({
				reflectivity: 0.0,
				flatShading: true,
				transparent: true,
				opacity: 0.75,
				color: scssVariables["currentSixWeeks"],
			});
			Memory.addMaterial(sixWeeksMat, true, "sixWeeksMat");

			const teams = this.model.getTaskTeams();
			for(let t in teams){

				const teamMaterial = new THREE.MeshBasicMaterial({
					reflectivity: 0.0,
					flatShading: true,
					transparent: true,
					opacity: 0.75,
					color: scssVariables[teams[t].getColorClass().replace("BG_", "").toLowerCase()],
				});
				Memory.addMaterial(teamMaterial , true, teams[t].getId() + "-team");
				const teamNotMaterial = new THREE.MeshBasicMaterial({
					reflectivity: 0.0,
					flatShading: true,
					transparent: true,
					opacity: 0.35,
					color: scssVariables[teams[t].getColorClass().replace("BG_", "").toLowerCase()],
				});
				Memory.addMaterial(teamNotMaterial , true, teams[t].getId() + "-not-team");
				
			}
		},

		allInvisible(bool){
			Memory.setAllInvisible(bool);
			Memory.refresh();
		},

		allToRed(bool){
			Memory.allToRed(bool);
			Memory.refresh();
		},

		allTransparent(){
			this.scene.setAllMaterials("ignoredMaterial");
		},

		watchTime : function(time){
			if(this.time != time){

				this.time = time;

				//State
				const startActualWeek = this.time * 7;

				const start6Weeks = Math.trunc(this.time / 6) * 42;
				const previousTasks = this.timeline.getTasksBetweenTwoDates(0, start6Weeks);
				const weeksTasks = this.timeline.getTasksBetweenTwoDates(start6Weeks, start6Weeks + 41);
				const nextTasks = this.timeline.getTasksBetweenTwoDates(start6Weeks, this.model.getDuration() * 7);

				for(let t in previousTasks){
					const objs = previousTasks[t].getObject4D().getObjects3D()
					for(let o in objs){
						const forges = objs[o].getForgeObjects();
						for(let f in forges){
							Memory.setState(forges[f], "built");
						}
					}
				}

				for(let n in nextTasks){
					const objs = nextTasks[n].getObject4D().getObjects3D()
					for(let o in objs){
						const forges = objs[o].getForgeObjects();
						for(let f in forges){
							Memory.setState(forges[f], "toBuild");
						}
					}
				}

				for(let w in weeksTasks){
					let state = null;
					if(this.timeline.isActiveBetweenTwoDate(weeksTasks[w], startActualWeek, startActualWeek + 6)){
						state = "currentWeek";
					}else{
						state = "builtOn6W";
					}

					const objs = weeksTasks[w].getObject4D().getObjects3D()
					for(let o in objs){
						const forges = objs[o].getForgeObjects();
						for(let f in forges){
							Memory.setState(forges[f], state);
						}
					}
				}		

				//Selection
				this.clearSelection();
				const tasks = V_taskTableUtils.getTokens();
				for(let t in tasks){
					this.select(tasks[t].getObject4D(), true);
				}
				if(!Memory.isTeamDisplayed()){
					Memory.refresh();
				}

			}
		},

		highlightTask() {
			const select = this.scene.getViewer().getAggregateSelection();
			const selection = [];
			for(let s in select){
				for(let ss in select[s].selection){
					selection.push({
						selection : select[s].selection[ss],
						model : select[s].model
					});
				}
			}
			if(selection.length != 0){
				//this.scene.getViewer().clearSelection();
				for(let s in selection){
					const dbId = selection[s].selection;
					const model = selection[s].model;
					const fObject = Memory.getForgeObject(dbId, model);
					if(typeof fObject != "undefined"){
						const object4D = fObject.getObject3D().getParent();
						V_socketUtils.highlightTask(object4D.getTask(), !Memory.isSelected(fObject));
						const objects3D = object4D.getObjects3D();
						for(let obj in objects3D){
							const fObjs = objects3D[obj].getForgeObjects();
							for( let o in fObjs){
								if(fObjs[o] != null){	
									const b = fObjs[o].getSelected();
									Memory.select(fObjs[o], !b)
								}
							}
						}
					}


					//const task = fObjs[o].getObject3D().getParent().getTask();
					//V_socketUtils.highlightTask(task, !b);

				}
			}
			Memory.refresh();
		},

		setNotLinked() {
			Memory.setNotLinked();
			Memory.refresh();
		},

		select(object4D, bool){
			const objs = object4D.getObjects3D();
			for(let o in objs){
				const fobjs = objs[o].getForgeObjects();
				for(let f in fobjs){
					Memory.select(fobjs[f], bool);
				}
			}
			Memory.refresh();
		},

		clearSelection(){
			Memory.clearSelection();
			Memory.refresh();
		},

		setTeamDisplayed(taskTeam, bool){
			Memory.setTeamSelected(taskTeam, bool);
			Memory.refresh();
		},

		setTeamDisplayMode(bool){
			Memory.setTeamDisplayMode(bool);
			Memory.refresh();
		},
		hideLayer(layerName, bool){
			Memory.hideLayer(layerName, bool);
			Memory.refresh();
		},

		setLayerHideMode(bool){
			Memory.setLayerHideMode(bool);
			Memory.refresh();
		},
		setTime(time){
			this.playerinit = time;
		},
		handleMenuOpen(){
			this.menuopen = !this.menuopen;
		},
		handleMenuChange(id){
			this.modelShown[id].model.hide(this.modelShown[id].model.isShown());
			this.$set(this.modelShown, id, {
				model : this.modelShown[id].model,
				shown : this.modelShown[id].model.isShown()
			});
		},
		refreshCamera() {
			Memory.setTarget();
			Memory.refresh();
		}
	},
	mounted : function(){

		this.scene = new Scene();
		this.objs = this.model.getObjects3D();

		V_timelineUtils.addListener("time", this, this.setTime);
		this.scene.init(this.oauth, this.urns, this.objs, ()=>{
			console.log("init done");

			const models = this.scene.getModels();
			for(let m in models){
				this.modelShown[models[m].getId()] = {
					shown : models[m].isShown(),
					model : models[m]
				}
			}
		
			let camera = new Camera();
			Memory.setCamera(camera);

			this.createCustumMaterials();
			this.hideLayer("Etage Rouge", true);
			this.hideLayer("Etage Bleu", true);
			this.setLayerHideMode(true);
			//this.allTransparent();
			//this.allInvisible(true);
			//this.allToRed(true);
			this.setNotLinked();
			const tasks = V_taskTableUtils.getTokens();
			for(let t in tasks){
				this.select(tasks[t].getObject4D(), true);
			}

			this.scene.addListener(Autodesk.Viewing.AGGREGATE_SELECTION_CHANGED_EVENT, this.highlightTask);
			this.scene.addListener(Autodesk.Viewing.CAMERA_CHANGED_EVENT, this.refreshCamera);
			this.scene.setLightPreset(15);

			this.scene.setCube(true);
			/* Memory.getViewer().forEachExtension( (ext) => {
				console.log(ext);
			}); */

			const tool = new Tool(this.scene.getViewer());
			this.scene.getViewer().toolController.registerTool(tool);
			this.scene.getViewer().toolController.activateTool('tool');
			this.scene.getViewer().impl.selectionMaterialBase.opacity = 0;
			this.scene.getViewer().impl.selectionMaterialTop.opacity = 0;

			V_4DUtils.setForgeViewer(this);
			V_timelineUtils.removeListener("time", this);
			V_timelineUtils.addListener("time", this, this.watchTime);
			this.watchTime(this.playerinit);
			V_socketUtils.addViewer();
		})

	},
	template : `
	<div id="forgeViewer">
		<!-- forgeViewer -->
		<div id="modelMenu"> 
			
			<div class="openMenu" >
				<div v-if="menuopen">
					<div class="modelName" v-for="model in modelShown" v-tap="() => handleMenuChange(model.model.getId())" v-bind:class='[ model.shown ? "shown" : "hide"]'> 
						<a class="fileButton"></a> 
						<p v-html="model.model.getName()"></p>
					</div>
				</div>
			`+ modelBar + `
			</div>
		</div>

		<div id="forgeV"></div>
	</div>`,
}