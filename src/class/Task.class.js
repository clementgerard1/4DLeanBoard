import Utils from "./Utils.class.js";
import Operation from './Operation.class.js';
import Object4D from './Object4D.class.js';
import TaskTeam from './TaskTeam.class.js';
import Property from './interfaces/Property.class.js';
import Requirement from './Requirement.class.js';
import Zone from './Zone.class.js';
import State from './State.class.js';
import ConstructionType from './ConstructionType.class.js';
import PlanningObject from "./interfaces/PlanningObject.class";

/**
 * @class Task
 * @extends PlanningObject
 * @classdesc Task object represents a task of the lean board
 */
class Task extends PlanningObject{

	/**
		Task Constructor
		@param {string} [name=""] Name of task.
		@param {int} [id=automaticaly generated] id of the task
	*/
	constructor(name = "", id = Utils.getId("task")){
		super(name, id);
		this.operations = {};
		this.object4D = null;
		this.taskTeams = {};

		//LPS Requirement
		for(let i = 1 ; i <= 7 ; i++){
			super.addProperty(new Requirement(), "LPSRequirement" + i);
		}

	}

	/**
		Add a following task
		@param {Task} task task to add to following tasks collection
	*/
	addFollowingTask(task){
		super.addFollowing(task, Task);
	}

	/**
		Remove a following task
		@param {Task} task Task to remove of the following task collection
	*/
	removeFollowingTask(task){
		super.removeFollowing(task, Task);
	}

	/**
		Get all followingTasks
		@returns {Array} Array of Task
	*/
	getFollowingTasks(){
		return super.getFollowings();
	}

	/**
		Add a operation
		@param {Operation} [operation = new Operation] Operation to add to the collection
	*/
	addOperation(operation = new Operation()){
		this.operations[operation.id] = operation;
	}

	/**
		Remove a operation
		@param {Operation} operation Operation to remove
	*/
	removeOperation(operation){
		if(!(operation instanceof Operation)){
			console.error("removeOperation(operation) : operation " + operation + " not of type Operation");
		}else if(!(Object.keys(this.operations).includes("" + operation.id))){
			console.error("removeOperation(operation) : operation " + operation + " not in the collection");
		}else{
			delete this.operations[operation.id];
		}
	}

	/**
		Get all operations
		@returns {Array} Array of Operation
	*/
	getOperations(){
		return this.operations;
	}

	/**
		Get a operation by id
		@param {int} id id of the operation
		@returns {Operation} Operation corresponding
	*/
	getOperation(id){
		if(typeof this.operations[id] == "undefined"){
			console.error("getOperation(id) : id " + id + " unknowned on operations collection")
			return null;
		}else{
			return this.operations[id];
		}
	}

	/**
		Get the object4D of the task
		@returns {Object4D} object4D of the task
	*/
	getObject4D(){
		return this.object4D;
	}

	/**
		Set the Object4D of the task
		@param {Object4D} object4D New object4D of the task
	*/
	setObject4D(object4D){
		if(!(object4D instanceof Object4D)){
			console.error("setTaskTeam(taskTeam) need a Object4D object ; provided : " + object4D);
		}else{
			this.object4D = object4D;
		}
	}

	/**
		Add a taskTeam
		@param {TaskTeam} [taskTeam = new TaskTeam] TaskTeam to add to the collection
	*/
	addTaskTeam(taskTeam = new TaskTeam()){
		this.taskTeams[taskTeam.id] = taskTeam;
	}

	/**
		Remove a taskTeam
		@param {TaskTeam} taskTeam TaskTeam to remove
	*/
	removeTaskTeam(taskTeam){
		if(!(taskTeam instanceof TaskTeam)){
			console.error("removeTaskTeam(taskTeam) : taskTeam " + taskTeam + " not of type TaskTeam");
		}else if(!(Object.keys(this.taskTeams).includes("" + taskTeam.id))){
			console.error("removeTaskTeam(taskTeam) : taskTeam " + taskTeam + " not in the collection");
		}else{
			delete this.taskTeams[taskTeam.id];
		}
	}

	/**
		Get all taskTeams
		@returns {Array} Array of TaskTeam
	*/
	getTaskTeams(){
		return this.taskTeams;
	}

	/**
		Get a taskTeam by id
		@param {int} id id of the taskTeam
		@returns {TaskTeam} TaskTeam corresponding
	*/
	getTaskTeam(id){
		if(typeof this.taskTeams[id] == "undefined"){
			console.error("getTaskTeam(id) : id " + id + " unknowned on taskTeams collection")
			return null;
		}else{
			return this.taskTeams[id];
		}
	}

	/**
		Get duration of the task
		@returns {int} duration
	*/
	getDuration(){
		return this.operations[Object.keys(this.operations)[0]].getDuration();
	}

	/**
		Get the zone of the task
		@returns {Zone} zone of the task
	*/
	getZone(){
		return super.getPropertyByName("zone");
	}

	/**
		Set the Zone of the task
		@param {Zone} zone New zone of the task
	*/
	setZone(zone){
		if(!(zone instanceof Zone)){
			console.error("setZone(zone) need a Zone object ; provided : " + zone);
		}else{
			super.addProperty(zone, "zone");
		}
	}

	/**
		Get the state of the task
		@returns {State} zone of the task
	*/
	getState(){
		return super.getPropertyByName("state");
	}

	/**
		Set the State of the task
		@param {State} state New state of the task
	*/
	setState(state){
		if(!(state instanceof State)){
			console.error("setState(state) need a State object ; provided : " + state);
		}else{
			super.addProperty(state, "state");
		}
	}

	/**
		Get the constructionType of the task
		@returns {ConstructionType} constructionType of the task
	*/
	getConstructionType(){
		return super.getPropertyByName("constructionType");
	}

	/**
		Set the ConstructionType of the task
		@param {ConstructionType} constructionType New constructionType of the task
	*/
	setConstructionType(constructionType){
		if(!(constructionType instanceof ConstructionType)){
			console.error("setConstructionType(constructionType) need a ConstructionType object ; provided : " + constructionType);
		}else{
			super.addProperty(constructionType, "constructionType");
		}
	}

	/**
		Get a LPSrequierement of the task
		@param {int} numero Numero of LPSRequirement 
		@returns {ConstructionType} constructionType of the task
	*/
	getLPSRequirement(i){
		return super.getPropertyByName("LPSRequirement" + (i+1));
	}

}
export default Task;