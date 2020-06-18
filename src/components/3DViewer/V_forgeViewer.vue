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
			"objs" : {},
			"geometryFlag" : false,
			"treeFlag" : false,
			"countt" : 0,
		}
	},
	props:[
		"manifest",
		"oauth",
		"timeline",
		"model"
	],
	methods:{
		clearSelected(){
			for(let i in this.selected){
				this.viewer.toggleSelect(this.selected[i]);
			}
			this.selected = [];
		},
		clearHighlighting(){
			if(this.viewer != null){
				this.clearSelected();
			}
		},
		highlight(object4D){
			this.clearSelected();
			if(this.viewer != null){
				// ^ peut être ajouter la couleur qu'on veut mettre à l'object3D en paramètre
				// sous la forme d'un vecteur4 contenant (r, g, b, a)

				const objects3D = object4D.getObjects3D();
				for(let o in objects3D){
					const object3D = objects3D[o];

					// indexFromId est la clé permettant de trouver l'id pour illuminer l'élément correspondant
					for(let s in this.tree.nodeAccess.nameSuffixes){
						if(this.tree.nodeAccess.nameSuffixes[s] == object3D.getUniqId()){
							const index = this.getDbId(s);
							if(!this.selected.includes(index)){
								this.selected.push(index);
								this.viewer.toggleSelect(index);
								this.viewer.setThemingColor(index, null);
								const color = new THREE.Vector4(0.0, 1.0, 0.0, 0.5);
								this.viewer.setThemingColor(index, color, this.viewer.model);
								this.viewer.fitToView(index[0], this.viewer.model);
							}
						}
					}

					// sélectionne si pas sélectionner, sinon désélectionne
					this.selectionGetProperties();
					// sensé illuminer un objet avec la couleur (r,g,b,op) passée en paramètre

					//const prop = this.viewer.model.getProperties(index3, this.propertiesReturn, this.propertiesError);

					// dessous les objets principaux pour le changement de couleurs par themingColor
					const fragList = this.viewer.model.getFragmentList();
					const colorMap = fragList.db2ThemingColor;

				}
				
				//repositionne la caméra
				// fonction pour cacher les objets passer en paramètre (ids) => hide()
			}
		},
		map3DObjs() {
			// tableau clé valeur avec en clé l'id de l'objet et en valeur l'objet
			const map = this.map;
			let rep = false;

			const impl = this.viewer.impl;
			//this.viewer.impl.matman().addMaterial("baseMaterial", baseMaterial, true);
			//console.log(impl);
			//console.log(impl.getMaterials()._materials);
			//console.log(this.viewer.model.getFragmentList());
			//console.log(this.viewer.model.getFragmentList().materialIdMap);

      const that= this;

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
									const material = new THREE.MeshPhongMaterial({
									    reflectivity: 0.0,
									    flatShading: true,
									    transparent: true,
									    opacity: 0.8,
									    color: scssVariables[phs[j].getColorClass().replace("BG_", "").toLowerCase()]
						      });
									this.objs[o3D[l].getId()] = {
										obj3D : o3D[l],
										guId : o3D[l].getIFCId(),
										dbId : index,
										color : {
											r : r,
											g : g,
											b : b,
											a : 0.2
										},
										material : material
									}
									// console.log("dbid", index, o3D[l].getName());
									const materials = impl.getMaterials();
									materials.addMaterial(Utils.getGuid(), material, true);
									this.color3DObject(this.objs[o3D[l].getId()], this.objs[o3D[l].getId()].material);
								}
							}
						}
					}
				}
			}

		},
		color3DObject(obj, baseMaterial){
			//console.log(this.tree);
			//setTimeout(()=>{
				this.tree.enumNodeChildren(obj.dbId,
					(node) => { 
						// console.log(obj.dbId, node);
						// console.log(this.viewer.model.getFragmentList());
						const newId = this.viewer.model.getFragmentList().fragments.fragId2dbId.indexOf(node);
						//console.log(node, this.viewer.model.getFragmentList());
						const materialId = this.viewer.model.getFragmentList().materialmap[baseMaterial.id];
						//const count = this.tree.getChildCount(node);
						//const proxy = this.viewer.impl.getRenderProxy(this.viewer.model, node);
						//console.log(proxy);
						//proxy.material = baseMaterial;
						//console.log(this.countt++);
						//console.log(obj.obj3D.getName(), obj.dbId, this.tree.getChildCount(node));
						//if(typeof this.viewer.model.getFragmentList().getMaterial(node) != "undefined"){
						//}
						const id = node+1;
						//console.log(baseMaterial.id, this.viewer.model.getFragmentList().materialmap);
						this.viewer.model.getFragmentList().setMaterial(newId, baseMaterial);
						//console.log(this.viewer.model.getFragmentList().getMaterial(node));
						//console.log(obj.obj3D.getName(), obj.dbId, node, this.viewer.model.getFragmentList().materialids);
						//console.log(this.viewer.model.getFragmentList().materialids.length);
						//for(let m in this.viewer.model.getFragmentList().materialids){
						//if(node < this.viewer.model.getFragmentList().materialids.length){
						if(newId != -1){
							this.viewer.model.getFragmentList().materialids[newId] = materialId;
						}
						//}
						//}
						//console.log(obj.obj3D.getName(), obj.dbId, node, this.viewer.model.getFragmentList().materialids);
						//if(typeof this.viewer.model.getFragmentList().getMaterial(node) != "undefined"){
							//console.log("----");
							//console.log(this.viewer.model.getFragmentList().getMaterial(node));
							//console.log(this.viewer.model.getFragmentList().getMaterial(node).color["r"]);
						//}

						this.viewer.impl.invalidate(true);
						// if(true || count == 0){

						// }else{

						// }
					}, 
				true);
			//}, 500);
			// this.viewer.impl.sceneUpdated(true);

			//if(this.tree.getChildCount(node) == 0){
				/*console.log("--");
				console.log(obj.obj3D.getName());
				console.log("1", this.viewer.model.getFragmentList().getMaterial(node));
				this.viewer.model.getFragmentList().setMaterial(node, baseMaterial);
				console.log(this.viewer.impl);
				console.log("2", this.viewer.model.getFragmentList().getMaterial(node));
				console.log("--");
				//console.log(baseMaterial.opacity);
				
				const frag = this.viewer.impl.getRenderProxy(this.viewer.model, node);
				if(frag.material != null){
					frag.material = baseMaterial;
				}
				frag.material = baseMaterial;
				console.log(frag.material);
				console.log(frag.material);
				for(let f in Object.keys(frag)){
					console.log(Object.keys(frag)[f], frag[Object.keys(frag)[f]]);
				}
				this.viewer.setThemingColor(node, new THREE.Vector4(obj.color.r, obj.color.g, obj.color.b, obj.color.a));
				this.viewer.impl.visibilityManager.show(obj.dbId);*/
				
			//}
		},
		getPropertie(res) {
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
						this.viewer.getProperties(res.properties[i].displayValue, this.getPropertie);
					}
				}
			}
		},
		highlightTask() {

			var selection = this.viewer.getSelection();
			console.log(selection);
			var interId = [];

			for(let i in selection) {
				interId.push(this.getUniqueId(selection[i]));
				this.viewer.getProperties(selection[i], this.getPropertie);
			}
			/*var uniqId = [];
			for(let j in interId) {
				console.log(interId[j]);
				for(let k in this.tree.nodeAccess.nameSuffixes) {
					if(k == interId[j]) {
						uniqId.push(this.tree.nodeAccess.nameSuffixes[k]);
					}
				}
			}
			console.log(uniqId);*/
		},
		selectionGetProperties() {

			function propCallback(data) {
				// Check if we got properties.
				if ((data.properties == null) || (data.properties.length == 0)) {
					console.log("no properties");
					return;
				}
				// affiche les propriétés de l'objet
				// pour le changement de couleur les propriétés suivante nous intéressent
				// data.properties[52-63 + 65] et éventuellement la propriété 64.
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
			   },
			   memory: {
            limit:  1000 // in MB
        }
			}

			this.viewer = new Autodesk.Viewing.GuiViewer3D(domContainer, opt);
			//console.log(this.viewer);

			this.viewer.initialize();
			this.viewer.loadModel(doc.getViewablePath(selectedItem));

			// this.viewer.impl.setSelectionColor(new THREE.Color(1,0,0));
			// activés de base (mais importante à reverse):

			// important selon moi
			this.viewer.setReverseZoomDirection(true);

			// this.viewer.setBackgroundColor(255,255,0,0,0,0);
			this.viewer.setLightPreset(12);

			/*this.getAllLeafComponents(this.viewer, function (dbIds) {
				console.log('Found ' + dbIds.length + ' leaf nodes');
				console.log(dbIds);
			});*/

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
			if(this.treeFlag && this.geometryFlag) this.onGeometryLoaded();

		},
		onGeometryLoaded(that){
			this.tree = this.viewer.model.getInstanceTree();
			this.map = new Map();
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
		        });
		},
		onLoadError(errCode, that){
	      console.log('Error loading document: ' + errCode)
		}/* ,
		getAllLeafComponents(viewer, callback) {
			var cbCount = 0; // count pending callbacks
			var components = []; // store the results
			var tree; // the instance tree

			function getLeafComponentsRec(parent) {
				cbCount++;
				if (tree.getChildCount(parent) != 0) {
					tree.enumNodeChildren(parent, function (children) {
						getLeafComponentsRec(children);
					}, false);
				} else {
					components.push(parent);
				}
				if (--cbCount == 0) callback(components);
			}
			viewer.getObjectTree(function (objectTree) {
				tree = objectTree;
				var allLeafComponents = getLeafComponentsRec(tree.getRootId());
			});
		}*/
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