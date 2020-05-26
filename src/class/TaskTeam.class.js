import Team from './interfaces/Team.class.js';
import OperationUnit from './OperationUnit.class.js';

/**
 * @class TaskTeam
 * @extends Team
 * @classdesc TaskTeam represents team  on Phase moment
 */
class TaskTeam extends Team{

	/**
		TaskTeam Constructor
		@param {string} [name=""] Name of taskteam.
		@param {int} [id=automaticaly generated] id of the requirement taskteam
	*/
	constructor(name = "", id){
		super(name, id);
		this.operationUnits = {};
	}

	/**
		Add a operationUnit
		@param {OperationUnit} [operationUnit = new OperationUnit] OperationUnit to add to the collection
	*/
	addOperationUnit(operationUnit = new OperationUnit()){
		this.operationUnits[operationUnit.id] = operationUnit;
	}

	/**
		Remove a operationUnit
		@param {OperationUnit} operationUnit OperationUnit to remove
	*/
	removeOperationUnit(operationUnit){
		if(!(operationUnit instanceof OperationUnit)){
			console.error("removeOperationUnit(operationUnit) : operationUnit " + operationUnit + " not of type OperationUnit");
		}else if(!(Object.keys(this.operationUnits).includes("" + operationUnit.id))){
			console.error("removeOperationUnit(operationUnit) : operationUnit " + operationUnit + " not in the collection");
		}else{
			delete this.operationUnits[operationUnit.id];
		}
	}

	/**
		Get all operationUnits
		@returns {Array} Array of OperationUnit
	*/
	getOperationUnits(){
		return this.operationUnits;
	}

	/**
		Get a operationUnit by id
		@param {int} id id of the operationUnit
		@returns {OperationUnit} OperationUnit corresponding
	*/
	getOperationUnit(id){
		if(typeof this.operationUnits[id] == "undefined"){
			console.error("getOperationUnit(id) : id " + id + " unknowned on operationUnits collection")
			return null;
		}else{
			return this.operationUnits[id];
		}
	}

}
export default TaskTeam;