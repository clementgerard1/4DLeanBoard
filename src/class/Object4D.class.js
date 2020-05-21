/**
 * @class Object4D 
 * @classdesc Object4D
 */
class Object4D{

	/**
		Object4D Constructor
		@param {string} id object4Did.
		@param {string} IFCFile IFC file as string
	*/
	constructor(id, IFCFile){
		this.id = id;
	}

	/**
		get the object4D id
		@returns {string} object4D id
	*/
	getID(){
		return this.id;
	}

}
export default Object4D;