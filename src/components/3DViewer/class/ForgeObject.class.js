import Utils from "../../../class/Utils.class.js";

class ForgeObject{

	#id;
	#properties;
	#fragments;
	#model;
	#selected;

	constructor(id = Utils.getId("forgeObjects")){
		this.#id = id;
		this.#properties = {};
		this.#fragments = {};
		this.#model = null;
		this.#selected = false;
	}

	addProperty(property){
		this.#properties[property.name] = property;
	}

	addFragment(fragment){
		this.#fragments[fragment.getFragId()] = fragment;
	}

	setModel(model){
		this.#model = model;
	}

	setAllMaterials(materialName){
		for(let f in this.#fragments){
			this.#fragments[f].setMaterial(materialName);
		}
	}

	getId(){
		return this.#id;
	}

	isSelected(bool){
		if(bool != this.#selected){
			this.#selected = bool;
			this.updateMaterial();
		}
	}

	updateMaterial(){

	}

}
export default ForgeObject;