import Utils from "./Utils.class.js";
import Operation from './Operation.class.js';
import Phase from './Phase.class.js';
import Object4D from './Object4D.class.js';
import TaskTeam from './TaskTeam.class.js';
import Property from './interfaces/Property.class.js';
import Requirement from './Requirement.class.js';
import Zone from './Zone.class.js';
import Person from './Person.class.js';
import State from './State.class.js';
import ConstructionType from './ConstructionType.class.js';
import PlanningObject from "./interfaces/PlanningObject.class";

class Task extends PlanningObject{

	#operations;
	#object4D;
	#taskTeam;
	#parentPhase;
	#paused;
	#done;
	#go;
	#colorClass;
	#description;
	#workers;
	#persons;

	/**
 		@class Task
 		@extends PlanningObject
 		@classdesc Task object represents a task of the lean board

		@constructs

		@param {string} [name=""] Name of task.
		@param {int} [id=automaticaly generated] id of the task
	*/
	constructor(name = "", id = Utils.getId("task")){
		super(name, id);
		this.#operations = {};
		this.#object4D = null;
		this.#taskTeam = null;
		this.#parentPhase = null;
		this.#paused = false;
		this.#done = false;
		this.#go = false;
		this.#colorClass = "defaultcolor";
		this.#description = "";
		this.#workers = null;
		this.#persons = {};
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
		Add a previous task
		@param {Task} task task to add to previous tasks collection
	*/
	addPreviousTask(task){
		super.addPrevious(task, Task);
	}

	/**
		Remove a previous task
		@param {Task} task Task to remove of the previous task collection
	*/
	removePreviousTask(task){
		super.removePrevious(task, Task);
	}

	/**
		Get all previousTasks
		@returns {Array} Array of Task
	*/
	getPreviousTasks(){
		return super.getPrevious();
	}



	/**
		Add a operation
		@param {Operation} [operation = new Operation] Operation to add to the collection
	*/
	addOperation(operation = new Operation()){
		this.#operations[operation.getId()] = operation;
	}

	/**
		Remove a operation
		@param {Operation} operation Operation to remove
	*/
	removeOperation(operation){
		if(!(operation instanceof Operation)){
			console.error("removeOperation(operation) : operation " + operation + " not of type Operation");
		}else if(!(Object.keys(this.#operations).includes("" + operation.getId()))){
			console.error("removeOperation(operation) : operation " + operation + " not in the collection");
		}else{
			delete this.#operations[operation.getId()];
		}
	}

	/**
		Get all operations
		@returns {Array} Array of Operation
	*/
	getOperations(){
		return this.#operations;
	}

	/**
		Get a operation by id
		@param {int} id id of the operation
		@returns {Operation} Operation corresponding
	*/
	getOperation(id){
		if(typeof this.#operations[id] == "undefined"){
			console.error("getOperation(id) : id " + id + " unknowned on operations collection")
			return null;
		}else{
			return this.#operations[id];
		}
	}

	/**
		Get the object4D of the task
		@returns {Object4D} object4D of the task
	*/
	getObject4D(){
		return this.#object4D;
	}

	/**
		Set the Object4D of the task
		@param {Object4D} object4D New object4D of the task
	*/
	setObject4D(object4D){
		if(!(object4D instanceof Object4D)){
			console.error("setObject4D(Object4D) need a Object4D object ; provided : " + object4D);
		}else{
			this.#object4D = object4D;
		}
	}

	/**
		Set the taskTeam
		@param {TaskTeam} [taskTeam = new TaskTeam] taskTeam
	*/
	setTaskTeam(taskTeam = new TaskTeam()){
		if(!(taskTeam instanceof TaskTeam)){
			console.error("setTaskTeam(taskTeam) : taskTeam " + taskTeam + " not of type TaskTeam");
		}else{
			this.#taskTeam = taskTeam;
		}
	}

	/**
		Set the state from a string
		@param {String} str
	*/
	setStateFromString(str){
		if(str == "Not Ready"){

		}else if(str == "Ready"){

		}else if(str == "Done"){
			this.setDone(true);
		}else if(str == "Go"){
			this.setGo(true);
		}else if(str == "Pause"){
			this.setPaused(true);
		}
	}

	/**
		Get the taskTeam
		@returns {Array} Array of TaskTeam
	*/
	getTaskTeam(){
		return this.#taskTeam;
	}

	/**
		Set the description
		@param {String} description
	*/
	setDescription(description){
		this.#description = description;
	}

	/**
		Get the description
		@returns {String}
	*/
	getDescription(){
		return this.#description;
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
		Get a requierement of the task
		@param {string} name 
		@returns {Requirement} 
	*/
	getRequirement(name){
		return super.getPropertyByName(name);
	}

	/**
		Get a requierement of the task by id
		@param {uint} id 
		@returns {Requirement}
	*/
	getRequirementById(id){
		return super.getProperty(id);
	}

	/**
		Add a requirement to the task
		@param {string} name Name of Requirement 
		@param {Requirement} requirement
	*/
	addRequirement(name, requirement){
		super.addProperty(requirement, name);
	}

	/**
		Set the parentPhase of the task
		@param {Phase} phase
	*/
	setParentPhase(phase){
		if(phase != null && !(phase instanceof Phase)){
			console.error("setParentPhase(phase) need a Phase object ; provided : " + phase);
		}else{
			this.#parentPhase = phase;
		}
	}

	/**
		Get the parent phase of the task
		@returns {Phase}
	*/
	getParentPhase(){
		return this.#parentPhase;
	}

	/** verify if all requirements are true
		@returns {bool}
	*/
	isReady(){
		if(!this.getRequirement("constraint").getValue()) return false;
		if(!this.getRequirement("information").getValue()) return false;
		if(!this.getRequirement("manpower").getValue()) return false;
		if(!this.getRequirement("space").getValue()) return false;
		if(!this.getRequirement("safety").getValue()) return false;
		if(!this.getRequirement("materials").getValue()) return false;
		if(!this.getRequirement("equipement").getValue()) return false;
		return true;
	}

	/** set the done state of the task
		@param {bool}
	*/
	setDone(bool){
		if(typeof bool != "undefined"){
			this.#done = bool;
		}
	}

	/** set the go state of the task
		@param {bool}
	*/
	setGo(bool){
		if(typeof bool != "undefined"){
			this.#go = bool;
		}
	}

	/** set the paused state of the task
		@param {bool}
	*/
	setPaused(bool){
		if(typeof bool != "undefined"){
			this.#paused = bool;
		}
	}

	/** verify if task is done
		@returns {bool}
	*/
	isDone(){
		return this.#done;
	}

	/** verify if task is go
		@returns {bool}
	*/
	isGo(){
		return this.#go;
	}

	/** verify if task is paused
		@returns {bool}
	*/
	isPaused(){
		return this.#paused;
	}

	/**
		Set the colorClass of the task
		@params {int} num
	*/
	setColorClass(colorClass){
		if(typeof colorClass == "undefined"){
			console.error("setColorClass : need a string ; provided : " + colorClass);
		}else{
			this.#colorClass = colorClass;
		}
	}

	/**
		Get the color class attribuate to this task
		@returns {String} 
	*/
	getColorClass(){
		return this.#colorClass;
	}

	setWorkers(n){
		this.#workers = n;
	}

	getWorkers(){
		return this.#workers;
	}

	/**
		Add a person
		@param {Person} person Person to add to the collection
	*/
	addPerson(person){
		this.#persons[person.getId()] = person;
	}

	/**
		Remove a person
		@param {Person} person Person to remove
	*/
	removePerson(person){
		if(!(person instanceof Person)){
			console.error("removePerson(person) : person " + person + " not of type Person");
		}else if(!(Object.keys(this.#persons).includes("" + person.getId()))){
			console.error("removePerson(person) : person " + person + " not in the collection");
		}else{
			delete this.#persons[person.getId()];
		}
	}

	/**
		Get all persons
		@returns {Array} Array of Person
	*/
	getPersons(){
		return this.#persons;
	}

	clone(){
		const task = new Task(this.getName(), this.getId());
		task.setWorkers(this.#workers);
		task.setColorClass(this.#colorClass);
		task.setGo(this.#go);
		task.setDone(this.#done);
		task.setPaused(this.#paused);
		task.setDescription(this.#description);
		task.setStartDate(this.getStartDate());
		task.setEndDate(this.getEndDate());

		const properties = this.getProperties();
		for(let p in properties){
			task.addProperty(properties[p], properties[p].getName());
		}

		//Not cloned
		task.setTaskTeam(this.#taskTeam);
		for(let o in this.#operations){
			task.addOperation(this.#operations[o]);
		}
		task.setObject4D(this.#object4D);
		for(let p in this.#persons){
			task.addPerson(this.#persons[p]);
		}

		return task;

	}


}
export default Task;