import Utils from "../../../class/Utils.class.js";
import Document from "./Document.class.js";
import Memory from "./Memory.class.js";

import scssVariables from "../../SixWeekView/assets/_variables.scss";

import styles3D from "../assets/styles3D.csv";

class Scene{

	#id;
	#viewer;
	#initInfos;
	#documents;
	#viewCubeUiExt;
	#modelInitLoaded;
	#modelInitLoaded2;
	#modelsNeeded;
	#planningModel;
	#cameraPositions;

	#styles;
	/**
		@class Scene
		@classdesc Scene represents the forge viewer

		@constructs

		@param {int} [id=automaticaly generated] id of the scene.
	*/
	constructor(planningModel, id = Utils.getId("scene")){
		this.#planningModel = planningModel;
		this.#id = id;
		this.#viewer = null;
		this.#initInfos = {
			callback : null,
			oauth : null,
			urns : null,
		}
		this.#documents = [];
		this.#viewCubeUiExt = null;
		this.#modelInitLoaded = 0;
		this.#modelInitLoaded2 = 0;


		this.#styles = [];
		this.parseStyles(styles3D);
		this.#modelsNeeded = this.determineModels();

		this.cameraPositions = [
			//Position accueil
			{
				//position
				position : {x: 68.02633925341685, y: -98.55161393828413, z: 49.90499151685977},
				target : {x: 20.10941642912082, y: -44.87735347360224, z: 10.793415509800447},
				up : {x: -0.31805582789506753, y: 0.3562710279069489, z: 0.8785849105329031},
				pivot : {x: 0, y: 0, z: 0},
				world : {x: 0, y: 0, z: 1}
			},
			//Position top, ABCD
			{
				position : {x: -154.9668077607862, y: -74.3660765066464, z: 164.31020652559766},
				target : {x: -97.58105627734194, y: -51.91659205167039, z: 110.36978307970458},
				up : {x: 0.6133927226021029, y: 0.23996114078638597, z: 0.752441372314997},
				pivot : {x: 0, y: 0, z: 0},
				world : {x: 0, y: 0, z: 1}
			},
			//Position A
			{
				position : {x: 9.223389039290321, y: -54.01896386105711, z: 11.71775901546539},
				target : {x: -25.258608411304944, y: -4.856835912459893, z: -43.966620612208864},
				up : {x: -0.39044872498148153, y: 0.556675703094308, z: 0.7332543588310904},
				pivot : {x: 0, y: 0, z: 0},
				world : {x: 0, y: 0, z: 1}
			},
			//Position B
			{
				position : {x: -15.394322745046646, y: 0.24477469090506773, z: 21.942441990088277},
				target : {x: 64.88447775379392, y: -2.9957277961861495, z: 6.0841179539690415},
				up : {x: 0.19348628689559694, y: -0.00781019135820668, z: 0.981071892214991},
				pivot : {x: 0, y: 0, z: 0},
				world : {x: 0, y: 0, z: 1}
			},
			//Position C
			{
				position : {x: -43.37295995204263, y: 20.476442557284344, z: 8.773493292172084},
				target : {x: 35.865041571035015, y: 0.14475835412967797, z: 12.599044131983353},
				up : {x: -0.04524751307901153, y: 0.011610062460152145, z: 0.9989083386426586},
				pivot : {x: 0, y: 0, z: 0},
				world : {x: 0, y: 0, z: 1}
			},
			//Position D
			{
				position : {x: -2.742693448669119, y: -10.698429280478678, z: -17.943341988061},
				target : {x: 10.27488485160662, y: -10.308668200182195, z: 62.908768983963235},
				up : {x: -0.9868319795525218, y: -0.029546870358625608, z: 0.15902712531031285},
				pivot : {x: 0, y: 0, z: 0},
				world : {x: 0, y: 0, z: 1}
			},
		];

	}

	setFixCamera(i){
		const infos = this.cameraPositions[i];
		this.#viewer.utilities.transitionView(new THREE.Vector3(infos.position.x, infos.position.y, infos.position.z), new THREE.Vector3(infos.target.x, infos.target.y, infos.target.z), this.#viewer.autocamCamera.fov, new THREE.Vector3(infos.up.x, infos.up.y, infos.up.z), new THREE.Vector3(infos.world.x, infos.world.y, infos.world.z), false, new THREE.Vector3(infos.pivot.x, infos.pivot.y, infos.pivot.z));
	}

	init(oauth, urns, objs, ifcProperties, callback){

		//for(let o in objs){
			//const tag = objs[o].getIFCId();
			for(let i in ifcProperties){
				const infos = JSON.parse(ifcProperties[i]);

					//console.log(infos);
					for(let ii in infos){
						for(let o in infos[ii].objs3D){
							//console.log(infos[ii].objs3D[o].tag);
						}
					}
			}
			//console.log(tag);
		//}

		//Properties
		const properties = {};
		for(let p in ifcProperties){
			const infos = JSON.parse(ifcProperties[p]);
			for(let i in infos){
				for(let o in infos[i].objs3D){
					if(typeof properties[infos[i].objs3D[o].tag] == "undefined") properties[infos[i].objs3D[o].tag] = {
						name3D : infos[i].objs3D[o].name,
						props : []
					};
					properties[infos[i].objs3D[o].tag].props[properties[infos[i].objs3D[o].tag].props.length] = {
						desc : infos[i].desc,
						props : []
					}

					for(let t in infos[i]){
						if(t != "desc" && t != "objs3D"){
							properties[infos[i].objs3D[o].tag].props[properties[infos[i].objs3D[o].tag].props.length - 1] = {
								0 : infos[i][t][0],
								1 : infos[i][t][1],
								2 : infos[i][t][2],
							}
						}
					}
				}
			}
		}

		this.#initInfos = {
			properties : properties,
			callback : callback,
			oauth : oauth,
			urns : urns,
			objs : objs,
		}

		var options = {
		    env: 'AutodeskProduction',
		    api: 'derivativeV2',  // for models uploaded to EMEA change this option to 'derivativeV2_EU'
		    accessToken : this.#initInfos.oauth.credentials.access_token,
		    groundReflection : true,
				edgeRendering : true,
				ambientShadows : true,
		};
		const that = this;
		Autodesk.Viewing.Initializer(options, () => {this._onInitialisationSuccess(that)});
	}

	_onInitialisationSuccess(that){

	    that.#viewer = new Autodesk.Viewing.GuiViewer3D(document.getElementById('forgeV'));
	    Memory.setViewer(this.#viewer);

	    var startedCode = that.#viewer.start();
	    if (startedCode > 0) {
	        console.error('Failed to create a Viewer: WebGL not supported.');
	        return;
	    }

			Autodesk.Viewing.Document.load("urn:" + that.#initInfos.urns[0], (document) => {that._onDocumentLoaded(document, that)} , (event)=>{console.log(console.error('Failed fetching Forge manifest'))});

	}

	getStyle(timeMode, constraint, selected, shown, filterMode){
		let select = "selected";
		if(!selected) select = "notSelected";
		let visible = "visible";
		if(!shown) visible = "hidden";

		let style = null;
		for(let s in this.#styles){
			if(this.#styles[s].timeState == timeMode && (this.#styles[s].constructionState == constraint || this.#styles[s].constructionState == null) && typeof this.#styles[s].styles[filterMode] != "undefined" && typeof this.#styles[s].styles[filterMode][select] != "undefined" && typeof this.#styles[s].styles[filterMode][select][visible] != "undefined"){
				return this.#styles[s].styles[filterMode][select][visible];
			}
		}
	}

	_onDocumentLoaded(doc, that){
		that.#modelInitLoaded++;
	    const docObj = new Document(doc, that.#modelsNeeded);
	    that.#documents.push(docObj);

		if(that.#modelInitLoaded < that.#initInfos.urns.length){
			Autodesk.Viewing.Document.load("urn:" + that.#initInfos.urns[that.#modelInitLoaded], (document) => {that._onDocumentLoaded(document, that)} , (event)=>{console.log(console.error('Failed fetching Forge manifest'))});
			return;
		}

	   	that.#documents[0].loadModels(that.#viewer, that.#initInfos.objs, that.#initInfos.properties, ()=>{that._onModelLoaded(that)});

	}

	_onModelLoaded(that){
		that.#modelInitLoaded2++;
		if(that.#modelInitLoaded2 < that.#initInfos.urns.length){
			that.#documents[that.#modelInitLoaded2].loadModels(that.#viewer, that.#initInfos.objs, that.#initInfos.properties, ()=>{that._onModelLoaded(that)});
			return;
		}
		that._endOfInit(that);
	}

	_endOfInit(that){

	console.log(Autodesk.ModelStructure);

	let section = null;
	let hierarchie = null;
	  const toolbar = that.#viewer.getToolbar();
	  const controls = []
	  for(let i = 0 ; i < toolbar.getNumberOfControls() ; i++){
	  	const id = toolbar.getControlId(i);
	  	const control = toolbar.getControl(id);
	  	const contain = toolbar.getControl(id).getNumberOfControls();
	  	if(contain > 0){
	  		for(let j = 0 ; j < contain ; j++){
	  			if(control.getControlId(j) == "toolbar-sectionTool"){
	  				section = control.getControl(control.getControlId(j));
	  			}else if(control.getControlId(j) == "toolbar-modelStructureTool"){
	  				hierarchie = control.getControl(control.getControlId(j));
	  			}

	  		}
	  	}
	  	controls.push(control);
		}
		for(let c in controls){
			toolbar.removeControl(controls[c]);
		}
		const container = new Autodesk.Viewing.UI.ControlGroup("main");
		toolbar.addControl(container);

		container.addControl(section);
		container.addControl(hierarchie);

		const panel = new Autodesk.Viewing.UI.DockingPanel(document.getElementById("ifcStructures"), "ifcStructPanel", "IFC Structure");
		that.#viewer.addPanel(panel);
		panel.setVisible(true);
		panel.createTitleBar("BONJOUR");


		that.#viewer.setGroundShadow(false);
		that.#viewer.setEnvMapBackground(true);
		//that.#viewer.setDisplayEdges(true);
		that.#viewer.setOrbitPastWorldPoles(false);
		that.#viewer.setReverseZoomDirection(true);
		that.#viewer.setEnvMapBackground(true);
		that.#viewer.setFocalLength(19);
		// to disable auto highlighting when mouse over an object
		//that.#viewer.disableHighlight(true);
	    that.#initInfos.callback();

	}

	setAllMaterials(materialName){
		for(let d in this.#documents){
			this.#documents[d].setAllMaterials(materialName);
		}
		this.#viewer.impl.invalidate(true);
	}

	addListener(event, callback){
		this.#viewer.addEventListener(event, callback);
	}

	getViewer(){
		return this.#viewer;
	}

	setLightPreset(index){
		this.#viewer.setLightPreset(index);
	}

	setCube(bool){

		if(this.#viewCubeUiExt == null){
			this.#viewer.loadExtension('Autodesk.ViewCubeUi').then(cube => {
				this.#viewCubeUiExt = this.#viewer.getExtension('Autodesk.ViewCubeUi');
				this.#viewCubeUiExt.setVisible(bool);
				this.#viewCubeUiExt.displayHomeButton(true);
				this.#viewCubeUiExt.refreshCube();
			});
		}else{
			//this.#viewCubeUiExt.setVisible(bool);
			//this.#viewCubeUiExt.displayHomeButton(bool);
		}

	}

	getModels(){
		const models = [];
		for(let d in this.#documents){
			const modelss = this.#documents[d].getModel(0);
			models.push(modelss);
		}
		return models;
	}

	determineModels(){
		const models = [];
		let edgeTeam = false;

		//no Edge 
		models[models.length] = {
			style : null,
		}

		for(let s in this.#styles){
			for(let ss in this.#styles[s].styles){
				for(let sss in this.#styles[s].styles[ss]){
					for(let ssss in this.#styles[s].styles[ss][sss]){
						if(this.#styles[s].styles[ss][sss][ssss].edge != null){
							let v = true;
							for(let m in models){
								if(models[m].style == this.#styles[s].styles[ss][sss][ssss].edge){
									v = false;
									break;
								}
							}
							if(v){
								const regex = RegExp('team');
								if(regex.test(this.#styles[s].styles[ss][sss][ssss].edge)){
									const teams = this.#planningModel.getTaskTeams();
									if(!edgeTeam){
										for(let t in teams){	
											models[models.length] = {
												style : scssVariables[teams[t].getColorClass().replace("BG_", "").toLowerCase()],
											}
										}
										edgeTeam = true;
									}
								}else{

									models[models.length] = {
										style : this.#styles[s].styles[ss][sss][ssss].edge,
									}
								}
							}
						}
					}
				}
			}
		}
		return models;

	}

	getEdgeStyles(){
		return this.#modelsNeeded;
	}

	parseStyles(csv){

		const defaultStyles = {
			"basicMaterial" : {
				"selected" : {
					"visible" : {
						"material" : null,
						"edge" : null,
						"MAV" : false,
						"EAV" : false,
					},
					"hidden" : {
						"material" : null,
						"edge" : null,
						"MAV" : false,
						"EAV" : false,
					}
				},
				"notSelected" : {
					"visible" : {
						"material" : null,
						"edge" : null,
						"MAV" : false,
						"EAV" : false,
					},
					"hidden" : {
						"material" : null,
						"edge" : null,
						"MAV" : false,
						"EAV" : false,
					}
				}
			},
			"teamMaterial" : {
				"selected" : {
					"visible" : {
						"material" : null,
						"edge" : null,
						"MAV" : false,
						"EAV" : false,
					},
					"hidden" : {
						"material" : null,
						"edge" : null,
						"MAV" : false,
						"EAV" : false,
					}
				},
				"notSelected" : {
					"visible" : {
						"material" : null,
						"edge" : null,
						"MAV" : false,
						"EAV" : false,
					},
					"hidden" : {
						"material" : null,
						"edge" : null,
						"MAV" : false,
						"EAV" : false,
					}
				}
			}
		}

		const lines = csv.split("\n");
		let currentStyle = null;
		let currentSelectMode = null;
		let currentVisibleMode = null;
		let currentTypeMode = null;


		for(let l in lines){
			const line = lines[l];
			if(l == 0) continue;
			const cols = line.split(",");
			for(let c in cols){
				const col = cols[c];
				

				//Init 3D style
				if(c == 0 && col != ""){

					let constraint = null;
					if(cols[1] != ""){
						constraint = cols[1];
					};
					currentStyle = {
						timeState : parseInt(col),
						constructionState : constraint,
						styles : {

						}
						/* model for each style */
						// selected : {

						// 		visible : {

						// 				material : {

						// 				},
						// 				edge : {

						// 				},
						// 				MAV : false,
						// 				EAV : false

						// 		},
						// 		hidden : {

						// 				material : {

						// 				},
						// 				edge : {

						// 				},
						// 				MAV : false,
						// 				EAV : false

						// 		}
						// },

						// notSelected : {

						// 		visible : {

						// 			material : {

						// 			},
						// 			edge : {

						// 			},
						// 			MAV : false,
						// 			EAV : false

						// 		},
						// 		hidden : {

						// 			material : {

						// 			},
						// 			edge : {

						// 			},
						// 			MAV : false,
						// 			EAV : false

						// 		}
						// }
					};	
					this.#styles[this.#styles.length] = currentStyle;
				} 

				//Update select mode
				if(c == 2 && cols[c] == "Selected"){
					currentSelectMode = "selected";
				}else if(c == 2 && cols[c] == "Not Selected"){
					currentSelectMode = "notSelected";
				}

				//Update visible mode
				if(c == 3 && cols[c] == "Visible"){
					currentVisibleMode = "visible";
				}else if(c == 3 && cols[c] == "Hidden"){
					currentVisibleMode = "hidden";
				}

				//Update type mode
				if(c == 4 && cols[c] == "Material"){
					currentTypeMode = "material";
				}else if(c == 4 && cols[c] == "Edge"){
					currentTypeMode = "edge";
				}else if(c == 4 && cols[c] == "Material Transparent"){
					currentTypeMode = "transparent";
				}// }else if(c == 4 && cols[c] == "EAV"){
				// 	currentTypeMode = "EAV";
				// }

				//Basic material mode 
				if(c == 5){
					if(typeof currentStyle.styles["basicMaterial"] == "undefined") currentStyle.styles["basicMaterial"] = {};
					if(typeof currentStyle.styles["basicMaterial"][currentSelectMode] == "undefined") currentStyle.styles["basicMaterial"][currentSelectMode] = {};
					if(typeof currentStyle.styles["basicMaterial"][currentSelectMode][currentVisibleMode] == "undefined") currentStyle.styles["basicMaterial"][currentSelectMode][currentVisibleMode] = {};
					if(cols[c] != ""){
					currentStyle.styles["basicMaterial"][currentSelectMode][currentVisibleMode][currentTypeMode] = cols[c];
					}else{
						currentStyle.styles["basicMaterial"][currentSelectMode][currentVisibleMode][currentTypeMode] = defaultStyles["basicMaterial"][currentSelectMode][currentVisibleMode][currentTypeMode];
					}
				}

				//Team material mode / Displayed
				if(c == 6){
					if(typeof currentStyle.styles["teamMaterial"] == "undefined") currentStyle.styles["teamMaterial"] = {};
					if(typeof currentStyle.styles["teamMaterial"][currentSelectMode] == "undefined") currentStyle.styles["teamMaterial"][currentSelectMode] = {};
					if(typeof currentStyle.styles["teamMaterial"][currentSelectMode][currentVisibleMode] == "undefined") currentStyle.styles["teamMaterial"][currentSelectMode][currentVisibleMode] = {};
					if(cols[c] != ""){
						currentStyle.styles["teamMaterial"][currentSelectMode][currentVisibleMode][currentTypeMode] = cols[c];
					}else{
						currentStyle.styles["teamMaterial"][currentSelectMode][currentVisibleMode][currentTypeMode] = defaultStyles["basicMaterial"][currentSelectMode][currentVisibleMode][currentTypeMode];
					}
				}
			
			}
		}

	}

}
export default Scene;