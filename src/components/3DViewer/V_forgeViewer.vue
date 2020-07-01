import V_4DUtils from "../Utils/V_4DUtils.class.js";
import V_socketUtils from "../Utils/V_socketUtils.class.js";
import V_timelineUtils from "../Utils/V_timelineUtils.class.js";
import V_taskTableUtils from "../Utils/V_taskTableUtils.class.js";
import Config from "../../../config.js"
import "./V_forgeViewer.scss";
import scssVariables from "../SixWeekView/assets/_variables.scss";
import Utils from "../../class/Utils.class.js"

export default {
	data: function(){
		return {
			"viewer" : null,
			"tree" : null,
			"selected" : [],
			"map" : [],
			"objs" : [],
			"geometryFlag" : false,
			"treeFlag" : false,
			"selectedMaterial" : null,
			"sixWeeksMat" : null,
			"currWeekMat" : null,
			"nextsWeeksMat" : null,
			"initialMaterials" : [],
			"shownContractor" : null,
			"fliterModeFlag" : false,
			"colored" : [],
			"playing" : true,
			"camera" : null,
			"nav" : null,
		}
	},
	props:[
		"urn",
		"oauth",
		"timeline",
		"model"
	],
	methods:{

		// méthodes camera intéressantes : fitBounds(immediate : bool, bounds : THREE.Box3, reorient : bool) => se fera a chaque nouvelle selection

		// a faire méthode highlight from player
		// a faire désélection quand on clique sur un objet deja selectionné
		//
		// highlight elements with the time of the projects (of the player)
		// bool a true met les couleurs en fonction du player, a false les enlèves
		setPlayerState(bool) {
			if(bool) {
				let start = 0;
				let startActualWeek = start;
				let start6Weeks = start;
				if(this.time!=undefined) {
					startActualWeek += this.time*7;
					start6Weeks += Math.trunc(this.time/6)*42;
				}
				for(let i in this.objs) {
					const obj = this.objs[i];
					if(this.timeline.isActiveBetweenTwoDate(obj.obj3D.getParent().getTask(), start6Weeks, start6Weeks+42)) {
						if(this.timeline.isActiveBetweenTwoDate(obj.obj3D.getParent().getTask(), startActualWeek, startActualWeek+7)) {
							this.restore3DObject(obj);
							this.color3DObject(obj, false, false, true);
							obj.state = "currentWeek";
						} else if(this.timeline.isActiveBetweenTwoDate(obj.obj3D.getParent().getTask(), start6Weeks, startActualWeek-1)) {
							this.restore3DObject(obj);
							obj.state = "builtOn6W";
						} else {
							this.restore3DObject(obj);
							this.color3DObject(obj, false, false, false, false, true);
							obj.state = "toBuildOn6W";
						}
					} else if(this.timeline.isActiveBetweenTwoDate(obj.obj3D.getParent().getTask(), start, start6Weeks-1)) {
						this.restore3DObject(obj);
						obj.state = "built";
					} else {
						this.restore3DObject(obj);
						this.color3DObject(obj, false, false, false, true);
						obj.state = "toBuild";
					}
					this.playing = true;
				}
			} else {
				this.clearColors();
				this.playing = false;
			}
		},

		colorFromState(obj, state) {
			if(state=="currentWeek") {
				this.color3DObject(obj, false, false, true);
			} else if(state=="toBuildOn6W") {
				this.color3DObject(obj, false, false, false, false, true);
			} else if(state=="toBuild") {
				this.color3DObject(obj, false, false, false, true);
			} else {
				this.restore3DObject(obj);
			}
		},

		setContractorDisplayMode(bool){
			if(bool) {
				this.setPlayerState(false);
				var mils = this.model.getMilestones();
				for(let i in mils) {
					var phases = mils[i].getPhases();
					for(let j in phases) {
						var objs4D = phases[j].getObjects4D();
						for(let k in objs4D) {
							var objs3D = objs4D[k].getObjects3D();
							for(let l in objs3D) {
								const obj = this.objs[objs3D[l].getId()];
								if(this.selected.includes(obj)){
									this.color3DObject(obj, true);
									this.colored.push(obj);
								} else if((phases[j].getContractor().getId() == this.shownContractor) || (this.shownContractor==null)) {
									this.color3DObject(obj);
								} else {
									this.color3DObject(obj, false, true);
									obj.shadowed = true;
								}
							}
						}
					}
				}
				this.fliterModeFlag = true;
			} else {
				this.clearColors();
				this.fliterModeFlag = false;
				this.setPlayerState(true);
			}
		},

		setContractorDisplayed(contractor){
			if(contractor != null){
				this.shownContractor = contractor.getId();
			}else{
				this.shownContractor = null;
			}
			this.clearColors();
			this.setContractorDisplayMode(this.fliterModeFlag);
		},

		getObjByDbId(dbId){
			const toReturn = [];
			for(let o in this.objs){
				if(this.objs[o].dbId == dbId){
					toReturn.push(this.objs[o]);
				}
			}
			return toReturn;
		},

		getObjByNodeId(nodeId){
			const toReturn = [];
			for(let o in this.objs){
				if(this.objs[o].nodes.includes(nodeId)) toReturn.push(this.objs[o]);
			}
			return toReturn;
		},		
		//
		clearHighlighting(){
			if(this.viewer != null){
				for(let i in this.selected){
					this.restore3DObject(this.selected[i]);
					if(this.colored.includes(this.selected[i])) {
						this.color3DObject(this.selected[i]);
					}
					delete this.selected[i];
				}
			}
			this.selected = [];
		},
		clearColors(){
			if(this.viewer != null){
				for(let i in this.colored){
					if(this.selected.includes(this.colored[i])) {
						this.color3DObject(this.colored[i], true);
					} else {
						this.restore3DObject(this.colored[i]);
					}
					delete this.colored[i];
				}
			}
			this.colored = [];
		},
		highlight(object4D, bool){
			if(this.viewer != null){
				const objects3D = object4D.getObjects3D();
				for(let o in objects3D){
					const object3D = objects3D[o];
					for(let s in this.tree.nodeAccess.nameSuffixes){
						if(this.tree.nodeAccess.nameSuffixes[s] == object3D.getUniqId()){
							const obj = this.objs[object3D.getId()];
							if(!this.selected.includes(obj)){
								if(bool) {
									if(this.colored.includes(obj) || this.played.includes(obj)) {
										this.restore3DObject(obj);
									}
									this.color3DObject(obj, true);
								}
							} else if(this.selected.includes(obj) && !bool) {
								this.restore3DObject(obj);
								if(!this.playing) {
									if (this.colored.includes(obj)) {
										this.color3DObject(obj, false, obj.shadowed);
									}
								} else {
									this.colorFromState(obj, obj.state);
								}
							}
							this.viewer.fitToView(this.getDbId(s)[0]);
						}
					}

					// sélectionne si pas sélectionner, sinon désélectionne
					//this.selectionGetProperties();
					// sensé illuminer un objet avec la couleur (r,g,b,op) passée en paramètre

					//const prop = this.viewer.model.getProperties(index3, this.propertiesReturn, this.propertiesError);

					// dessous les objets principaux pour le changement de couleurs par themingColor
					//const fragList = this.viewer.model.getFragmentList();
					//const colorMap = fragList.db2ThemingColor;

				}
				//console.log(this.nav.getCameraRightVector(false), this.nav.getEyeVector(), this.nav.getPosition());
				//repositionne la caméra
				// fonction pour cacher les objets passer en paramètre (ids) => hide()
			}

		},
		map3DObjs() {
			var mils = this.model.getMilestones();
			for(let i in mils) {
				var phs = mils[i].getPhases();
				for(let j in phs){
					var o4D = phs[j].getObjects4D();
					for(let k in o4D){
						var o3D = o4D[k].getObjects3D();
						for(let l in o3D) {
							for(let s in this.tree.nodeAccess.nameSuffixes){
								if(this.tree.nodeAccess.nameSuffixes[s] == o3D[l].getUniqId()){
									const index = this.getDbId(s);
									const r = parseInt(scssVariables[phs[j].getColorClass().replace("BG_", "").toLowerCase()].slice(1,3), 16) / 255;
									const g = parseInt(scssVariables[phs[j].getColorClass().replace("BG_", "").toLowerCase()].slice(3,5), 16) / 255;
									const b = parseInt(scssVariables[phs[j].getColorClass().replace("BG_", "").toLowerCase()].slice(5,7), 16) / 255;
									const a = 0.75;
									const material = new THREE.MeshBasicMaterial({
									    reflectivity: 0.0,
									    flatShading: true,
									    transparent: true,
									    opacity: a,
									    color: scssVariables[phs[j].getColorClass().replace("BG_", "").toLowerCase()],
						      		});
						      		const sMat = new THREE.MeshBasicMaterial({
									    reflectivity: 0.0,
									    flatShading: true,
									    transparent: true,
									    opacity: 0.3,
									    color: scssVariables[phs[j].getColorClass().replace("BG_", "").toLowerCase()],
						      		});
									this.objs[o3D[l].getId()] = {
										obj3D : o3D[l],
										guId : o3D[l].getIFCId(),
										dbId : index,
										color : {
											r : r,
											g : g,
											b : b,
											a : a
										},
										material : material,
										sMat : sMat,
										initialMaterials : {},
										nodes: [],
										colored : false,
										shadowed : false,
										state : "initial", // Pour plus tard
										needUpdate : false,
									}
									const materials = this.viewer.impl.getMaterials();
									materials.addMaterial(Utils.getGuid(), material, true);
									materials.addMaterial(Utils.getGuid(), sMat, true);
									this.getNodeInfos(this.objs[o3D[l].getId()]);
									//this.color3DObject(this.objs[o3D[l].getId()]);
								}
							}
						}
					}
				}
			}
		},
		getNodeInfos(obj){
			this.tree.enumNodeChildren(obj.dbId,
				(node) => { 
					const newId = this.viewer.model.getFragmentList().fragments.fragId2dbId.indexOf(node);
					if(newId != -1 && typeof this.initialMaterials[newId] == "undefined"){
						this.initialMaterials[newId] = this.viewer.model.getFragmentList().getMaterial(newId);
					} 
					if(!obj.nodes.includes(node)) obj.nodes.push(node);
				}, 
			true);
		},
		color3DObject(obj, selectMode = false, shadowMode = false, currWeekMode = false, nextWeeksMode = false, sixWeeksMode = false){
			if(obj!=null) {
				if(!obj.colored || obj.needUpdate){
					this.tree.enumNodeChildren(obj.dbId,
						(node) => { 
							//const count = this.tree.getChildCount(node);
							const newId = this.viewer.model.getFragmentList().fragments.fragId2dbId.indexOf(node);

							let materialId = null;
							if(selectMode){
								materialId = this.viewer.model.getFragmentList().materialmap[this.selectedMaterial.id];
								this.viewer.model.getFragmentList().setMaterial(newId, this.selectedMaterial);
							}else if(shadowMode){
								materialId = this.viewer.model.getFragmentList().materialmap[obj.sMat.id];
								this.viewer.model.getFragmentList().setMaterial(newId, obj.sMat);
							}else if(currWeekMode){
								materialId = this.viewer.model.getFragmentList().materialmap[this.currWeekMat.id];
								this.viewer.model.getFragmentList().setMaterial(newId, this.currWeekMat);
							}else if(sixWeeksMode){
								materialId = this.viewer.model.getFragmentList().materialmap[this.sixWeeksMat.id];
								this.viewer.model.getFragmentList().setMaterial(newId, this.sixWeeksMat);
							}else if(nextWeeksMode){
								materialId = this.viewer.model.getFragmentList().materialmap[this.nextsWeeksMat.id];
								this.viewer.model.getFragmentList().setMaterial(newId, this.nextsWeeksMat);
							}else{
								materialId = this.viewer.model.getFragmentList().materialmap[obj.material.id];
								this.viewer.model.getFragmentList().setMaterial(newId, obj.material);
							}
							if(newId != -1){
								this.viewer.model.getFragmentList().materialids[newId] = materialId;
								obj.colored = true;
							}
							this.viewer.impl.invalidate(true);
						}, 
					true);
					if(selectMode){
						this.selected.push(obj);
					} else {
						this.colored.push(obj);
					}
				}
			}
		},
		restore3DObject(obj){
			if(obj.colored || obj.needUpdate){
				this.tree.enumNodeChildren(obj.dbId,
					(node) => {
						const newId = this.viewer.model.getFragmentList().fragments.fragId2dbId.indexOf(node);
						if(newId != -1){
							const materialId = this.viewer.model.getFragmentList().materialmap[ this.initialMaterials[newId].id ];
							this.viewer.model.getFragmentList().setMaterial(newId, this.initialMaterials[newId]);
							this.viewer.model.getFragmentList().materialids[newId] = materialId;
						}
						this.viewer.impl.invalidate(true);

					}, 
				true);
				obj.colored = false;
				if(this.colored.includes(obj)) {
					delete this.colored[this.colored.indexOf(obj)];
				}
				if ((this.fliterModeFlag) && (this.selected.includes(obj))) {
					this.color3DObject(obj, false, obj.shadowed);
				}
				if(this.selected.includes(obj)) {
					delete this.selected[this.selected.indexOf(obj)];
				}
			}
		},

		//
		getProperty(res) {
			let foundGuid = false;
			for(let i in res.properties) {
				if(this.map.has(res.properties[i].displayValue)) {
					foundGuid = true;
					// object 3D séléctionné
					var obj = this.map.get(res.properties[i].displayValue);
					// illumine la tâche asssocié au parent 
					V_socketUtils.highlightTask(obj.getParent().getTask());
				}
			}
			if(!foundGuid) {
				for(let i in res.properties) {
					if(res.properties[i].displayName == "parent") {
						this.viewer.getProperties(res.properties[i].displayValue, this.getProperty);
					}
				}
			}
		},

		//
		highlightTask() {
			const selection = this.viewer.getSelection();
			// this.clearHighlighting();
			this.viewer.clearSelection();
			
			for(let s in selection){
				const objs = this.getObjByNodeId(selection[s]);
				for(let o in objs){
					if(this.colored.includes(objs[o])) {
						if(!this.selected.includes(objs[o])) {
							this.restore3DObject(objs[o]);
							this.color3DObject(objs[o], true);
							V_socketUtils.highlightTask(objs[o].obj3D.getParent().getTask(), true);
						} else {
							this.color3DObject(objs[o], false, objs[o].shadowed);
						}
					} else if(this.selected.includes(objs[o])) {
						this.restore3DObject(objs[o]);
						if(this.playing) {
							this.colorFromState(objs[o], objs[o].state);
						}
						V_socketUtils.highlightTask(objs[o].obj3D.getParent().getTask(), false);
					} else {
						this.color3DObject(objs[o], true);
						V_socketUtils.highlightTask(objs[o].obj3D.getParent().getTask(), true);
					}
				}
			}
		},

		//
		selectionGetProperties() {

			function propCallback(data) {
				// Check if we got properties.
				if ((data.properties == null) || (data.properties.length == 0)) {
					console.log("no properties");
					return;
				}
			}

			function propErrorCallback(data) {
				console.log("error in getProperties().");
			}

			if (this.viewer.getSelection().length > 0) {
				var objSelected = this.viewer.getSelection()[0];
				this.viewer.getProperties(objSelected, propCallback, propErrorCallback);
			}
			else {
				console.log("Please select one element to show properties.");
			}
		},
		getDbId(id){
			var dbId;
			const that = this;
			dbId = parseInt(Object.keys(this.tree.nodeAccess.dbIdToIndex).filter(function(key) {
			    return that.tree.nodeAccess.dbIdToIndex[key] == id;
			})[0]);
			return dbId;
		},
		getUniqueId(dbid){
			var UId;
			const that = this;
			UId = parseInt(Object.keys(this.tree.nodeAccess.dbIdToIndex).filter(function(key) {
			    return that.tree.nodeAccess.dbIdToIndex[dbid] == key;
			})[0]);
			return UId;
		},
		onDocumentLoaded(doc, that){
			// Grab all geometry items
			var geometryItems = doc.getRoot().search({ 'type': 'geometry' });

			// Pick the first item by default
			var selectedItem = geometryItems[0];

			var domContainer = document.getElementById('forgeV');
			// UI-less Version: viewer without controls and commands
			//var viewer = new Autodesk.Viewing.Viewer3D(domContainer)

			// GUI Version: viewer with controls

			const opt = {
			   profileSettings: {
			       ambientShadows: false
			   }
			}

			this.viewer = new Autodesk.Viewing.Viewer3D(domContainer, opt);

			this.viewer.initialize();
			this.viewer.loadModel(doc.getViewablePath(selectedItem));
			this.viewer.loadExtension('Autodesk.ViewCubeUi');

			this.viewer.setQualityLevel(false, false);
			this.viewer.setGhosting(false);
			this.viewer.setGroundShadow(false);

			// important selon moi
			this.viewer.setReverseZoomDirection(true);

			this.viewer.setLightPreset(12);

			this.viewer.addEventListener(Autodesk.Viewing.OBJECT_TREE_CREATED_EVENT, () => this.fireLoadEvent("tree"));
			this.viewer.addEventListener(Autodesk.Viewing.GEOMETRY_LOADED_EVENT, () => this.fireLoadEvent("geometry"));
			this.viewer.addEventListener(Autodesk.Viewing.SELECTION_CHANGED_EVENT, this.highlightTask);
		},
		fireLoadEvent(type){
			if(type == "geometry"){
				this.geometryFlag = true;
			}else{
				this.treeFlag = true;
			}
			if(this.treeFlag && this.geometryFlag) this.onLoaded();

		},
		onLoaded(that){
			this.tree = this.viewer.model.getInstanceTree();
			this.selectedMaterial = new THREE.MeshBasicMaterial({
			    reflectivity: 0.0,
			    flatShading: true,
			    transparent: true,
			    opacity: 0.8,
			    color: scssVariables["select3DColor"],
			});
			this.nextsWeeksMat = new THREE.MeshBasicMaterial({
				reflectivity: 0.0,
				flatShading: true,
				transparent: true,
				opacity: 0.1,
				color: scssVariables["nextSixWeeks"],
			});
			this.currWeekMat = new THREE.MeshBasicMaterial({
				reflectivity: 0.0,
				flatShading: true,
				transparent: true,
				opacity: 0.75,
				color: scssVariables["currentWeek"],
			});
			this.sixWeeksMat = new THREE.MeshBasicMaterial({
				reflectivity: 0.0,
				flatShading: true,
				transparent: true,
				opacity: 0.75,
				color: scssVariables["currentSixWeeks"],
			});
			const materials = this.viewer.impl.getMaterials();
			materials.addMaterial(Utils.getGuid(), this.selectedMaterial, true);
			materials.addMaterial(Utils.getGuid(), this.sixWeeksMat, true);
			materials.addMaterial(Utils.getGuid(), this.nextsWeeksMat, true);
			materials.addMaterial(Utils.getGuid(), this.currWeekMat, true);
			//console.log(this.fragList, this.map);
			this.map3DObjs();
			this.camera = this.viewer.getCamera();
			this.nav = this.viewer.navigation;
			this.setPlayerState(true);
			const tasks = V_taskTableUtils.getTokens();
			for(let t in tasks){
				const obj4D = tasks[t].getObject4D();
				this.highlight(obj4D, true);
			}
			//console.log(this.viewer, this.nav.getCameraRightVector(false), this.nav.getEyeVector(), this.nav.getPosition());
		},
		onEnvInitialized(that){
			Autodesk.Viewing.Document.load(
				"urn:" + that.urn,
				function(doc) {
					that.onDocumentLoaded (doc, that)
				},
				function (errCode){
					that.onLoadError (errCode, that)
				}
			);
		},
		onLoadError(errCode, that){
	      console.log('Error loading document: ' + errCode)
		},

		watchTime : function(time){
			this.time = time;
			this.clearHighlighting();
			const tasks = V_taskTableUtils.getTokens();
			this.setPlayerState(true);
			for(let t in tasks){
				this.highlight(tasks[t].getObject4D(), true);
			}
		}
	},
	created : function(){
		this.clearHighlighting();
		V_4DUtils.setForgeViewer(this);
		V_socketUtils.addViewer();
		V_timelineUtils.addListener("time", this, this.watchTime);
	},
	mounted : function(){
		if(Config["forgeRenderer"]){
			const that = this;
			const initOptions = {
			      documentId: "urn:" + this.urn,
			      env: 'AutodeskProduction',
			      getAccessToken: function(onGetAccessToken) {
			        return that.oauth.credentials.access_token;
			      }
			};

		    Autodesk.Viewing.Initializer(
		      initOptions,
		      function() {
		        that.onEnvInitialized(that)
		      }
			)
		}
	},
	template : `
	<div id="forgeViewer">
		<!-- forgeViewer -->
		<div id="forgeV"></div>
	</div>`,
}