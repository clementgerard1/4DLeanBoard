import Team from './interfaces/Team.class.js';
import OperationUnit from './OperationUnit.class.js';

class TaskTeam extends Team{

	#operationUnits;
	#workers;
	#colorClass;

	/**
 		@class TaskTeam
 		@extends Team
 		@classdesc TaskTeam represents team  on Phase moment
 		
		@constructs

		@param {string} [name=""] Name of taskteam.
		@param {int} [id=automaticaly generated] id of the requirement taskteam
	*/
	constructor(name = "", id){
		super(name, id);
		this.#operationUnits = {};
		this.#workers = null;
		this.#colorClass = "defaultcolor";
	}

	/**
		Add a operationUnit
		@param {OperationUnit} [operationUnit = new OperationUnit] OperationUnit to add to the collection
	*/
	addOperationUnit(operationUnit = new OperationUnit()){
		this.#operationUnits[operationUnit.getId()] = operationUnit;
	}

	/**
		Remove a operationUnit
		@param {OperationUnit} operationUnit OperationUnit to remove
	*/
	removeOperationUnit(operationUnit){
		if(!(operationUnit instanceof OperationUnit)){
			console.error("removeOperationUnit(operationUnit) : operationUnit " + operationUnit + " not of type OperationUnit");
		}else if(!(Object.keys(this.#operationUnits).includes("" + operationUnit.getId()))){
			console.error("removeOperationUnit(operationUnit) : operationUnit " + operationUnit + " not in the collection");
		}else{
			delete this.#operationUnits[operationUnit.getId()];
		}
	}

	/**
		Get all operationUnits
		@returns {Array} Array of OperationUnit
	*/
	getOperationUnits(){
		return this.#operationUnits;
	}

	/**
		Get a operationUnit by id
		@param {int} id id of the operationUnit
		@returns {OperationUnit} OperationUnit corresponding
	*/
	getOperationUnit(id){
		if(typeof this.#operationUnits[id] == "undefined"){
			console.error("getOperationUnit(id) : id " + id + " unknowned on operationUnits collection")
			return null;
		}else{
			return this.#operationUnits[id];
		}
	}

	
	/**
		Set the number of worker of the task
		@param {int} nb
	*/
	setWorkers(nb){
		if(typeof nb != "number"){
			console.error("setWorkers(nb) need a number ; provided : " + nb);
		}else{
			this.#workers = nb;
		}
	}

	/**
		Get the number of workers
		@returns {int}
	*/
	getWorkers(){
		return this.#workers;
	}	

	setColorClass(colorClass){
		if(typeof colorClass == "undefined"){
			console.error("setColorClass : need a string ; provided : " + colorClass);
		}else{
			this.#colorClass = colorClass;
		}
	}

	/**
		Get the color class attribuate to this phase
		@returns {String} 
	*/
	getColorClass(){
		return this.#colorClass;
	}

}
export default TaskTeam;