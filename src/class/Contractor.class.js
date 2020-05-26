import Team from './interfaces/Team.class.js';
import TaskTeam from './TaskTeam.class.js';

/**
 * @class Contractor
 * @extends Team
 * @classdesc Contractor represents team  on Phase moment
 */
class Contractor extends Team{

	/**
		Contractor Constructor
		@param {string} [name=""] Name of contractor.
		@param {int} [id=automaticaly generated] id of the requirement contractor
	*/
	constructor(name = "", id){
		super(name, id);
		this.taskTeams = {};
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
			console.error("getTaskTeam(id) : id " + id + " unknowned on taskTeam collection")
			return null;
		}else{
			return this.taskTeams[id];
		}
	}

}
export default Contractor;