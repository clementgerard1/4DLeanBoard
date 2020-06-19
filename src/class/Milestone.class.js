import Utils from "./Utils.class.js";
import Phase from "./Phase.class.js";
import Requirement from "./Requirement.class.js";
import PlanningObject from "./interfaces/PlanningObject.class";

class Milestone extends PlanningObject{

	#phases;
	#event;

	/**
		
		@class Milestone
		@extends PlanningObject
		@classdesc Milestone represents a milestone

 		@constructs 

		@param {string} [name=""] Name of milestone.
		@param {bool} [event=""] true if milestone is an event / false if this is a container for phases.
		@param {int} [id=automaticaly generated] id of the milestone
	*/
	constructor(name = "", event = false, id = Utils.getId("milestone")){
		super(name, id);
		this.#phases = {};
		this.#event = event;
	}

	/**
		return true if the milestone is an event / false if this is a container for phases
		@returns bool
	*/
	isEvent(){
		return this.#event;
	}

	/**
		Add a requirement
		@param {Requirement} [requirement = new Requirement] Requirement to add to the collection
	*/
	addRequirement(requirement = new Requirement()){
		super.addProperty(requirement);
	}

	/**
		Remove a requirement
		@param {Requirement} requirement Requirement to remove
	*/
	removeRequirement(requirement){
		super.removeProperty(requirement);
	}

	/**
		Get all requirements
		@returns {Array} Array of Requirement
	*/
	getRequirements(){
		return super.getProperties();
	}

	/**
		Add a phase
		@param {Phase} [phase = new Phase] Phase to add to the collection
	*/
	addPhase(phase = new Phase()){
		this.#phases[phase.getId()] = phase;
	}

	/**
		Remove a phase
		@param {Phase} phase Phase to remove
	*/
	removePhase(phase){
		if(!(phase instanceof Phase)){
			console.error("removePhase(phase) : phase " + phase + " not of type Phase");
		}else if(!(Object.keys(this.#phases).includes("" + phase.getId()))){
			console.error("removePhase(phase) : phase " + phase + " not in the collection");
		}else{
			delete this.#phases[phase.getId()];
		}
	}

	/**
		Get all phases
		@returns {Array} Array of Phase
	*/
	getPhases(){
		return this.#phases;
	}

	/**
		Get a phase
		@param {int} id idof the phase
		@returns {Phase} Phase corresponding
	*/
	getPhase(id){
		if(typeof this.#phases[id] == "undefined"){
			console.error("getPhase(id) : id " + id + " unknowned on phases colleciton")
			return null;
		}else{
			return this.#phases[id];
		}
	}

	/**
		Add a following milestone
		@param {Milestone} milestone milestone to add to following milestones collection
	*/
	addFollowingMilestone(milestone){
		super.addFollowing(milestone, Milestone);
	}

	/**
		Remove a following milestone
		@param {Milestone} milestone Milestone to remove of the following milestone collection
	*/
	removeFollowingMilestone(milestone){
		super.removeFollowing(milestone, Milestone);
	}

	/**
		Get all followingMilestones
		@returns {Array} Array of Milestone
	*/
	getFollowingMilestones(){
		return super.getFollowings();
	}

	/**
		Add a previous milestone
		@param {Milestone} milestone milestone to add to previous milestones collection
	*/
	addPreviousMilestone(milestone){
		super.addPrevious(milestone, Milestone);
	}

	/**
		Remove a following milestone
		@param {Milestone} milestone Milestone to remove of the previous milestone collection
	*/
	removePreviousMilestone(milestone){
		super.removePrevious(milestone, Milestone);
	}

	/**
		Get all followingMilestones
		@returns {Array} Array of Milestone
	*/
	getPreviousMilestones(){
		return super.getPrevious();
	}

}
export default Milestone;