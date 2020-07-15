import V_4DUtils from "../Utils/V_4DUtils.class.js";
import V_socketUtils from "../Utils/V_socketUtils.class.js";
import V_timelineUtils from "../Utils/V_timelineUtils.class.js";
import V_taskTableUtils from "../Utils/V_taskTableUtils.class.js";
import Config from "../../../config.js";
import "./V_forgeViewer.scss";
import scssVariables from "../SixWeekView/assets/_variables.scss";
import Utils from "../../class/Utils.class.js";
import ForgeSDK from 'forge-apis';



export default {
	data : function(){
		return {
			viewer : null,
			modelCount : 0,
			documents : []
		}
	},
	props : [
		"urns",
		"oauth",
		"timeline",
		"model",
	],
	methods : {

		initialisation(){

			const defaultSettings = Autodesk.Viewing.DefaultSettings;

			var options = {
			    env: 'AutodeskProduction',
			    api: 'derivativeV2',  // for models uploaded to EMEA change this option to 'derivativeV2_EU'
			    accessToken : this.oauth.credentials.access_token,
			};

			Autodesk.Viewing.Initializer(options, this.onInitialisationSuccess);

		},

		onInitialisationSuccess(){

		    this.viewer = new Autodesk.Viewing.Viewer3D(document.getElementById('forgeV'));

		    var startedCode = this.viewer.start();
		    if (startedCode > 0) {
		        console.error('Failed to create a Viewer: WebGL not supported.');
		        return;
		    }

		    this.loadModel();

		},

		loadModel(){
			for(let u in this.urns){
				Autodesk.Viewing.Document.load("urn:" + this.urns[u], this.onModelLoaded , (event)=>{console.log(console.error('Failed fetching Forge manifest'))});
			}
		},

		

		onModelLoaded(viewerDocument){

			const derivativesApi = new ForgeSDK.DerivativesApi();


			this.documents[this.documents.length] = viewerDocument;
			//console.log("---");
			//console.log(viewerDocument);
			//console.log(viewerDocument.getRoot());
			//console.log(viewerDocument.getRoot().search({'type': 'geometry'}));
			this.modelCount++;
			if(this.modelCount != this.urns.length) return;


			//Multiple model display
			for(let d in this.documents){
	            var viewables = this.documents[d].getRoot();
	   //          console.log(this.oauth);
	   //          console.log(viewables.getPropertyDbManifest())
				// console.log(viewables.findPropertyDbPath())
	            /*viewables.traverse((bb) => {
	            	//console.log("--", bb, bb.name(), bb.type());
	            	if(typeof bb.lmvDocument != "undefined"){
	            		// console.log(bb.type());
		            	// console.log(bb.lmvDocument.myPath);
		            	// console.log(derivativesApi.getManifest(bb.lmvDocument.myPath, {}, this.oauth, this.oauth.credentials.access_token));
		            }
	            });*/
	            //console.log(this.documents[d].getRoot().findAllViewables());
	            const t = this.documents[d].getRoot().findAllViewables();
	            for(let tt in t){
	            	//console.log(t[tt].type());
	            	//console.log(t[tt].isViewable());
	            }
				//console.log(viewables.name());
				//console.log(viewables.type());
				//console.log(viewables.isViewable());
	            this.viewer.loadDocumentNode(this.documents[d], viewables.getDefaultGeometry(),{
	                keepCurrentModels: true,
	                preserveView : true,
	            });

	            this.viewer.loadModel(viewerDocument.getViewablePath(viewables.getDefaultGeometry()), {}, (model) => {

	            	setTimeout(()=>{ 
	            		const tree = model.getInstanceTree();
	            		console.log(tree, model.instanceTree); 
	            		tree.enumNodeFragments(2403, (node)=>{
	            			//console.log(2403, node);
	            		}, true);
	            	}, 1000);

	            	function userFunction(pdb) {


	            		//console.log("extern", pdb.getExternalIdMapping());

	            		const arr = [];
	            		pdb.enumAttributes(function(i, attrDef, attrRaw){
	            			arr[i] = attrDef.name, attrRaw;
					        //console.log(i, attrDef, attrRaw);
					    });
					   	
	            		pdb.enumObjects(function(dbId){
	            			console.log(dbId, pdb.getObjectProperties(dbId));
						    // For each part, iterate over their properties.
						    pdb.enumObjectProperties(dbId, function(attrId, valId){

						    	

						    	//console.log(pdb.getObjectProperties(dbId));

						    	return true;

						        // Only process 'Mass' property.
						        // The word "Property" and "Attribute" are used interchangeably.
						        //console.log(dbId, arr[attrId], valId);
						    });
						});

					};
					const thePromise = model.getPropertyDb().executeUserFunction(userFunction);
					thePromise.then(function(retValue){
					    console.log('retValue is: ', retValue); // prints 'retValue is: 42'
					}).catch(function(err){
					  console.log("Something didn't go right...")
					  console.log(err);
					});
	            	console.log(model.getPropertyDb())
	            });

				

				//console.log("hey", viewerDocument, viewables.getDefaultGeometry());
				
	        }

		}

	},
	mounted : function(){

		this.initialisation();



	},
	template : `
	<div id="forgeViewer">
		<!-- forgeViewer -->
		<div id="forgeV"></div>
	</div>`,
}