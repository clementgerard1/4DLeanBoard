import Property from './interfaces/Property.class.js';

/**
 * @class State
 * @extends Property
 * @classdesc State represents states property used in Tasks
 */
class State extends Property{

	/**
		State Constructor
		@param {string} [value=""] Value of state.
		@param {string} [name=""] Name of state.
		@param {int} [id=automaticaly generated] id of the state property
	*/
	constructor(value = "" ,name = "", id){
		super(name, id);
		this.val = value;
	}

	/**
		Get the value of the state property
		@returns {string} value of the state property
	*/
	getValue(){
		return this.val;
	}

	/**
		Set the value of the state property
		@param {string} value of the state property
	*/
	setValue(value){
		if(typeof value == "string"){
			console.error("setValue(value) need a string ; provided : " + value);
		}else{
			this.val = value;
		}
	}

}
export default State;