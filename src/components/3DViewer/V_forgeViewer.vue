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

import modelBar from "./assets/LvlBarHidden2.svg";
import ifcIcon from "./assets/IFCfileicon.svg";

import V_ifcPropertiesPanel from "./V_ifcPropertiesPanel.vue";
import V_filterPanel from "../FilterPanel/V_filterPanel.vue";


export default {
	components : {
		ifcPropertiesPanel : V_ifcPropertiesPanel,
		filterPanel : V_filterPanel,
	},
	data : function(){
		return {
			scene : null,
			time : null,
			playerinit : null,
			offset : null,
			menuopen : false,
			modelShown : [],
			nextCameraUpdate : false,
			cameraTimeout : null,
			infosBeforeView : null,
			cameraLocked : false,
			ifcPropertiesDisplayed : [],
			layers : [],
			loadingText : "Initialisation",
			loaded : false,
			initLayers : {},
		}
	},
	props : [
		"urns",
		"oauth",
		"timeline",
		"model",
		"ifcProperties"
	],
	computed : {
		_model : function(){
			return this.model;
		}
	},
	methods : {

		getScene : function(){
			return this.scene;
		},

		watchTime : function(time, forced = false){
			if(this.time != time || forced){

				this.time = time;

				//State
				const startActualWeek = this.time * 7;
				const start6Weeks = (Math.floor((this.time - this.offset) / 6) * 6 + this.offset) * 7;
				//const start6Weeks = Math.trunc(this.time / 6) * 42;
				const previousTasks = this.timeline.getTasksBetweenTwoDates(0, startActualWeek - 1);
				const thisWeek = this.timeline.getTasksBetweenTwoDates(startActualWeek, startActualWeek + 6);
				const weeksTasks = this.timeline.getTasksBetweenTwoDates(startActualWeek, start6Weeks + 41);
				const nextTasks = this.timeline.getTasksBetweenTwoDates(start6Weeks + 42, this.model.getDuration() * 7);

				for(let n in nextTasks){
					const objs = nextTasks[n].getObject4D().getObjects3D()
					for(let o in objs){
						const forges = objs[o].getForgeObjects();
						for(let f in forges){
							Memory.setState(forges[f], 1);
						}
					}
				}

				for(let n in weeksTasks){
					const objs = weeksTasks[n].getObject4D().getObjects3D()
					for(let o in objs){
						const forges = objs[o].getForgeObjects();
						for(let f in forges){
							Memory.setState(forges[f], 2);
						}
					}
				}

				for(let n in thisWeek){
					const objs = thisWeek[n].getObject4D().getObjects3D()
					for(let o in objs){
						const forges = objs[o].getForgeObjects();
						for(let f in forges){
							Memory.setState(forges[f], 3);
						}
					}
				}

				for(let n in previousTasks){
					const objs = previousTasks[n].getObject4D().getObjects3D()
					for(let o in objs){
						const forges = objs[o].getForgeObjects();
						for(let f in forges){
							Memory.setState(forges[f], 4);
						}
					}
				}

				//Selection
				// this.clearSelection();
				// const tasks = V_taskTableUtils.getTokens();
				// for(let t in tasks){
				// 	this.select(tasks[t].getObject4D(), true);
				// }

				this.setTime(this.time);

				Memory.refresh();

			}
		},

		setZoneDisplayed(zone, bool){
			Memory.setZoneDisplayed(zone, bool);
			Memory.refresh();
		},

		setConstructionStateDisplayed(constructionState, bool){
			Memory.setConstructionStateDisplayed(constructionState, bool);
			Memory.refresh();
		},

		setLayerDisplayed(layer, bool){
			Memory.setLayerDisplayed(layer, bool);
			Memory.refresh();
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
					//console.log(Memory.getForgeObject(select[s].selection[ss], select[s].model);
				}
			}

			if(selection.length != 0){
				
				//IFC Properties
				this.ifcPropertiesDisplayed = [];
				for(let s in selection){
					const objF = Memory.getForgeObject(selection[s].selection, selection[s].model);
					if(objF != null){
						const properties = objF.getProperties();
						this.ifcPropertiesDisplayed.push({ key : "Phase", value: objF.getObject3D().getParent().getTask().getParentPhase().getName()});
						this.ifcPropertiesDisplayed.push({ key : "Tâche", value: objF.getObject3D().getParent().getTask().getName()});
						this.ifcPropertiesDisplayed.push({ key : "Equipe", value: objF.getObject3D().getParent().getTask().getTaskTeam().getName()});
						for(let p in properties){
							if(typeof properties[p].getInfo() == "object"){
								this.ifcPropertiesDisplayed.push({ key : properties[p].getName(), value: properties[p].getInfo().displayValue});
							}else{
								this.ifcPropertiesDisplayed.push({ key : properties[p].getName(), value: properties[p].getInfo()});
							}
						}

					}
					
				}

				this.clearSelection();
				this.scene.getViewer().clearSelection();
				for(let s in selection){
					const dbId = selection[s].selection;
					const model = selection[s].model;
					const fObject = Memory.getForgeObject(dbId, model);
					if(typeof fObject != "undefined" && fObject != null){
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
				}
				Memory.refresh();
			}
		},

		select(object4D, bool){
			const toFit = [];
			const objs = object4D.getObjects3D();
			for(let o in objs){
				const fobjs = objs[o].getForgeObjects();
				for(let f in fobjs){
					Memory.select(fobjs[f], bool);
					let temp = null;
					for(let t in toFit){
						if(toFit[t].model.id == fobjs[f].getModel().id) temp = t;
					}
					if(temp == null){
						toFit.push({
							model : fobjs[f].getModel(),
							selection : [fobjs[f].getId()]
						});
					}else{
						toFit[temp].selection.push(fobjs[f].getId());
					}
				}
			}
			this.setSelectDisplayMode(bool);
			
			// if(bool){
			// 	this.ifcPropertiesDisplayed = [{ key : "keyTest", value: "Bonjour"}];
			// }else{
			// 	this.ifcPropertiesDisplayed = [{ key : "key2", value: "Aurevoir"}];
			// }

			this.nextCameraUpdate = true;
			if(bool){
				this.infosBeforeView = {
						position : {
							x : this.scene.getViewer().autocamCamera.position.x,
							y : this.scene.getViewer().autocamCamera.position.y,
							z : this.scene.getViewer().autocamCamera.position.z,
						},
						target : {
							x : this.scene.getViewer().autocamCamera.target.x,
							y : this.scene.getViewer().autocamCamera.target.y,
							z : this.scene.getViewer().autocamCamera.target.z,
						},
						up : {
							x : this.scene.getViewer().autocamCamera.up.x,
							y : this.scene.getViewer().autocamCamera.up.y,
							z : this.scene.getViewer().autocamCamera.up.z,
						},
						pivot :{
							x : this.scene.getViewer().autocamCamera.pivot.x,
							y : this.scene.getViewer().autocamCamera.pivot.y,
							z : this.scene.getViewer().autocamCamera.pivot.z,
						},
						world :{
							x : this.scene.getViewer().autocamCamera.worldup.x,
							y : this.scene.getViewer().autocamCamera.worldup.y,
							z : this.scene.getViewer().autocamCamera.worldup.z,
						}
					}
				this.scene.getViewer().utilities.autocam.shotParams.duration = 0;
				requestAnimationFrame(()=>{
					this.scene.getViewer().utilities.autocam.shotParams.duration = 2;
					this.scene.getViewer().impl.fitToView(toFit, false);
				})
			}else{
				this.scene.getViewer().utilities.autocam.shotParams.duration = 0;
				requestAnimationFrame(()=>{
					this.scene.getViewer().utilities.autocam.shotParams.duration = 2;
					this.scene.getViewer().utilities.transitionView(new THREE.Vector3(this.infosBeforeView.position.x, this.infosBeforeView.position.y, this.infosBeforeView.position.z), new THREE.Vector3(this.infosBeforeView.target.x, this.infosBeforeView.target.y, this.infosBeforeView.target.z), this.scene.getViewer().autocamCamera.fov, new THREE.Vector3(this.infosBeforeView.up.x, this.infosBeforeView.up.y, this.infosBeforeView.up.z), new THREE.Vector3(this.infosBeforeView.world.x, this.infosBeforeView.world.y, this.infosBeforeView.world.z), false, new THREE.Vector3(0, 0, 0));
				})
			}
			
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

		setSelectDisplayMode(bool){
			Memory.setSelectDisplayMode(bool);
			Memory.refresh();
		},

		setTime(time){
			this.playerinit = time;
			if(!this.cameraLocked){
				const tasks = this.timeline.getTasksBetweenTwoDates(time * 7, time * 7 + 6);
				const zones = [];
				let camera = null;
				for(let t in tasks){
					if(camera == 1) break;
					switch (tasks[t].getZone().getValue()){
						case "A, B, C, D" : camera = 1;
											break;
						case "A" : 	if(camera != null && camera != 2){camera = 1; break};
								camera = 2;
								break;
						case "B" : 	if(camera != null && camera != 3){camera = 1; break};
								camera = 3;
								break;
						case "C" : 	if(camera != null && camera != 4){camera = 1; break};
								camera = 4;
								break;
						case "D" : 	if(camera != null && camera != 5){camera = 1; break};
								camera = 5;
								break;

					}
				}
				if(camera == null) camera = 0;
				this.scene.getViewer().utilities.autocam.shotParams.duration = 0;
				requestAnimationFrame(()=>{
					this.scene.getViewer().utilities.autocam.shotParams.duration = 2;
					this.nextCameraUpdate = true;
					this.scene.setFixCamera(camera);
				})
			}
		},

		setOffset(offset){
			this.offset = offset;
			this.watchTime(this.time, true);
		},

		handleMenuOpen(){
			this.menuopen = !this.menuopen;
		},


		handleMenuChange(id){
			this.$set(this.modelShown, id, {
				shown : !this.modelShown[id].shown,
				name : this.modelShown[id].name,
				id : id,
			});
			Memory.setIfcTransparent(id, this.modelShown[id].shown);
			V_socketUtils.setIfcMenuChange(this.modelShown);
		},
		refreshCamera() {
			// Memory.setTarget();
			// Memory.refresh();
		},

		setIfcMenuChange(ifcs){
			for(let i in ifcs){
				this.$set(this.modelShown, i, {
					shown : ifcs[i],
					name : this.modelShown[i].name,
					id : i,
				});
				Memory.setIfcTransparent(i, this.modelShown[i].shown);
			}
		},

		triggerPhaseDisplay(phase, bool){
			Memory.triggerPhaseDisplay(phase, bool);
			Memory.refresh();
		},

		triggerPhaseDisplayById(phaseId, bool){
			const phase = this.model.getPhase(phaseId);
			Memory.triggerPhaseDisplay(phase, bool);
			Memory.refresh();
		},

		triggerTeamDisplay(team, bool){
			Memory.triggerTeamDisplay(team, bool);
			Memory.refresh();
		},

		setCamera(infos){
			this.nextCameraUpdate = true;
			this.scene.getViewer().utilities.autocam.shotParams.duration = 0;
			this.scene.getViewer().utilities.transitionView(new THREE.Vector3(infos.position.x, infos.position.y, infos.position.z), new THREE.Vector3(infos.target.x, infos.target.y, infos.target.z), this.scene.getViewer().autocamCamera.fov, new THREE.Vector3(infos.up.x, infos.up.y, infos.up.z), new THREE.Vector3(infos.world.x, infos.world.y, infos.world.z), false, new THREE.Vector3(0, 0, 0));
		},

		setCameraLocked(bool){
			this.cameraLocked = bool;
		},

		hackEdges(){

			this.scene.getViewer().setDisplayEdges(true);

	      const renderer = this.scene.getViewer().impl.renderer();
	      const viewer = this.scene.getViewer();
	      const _edgeMaterial = renderer.getEdgeMaterial();
	      Memory.addMaterialInformations(viewer.impl.getMaterials()._materials);

	      const l = this.urns.length;
			_edgeMaterial.getCustomOverrideMaterial = function(shapeMaterial) {
					//console.log(shapeMaterial.id, shapeMaterial.lol);

					//console.log(shapeMaterial.id);
            // If the original material applies the instance transform, depthMaterial must do this as well.
            var instanced   = shapeMaterial.useInstancing;

            var mat = _edgeMaterial;

            //Unlike depth test settings, we need to change uniforms on the material variant
            //for them to take effect
            const _isRenderingOverlays = true;
            const _isRenderingHidden = false;
            
            var _edgeColor = null;
				    var _edgeColorHighlight = null;
				    var _edgeColorHighlightUnder = null;

				    if(shapeMaterial.edgeCustumColor){
            	_edgeColor = shapeMaterial.edgeCustumColor;
					    _edgeColorHighlight = shapeMaterial.edgeCustumColor;
					    _edgeColorHighlightUnder = shapeMaterial.edgeCustumColor;
            }else{
            	_edgeColor = new THREE.Vector4(1,1,1,0);
					    _edgeColorHighlight = new THREE.Vector4(1,1,0, 0);
					    _edgeColorHighlightUnder = new THREE.Vector4(1,1,0, 0);
            }
				    
            if (_isRenderingOverlays) {
                if (_isRenderingHidden) {
                    mat.uniforms.color.value.copy(_edgeColorHighlightUnder);
                } else {
                    mat.uniforms.color.value.copy(_edgeColorHighlight);
                }
            } else {
                mat.uniforms.color.value.copy(_edgeColor);
            }

            // Standard model materials usually use the default edge opacity.
            // But we allow custom shapes to override it.
            if (shapeMaterial.edgeOpacity !== undefined) {
                mat.uniforms.color.value.w = shapeMaterial.edgeOpacity;
            }

            mat.uniforms.color.needsUpdate = true;
            return mat;
        };

			//console.log(this.scene.getViewer());
		}


	},
	mounted : function(){
		this.scene = new Scene(this.model);
		Memory.setSceneObject(this.scene);
		this.objs = this.model.getObjects3D();

		V_timelineUtils.addListener("time", this, this.setTime);
		V_timelineUtils.addListener("offset", this, this.setOffset);

		Memory.setNb3DModels(this.urns.length);
		Memory.setNbStyles(this.scene.getEdgeStyles().length);

		Memory.addLoadListener(()=>{
			this.loadingText = Memory.getLoadCounter() + " / " + (Memory.getNbStyles() * Memory.getNb3DModels());
		});

		this.scene.init(this.oauth, this.urns, this.objs, this.ifcProperties, ()=>{
			console.log("init done");
			this.layers = Memory.getLayers();
			this.scene.getViewer().utilities.autocam.shotParams.duration = 2;
			this.scene.getViewer().setUsePivotAlways(true);
			this.scene.getViewer().utilities.autocam.homeVector = {
	            position: new THREE.Vector3(68.02633925341685, -98.55161393828413, 49.90499151685977),
	                  up: new THREE.Vector3(-0.31805582789506753, 0.3562710279069489, 0.8785849105329031),
	              center: new THREE.Vector3(20.10941642912082, -44.87735347360224, 10.793415509800447),
	               pivot: new THREE.Vector3(0, 0, 0),
	                 fov: this.scene.getViewer().utilities.autocam.camera.fov,
	             worldUp: new THREE.Vector3(0, 0, 1),
	             isOrtho: false
	        };

			this.scene.addListener(Autodesk.Viewing.CAMERA_CHANGE_EVENT, (e)=>{
				// console.log("position", e.camera.position);
				// console.log("target", e.camera.target);
				// console.log("up", e.camera.up);
				// console.log("pivot", e.camera.pivot);
				// console.log("worldup", e.camera.worldup);
				if(!this.nextCameraUpdate){
					V_socketUtils.setCamera({
						position : {
							x : e.camera.position.x,
							y : e.camera.position.y,
							z : e.camera.position.z,
						},
						target : {
							x : e.camera.target.x,
							y : e.camera.target.y,
							z : e.camera.target.z,
						},
						up : {
							x : e.camera.up.x,
							y : e.camera.up.y,
							z : e.camera.up.z,
						},
						pivot :{
							x : e.camera.pivot.x,
							y : e.camera.pivot.y,
							z : e.camera.pivot.z,
						},
						world :{
							x : e.camera.worldup.x,
							y : e.camera.worldup.y,
							z : e.camera.worldup.z,
						}
					})
				}else{
					if(this.cameraTimeout != null){
						clearTimeout(this.cameraTimeout);
						this.cameraTimeout = null;
					}
					this.cameraTimeout = setTimeout(()=>{
						this.nextCameraUpdate = false;
						this.scene.getViewer().utilities.autocam.shotParams.duration = 0;
						requestAnimationFrame(()=>{
							this.scene.getViewer().utilities.autocam.shotParams.duration = 2;
						})
					}, 400);
				}
			});

			const models = this.scene.getModels();
			for(let m in models){
				this.modelShown[Math.trunc(models[m].getId() / Memory.getNbStyles())] = {
					shown : models[m].isShown(),
					id : Math.trunc(models[m].getId() / Memory.getNbStyles()),
					name : models[m].getName()
				}
			}

			//Start rendering

			//this.createCustumMaterials();
			//this.hideLayer("Etage Rouge", true);
			//this.hideLayer("Etage Bleu", true);
			//this.setLayerHideMode(true);
			//this.allTransparent();
			//this.allInvisible(true);
			//this.allToRed(true);
			//this.setNotLinked();
			// const tasks = V_taskTableUtils.getTokens();
			// for(let t in tasks){
			// 	this.select(tasks[t].getObject4D(), true);
			// }

			this.scene.addListener(Autodesk.Viewing.AGGREGATE_SELECTION_CHANGED_EVENT, this.highlightTask);
			this.scene.setLightPreset(15);

			this.scene.setCube(true);

			this.scene.getViewer().impl.selectionMaterialBase.opacity = 0;
			this.scene.getViewer().impl.selectionMaterialTop.opacity = 0;

			this.hackEdges();

			const tool = new Tool(this.scene.getViewer());
			this.scene.getViewer().toolController.registerTool(tool);
			this.scene.getViewer().toolController.activateTool('tool');

			V_4DUtils.setForgeViewer(this);
			V_timelineUtils.removeListener("time", this);
			V_timelineUtils.addListener("time", this, this.watchTime);
			V_socketUtils.addViewer();

			//All informations are loaded / All objects are invisible on their models
			console.log("LOADED");

			//Properties extension
			for(let i = 0 ; i < (Memory.getNbStyles() * Memory.getNb3DModels()); i++){
				if((i % Memory.getNbStyles()) != 0){
					const style = document.createElement('style');
					style.innerHTML = '[lmv-modelid="' + (i + 1)  +  '"] { display : none }';
					document.body.appendChild(style);
				}
			}

			//
			
			Memory.setUnlinkedStyle();
			this.watchTime(this.playerinit);
			for(let m in models){
				Memory.setIfcTransparent(this.modelShown[Math.trunc(models[m].getId() / Memory.getNbStyles())], this.modelShown[Math.trunc(models[m].getId() / Memory.getNbStyles())].shown);
			}

			this.loaded = true;

		})

	},
	template : `
	<div id="forgeViewer">
		<div v-if="!loaded" id="loadFrame"><p v-html="loadingText"></p></div>
		<!-- forgeViewer -->
		<ifcPropertiesPanel v-bind:properties="ifcPropertiesDisplayed"></ifcPropertiesPanel>
		<div id="modelMenu"> 
			
			<div class="openMenu" >
				<div v-if="menuopen" class="ifcMenu">
					<div class="ifcName" v-for="model in modelShown" v-tap="() => handleMenuChange(model.id)" v-bind:class='[ model.shown ? "shown" : "hide"]'> 
						<a class="ifcIcon">` + ifcIcon + `</a> 
						<p v-html="model.name"></p>
					</div>
				</div>
			`+ modelBar + `
			</div>
		</div>

		<div id="forgeV">
			<div id="ifcStructures"></div>
		</div>
		<div id="filterPanelWrapper">
			<filterPanel id="filterPanel" v-bind:layers="layers" v-bind:model="_model"></filterPanel>
		</div>
	</div>`,
}