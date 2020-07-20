import Utils from "../../../class/Utils.class.js";
import Memory from "./Memory.class.js";

class Fragment{

	#fragId;
	#id;
	#material;
	#initMaterial;
	#ignoredMaterial;
	#model;

	constructor(fragId ,material, ignored, id = Utils.getId("forgeFragments")){
		this.#fragId = fragId;
		this.#id = id;
		this.#initMaterial = material;
		this.#ignoredMaterial = ignored;
		this.#material = material;
		this.#model = null;
	}

	getFragId(){
		return this.#fragId;
	}

	setMaterial(materialName){
		let material = null;
		if(materialName == "ignoredMaterial"){
			material = this.#ignoredMaterial;
		}else if(materialName == "init"){
			material = this.#initMaterial;
		}else{
			material = Memory.getMaterial(materialName);
		}
		if(material.id != this.#material.id){
			this.#model.getFragmentList().setMaterial(this.#fragId, material);
			this.#material = material;
		}
	}

	setModel(model){
		this.#model = model;
	}

	getFragId(){
		return this.#fragId;
	}

}
export default Fragment;