import Utils from './Utils.class.js';

/**
 * @class Object3D 
 * @classdesc Object3D
 */
class Object3D{

	/**
		Object3D Constructor
		@param {string} [name=""] Name of object3D.
		@param {int} [id=automaticaly generated] id of the object3D
	*/
	constructor(name = "", id = Utils.getId("object3D")){
		this.id = id;
		this.name = name;
	}

	/**
		Get the name of the object3D
		@returns {string} name of the object3D
	*/
	getName(){
		return this.name;
	}	

	/**
		get the object3D id
		@returns {string} object3D id
	*/
	getId(){
		return this.id;
	}

}
export default Object3D;