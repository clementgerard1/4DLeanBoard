import Utils from "../../../class/Utils.class.js";
import Memory from "./Memory.class.js";
import scssVariables from "../../SixWeekView/assets/_variables.scss";

class ForgeObject{

	#id;
	#properties;
	#fragments;
	#model;
	#originalModelId;
	#state;
	#object3D;
	#teamDisplayed;
	#teamSelected;
	#layerHided;
	#inLayerSelected;
	#linked;

	#timeState;
	#selected;
	#visible;
	#started;

	constructor(id = Utils.getId("forgeObjects"), model){
		this.#id = id;
		this.#properties = {};
		this.#fragments = {};
		this.#model = model;
		this.#originalModelId = (Math.trunc((model.id-1) / Memory.getNbStyles())) + 1;
		this.#state = "toBuild";
		this.#object3D = null;
		this.#teamDisplayed = false;
		this.#teamSelected = true;
		this.#layerHided = false;
		this.#inLayerSelected = false;
		this.#linked = false;

		this.#timeState = -1;
		this.#selected = false;
		this.#visible = true;

		this.#started = false;
	}

	setTimeState(i){
		if(this.#timeState != i){
			const viewer = Memory.getViewer();
			this.#timeState = i;
			this.updateMaterial();
		}
	}

	setTransparent(bool){
		if(this.#visible != !bool){
			this.#visible = !bool;
			this.updateMaterial();
		}
	}

	addProperty(property){
		this.#properties[property.getName()] = property;
	}

	addFragment(fragment){
		this.#fragments[fragment.getFragId()] = fragment;
	}

	setModel(model){
		this.#model = model;
	}

	getModel(){
		return this.#model;
	}

	isLinked(bool) {
		this.#linked = bool;
	}

	isTeamSelected(teams){
		if(typeof teams[this.#object3D.getParent().getTask().getTaskTeam().getId()] != "undefined"){
			this.#teamSelected = true;
		}else{
			this.#teamSelected = false;
		}
		//this.updateMaterial();
	}

	isTeamDisplayed(bool){
		this.#teamDisplayed = bool;
		//this.updateMaterial();
	}

	hideInLayer(layers){
		/* Memory.getViewer().getProperties(this.#id, (prop) => {
			console.log(prop);
		}, (err) => {
			console.log(err);
		}); */

		// layering ne marche pas pour le moment
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
			//console.log(viewer);
			viewer.setThemingColor(this.#id, color, this.#model);
		}
	}

	isLayerHided(bool){
		//const viewer = Memory.getViewer();
		
		//console.log(this.#inLayerSelected);
		if(bool) {
			if(this.#inLayerSelected) {
				//viewer.hide(this.#id, this.#model);
				this.#layerHided = true;
			}
		}else {
			//viewer.show(this.#id, this.#model);
			this.#layerHided = false;
		}
		//this.updateMaterial();
	}

	getId(){
		return this.#id;
	}

	//
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
	//

	isSelected(bool){
		if(bool != this.#selected){
			this.#selected = bool;
			//this.updateMaterial();
		}
	}

	setState(state){
		if(this.#state != state){
			this.#state = state;
			//this.updateMaterial();
		}
	};

	updateMaterial(){

		const viewer = Memory.getViewer();
		const styles = Memory.getSceneObject().getStyle(this.#timeState, null, this.#selected, this.#visible, "basicMaterial");
		
		if(typeof styles != "undefined"){
			const newModel = Memory.getModelByEdgeStyle(this.#originalModelId, styles.edge);
			const color = new THREE.Vector4(parseInt(styles.material.slice(1, 3), 16) / 255, parseInt(styles.material.slice(3, 5), 16) / 255, parseInt(styles.material.slice(5, 7), 16) / 255, parseInt(styles.material.slice(8, 11)) / 100);
			if((newModel != null && newModel.id != this.#model.id) || !this.#started){
				viewer.impl.visibilityManager.setNodeOff(this.#id, true, this.#model);
				viewer.impl.visibilityManager.setNodeOff(this.#id, false, newModel);
				this.#model = newModel;

				this.#started = true;
			}


			viewer.setThemingColor(this.#id, color, this.#model);
			if(styles.transparent == "TRUE"){
				viewer.hide(this.#id, this.#model);
			}else{
				viewer.show(this.#id, this.#model);
			}
		}

		

		/*let materialName = null;
		if(!this.#selected) {
			viewer.setThemingColor(this.#id, null, this.#model);
		}
		viewer.show(this.#id, this.#model);
		if(this.#teamDisplayed){
			if(!this.#linked){
				materialName = "init";
				viewer.hide(this.#id, this.#model);
			}else if(this.#teamSelected){
				const color = this.#object3D.getParent().getTask().getTaskTeam().getColorClass();
				const hexa = scssVariables[color.charAt(0).toLowerCase() + color.slice(1)];
				const r = parseInt(hexa.slice(1, 3), 16);
				const g = parseInt(hexa.slice(3, 5), 16);
				const b = parseInt(hexa.slice(5, 7), 16);
				viewer.setThemingColor(this.#id, new THREE.Vector4(r / 255, g / 255, b / 255, 1), this.#model);
				materialName = "init";
				//materialName = this.#object3D.getParent().getTask().getTaskTeam().getId() + "-team";
			}else{	
				//materialName = this.#object3D.getParent().getTask().getTaskTeam().getId() + "-not-team";
				viewer.hide(this.#id, this.#model);
				materialName = "init";
			}
		}else if(this.#layerHided){
			if(this.#inLayerSelected){
				viewer.hide(this.#id, this.#model)
			}else{
				viewer.show(this.#id, this.#model);
			}
		}else{
			if(this.#selected){
				materialName = "init";
				viewer.setThemingColor(this.#id, new THREE.Vector4(77/255,170/255,49/255,1), this.#model);
			}else if(this.#state == "toBuild"){
				//1
				materialName = "ignoredMaterial";
				//this.hide(true);
				viewer.setThemingColor(this.#id, new THREE.Vector4(77/255,170/255,49/255,0.2), this.#model);

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
		}*/
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