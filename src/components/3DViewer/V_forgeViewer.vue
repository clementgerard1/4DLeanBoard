import V_4DUtils from "../Utils/V_4DUtils.class.js";
import V_socketUtils from "../Utils/V_socketUtils.class.js";
import Config from "../../../config.js"
import "./V_forgeViewer.scss";
import scssVariables from "../SixWeekView/assets/_variables.scss";
import Utils from "../../class/Utils.class.js"

/**
	* @vue-prop {Object} manifest forge Manifest
	* @vue-prop {Object} oauth object contenant l'authentification
	* @vue-prop {Timeline} timeline - Timeline Object 
	* @vue-prop {Model} model - Model Object
	* @vue-event {Number} increment - Emit counter's value after increment
	* @vue-event {Number} decrement - Emit counter's value after decrement
*/
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
			"initialMaterials" : [],
			"shownContractor" : null,
			"fliterModeFlag" : false,
			"colored" : [],
		}
	},
	props:[
		"manifest",
		"oauth",
		"timeline",
		"model"
	],
	methods:{

		setContractorDisplayMode(bool){
			if(bool) {
				var mils = this.model.getMilestones();
				for(let i in mils) {
					var phases = mils[i].getPhases();
					for(let j in phases) {
						var objs4D = phases[j].getObjects4D();
						for(let k in objs4D) {
							var objs3D = objs4D[k].getObjects3D();
							for(let l in objs3D) {
								if(this.selected.includes(this.objs[objs3D[l].getId()])){
									this.color3DObject(this.objs[objs3D[l].getId()], true);
								} else if((phases[j].getContractor().getId() == this.shownContractor) || (this.shownContractor==null)) {
									this.color3DObject(this.objs[objs3D[l].getId()]);
								} else {
									this.color3DObject(this.objs[objs3D[l].getId()], false, true);
								}
							}
						}
					}
				}
				this.fliterModeFlag = true;
				this.viewer.setGroundShadow(false);
			} else {
				this.clearColors();
				this.fliterModeFlag = false;
				this.viewer.setGroundShadow(true);
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
					this.restore3DObject(this.colored[i]);
					delete this.colored[i];
				}
			}
			this.colored = [];
		},
		highlight(object4D){
			this.clearHighlighting();
			if(this.viewer != null){
				// ^ peut être ajouter la couleur qu'on veut mettre à l'object3D en paramètre
				// sous la forme d'un vecteur4 contenant (r, g, b, a)
				const objects3D = object4D.getObjects3D();
				for(let o in objects3D){
					const object3D = objects3D[o];
					for(let s in this.tree.nodeAccess.nameSuffixes){
						if(this.tree.nodeAccess.nameSuffixes[s] == object3D.getUniqId()){
							const index = this.getDbId(s);
							const obj = this.objs[object3D.getId()];
							if(!this.selected.includes(obj)){
								if(this.colored.includes(obj)) {
									this.restore3DObject(obj);
								}
								this.color3DObject(obj, true);
								this.viewer.fitToView(index[0], this.viewer.model);
							}
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
		color3DObject(obj, selectMode = false, shadowMode = false){

			if(!obj.colored || obj.needUpdate){
				this.tree.enumNodeChildren(obj.dbId,
					(node) => { 
						//const count = this.tree.getChildCount(node);
						const newId = this.viewer.model.getFragmentList().fragments.fragId2dbId.indexOf(node);

						let materialId = null;
						if(selectMode){
							materialId = this.viewer.model.getFragmentList().materialmap[this.selectedMaterial.id];
							this.viewer.model.getFragmentList().setMaterial(newId, this.selectedMaterial);
							this.selected.push(obj);
						}else if(shadowMode){
							materialId = this.viewer.model.getFragmentList().materialmap[obj.sMat.id];
							this.viewer.model.getFragmentList().setMaterial(newId, obj.sMat);
							this.colored.push(obj);
						}else{
							materialId = this.viewer.model.getFragmentList().materialmap[obj.material.id];
							this.viewer.model.getFragmentList().setMaterial(newId, obj.material);
							this.colored.push(obj);
						}
						if(newId != -1){
							this.viewer.model.getFragmentList().materialids[newId] = materialId;
							obj.colored = true;
						}
						this.viewer.impl.invalidate(true);
					}, 
				true);
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
							obj.colored = false;
						}
						this.viewer.impl.invalidate(true);

					}, 
				true);
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
			this.clearHighlighting();
			this.viewer.clearSelection();
			
			for(let s in selection){
				const objs = this.getObjByNodeId(selection[s]);
				for(let o in objs){
					if(this.colored.includes(objs[o])) {
						this.restore3DObject(objs[o]);
					}
					this.color3DObject(objs[o], true);
					V_socketUtils.highlightTask(objs[o].obj3D.getParent().getTask());
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
			const materials = this.viewer.impl.getMaterials();
	  		materials.addMaterial(Utils.getGuid(), this.selectedMaterial, true);
			this.map3DObjs();
		},
		onEnvInitialized(that){
			Autodesk.Viewing.Document.load(
        "urn:" + that.manifest.urn,
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
		}
	},
	created : function(){
		V_4DUtils.setForgeViewer(this);
		V_socketUtils.addViewer();
	},
	mounted : function(){
		if(Config["forgeRenderer"]){
			const that = this;
			const initOptions = {
			      documentId: "urn:" + this.manifest.urn,
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