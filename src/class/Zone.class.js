import Property from './interfaces/Property.class.js';

/**
 * @class Zone
 * @classdesc Zone represents zones property used in Tasks
 */
class Zone extends Property{

	/**
		Zone Constructor
		@param {string} [value=""] Value of zone.
		@param {string} [name=""] Name of zone.
		@param {int} [id=automaticaly generated] id of the zone property
	*/
	constructor(value = "" ,name = "", id){
		super(name, id);
		this.val = value;
	}

	/**
		Get the value of the zone property
		@returns {string} value of the zone property
	*/
	getValue(){
		return this.val;
	}

	/**
		Set the value of the zone property
		@param {string} value of the zone property
	*/
	setValue(value){
		if(typeof value == "string"){
			console.error("setValue(value) need a string ; provided : " + value);
		}else{
			this.val = value;
		}
	}

}
export default Zone;