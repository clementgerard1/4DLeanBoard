import Property from './interfaces/Property.class.js';

/**
 * @class ConstructionType
 * @extends Property
 * @classdesc ConstructionType represents constructionTypes property used in Tasks
 */
class ConstructionType extends Property{

	/**
		ConstructionType Constructor
		@param {string} [value=""] Value of constructionType.
		@param {string} [name=""] Name of constructionType.
		@param {int} [id=automaticaly generated] id of the constructionType property
	*/
	constructor(value = "" ,name = "", id){
		super(name, id);
		this.val = value;
	}

	/**
		Get the value of the constructionType property
		@returns {string} value of the constructionType property
	*/
	getValue(){
		return this.val;
	}

	/**
		Set the value of the constructionType property
		@param {string} value of the constructionType property
	*/
	setValue(value){
		if(typeof value == "string"){
			console.error("setValue(value) need a string ; provided : " + value);
		}else{
			this.val = value;
		}
	}

}
export default ConstructionType;