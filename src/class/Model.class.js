import Object4D from "./Object4D.class.js";
import Task from "./Task.class.js";

/**
 * @class Model
 * @classdesc Model represents the root container
 */
class Model{

	/**
		Model Constructor
		@param {string} name Name of model.
	*/
	constructor(name){
		this.name = name;
		this.objects = {};
	}

	/**
		Add a 4DObject to the model
		@param {object4D} object Object to add.
	*/
	addObject4D(object = null){
		if(object == null || !(object instanceof Object4D)){
			console.error("addObject4D need an object4D to add; provided : " + object);
		}else{
			this.objects[object.id] = object;
		}
	}

	/**
		remove a 4DObject to the model
		@param {object4D} object Objet to remove.
	*/
	removeObject4D(object = null){
		if(object == null || !(object instanceof Object4D) || typeof this.objects[object.id] == "undefined"){
			console.error("Object doesn't exist on collection");
		}else{
			delete this.objects[object.id];
		}
	}

	/**
		get the collection of Object4D in the model
		@returns {Array} Array of Object4D
	*/
	getObjects4D(){
		return this.objects;
	}

	/**
		get object4D by its id
		@param {string} id id of the object.
		@returns {Object4D} Object4D correponding
	*/
	getObject4DById(id = null){
		if(id == null || typeof this.objects[id] == "undefined"){
			console.error("Object4D with id " + id + "doesn't exist on collection");
			return null;
		}else{
			return this.objects[id];
		}
	}


	/**
		Add a Task to the model
		@param {Task} object Task to add.
	*/
	addTask(task = null){
		if(task == null || !(task instanceof Task)){
			console.error("addTask need a task to add; provided :" + task);
		}else{
			this.tasks[task.id] = task;
		}
	}

	/**
		remove a 4DObject to the model
		@param {object4D} object Task to remove.
	*/
	removeTask(task = null){
		if(task == null || typeof this.tasks[task.id] == "undefined" || !(task instanceof Task)){
			console.error("Task doesn't exist on collection");
		}else{
			delete this.tasks[task.id];
		}
	}

	/**
		get the collection of Tasks in the model
		@returns {Array} Array of Task
	*/
	getTasks(){
		return this.objects;
	}

	/**
		get task by its id
		@param {string} id id of the Task.
		@returns {Task} Task correponding
	*/
	getTaskById(id){
		if(id == null || typeof this.tasks[id] == "undefined"){
			console.error("Task with id " + id + "doesn't exist on collection");
			return null;
		}else{
			return this.tasks[id];
		}
	}

}
export default Model;