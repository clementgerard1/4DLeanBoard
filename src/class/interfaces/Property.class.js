import Utils from "../Utils.class.js";
/**

 */
class Property{

	#id;
	#name;

	/**
		@class Property
 		@classdesc Property abstract object which represents a generic property  - Don't instanciate it !

 		@constructs 
 		
		@param {string} name Name of property.
		@param {int} id id of the property
	*/
	constructor(name, id){
		if(typeof id == "undefined"){
			id = Utils.getId("property");
		}
		this.#id = id;
		this.#name = name;
	}

	/**
		Get the id of the property
		@returns {int} id of the property
	*/
	getId(){
		return this.#id;
	}

	/**
		Get the name of the property
		@returns {string} name of the property
	*/
	getName(){
		return this.#name;
	}	

}
export default Property;