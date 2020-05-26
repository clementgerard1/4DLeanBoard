import Utils from "./Utils.class.js";
import OperationUnit from "./OperationUnit.class.js";
import PlanningObject from "./interfaces/PlanningObject.class";


/**
 * @class Operation
 * @extends PlanningObject
 * @classdesc Operation object represents a operation of the lean board
 */
class Operation extends PlanningObject{

	/**
		Operation Constructor
		@param {string} [name=""] Name of operation.
		@param {uint} [duration=""] Duration of the operation.
		@param {int} [id=automaticaly generated] id of the operation
	*/
	constructor(name = "", duration = 1, id = Utils.getId("operation")){
		super(name, id);
		this.operationUnit = null;
		this.duration = duration;
	}

	/**
		Get the operation duration
		@returns {int} operation duration
	*/
	getDuration(){
		return this.duration
	}

	/**
		Get the operationUnit of the operation
		@returns {OperationUnit} operationUnit of the operation
	*/
	getOperationUnit(){
		return this.operationUnit
	}

	/**
		Set the OperationUnit of the operation
		@param {OperationUnit} operationUnit New operationUnit of the operation
	*/
	setOperationUnit(operationUnit){
		if(!(operationUnit instanceof OperationUnit)){
			console.error("setOperationUnit(operationUnit) need a OperationUnit object ; provided : " + operationUnit);
		}else{
			this.operationUnit = operationUnit;
		}
	}

	/**
		Add a following operation
		@param {Operation} operation operation to add to following operations collection
	*/
	addFollowingOperation(operation){
		super.addFollowing(operation, Operation);
	}

	/**
		Remove a following operation
		@param {Operation} operation Operation to remove of the following operation collection
	*/
	removeFollowingOperation(operation){
		super.removeFollowing(operation, Operation);
	}

	/**
		Get all followingOperations
		@returns {Array} Array of Operation
	*/
	getFollowingOperations(){
		return super.getFollowings();
	}

}
export default Operation;