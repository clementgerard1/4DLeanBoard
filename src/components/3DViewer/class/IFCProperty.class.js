import Utils from "../../../class/Utils.class.js";

class IFCProperty{

	#id;
	#name;
	#propertyInfos;

	constructor(name, propertyInfos, id = Utils.getId("ifcProperty")){
		this.#name = name;
		this.#id = id;
		this.#propertyInfos = propertyInfos;
	}

	getName(){
		return this.#name;
	}

	getId(){
		return this.#id;
	}

}
export default IFCProperty;