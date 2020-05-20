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
	addObject4D(object){
		this.objects[object.id] = object;
	}

	/**
		remove a 4DObject to the model
		@param {object4D} object Objet to remove.
	*/
	removeObject4D(object){
		delete this.objects[object.id];
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
	getTaskById(id){
		return this.tasks[id];
	}


	/**
		Add a Task to the model
		@param {Task} object Task to add.
	*/
	addTask(object){
		this.objects[object.id] = object;
	}

	/**
		remove a 4DObject to the model
		@param {object4D} object Task to remove.
	*/
	removeTask(object){
		delete this.objects[object.id];
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
		return this.tasks[id];
	}

}
module.exports = Model;