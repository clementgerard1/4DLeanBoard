import Utils from "../../../class/Utils.class.js";

class Memory{

	static #materials = [];
	static #textures = [];
	static #viewer = null;
	static #selected = {};
	static #forgeObjects = {};
	static #forgeObjectsNotLinked = {}
	static #teamDisplay = false;
	static #layerDisplay = false;
	static #layerSelected = {};
	static #teamSelected = {};

	static addMaterial(material, init = false, name = this.#viewer.model.getFragmentList().materialmap[material.id]){
		if(init){
			//material.envMap = null;
			//material.reflectivity = 0;
			this.#viewer.impl.getMaterials().addMaterial(name, material, true);
			//console.log(name);
			//material.envMap = null;
			//material.reflectivity = 0;
			//material.needsUpdate = true;
			//console.log(this.#viewer.impl.matman());
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

	static isTeamDisplayed(){
		return this.#teamDisplay;
	}

	static isLayerDisplayed(){
		return this.#layerDisplay;
	}

	static setViewer(viewer){
		this.#viewer = viewer;
	}

	static getMaterial(name){
		return this.#materials[name];
	}

	static setTeamSelected(team, bool){
		if(bool){
			this.#teamSelected[team.getId()] = true;
		}else{
			delete this.#teamSelected[team.getId()];
		}
		for(let f in this.#forgeObjects){
			this.#forgeObjects[f].isTeamSelected(this.#teamSelected);
		}
	}

	static setLayerSelected(layer, bool){
		if(bool){
			this.#layerSelected[layer] = true;
		}else{
			delete this.#layerSelected[layer];
		}
		for(let f in this.#forgeObjects){
			this.#forgeObjects[f].isLayerSelected(this.#layerSelected);
		}
	}

	static setLayerDisplayMode(bool){
		if(this.#layerDisplay != bool){
			this.#layerDisplay = bool;
			for(let f in this.#forgeObjects){
				this.#forgeObjects[f].isLayerDisplayed(bool);
			}
		}
	}

	static setTeamDisplayMode(bool){
		if(this.#teamDisplay != bool){
			this.#teamDisplay = bool;
			for(let f in this.#forgeObjects){
				this.#forgeObjects[f].isTeamDisplayed(bool);
			}
		}
	}

	static isSelected(forgeObject){
		return typeof this.#selected[forgeObject.getId()] != "undefined";
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