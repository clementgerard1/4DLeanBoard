import Utils from "./Utils.class.js";
import OperationUnit from "./OperationUnit.class.js";


/**
 * @class Operation
 * @classdesc Operation object represents a operation of the lean board
 */
class Operation{

	/**
		Operation Constructor
		@param {string} [name=""] Name of operation.
		@param {uint} [duration=""] Duration of the operation.
		@param {int} [id=automaticaly generated] id of the operation
	*/
	constructor(name = "", duration = 1, id = Utils.getId("operation")){
		this.id = id;
		this.name = name;
		this.followingOperations = {};
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
		Get the id of the operation
		@returns {int} id of the operation
	*/
	getId(){
		return this.id;
	}

	/**
		Get the name of the operation
		@returns {string} name of the operation
	*/
	getName(){
		return this.name;
	}	
	/**
		Add a following operation
		@param {Operation} operation operation to add to following operations collection
	*/
	addFollowingOperation(operation){
		if(!(operation instanceof Operation)){
			console.error("addFollowingOperation(operation) need Operation Object ; prvovided : " + operation);
		}else{
			this.followingOperations[operation.id] = operation;
		}
	}

	/**
		Remove a following operation
		@param {Operation} operation Operation to remove of the following operation collection
	*/
	removeFollowingOperation(operation){
		if(!(operation instanceof Operation)){
			console.error("removeFollowingOperation(operation) : operation " + operation + " not of type Operation");
		}else if(!(Object.keys(this.followingOperations).includes("" + operation.id))){
			console.error("removeFollowingOperation(operation) : operation " + operation + " not in the collection");
		}else{
			delete this.followingOperations[operation.id];
		}
	}

	/**
		Get all followingOperations
		@returns {Array} Array of Operation
	*/
	getFollowingOperations(){
		return this.followingOperations;
	}

}
export default Operation;