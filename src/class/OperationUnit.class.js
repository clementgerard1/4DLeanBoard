import Team from './interfaces/Team.class.js';

/**
 * @class OperationUnit
 * @classdesc OperationUnit represents team  on Phase moment
 */
class OperationUnit extends Team{

	/**
		OperationUnit Constructor
		@param {string} [name=""] Name of operationUnit.
		@param {int} [id=automaticaly generated] id of the requirement operationUnit
	*/
	constructor(name = "", id){
		super(name, id);
	}

}
export default OperationUnit;