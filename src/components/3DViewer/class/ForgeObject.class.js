import Utils from "../../../class/Utils.class.js";

class ForgeObject{

	#id;
	#properties;
	#fragments;
	#model;
	#selected;
	#state;
	#object3D;

	constructor(id = Utils.getId("forgeObjects")){
		this.#id = id;
		this.#properties = {};
		this.#fragments = {};
		this.#model = null;
		this.#selected = false;
		this.#state = "toBuild";
		this.#object3D = null;
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

	setState(state){
		if(this.#state != state){
			this.#state = state;
			this.updateMaterial();
		}
	}

	updateMaterial(){
		let materialName = "init";
		if(this.#selected){
			materialName = "selectedMaterial";
		}else if(this.#state == "toBuild"){
			materialName = "nextsWeeksMat";
		}else if(this.#state == "built"){
			materialName = "init";
		}else if(this.#state == "currentWeek"){
			materialName = "currWeekMat";
		}else if(this.#state == "builtOn6W"){
			materialName = "sixWeeksMat";
		}

		for(let f in this.#fragments){
			this.#fragments[f].setMaterial(materialName);
		}
	}

	getSelected(){
		return this.#selected;
	}

	setObject3D(obj){
		this.#object3D = obj;
	}

	getObject3D(){
		return this.#object3D;
	}

}
export default ForgeObject;