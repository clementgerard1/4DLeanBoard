import Team from './interfaces/Team.class.js';

class OperationUnit extends Team{

	/**
 		@class OperationUnit
 		@extends Team
 		@classdesc OperationUnit represents team  on Phase moment

		@constructs

		@param {string} [name=""] Name of operationUnit.
		@param {int} [id=automaticaly generated] id of the requirement operationUnit
	*/
	constructor(name = "", id){
		super(name, id);
	}

}
export default OperationUnit;