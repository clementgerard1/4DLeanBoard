import Utils from "../../../class/Utils.class.js";
import Document from "./Document.class.js";
import Memory from "./Memory.class.js";

class Scene{

	#id;
	#viewer;
	#initInfos;
	#documents;
	#viewCubeUiExt;
	#temps;
	/**
		@class Scene
		@classdesc Scene represents the forge viewer

		@constructs

		@param {int} [id=automaticaly generated] id of the scene.
	*/
	constructor(id = Utils.getId("scene")){
		this.#id = id;
		this.#viewer = null;
		this.#initInfos = {
			callback : null,
			oauth : null,
			urns : null,
		}
		this.#documents = [];
		this.#viewCubeUiExt = null;
		this.#temps = [];

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
		//that.#id = 3;
	    that.#viewer = new Autodesk.Viewing.GuiViewer3D(document.getElementById('forgeV'));
	    Memory.setViewer(this.#viewer);

	    var startedCode = that.#viewer.start();
	    if (startedCode > 0) {
	        console.error('Failed to create a Viewer: WebGL not supported.');
	        return;
	    }

	    for(let u in that.#initInfos.urns){
			Autodesk.Viewing.Document.load("urn:" + that.#initInfos.urns[u], (document) => {that._onDocumentLoaded(document, that)} , (event)=>{console.log(console.error('Failed fetching Forge manifest'))});
		}
	}

	_onDocumentLoaded(doc, that){

	    const docObj = new Document(doc);
	    that.#documents.push(docObj);
	    docObj.loadModels(that.#viewer, that.#initInfos.objs, ()=>{that._endOfInit(that)});

	}

	_endOfInit(that){
		that.#temps.push(that.#temps.length);
		if(that.#temps.length < that.#initInfos.urns.length) return;
		
		that.#viewer.setGroundShadow(false);
		that.#viewer.setEnvMapBackground(true);
		that.#viewer.setDisplayEdges(true);
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
		console.log(this.#viewer);
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
			models.push(this.#documents[d].getModel());
		}
		return models;
	}

}
export default Scene;