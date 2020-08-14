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
	static nbModels = 0;
	static nbStyles = 1;
	static sceneObj = null;

	static style2Model = {};

	static addMaterial(material, init = false, name){
		if(typeof material != "undefined"){
			if(name == "undefined") name = this.#viewer.model.getFragmentList().materialmap[material.id];
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
	}

	static setNb3DModels(nb){
		this.nbModels = nb;
		for(let i = 0 ; i < nb ; i++){
			this.style2Model[i] = {};
		}
	}

	static setNbStyles(nb){
		this.nbStyles = nb;
	}

	static getNbStyles(nb){
		return this.nbStyles;
	}

	static setSceneObject(sceneObj){
		this.sceneObj = sceneObj;
	}

	static getSceneObject(){
		return this.sceneObj;
	}

	static addEdgeStyle(style, model){
		if(typeof this.style2Model[Math.trunc((model.id - 1) / this.nbStyles)][style] == "undefined"){
			this.style2Model[Math.trunc((model.id - 1) / this.nbStyles)][style] = {
				model : model,
				nb : model.id % this.nbStyles
			}
		}
	}

	static getModelByEdgeStyle(startModelId, style){

		if(style == null) style = "null";
		if(typeof this.style2Model[startModelId - 1] != "undefined"){
			return this.style2Model[startModelId - 1][style].model;
		}
	}

	static getEdgeStyleByModelId(modelId){
		for(let s in this.style2Model[Math.trunc((modelId - 1) / this.nbStyles)]){
			if(this.style2Model[Math.trunc((modelId - 1) / this.nbStyles)][s].nb == modelId % this.nbStyles){
				return s;
			}
		}
		// if(typeof this.style2Model[startModelId - 1] != "undefined"){
		// 	return this.style2Model[startModelId - 1][style];
		// }
	}

	static addMaterialInformations(materials){
		for(let m in materials){
			const temp = m.split("|");
			if(temp.length > 1){
				const temp2 = temp[0].split(":");
				if(temp2.length > 1){
					materials[m].lol = parseInt(temp2[1]);
					const style = this.getEdgeStyleByModelId(parseInt(temp2[1]));
					//SLICE BUGGER
					if(style != "null"){
						materials[m].edgeCustumColor = new THREE.Vector4(parseInt(style.slice(1, 3), 16) / 255, parseInt(style.slice(3, 5), 16) / 255, parseInt(style.slice(5, 7), 16) / 255, 1);
					}
					
				}else{
					materials[m].lol = "LOL";
				}
				//console.log(temp[1]);
			}else{
				materials[m].lol = "LOL";
			}
		}
	}

	static setIfcTransparent(id, bool){
		for(let f in this.#forgeObjects[id]){
			this.#forgeObjects[id][f].setIfcTransparent(!bool);
		}
		for(let f in this.#forgeObjectsNotLinked[id]){
			this.#forgeObjectsNotLinked[id][f].setIfcTransparent(!bool);
		}
	}

	static setUnlinkedStyle(){
		for(let f in this.#forgeObjectsNotLinked){
			for(let ff in this.#forgeObjectsNotLinked[f]){
				this.#forgeObjectsNotLinked[f][ff].setTimeState(0);
			}
		}
	}

	static setState(forgeObject, state){
		forgeObject.setTimeState(state);
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
			for(let ff in this.#forgeObjects[f]){
				this.#forgeObjects[f][ff].isTeamSelected(this.#teamSelected);
			}
		}
	}

	static hideLayer(layer, bool){
		if(bool){
			this.#layerSelected.push(layer);
		}else{
			delete this.#layerSelected[this.#layerSelected.indexOf(layer)];
		}
		for(let f in this.#forgeObjects){
			for(let ff in this.#forgeObjects[f]){
				this.#forgeObjects[f][ff].hideInLayer(this.#layerSelected);
			}
		}
		/* for(let f in this.#forgeObjectsNotLinked) {
			this.#forgeObjectsNotLinked[f].hideInLayer(this.#layerSelected);
		} */
	}

	static setLayerHideMode(bool){
		if(this.#layerDisplay != bool){
			this.#layerDisplay = bool;
			for(let f in this.#forgeObjects){
				for(let ff in this.#forgeObjects[f]){
					this.#forgeObjects[f][ff].isLayerHided(bool);
				}
			}
			/* for(let f in this.#forgeObjectsNotLinked) {
				this.#forgeObjectsNotLinked[f].isLayerHided(bool);
			} */
		}
	}
	

	static setTeamDisplayMode(bool){
		if(this.#teamDisplay != bool){
			this.#teamDisplay = bool;
			for(let f in this.#forgeObjects){
				for(let ff in this.#forgeObjects[f]){
					this.#forgeObjects[f][ff].isTeamDisplayed(bool);
				}
			}
			// for(let f in this.#forgeObjectsNotLinked){
			// 	for(let ff in this.#forgeObjectsNotLinked[f]){
			// 		this.#forgeObjectsNotLinked[f][ff].isTeamDisplayed(bool);
			// 	}
			// }
		}
	}

	static isSelected(forgeObject){
		return typeof this.#selected[forgeObject.getId()] != "undefined";
	}

	static select(forgeObject, bool){
		if(bool){
			if(typeof this.#selected[forgeObject.getId()] == "undefined") this.#selected[forgeObject.getId()] = forgeObject;
		}else{
			delete this.#selected[forgeObject.getId()];
		}
		forgeObject.isSelected(bool);
	}

	static getSelected(){
		return this.#selected;
	}

	static clearSelection(){
		for(let s in this.#selected){
			this.select(this.#selected[s], false);
		}
	}

	static getForgeObject(dbId, model){
		const newModelId = Math.trunc((model.id - 1) / this.nbStyles);
		if(typeof  this.#forgeObjects[newModelId] == "undefined" || typeof this.#forgeObjects[newModelId][dbId] == "undefined") return null;
		return this.#forgeObjects[newModelId][dbId];
	}

	static addForgeObject(forgeObject, linked){
		const modelId = Math.trunc((forgeObject.getModel().id - 1) / this.nbStyles);
		if(linked && typeof this.#forgeObjects[modelId] == "undefined") this.#forgeObjects[modelId] = {};
		if(!linked && typeof this.#forgeObjectsNotLinked[modelId] == "undefined") this.#forgeObjectsNotLinked[modelId] = {};
		if(linked){
			this.#forgeObjects[modelId][forgeObject.getId()] = forgeObject;
		}else{
			this.#forgeObjectsNotLinked[modelId][forgeObject.getId()] = forgeObject;
		}
	}

	static refresh(){
		this.#viewer.impl.invalidate(true);
	}
}
export default Memory;