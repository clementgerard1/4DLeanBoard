import Utils from "../../../class/Utils.class.js";
import Memory from "./Memory.class.js";

class Fragment{

	#fragId;
	#id;
	#material;
	#model;

	constructor(fragId ,material, id = Utils.getId("forgeFragments")){
		this.#fragId = fragId;
		this.#id = id;
		this.#material = material;
		this.#model = null;
	}

	getFragId(){
		return this.#fragId;
	}

	setMaterial(materialName){
		const material = Memory.getMaterial(materialName);
		this.#model.getFragmentList().setMaterial(this.#fragId, material);
	}

	setModel(model){
		this.#model = model;
	}

}
export default Fragment;