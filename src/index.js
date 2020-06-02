import Vue from "vue/dist/vue.esm.js";
import Utils from "./class/Utils.class.js";
import Loader from "./class/Loader.class.js";
import Timeline from "./class/Timeline.class.js";
import V_taskTable from "./components/V_taskTable.vue";
import V_taskTableFrame from "./components/V_taskTableFrame.vue";
import V_forgeViewer from "./components/V_forgeViewer.vue";
import Hammer from "hammerjs";
import "./index.css";
import Config from "../config.js";

window.addEventListener("load", function(){
	init();
});

function init(){

	Promise.all([Utils.loadTextFile("datas/Project1.csv"), Utils.loadTextFile("datas/Project1.ifc")])
	.then( files => Loader.fromCSVandIFC(files[0], files[1]))
	.then( timeline => {
		//Model Loaded and Timeline created
		const model = timeline.getModel();
		const playerInit = 10;
		const phase = timeline.getModel().getMilestones()[0].getPhases()[0];
	  	const duration = model.getDuration();

	  	//Touch gestures
	  	Vue.directive("tap", {
			bind: function(el, binding) {
				if (typeof binding.value === "function") {
					const mc = new Hammer(el);
					var tap = new Hammer.Tap();
					mc.add(tap);
					mc.on("tap", binding.value);
				}
			}
		});

		//Création du viewer
		let clientId = Config.autoDeskForgeSettings[Config.autoDeskAccount].clientId;
		let clientSecret = Config.autoDeskForgeSettings[Config.autoDeskAccount].clientSecret;

		Utils.getAutodeskAuth(clientId, clientSecret).then(Utils.createForgeBucket).then( oAuth => Utils.uploadIFCFileToForge(oAuth, "datas/Project1.ifc")).then( obj => {
			
			/*var urn = 'urn:dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6dGVzdF9jb2xsYWJfdjQvUHJvamVjdDEuaWZj'

		    /////////////////////////////////////////////////////////////////
		    // Initialization Options
		    //
		    /////////////////////////////////////////////////////////////////
		    var initOptions = {
		      documentId: urn,
		      env: 'AutodeskProduction',
		      getAccessToken: function( onGetAccessToken) {
		        return token
		      }
		    }

		    // typically getAccessToken would look like below
		    // where /api/forge/token is a REST endpoint
		    // on your own server that return a valid forge token
		    //
		    //getAccessToken: function(onGetAccessToken) {
		    //  $.get('/api/forge/token', function(token) {
		    //    onGetAccessToken(token.access_token)
		    //  })
		    //}

		    /////////////////////////////////////////////////////////////////
		    // Document Loaded Handler
		    //
		    /////////////////////////////////////////////////////////////////
		    function onDocumentLoaded (doc) {

		      var rootItem = doc.getRootItem()

		      // Grab all geometry items
		      var geometryItems =
		        Autodesk.Viewing.Document.getSubItemsWithProperties(
		          rootItem, { 'type': 'geometry' }, true)

		      // Pick the first item by default
		      var selectedItem = geometryItems[0]

		      var domContainer = document.getElementById('viewer')

		      // UI-less Version: viewer without controls and commands
		      //var viewer = new Autodesk.Viewing.Viewer3D(domContainer)

		      // GUI Version: viewer with controls
		      var viewer = new Autodesk.Viewing.Private.GuiViewer3D(domContainer)

		      viewer.initialize()

		      viewer.loadModel(doc.getViewablePath(selectedItem))
			  
			  viewer.impl.setSelectionColor(new THREE.Color(1,0,0));
			  viewer.addEventListener(Autodesk.Viewing.GEOMETRY_LOADED_EVENT, ()=>viewer.select(1))
		    }

		    /////////////////////////////////////////////////////////////////
		    // Environment Initialized Handler
		    //
		    /////////////////////////////////////////////////////////////////
		    function onEnvInitialized () {

		      Autodesk.Viewing.Document.load(
		        initOptions.documentId,
		        function(doc) {
		          onDocumentLoaded (doc)
		        },
		        function (errCode){
		          onLoadError (errCode)
		        })
		    }

		    /////////////////////////////////////////////////////////////////
		    // Error Handler
		    //
		    /////////////////////////////////////////////////////////////////
		    function onLoadError (errCode) {

		      console.log('Error loading document: ' + errCode)
		    }

		    /////////////////////////////////////////////////////////////////
		    // Bootstraping
		    //
		    /////////////////////////////////////////////////////////////////
		    Autodesk.Viewing.Initializer(
		      initOptions,
		      function() {
		        onEnvInitialized ()
		      }
			)*/
		});
		/*

		*/const viewer = null;/*

		*/

		const app = new Vue({
			el : '#content',
			components : {
				forgeviewer : V_forgeViewer,
				tasktableframe : V_taskTableFrame,
			},
			data:{
				playerinit : playerInit,
				timeline : timeline,
				model : model,
				duration : duration,
				viewer : viewer,
	 		},

	 		template : `
	 		<div id="content">
	 			<forgeviewer viewer="viewer"></forgeviewer>
	 			<tasktableframe v-bind:model="model" v-bind:timeline="timeline" v-bind:playerinit="playerinit" v-bind:duration="duration"></tasktableframe>
	 		</div>
	 		`
		});

	})
	.catch( error => console.error(error));

}