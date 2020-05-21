/**
 * @class Task
 * @classdesc Task object represents a task of the lean board
 */
class Task{

	/**
		Task Constructor
		@param {string} id id of Task.
		@param {Date} start Date of Start.
		@param {Date} end Date of End.
		@param {Array} [name] parents Task Array.
	*/
	constructor(id, start, end, parents){
		this.start = start;
		this.end = end;
		this.duration = start - end;
		this.name = id;
		this.id = id;
		if(typeof parents != "undefined"){
			for(let p in parents){
				this.parents[parents[p].id] = parents[p];
			}
		}else{
			this.parents = {};
		}
	}

	/**
		set the task name
		@param {string} name new name.
	 */
	setName(name = ""){
		this.name = name;
	}

	/**
		get the task name
		@returns {string} task name
	*/
	getName(){
		return this.name;
	}

	/**
		add parent Task
		@param {Task} parent parent Task.
	 */
	addParent(parent = null){
		if(parent == null || !(parent instanceof Task)){
			console.error("addParent nedd a TaskObject ; provided : " + parent);
		}else{
			this.parents[parent.id] = parent;
		}
	}

	/**
		get the collection of parent Tasks
		@returns {Array} Array of Task
	*/
	getParents(){
		return this.parents;
	}

	/**
		get the task id
		@returns {string} task id
	*/
	getID(){
		return this.id;
	}

}
export default Task;