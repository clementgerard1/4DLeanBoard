import taskSVG from "./assets/task.svg";
import V_4DUtils from "./utils/V_4DUtils.class.js";
import "./V_forgeViewer.css";

export default {
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
			console.log("HIGHLIGHT : " + object3D.getId());
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
	      var viewer = new Autodesk.Viewing.Private.GuiViewer3D(domContainer)

	      viewer.initialize()

	      viewer.loadModel(doc.getViewablePath(selectedItem))
		  
		  viewer.impl.setSelectionColor(new THREE.Color(1,0,0));
		  viewer.addEventListener(Autodesk.Viewing.GEOMETRY_LOADED_EVENT, ()=>viewer.select(1))
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

		console.log(this.manifest);
		console.log(this.oauth);
		console.log(this.model);
		console.log(this.timeline);
		console.log("created");
	},
	mounted : function(){
		console.log("mounted");
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
	},
	template : `
	<div id="forgeViewer">
		<p>FORGE VIEWER</p>
		<!-- forgeViewer -->
		<div id="forgeV"></div>
	</div>`,
}