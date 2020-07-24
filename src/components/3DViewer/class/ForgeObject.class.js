import Utils from "../../../class/Utils.class.js";
import Memory from "./Memory.class.js";

class ForgeObject{

	#id;
	#properties;
	#fragments;
	#model;
	#selected;
	#state;
	#object3D;
	#teamDisplayed;
	#teamSelected;
	#layerDisplayed;
	#layerSelected;

	constructor(id = Utils.getId("forgeObjects")){
		this.#id = id;
		this.#properties = {};
		this.#fragments = {};
		this.#model = null;
		this.#selected = false;
		this.#state = "toBuild";
		this.#object3D = null;
		this.#teamDisplayed = false;
		this.#teamSelected = true;
		this.#layerDisplayed = false;
		this.#layerSelected = true;
	}

	setInvisible(bool){
		const viewer = Memory.getViewer();
		viewer.impl.visibilityManager.setNodeOff(this.#id, bool);
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

	isTeamSelected(teams){
		if(typeof teams[this.#object3D.getParent().getTask().getTaskTeam().getId()] != "undefined"){
			this.#teamSelected = true;
		}else{
			this.#teamSelected = false;
		}
		this.updateMaterial();
	}

	isTeamDisplayed(bool){
		this.#teamDisplayed = bool;
		this.updateMaterial();
	}

	isLayerSelected(layers){
		if(typeof layers[this.#properties["Layer"]] != "undefined"){
			this.#layerSelected = true;
		}else{
			this.#layerSelected = false;
		}
		this.updateMaterial();
	}

	setColor(bool, color){
		const viewer = Memory.getViewer();
		if(bool){
			viewer.setThemingColor(this.#id, color);
		}
	}

	isLayerDisplayed(bool){
		this.#layerDisplayed = bool;
		//vv problème lors de cet appel
		this.updateMaterial();
	}

	getId(){
		return this.#id;
	}

	hide(bool){
		const viewer = Memory.getViewer();
		if(bool){
			viewer.hide(this.#id, viewer.model);
		}else{
			viewer.show(this.#id);
		}
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

		let materialName = null;
		if(this.#teamDisplayed){
			if(this.#teamSelected){
				materialName = this.#object3D.getParent().getTask().getTaskTeam().getId() + "-team";
			}else{	
				materialName = this.#object3D.getParent().getTask().getTaskTeam().getId() + "-not-team";
			}
		}else if(this.#layerDisplayed) {
			if(this.#layerSelected) {
				console.log(this.#id);
			}
		}else{
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