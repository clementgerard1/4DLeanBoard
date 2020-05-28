import Property from './interfaces/Property.class.js';

class Level extends Property{

	#val;

	/**
		@class Level
 		@extends Property
 		@classdesc Level represents levels property used in Tasks

		@constructs

		@param {string} [value=""] Value of level.
		@param {string} [name=""] Name of level.
		@param {int} [id=automaticaly generated] id of the level property
	*/
	constructor(value = "" ,name = "", id){
		super(name, id);
		this.#val = value;
	}

	/**
		Get the value of the level property
		@returns {string} value of the level property
	*/
	getValue(){
		return this.#val;
	}

	/**
		Set the value of the level property
		@param {string} value of the level property
	*/
	setValue(value){
		if(typeof value == "string"){
			console.error("setValue(value) need a string ; provided : " + value);
		}else{
			this.#val = value;
		}
	}

}
export default Level;