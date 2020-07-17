import Utils from "../../../class/Utils.class.js";

class Memory{

	static #materials = [];
	static #textures = [];
	static #viewer = null;
	static #selected = {};
	static #forgeObjects = {};
	static #forgeObjectsNotLinked = {}

	static addMaterial(material, init = false, name = this.#viewer.model.getFragmentList().materialmap[material.id]){
		if(init){
			this.#viewer.impl.getMaterials().addMaterial(Utils.getGuid(), material, true);
		}
		const id = this.#viewer.model.getFragmentList().materialmap[material.id];
		if(typeof this.#materials[id] == "undefined") {
			if(typeof name == "undefined") name = Utils.getGuid("materialName");
			this.#materials[name] = material;
		}
	}

	static setState(forgeObject, state){
		forgeObject.setState(state);
	}

	static setViewer(viewer){
		this.#viewer = viewer;
	}

	static getMaterial(name){
		return this.#materials[name];
	}

	static select(forgeObject, bool){
		if(bool){
			if(typeof this.#selected[forgeObject.getId()]) this.#selected[forgeObject.getId()] = forgeObject;
		}else{
			delete this.#selected[forgeObject.getId()];
		}
		forgeObject.isSelected(bool);
	}

	static clearSelection(){
		for(let s in this.#selected){
			this.select(this.#selected[s], false);
		}
	}

	static getForgeObject(dbId){
		return this.#forgeObjects[dbId];
	}

	static addForgeObject(forgeObject, linked){
		//console.log(forgeObject.getId());
		if(linked){
			this.#forgeObjects[forgeObject.getId()] = forgeObject;
		}else{
			this.#forgeObjectsNotLinked[forgeObject.getId()] = forgeObject;
		}
	}

	static refresh(){
		this.#viewer.impl.invalidate(true);
	}


}
export default Memory;