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

		getScene : function(){
			return this.scene;
		},

		watchTime : function(time){
			if(this.time != time){

				this.time = time;
				//State
				const startActualWeek = this.time * 7;

				const start6Weeks = Math.trunc(this.time / 6) * 42;
				const previousTasks = this.timeline.getTasksBetweenTwoDates(0, start6Weeks - 1);
				const thisWeek = this.timeline.getTasksBetweenTwoDates(start6Weeks, start6Weeks + 6);
				const weeksTasks = this.timeline.getTasksBetweenTwoDates(start6Weeks, start6Weeks + 41);
				const nextTasks = this.timeline.getTasksBetweenTwoDates(start6Weeks + 84, this.model.getDuration() * 7);

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

				Memory.refresh();

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
				this.scene.getViewer().clearSelection();
				this.clearSelection();
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

		setTime(time){
			this.playerinit = time;
		},

		handleMenuOpen(){
			this.menuopen = !this.menuopen;
			const s = this.scene.getStyle(0, null, true, true, "basicMaterial");
			const id = Memory.getModelByEdgeStyle(1, s.edge);
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

		Memory.setNb3DModels(this.urns.length);
		Memory.setNbStyles(this.scene.getEdgeStyles().length);

		this.scene.init(this.oauth, this.urns, this.objs, ()=>{
			console.log("init done");

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
			this.scene.addListener(Autodesk.Viewing.CAMERA_CHANGED_EVENT, this.refreshCamera);
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
			
			Memory.setUnlinkedStyle();
			this.watchTime(this.playerinit);
			for(let m in models){
				Memory.setIfcTransparent(this.modelShown[Math.trunc(models[m].getId() / Memory.getNbStyles())], this.modelShown[Math.trunc(models[m].getId() / Memory.getNbStyles())].shown);
			}

		})

	},
	template : `
	<div id="forgeViewer">
		<!-- forgeViewer -->
		<div id="modelMenu"> 
			
			<div class="openMenu" >
				<div v-if="menuopen">
					<div class="modelName" v-for="model in modelShown" v-tap="() => handleMenuChange(model.id)" v-bind:class='[ model.shown ? "shown" : "hide"]'> 
						<a class="fileButton"></a> 
						<p v-html="model.name"></p>
					</div>
				</div>
			`+ modelBar + `
			</div>
		</div>

		<div id="forgeV"></div>
	</div>`,
}