import Utils from './Utils.class.js';
import Object4D from './Object4D.class.js';

class Object3D{

	#id;
	#name;
	#objId;
	#parentObject4D;
	#ifcId;

	/**
	 	@class Object3D 
	 	@classdesc Object3D
	 
		@constructs

		@param {string} [name=""] Name of object3D.
		@param {int} [objId=""] Id of object3D (:34...).
		@param {int} [id=automaticaly generated] id of the object3D
	*/
	constructor(name = "", objId ="", ifcId="", id = Utils.getId("object3D")){
		this.#id = id;
		this.#name = name;
		this.#objId = objId;
		this.#parentObject4D = null;
		this.#ifcId = ifcId;
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
		@returns {string} uniqId of the object3D
	*/
	getUniqId(){
		return this.#objId;
	}

	/**
		Get the ifcId of the object3D
		@returns {string} ifcId of the object3D
	*/
	getIFCId(){
		return this.#ifcId;
	}

	/**
		get the object3D id
		@returns {string} object3D id
	*/
	getId(){
		return this.#id;
	}

	/**
		Get the parent object4D
		@returns {Object4D} 
	*/
	getParent(){
		return this.#parentObject4D;
	}

	/**
		Set the parent object4D
		@param {Object4D} obj
	*/
	setParent(obj){
		if(!(obj instanceof Object4D)){
			console.error("setParent(obj) need a Object4D ; provided : ", obj);
		}else{
			this.#parentObject4D = obj;
		}
	}

}
export default Object3D;