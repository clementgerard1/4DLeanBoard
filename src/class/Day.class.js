import Utils from "./Utils.class.js";

class Day{

	#id;
	#date;

	/**
 		@class Person
 		@classdesc Person class represent a single person

		@constructs

		@param {string} [name=""] Name of operationUnit.
		@param {int} [id=automaticaly generated] id of the requirement operationUnit
	*/
	constructor(date, id = Utils.getId("day")){
		this.#id = id;
		this.#date = date
	}

	getId(){
		return this.#id;
	}

	getDate(){
		return this.#date;
	}

}
export default Day;