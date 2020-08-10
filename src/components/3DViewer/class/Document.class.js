import Utils from "../../../class/Utils.class.js";
import Model from "./Model.class.js";

class Document{

	#id;
	#doc;
	#models;
	#styles;
	#modelLoaded;

	constructor(doc, styles, id = Utils.getId("forgeDocument")){
		this.#id = id;
		this.#doc = doc;
		this.#models = [];
		this.#styles = styles;
		this.#modelLoaded = 0;
	}

	loadModels(viewer, objs, callback){

		const that = this;
		this.#models[this.#models.length] = new Model();
		const path = this.#doc.getViewablePath(this.#doc.getRoot().getDefaultGeometry());
		this.#models[this.#models.length - 1].load(viewer, this.#styles[0], path, objs, () => that._onModelLoaded(that, viewer, objs, path, callback));
		
	}

	_onModelLoaded(that, viewer, objs, path, callback){

		that.#modelLoaded++;
		if(that.#modelLoaded < that.#styles.length){
			that.#models[that.#models.length] = new Model();
			that.#models[that.#models.length - 1].load(viewer, that.#styles[that.#modelLoaded], path, objs, () => that._onModelLoaded(that, viewer, objs, path, callback));
			return;
		}

		callback();


	}

	getModels(){
		return this.#models;
	}

	setAllMaterials(materialName){
		this.#models.setAllMaterials(materialName);
	}
}
export default Document;