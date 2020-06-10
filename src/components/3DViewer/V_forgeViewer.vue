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
	},
	props:[
		"manifest",
		"oauth",
		"timeline",
		"model"
	],
	methods:{
		clearHighlighting(){
			console.log("CLEAR HIGHLIGHT");
		},
		highlight(object3D){
			console.log("HIGHLIGHT : " + object3D.getName());
			const toNumber = this.tree.nodeAccess.strings.indexOf(object3D.getName() + ":");
			const index1 = this.tree.nodeAccess.dbIdToIndex[toNumber]; // Ou inversement
			const indexFromId = this.tree.nodeAccess.nameSuffixes.indexOf(object3D.getUniqId());
			const index2 = this.tree.nodeAccess.dbIdToIndex[indexFromId]; // Ou inversement
			const that = this;
			const index3 = parseInt(Object.keys(this.tree.nodeAccess.dbIdToIndex).filter(function(key) {
			    return that.tree.nodeAccess.dbIdToIndex[key] == indexFromId;
			})[0]);
			console.log(toNumber, index1, indexFromId, index2, index3);
			this.viewer.select(index3);
			//Avec ça tu dois pouvoir afficher quelque chose d'interactif je pense
		},
		onDocumentLoaded(doc, that){

			var rootItem = doc.getRootItem()

      // Grab all geometry items
      var geometryItems =
        Autodesk.Viewing.Document.getSubItemsWithProperties(
          rootItem, { 'type': 'geometry' }, true)

      // Pick the first item by default
      var selectedItem = geometryItems[0]

      var domContainer = document.getElementById('forgeV')

      // UI-less Version: viewer without controls and commands
      //var viewer = new Autodesk.Viewing.Viewer3D(domContainer)

      // GUI Version: viewer with controls
      this.viewer = new Autodesk.Viewing.Private.GuiViewer3D(domContainer)


      this.viewer.initialize()

      this.viewer.loadModel(doc.getViewablePath(selectedItem))

		  this.viewer.impl.setSelectionColor(new THREE.Color(1,0,0));
		  this.viewer.addEventListener(Autodesk.Viewing.OBJECT_TREE_CREATED_EVENT, this.onGeometryLoaded);
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
		}
	},
	created : function(){
		V_4DUtils.addForgeViewer(this);
	},
	mounted : function(){
		if(Config["forgeRenderer"]){
			const that = this;
			console.log("urn:" + this.manifest.urn);
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