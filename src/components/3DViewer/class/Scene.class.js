import Utils from "../../../class/Utils.class.js";
import Document from "./Document.class.js";
import Memory from "./Memory.class.js";

class Scene{

	#id;
	#viewer;
	#initInfos;
	#documents;

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

	}

	init(oauth, urns, objs, callback){
		this.#initInfos = {
			callback : callback,
			oauth : oauth,
			urns : urns,
			objs : objs
		}

		var options = {
		    env: 'AutodeskProduction',
		    api: 'derivativeV2',  // for models uploaded to EMEA change this option to 'derivativeV2_EU'
		    accessToken : this.#initInfos.oauth.credentials.access_token,
		};
		const that = this;
		Autodesk.Viewing.Initializer(options, () => {this._onInitialisationSuccess(that)});
	}

	_onInitialisationSuccess(that){
		//that.#id = 3;
	    that.#viewer = new Autodesk.Viewing.Viewer3D(document.getElementById('forgeV'));
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
		
	    that.#viewer.setGroundShadow(false);
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

}
export default Scene;