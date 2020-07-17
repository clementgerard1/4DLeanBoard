import Utils from "../../../class/Utils.class.js";
import Model from "./Model.class.js";

class Document{

	#id;
	#doc;
	#model;

	constructor(doc, id = Utils.getId("forgeDocument")){
		this.#id = id;
		this.#doc = doc;
		this.#model = null;
	}

	loadModels(viewer, callback){

		const that = this;
		//Plus tard les multiples viewables            
        //const t = this.documents[d].getRoot().findAllViewables();

		this.#model = new Model();
		const path = this.#doc.getViewablePath(this.#doc.getRoot().getDefaultGeometry());

		this.#model.load(viewer, path, callback);

	}

	setAllMaterials(materialName){
		this.#model.setAllMaterials(materialName);
	}
	

}
export default Document;