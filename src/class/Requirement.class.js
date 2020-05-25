import Property from './interfaces/Property.class.js';

/**
 * @class Requirement
 * @classdesc Requirement represents requirements used in Milestones
 */
class Requirement extends Property{

	/**
		Requirement Constructor
		@param {string} [name=""] Name of requirement.
		@param {int} [id=automaticaly generated] id of the requirement property
	*/
	constructor(name = "", id){
		super(name, id);
	}

}
export default Requirement;