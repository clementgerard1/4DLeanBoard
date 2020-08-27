import Utils from "./Utils.class.js";

class Person{

	#id;
	#name;
	#email;
	#phone;

	/**
 		@class Person
 		@classdesc Person class represent a single person

		@constructs

		@param {string} [name=""] Name of operationUnit.
		@param {int} [id=automaticaly generated] id of the requirement operationUnit
	*/
	constructor(name = "", id = Utils.getId("person")){
		this.#name = name;
		this.#id = id;
		this.#email = null;
		this.#phone = null;
	}

	setEmail(email){
		this.#email = email;
	}

	setPhone(phone){
		this.#phone = phone;
	}

	getEmail(){
		return this.#email;
	}

	getPhone(){
		return this.#phone;
	}

	getId(){
		return this.#id;
	}

	getName(){
		return this.#name;
	}

}
export default Person;