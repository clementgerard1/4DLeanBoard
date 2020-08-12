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

	}

	init(oauth, urns, objs, callback, onSelect){
		this.#initInfos = {
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
			if(this.#styles[s].timeState == timeMode && this.#styles[s].constructionState == constraint && typeof this.#styles[s].styles[filterMode] != "undefined" && typeof this.#styles[s].styles[filterMode][select] != "undefined" && typeof this.#styles[s].styles[filterMode][select][visible] != "undefined"){
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

	   	that.#documents[0].loadModels(that.#viewer, that.#initInfos.objs, ()=>{that._onModelLoaded(that)});

	}

	_onModelLoaded(that){
		that.#modelInitLoaded2++;
		if(that.#modelInitLoaded2 < that.#initInfos.urns.length){
			that.#documents[that.#modelInitLoaded2].loadModels(that.#viewer, that.#initInfos.objs, ()=>{that._onModelLoaded(that)});
			return;
		}
		that._endOfInit(that);
	}

	_endOfInit(that){
		
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
		console.log(models);
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