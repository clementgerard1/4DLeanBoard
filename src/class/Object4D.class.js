import Utils from './Utils.class.js';
import Object3D from './Object3D.class.js';

class Object4D{

	#id;
	#name;
	#objects3D;

	/**
 		@class Object4D 
 		@classdesc Object4D

 		@constructs 
 		
		@param {string} [name=""] Name of object4D.
		@param {int} [id=automaticaly generated] id of the object4D
	*/
	constructor(name = "", id = Utils.getId("object4D")){
		this.#id = id;
		this.#name = name;
		this.#objects3D = [];
	}

	/**
		Get the name of the object4D
		@returns {string} name of the object4D
	*/
	getName(){
		return this.#name;
	}	

	/**
		get the object4D id
		@returns {string} object4D id
	*/
	getId(){
		return this.#id;
	}

	/**
		Add a object3D
		@param {Object3D} [object3D = new Object3D] Object3D to add to the collection
	*/
	addObject3D(object3D = new Object3D()){
		this.#objects3D[object3D.getId()] = object3D;
	}

	/**
		Remove a object3D
		@param {Object3D} object3D Object3D to remove
	*/
	removeObject3D(object3D){
		if(!(object3D instanceof Object3D)){
			console.error("removeObject3D(object3D) : object3D " + object3D + " not of type Object3D");
		}else if(!(Object.keys(this.#objects3D).includes("" + object3D.getId()))){
			console.error("removeObject3D(object3D) : object3D " + object3D + " not in the collection");
		}else{
			delete this.#objects3D[object3D.getId()];
		}
	}

	/**
		Get all objects3D
		@returns {Array} Array of Object3D
	*/
	getObjects3D(){
		return this.#objects3D;
	}

	/**
		Get a object3D by id
		@param {int} id id of the object3D
		@returns {Object3D} Object3D corresponding
	*/
	getObject3D(id){
		if(typeof this.#objects3D[id] == "undefined"){
			console.error("getObject3D(id) : id " + id + " unknowned on object3D collection")
			return null;
		}else{
			return this.#objects3D[id];
		}
	}

}
export default Object4D;