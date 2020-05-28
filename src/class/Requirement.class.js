import Property from './interfaces/Property.class.js';

class Requirement extends Property{

	#value;

	/**
 		@class Requirement
 		@extends Property
 		@classdesc Requirement represents requirements used in Milestones
		
		@constructs

		@param {string} [name=""] Name of requirement.
		@param {int} [id=automaticaly generated] id of the requirement property
	*/
	constructor(name = "", id){
		super(name, id);
		this.#value = false;
	}

	/**
		Get the value of the requierement
		@returns {bool} 
	*/
	getValue(){
		return this.#value;
	}

	/**
		Set the value of the requieremnet
		@param {bool} bool new value of requierement
	*/
	setValue(bool){
		this.#value = bool;
	}

}
export default Requirement;