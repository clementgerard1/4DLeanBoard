import Utils from './Utils.class.js';

class Object3D{

	#id;
	#name;
	#objId;

	/**
	 	@class Object3D 
	 	@classdesc Object3D
	 
		@constructs

		@param {string} [name=""] Name of object3D.
		@param {int} [objId=""] Id of object3D (:34...).
		@param {int} [id=automaticaly generated] id of the object3D
	*/
	constructor(name = "", objId ="", id = Utils.getId("object3D")){
		this.#id = id;
		this.#name = name;
		this.#objId = objId;
	}

	/**
		Get the name of the object3D
		@returns {string} name of the object3D
	*/
	getName(){
		return this.#name;
	}	

	/**
		Get the uniqId of the object3D
		@returns {string} name of the object3D
	*/
	getUniqId(){
		return this.#objId;
	}

	/**
		get the object3D id
		@returns {string} object3D id
	*/
	getId(){
		return this.#id;
	}

}
export default Object3D;