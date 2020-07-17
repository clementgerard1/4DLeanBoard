import Utils from "../../../class/Utils.class.js";

class Memory{

	static #materials = [];
	static #textures = [];
	static #viewer = null;
	static #selected = {};

	static addMaterial(material, init = false, name = this.#viewer.model.getFragmentList().materialmap[material.id]){
		if(init){
			this.#viewer.impl.getMaterials().addMaterial(Utils.getGuid(), material, true);
		}
		const id = this.#viewer.model.getFragmentList().materialmap[material.id];
		if(typeof this.#materials[id] == "undefined") {
			this.#materials[name] = material;
		}
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
			this.#selected[s]
		}
	}


}
export default Memory;