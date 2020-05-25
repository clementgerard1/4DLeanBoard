import Utils from "../Utils.class.js";
/**
 * @class Team
 * @classdesc Team abstract object which represents a generic team
 */
class Team{

	/**
		Team Constructor - For Heritage => Don't instantiate it
		@param {string} name Name of team
		@param {int} id id of the team
	*/
	constructor(name, id){
		if(typeof id == "undefined"){
			id = Utils.getId("team");
		}
		this.id = id;
		this.name = name;
	}

	/**
		Get the id of the team
		@returns {int} id of the team
	*/
	getId(){
		return this.id;
	}

	/**
		Get the name of the team
		@returns {string} name of the team
	*/
	getName(){
		return this.name;
	}	

}
export default Team;