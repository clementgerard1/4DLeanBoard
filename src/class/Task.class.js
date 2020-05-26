import Utils from "./Utils.class.js";
import Operation from './Operation.class.js';
import Object4D from './Object4D.class.js';
import TaskTeam from './TaskTeam.class.js';
import Property from './interfaces/Property.class.js';

/**
 * @class Task
 * @classdesc Task object represents a task of the lean board
 */
class Task{

	/**
		Task Constructor
		@param {string} [name=""] Name of task.
		@param {int} [id=automaticaly generated] id of the task
	*/
	constructor(name = "", id = Utils.getId("task")){
		this.id = id;
		this.name = name;
		this.followingTasks = {};
		this.operations = {};
		this.object4D = null;
		this.taskTeams = {};
		this.properties = {};
	}

	/**
		Get the id of the task
		@returns {int} id of the task
	*/
	getId(){
		return this.id;
	}

	/**
		Get the name of the task
		@returns {string} name of the task
	*/
	getName(){
		return this.name;
	}	

	/**
		Set the name of the task
		@param {string} name new name of the task
	*/
	setName(name){
		if(typeof name != "string"){
			console.error("setName(name) need a string ; provided : " + name);
		}else{
			this.name = name;
		}
	}	

	/**
		Add a following task
		@param {Task} task task to add to following tasks collection
	*/
	addFollowingTask(task){
		if(!(task instanceof Task)){
			console.error("addFollowingTask(task) need Task Object ; prvovided : " + task);
		}else{
			this.followingTasks[task.id] = task;
		}
	}

	/**
		Remove a following task
		@param {Task} task Task to remove of the following task collection
	*/
	removeFollowingTask(task){
		if(!(task instanceof Task)){
			console.error("removeFollowingTask(task) : task " + task + " not of type Task");
		}else if(!(Object.keys(this.followingTasks).includes("" + task.id))){
			console.error("removeFollowingTask(task) : task " + task + " not in the collection");
		}else{
			delete this.followingTasks[task.id];
		}
	}

	/**
		Get all followingTasks
		@returns {Array} Array of Task
	*/
	getFollowingTasks(){
		return this.followingTasks;
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
		Add a property
		@param {Property} [property = new Property] Property to add to the collection
	*/
	addProperty(property = new Property()){
		this.properties[property.id] = property;
	}

	/**
		Remove a property
		@param {Property} property Property to remove
	*/
	removeProperty(property){
		if(!(property instanceof Property)){
			console.error("removeProperty(property) : property " + property + " not of type Property");
		}else if(!(Object.keys(this.properties).includes("" + property.id))){
			console.error("removeProperty(property) : property " + property + " not in the collection");
		}else{
			delete this.properties[property.id];
		}
	}

	/**
		Get all properties
		@returns {Array} Array of Property
	*/
	getProperties(){
		return this.properties;
	}

	/**
		Get a property
		@param {int} id idof the property
		@returns {Property} Property corresponding
	*/
	getProperty(id){
		if(typeof this.properties[id] == "undefined"){
			console.error("getProperty(id) : id " + id + " unknowned on properties colleciton")
			return null;
		}else{
			return this.properties[id];
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
			console.log("delete");
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

}
export default Task;