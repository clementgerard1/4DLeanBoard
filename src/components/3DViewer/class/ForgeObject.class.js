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
	#layerHided;
	#inLayerSelected;

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
		this.#layerHided = false;
		this.#inLayerSelected = false;
	}

	setInvisible(bool){
		const viewer = Memory.getViewer();
		viewer.impl.visibilityManager.setNodeOff(this.#id, bool);
	}

	addProperty(property){
		/* if(typeof this.#properties[property.getName()] != "undefined") {
			console.log(property.getName(), 'double');
		} */
		this.#properties[property.getName()] = property;
	}

	addFragment(fragment){
		this.#fragments[fragment.getFragId()] = fragment;
	}

	setModel(model){
		this.#model = model;
	}

	isLinked(bool) {
		if(!bool) {
			this.#state = "built";
		}
		this.updateMaterial();
	}

	hide(bool) {
		const viewer = Memory.getViewer();
		if(bool) {
			viewer.hide(this.#id);
		}else {
			viewer.show(this.#id);
		}
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

	hideInLayer(layers){
		/* Memory.getViewer().getProperties(this.#id, (prop) => {
			console.log(prop);
		}, (err) => {
			console.log(err);
		}); */
		console.log(this.#properties);
		if(layers.includes(this.#properties.layer)){
			this.#inLayerSelected = true;
		}else{
			this.#inLayerSelected = false;
		}
		this.isLayerHided(this.#layerHided);
	}

	setColor(bool, color){
		const viewer = Memory.getViewer();
		if(bool){
			viewer.setThemingColor(this.#id, color);
		}
	}

	isLayerHided(bool){
		const viewer = Memory.getViewer();
		
		//console.log(this.#inLayerSelected);
		if(bool) {
			if(this.#inLayerSelected) {
				console.log(this.#id);
				viewer.hide(this.#id);
				this.#layerHided = true;
			}
		}else {
			viewer.show(this.#id);
			this.#layerHided = false;
		}
	}

	getId(){
		return this.#id;
	}

	hide(bool){
		if(this.#model != null){
			const viewer = Memory.getViewer();
			if(bool){
				viewer.hide(this.#id, this.#model);
			}else{
				viewer.show(this.#id, this.#model);
			}
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
		const viewer = Memory.getViewer();
		let materialName = null;
		if(!this.#selected) {
			viewer.setThemingColor(this.#id, null);
		}
		this.hide(false);
		if(this.#teamDisplayed){
			if(this.#teamSelected){
				materialName = this.#object3D.getParent().getTask().getTaskTeam().getId() + "-team";
			}else{	
				materialName = this.#object3D.getParent().getTask().getTaskTeam().getId() + "-not-team";
			}
		}else{
			if(this.#selected){
				materialName = "init";
				viewer.setThemingColor(this.#id, new THREE.Vector4(77/255,170/255,49/255,0.3), viewer.model, true);
			}else if(this.#state == "toBuild"){
				//1
				materialName = "ignoredMaterial";
				//this.hide(true);
				viewer.setThemingColor(this.#id, new THREE.Vector4(77/255,170/255,49/255,0.2), viewer.model, true);

				//2
			}else if(this.#state == "built"){
				materialName = "init";
			}else if(this.#state == "currentWeek"){
				materialName = "currWeekMat";
			}else if(this.#state == "builtOn6W"){
				materialName = "in6WeeksMaterial";
				//viewer.setThemingColor(this.#id, new THREE.Vector4(1,1,1,0.75), viewer.model, true);
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