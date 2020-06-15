import V_4DUtils from "../Utils/V_4DUtils.class.js";
import Config from "../../../config.js"
import "./V_forgeViewer.scss";

/**
	* @vue-prop {Object} manifest forge Manifest
	* @vue-prop {Object} oauth object contenant l'authentification
	* @vue-prop {Timeline} timeline - Timeline Object 
	* @vue-prop {Model} model - Model Object
	* @vue-event {Number} increment - Emit counter's value after increment
	* @vue-event {Number} decrement - Emit counter's value after decrement
*/
export default {
	date:{
		"viewer" : null,
		"tree" : null,
		"selected" : [],
		"map" : []
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
				console.log("CLEAR HIGHLIGHT");
				this.clearSelected();
			}
		},
		highlight(object4D){

			if(this.viewer != null){
				// ^ peut être ajouter la couleur qu'on veut mettre à l'object3D en paramètre
				// sous la forme d'un vecteur4 contenant (r, g, b, a)

				const objects3D = object4D.getObjects3D();
				for(let o in objects3D){
					const object3D = objects3D[o];

					console.log("HIGHLIGHT : " + object3D.getName());

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
					//console.log(prop);

					// dessous les objets principaux pour le changement de couleurs par themingColor
					const fragList = this.viewer.model.getFragmentList();
					const colorMap = fragList.db2ThemingColor;

				}
				
				//repositionne la caméra
				// fonction pour cacher les objets passer en paramètre (ids) => hide()
			}
		},
		map3DObjs(map) {
			// tableau clé valeur avec en clé l'id de l'objet et en valeur l'objet
			let rep = false;
			var mils = this.model.getMilestones();
			for(let i in mils) {
				var phs = mils[i].getPhases();
				for(let j in phs){
					var o4D = phs[j].getObjects4D();
					for(let k in o4D){
						console.log(o4D[k]);
						var o3D = o4D[k].getObjects3D();
						for(let l in o3D) {
							map.set(o3D[l].getId(), o3D[l]);
						}
					}
				}
			}
		},
		getPropertie(res) {
			console.log(res);
			let foundGuid = false;
			for(let i in res.properties) {
				if(this.map.has(res.properties[i].displayValue)) {
					foundGuid = true;
					// object 3D séléctionné
					var obj = this.map.get(res.properties[i].displayValue);
					console.log(obj);
					// illumine la tâche asssocié au parent 
					V_4DUtils.highlightTask(obj.getParent())
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
			console.log(this.tree);

			this.map = new Map();
			this.map3DObjs(this.map);
			console.log(this.map);

			var selection = this.viewer.getSelection();
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
			var rootItem = doc.getRootItem();

			// Grab all geometry items
			var geometryItems =
				Autodesk.Viewing.Document.getSubItemsWithProperties(
				rootItem, { 'type': 'geometry' }, true)

			// Pick the first item by default
			var selectedItem = geometryItems[0];

			var domContainer = document.getElementById('forgeV');

			// UI-less Version: viewer without controls and commands
			//var viewer = new Autodesk.Viewing.Viewer3D(domContainer)

			// GUI Version: viewer with controls
			this.viewer = new Autodesk.Viewing.Private.GuiViewer3D(domContainer);

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

			this.viewer.addEventListener(Autodesk.Viewing.OBJECT_TREE_CREATED_EVENT, this.onGeometryLoaded);
			this.viewer.addEventListener(Autodesk.Viewing.SELECTION_CHANGED_EVENT, this.highlightTask);
		},
		onGeometryLoaded(that){
			this.tree = this.viewer.model.getInstanceTree();
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
		V_4DUtils.addForgeViewer(this);
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
		<p>FORGE VIEWER</p>
		<!-- forgeViewer -->
		<div id="forgeV"></div>
	</div>`,
}