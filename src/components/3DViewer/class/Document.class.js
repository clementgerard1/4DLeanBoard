import Utils from "../../../class/Utils.class.js";
import Model from "./Model.class.js";

class Document{

	#id;
	#doc;
	#models;
	#modelsNeeded;
	#modelLoaded;

	constructor(doc, modelsNeeded, id = Utils.getId("forgeDocument")){
		this.#id = id;
		this.#doc = doc;
		this.#models = [];
		this.#modelsNeeded = modelsNeeded;
		this.#modelLoaded = 0;

	}

	loadModels(viewer, objs, properties, callback){

		const that = this;
		this.#models[this.#models.length] = new Model();
		const path = this.#doc.getViewablePath(this.#doc.getRoot().getDefaultGeometry());
		this.#models[this.#models.length - 1].load(viewer, this.#modelsNeeded[0].style, path, objs, properties, () => that._onModelLoaded(that, viewer, objs, properties, path, callback));
		
	}

	_onModelLoaded(that, viewer, objs, properties,  path, callback){

		that.#modelLoaded++;
		if(that.#modelLoaded < that.#modelsNeeded.length){
			that.#models[that.#models.length] = new Model();
			that.#models[that.#models.length - 1].load(viewer, that.#modelsNeeded[that.#modelLoaded].style, path, objs, properties, () => that._onModelLoaded(that, viewer, objs, properties, path, callback));
			return;
		}

		callback();


	}

	getModels(){
		return this.#models;
	}

	getModel(i){
		return this.#models[i];
	}

	setAllMaterials(materialName){
		this.#models.setAllMaterials(materialName);
	}
}
export default Document;