import Utils from "./Utils.class.js";

class Delivrable{

	#id;
	#name;

	/**	
		@class Delivrable
		@classdesc Delivrable represents a delivrable
		
		@constructs
		@param {string} [name=""] Name of Delivrable
		@param {int} [id=automaticaly generated] id of the Delivrable
	*/
	constructor(name = "", id = Utils.getId("delivrable")){
		this.#id = id;
		this.#name = name;
	}

	/**
		Get the id of the delivrable
		@returns {int} id of the delivrable
	*/
	getId(){
		return this.#id;
	}

	/**
		Get the name of the delivrable
		@returns {string} name of the delivrable
	*/
	getName(){
		return this.#name;
	}	

}
export default Delivrable;