import Utils from "./Utils.class.js";
import Phase from "./Phase.class.js";
import Requirement from "./Requirement.class.js";

/**
 * @class Milestone
 * @classdesc Milestone represents a milestone
 */
class Milestone{

	/**
		Milestone Constructor
		@param {string} [name=""] Name of milestone.
		@param {int} [id=automaticaly generated] id of the milestone
	*/
	constructor(name = "", id = Utils.getId("milestone")){
		this.id = id;
		this.name = name;
		this.phases = {};
		this.followingMilestones = [];
		this.requirements = [];
	}

	/**
		Add a requirement
		@param {Requirement} [requirement = new Requirement] Requirement to add to the collection
	*/
	addRequirement(requirement = new Requirement()){
		this.requirements[requirement.id] = requirement;
	}

	/**
		Remove a requirement
		@param {Requirement} requirement Requirement to remove
	*/
	removeRequirement(requirement){
		if(!(requirement instanceof Requirement)){
			console.error("removeRequirement(requirement) : requirement " + requirement + " not of type Requirement");
		}else if(!(Object.keys(this.requirements).includes("" + requirement.id))){
			console.error("removRequirement(requirement) : requirement " + requirement + " not in the collection");
		}else{
			delete this.requirements[requirement.id];
		}
	}

	/**
		Get all requirements
		@returns {Array} Array of Requirement
	*/
	getRequirements(){
		return this.requirements;
	}

	/**
		Add a phase
		@param {Phase} [phase = new Phase] Phase to add to the collection
	*/
	addPhase(phase = new Phase()){
		this.phases[phase.id] = phase;
	}

	/**
		Remove a phase
		@param {Phase} phase Phase to remove
	*/
	removePhase(phase){
		if(!(phase instanceof Phase)){
			console.error("removePhase(phase) : phase " + phase + " not of type Phase");
		}else if(!(Object.keys(this.phases).includes("" + phase.id))){
			console.error("removePhase(phase) : phase " + phase + " not in the collection");
		}else{
			delete this.phases[phase.id];
		}
	}

	/**
		Get all phases
		@returns {Array} Array of Phase
	*/
	getPhases(){
		return this.phases;
	}

	/**
		Get a phase
		@param {int} id idof the phase
		@returns {Phase} Phase corresponding
	*/
	getPhase(id){
		if(typeof this.phases[id] == "undefined"){
			console.error("getPhase(id) : id " + id + " unknowned on phases colleciton")
			return null;
		}else{
			return this.phases[id];
		}
	}

	/**
		Add a following milestone
		@param {Milestone} milestone milestone to add to following milestones collection
	*/
	addFollowingMilestone(milestone){
		if(!(milestone instanceof Milestone)){
			console.error("addFollowingMilestone(milestone) need Milestone Object ; prvovided : " + milestone);
		}else{
			this.followingMilestones[milestone.id] = milestone;
		}
	}

	/**
		Remove a following milestone
		@param {Milestone} milestone Milestone to remove of the following milestone collection
	*/
	removeFollowingMilestone(milestone){
		if(!(milestone instanceof Milestone)){
			console.error("removeFollowingMilestone(milestone) : milestone " + milestone + " not of type Milestone");
		}else if(!(Object.keys(this.followingMilestones).includes("" + milestone.id))){
			console.error("removeFollowingMilestone(milestone) : milestone " + milestone + " not in the collection");
		}else{
			delete this.followingMilestones[milestone.id];
		}
	}

	/**
		Get all followingMilestones
		@returns {Array} Array of Milestone
	*/
	getFollowingMilestones(){
		return this.followingMilestones;
	}

	/**
		Get the id of the milestone
		@returns {int} id of the milestone
	*/
	getId(){
		return this.id;
	}

	/**
		Get the name of the milestone
		@returns {string} name of the milestone
	*/
	getName(){
		return this.name;
	}	

}
export default Milestone;