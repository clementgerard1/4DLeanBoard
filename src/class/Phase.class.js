import Utils from "./Utils.class.js";
import Object4D from "./Object4D.class.js";
import Task from "./Task.class.js";
import Delivrable from "./Delivrable.class.js";
import Contractor from "./Contractor.class.js";
import PlanningObject from "./interfaces/PlanningObject.class";

class Phase extends PlanningObject{

	#tasks;
	#objects4D;
	#delivrables;
	#contractor;
	#colorClass;
	#requirementsString;
	#num;
	#parent;
	/**
 		@class Phase
 		@extends PlanningObject
 		@classdesc Phase object represents a phase of the lean board

		@constructs 

		@param {string} [name=""] Name of phase.
		@param {int} [id=automaticaly generated] id of the phase
	*/
	constructor(name = "", id = Utils.getId("phase")){
		super(name, id);
		this.#tasks = {};
		this.#objects4D = {};
		this.#delivrables = {};
		this.#contractor = null;
		this.#colorClass = "defaultcolor";
		this.#num = null;
		this.#requirementsString ="";
		this.#parent = null;
	}

	/**
		Get the contractor of the phase
		@returns {Contractor} contractor of the phase
	*/
	getContractor(){
		return this.#contractor
	}

	/**
		Set the Contractor of the phase
		@param {Contractor} contractor New contractor of the phase
	*/
	setContractor(contractor){
		if(!(contractor instanceof Contractor)){
			console.error("setContractor(contractor) need a Contractor object ; provided : " + contractor);
		}else{
			this.#contractor = contractor;
		}
	}

	/**
		Add a object4D
		@param {Object4D} [object4D = new Object4D] Object4D to add to the collection
	*/
	addObject4D(object4D = new Object4D()){
		this.#objects4D[object4D.getId()] = object4D;
	}

	/**
		Remove a object4D
		@param {Object4D} object4D Object4D to remove
	*/
	removeObject4D(object4D){
		if(!(object4D instanceof Object4D)){
			console.error("removeObject4D(object4D) : object4D " + object4D + " not of type Object4D");
		}else if(!(Object.keys(this.#objects4D).includes("" + object4D.getId()))){
			console.error("removeObject4D(object4D) : object4D " + object4D + " not in the collection");
		}else{
			delete this.#objects4D[object4D.getId()];
		}
	}

	/**
		Get all objects4D
		@returns {Array} Array of Object4D
	*/
	getObjects4D(){
		return this.#objects4D;
	}

	/**
		Get a object4D by id
		@param {int} id id of the object4D
		@returns {Object4D} Object4D corresponding
	*/
	getObject4D(id){
		if(typeof this.#objects4D[id] == "undefined"){
			console.error("getObject4D(id) : id " + id + " unknowned in objects4D collection")
			return null;
		}else{
			return this.#objects4D[id];
		}
	}

	/**
		Add a task
		@param {Task} [task = new Task] Task to add to the collection
	*/
	addTask(task = new Task()){
		this.#tasks[task.getId()] = task;
		task.setParentPhase(this);
	}

	/**
		Remove a task
		@param {Task} task Task to remove
	*/
	removeTask(task){
		if(!(task instanceof Task)){
			console.error("removeTask(task) : task " + task + " not of type Task");
		}else if(!(Object.keys(this.#tasks).includes("" + task.getId()))){
			console.error("removeTask(task) : phase " + task + " not in the collection");
		}else{
			task.setParentPhase(null);
			delete this.#tasks[task.getId()];
		}
	}

	/**
		Get all tasks
		@returns {Array} Array of Task
	*/
	getTasks(){
		return this.#tasks;
	}

	/**
		Get a task by id
		@param {int} id id of the task
		@returns {Task} Task corresponding
	*/
	getTask(id){
		if(typeof this.#tasks[id] == "undefined"){
			console.error("getTask(id) : id " + id + " unknowned on tasks colleciton")
			return null;
		}else{
			return this.#tasks[id];
		}
	}

	/**
		Add a delivrable
		@param {Delivrable} [delivrable = new Delivrable] Delivrable to add to the collection
	*/
	addDelivrable(delivrable = new Delivrable()){
		this.#delivrables[delivrable.getId()] = delivrable;
	}

	/**
		Remove a delivrable
		@param {Delivrable} delivrable Delivrable to remove
	*/
	removeDelivrable(delivrable){
		if(!(delivrable instanceof Delivrable)){
			console.error("removeDelivrable(delivrable) : delivrable " + delivrable + " not of type Delivrable");
		}else if(!(Object.keys(this.#delivrables).includes("" + delivrable.getId()))){
			console.error("removeDelivrable(delivrable) : delivrable " + delivrable + " not in the collection");
		}else{
			delete this.#delivrables[delivrable.getId()];
		}
	}

	/**
		Get all #delivrables
		@returns {Array} Array of Delivrable
	*/
	getDelivrables(){
		return this.#delivrables;
	}

	/**
		Get a delivrable by id
		@param {int} id id of the delivrable
		@returns {Delivrable} Delivrable corresponding
	*/
	getDelivrable(id){
		if(typeof this.#delivrables[id] == "undefined"){
			console.error("getDelivrable(id) : id " + id + " unknowned on tasks colleciton")
			return null;
		}else{
			return this.#delivrables[id];
		}
	}

	/**
		Add a following phase
		@param {Phase} phase phase to add to following phases collection
	*/
	addFollowingPhase(phase){
		super.addFollowing(phase, Phase);
	}

	/**
		Remove a following phase
		@param {Phase} phase Phase to remove of the following phase collection
	*/
	removeFollowingPhase(phase){
		super.removeFollowing(phase, Phase);
	}

	/**
		Get all followingPhases
		@returns {Array} Array of Phase
	*/
	getFollowingPhases(){
		return super.getFollowings();
	}

	/**
		Add a previous phase
		@param {Phase} phase phase to add to previous phases collection
	*/
	addPreviousPhase(phase){
		super.addPrevious(phase, Phase);
	}

	/**
		Remove a previous phase
		@param {Phase} phase Phase to remove of the previous phase collection
	*/
	removePreviousPhase(phase){
		super.removePrevious(phase, Phase);
	}

	/**
		Get all previousPhases
		@returns {Array} Array of Phase
	*/
	getPreviousPhases(){
		return super.getPrevious();
	}

	/**
		Get all taskTeams of the phase
		@returns {Array} Array of TaskTeams
	*/
	getTaskTeams(){
		const toReturn = [];
		for( let t in this.#tasks){
			const taskTeam = this.#tasks[t].getTaskTeam();
			if(!toReturn.includes(taskTeam)) toReturn[toReturn.length] = taskTeam;
		}
		return toReturn;
	}

	/**
		Set the numero of the phase
		@params {int} num
	*/
	setNum(num){
		if(typeof num == "undefined"){
			console.error("setColorClass : need a string ; provided : " + num);
		}else{
			this.#num = num;
		}
	}

	/**
		Get the numero of the phase
		@returns {int} 
	*/
	getNum(){
		return this.#num;
	}

	/*
		get a 3D object which is included in the phase by its id
		@param {String} id id (guid) of the object3D
		@returns {Object3D}
	*/
	get3DObjectById(id){
		const objects4D = this.getObjects4D();
		for(let o in objects4D){
			const result = objects4D[o].getObject3D(id);
			if(result != null){
				return result;
			}
		}
		return null;
	}

	/*
		get a 3D object which is included in the phase by its id
		@param {String} id id (guid) of the object3D
		@returns {Object3D}
	*/
	get4DObjectById(id){
		const objects4D = this.getObjects4D();
		for(let o in objects4D){
			if(objects4D[o].getId() == id) return objects4D[o];
		}
		return null;
	}

	/*
		get a collection of task corresponding to a taskTeam
		@param {TaskTeam} team
		@returns {Array} Array of Task
	*/
	getTasksByTaskTeam(team){
		const toReturn = [];
		for(let t in this.#tasks){
			if(this.#tasks[t].getTaskTeam() == team) toReturn.push(this.#tasks[t]);
		}
		return toReturn;
	}

	/**
		Set the colorClass of the phase - OLD 
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
		Get the color class attribuate to this phase - OLD 
		@returns {String} 
	*/
	getColorClass(){
		return this.#colorClass;
	}

	setRequirementsString(str){
		this.#requirementsString = str;
	}

	getRequirementsString(){
		return this.#requirementsString;
	}

	clone(){
		const phase = new Phase(this.getName(), this.getId());
		phase.setStartDate(this.getStartDate());
		phase.setEndDate(this.getEndDate());
		phase.setColorClass(this.#colorClass);
		phase.setNum(this.#num);
		phase.setRequirementsString(this.#requirementsString);
		for(let t in this.#tasks){
			const task = this.#tasks[t].clone();
			phase.addTask(task);
			task.setParentPhase(phase);
		}
		const tasks = phase.getTasks();
		for(let t in tasks){
			phase.addObject4D(tasks[t].getObject4D());
		}

		for(let t in this.#tasks){

			const followings = this.#tasks[t].getFollowingTasks();
			for(let f in followings){
				phase.getTask(this.#tasks[t].getId()).addFollowingTask(phase.getTask(followings[f].getId()));
			}
			const previous = this.#tasks[t].getPreviousTasks();
			for(let pp in previous){
				phase.getTask(this.#tasks[t].getId()).addPreviousTask(phase.getTask(previous[pp].getId()));
			}

		}

		const properties = this.getProperties();
		for(let pp in properties){
			phase.addProperty(properties[pp]);
		}

		//Not cloned
		phase.setContractor(this.#contractor);
		for(let d in this.#delivrables){
			phase.addDelivrable(this.#delivrables[d]);
		}

		return phase;
	}

	setParent(milestone){
		this.#parent = milestone;
	}

	getParent(){
		return this.#parent;
	}

}
export default Phase;