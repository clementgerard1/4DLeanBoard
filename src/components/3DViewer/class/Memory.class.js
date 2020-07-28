import Utils from "../../../class/Utils.class.js";
import { AuthClientThreeLegged } from "forge-apis";

class Memory{

	static #materials = [];
	static #textures = [];
	static #viewer = null;
	static #camera = null;
	static #selected = {};
	static #forgeObjects = {};
	static #forgeObjectsNotLinked = {};
	static #teamDisplay = false;
	static #layerDisplay = false;
	static #layerSelected = [];
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

	static setCamera(cam) {
		this.#camera = cam;
	}

	static setTarget() {
		this.#camera.setTarget(this.#camera.getTarget());
	}

	static isLayerDisplayed(){
		return this.#layerDisplay;
	}

	static setViewer(viewer){
		this.#viewer = viewer;
	}

	static getViewer(){
		return this.#viewer;
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

	static hideLayer(layer, bool){
		if(bool){
			this.#layerSelected.push(layer);
		}else{
			delete this.#layerSelected[this.#layerSelected.indexOf(layer)];
		}
		for(let f in this.#forgeObjects){
			this.#forgeObjects[f].hideInLayer(this.#layerSelected);
		}
		/* for(let f in this.#forgeObjectsNotLinked) {
			this.#forgeObjectsNotLinked[f].hideInLayer(this.#layerSelected);
		} */
	}

	static setLayerHideMode(bool){
		if(this.#layerDisplay != bool){
			this.#layerDisplay = bool;
			for(let f in this.#forgeObjects){
				this.#forgeObjects[f].isLayerHided(bool);
			}
			/* for(let f in this.#forgeObjectsNotLinked) {
				this.#forgeObjectsNotLinked[f].isLayerHided(bool);
			} */
		}
	}
	
	static setNotLinked(){
		for(let f in this.#forgeObjectsNotLinked){
			this.#forgeObjectsNotLinked[f].isLinked(false);
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

	static allToRed(bool){
		const color = new THREE.Vector4(1,0,0,1);
		const anomalies = new THREE.Vector4(0,0,1,1);
		for(let f in this.#forgeObjects){
			this.#forgeObjects[f].hide(bool);
			this.#forgeObjects[f].setColor(bool, color);
		}
		for(let f in this.#forgeObjectsNotLinked){
			this.#forgeObjectsNotLinked[f].hide(bool);
			this.#forgeObjectsNotLinked[f].setColor(bool, anomalies);
		}
	}

	static setAllInvisible(bool){
		for(let f in this.#forgeObjectsNotLinked){
			this.#forgeObjectsNotLinked[f].setInvisible(bool);
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