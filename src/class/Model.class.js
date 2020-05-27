import Utils from "./Utils.class.js";
import Milestone from './Milestone.class.js';

/**
 * @class Model
 * @classdesc Model represents the root container
 */
class Model{

	/**
		Model Constructor
		@param {string} [name=""] Name of model.
		@param {int} [id=automaticaly generated] id of the model.
	*/
	constructor(name = "", id = Utils.getId("model")){
		this.id = id;
		this.name = name;
		this.lastModifiedDate = new Date();
		this.milestones = [];
		this.startDate = Date.now();
	}

	/**
		Add a milestone
		@param {Milestone} [milestone = new Milestone] Milestone to add to the collection
		@param {uint} [order = lastPlace] order place of the milestone
	*/
	addMilestone(milestone = new Milestone(), order = this.milestones.length){
		this.milestones.splice(order, 0, milestone);
	}

	/**
		Remove a milestone
		@param {Milestone} milestone Milestone to remove
	*/
	removeMilestone(milestone){
		if(!(milestone instanceof Milestone)){
			console.error("removeMilestone(milestone) : milestone " + milestone + " not of type Milestone");
		}else if(!(this.milestones.includes(milestone))){
			console.error("removeMilestone(milestone) : milestone " + milestone + " not in the collection");
		}else{
			this.milestones.splice(this.milestones.indexOf(milestone), 1);
		}
	}

	/**
		Get all milestones
		@returns {Array} Array of Milestones
	*/
	getMilestones(){
		return this.milestones;
	}

	/**
		Get a milestone by ordernumber
		@param {uint} order order number of the milestone
		@returns {Milestone} Milestone corresponding
	*/
	getMilestone(order){
		if(typeof this.milestones[order] == "undefined"){
			console.error("getMilestone(order) : order " + order + " unknowned on milestones colleciton")
			return null;
		}else{
			return this.milestones[order];
		}
	}

	/**
		Get the id of the model
		@returns {int} id of the model
	*/
	getId(){
		return this.id;
	}

	/**
		Get the name of the model
		@returns {string} name of the model
	*/
	getName(){
		return this.name;
	}	

	/**
		Get the last modified date of the model
		@returns {Date} last modified date of the model
	*/
	getLastModifiedDate(){
		return this.lastModifiedDate;
	}	

	/**
		Set the last modified date of the model
		@param {Date} date last modified date
	*/
	setLastModifiedDate(date){
		if(date instanceof Date){
			this.lastModifiedDate = date;
		}else{
			console.error("setLastModifiedDate(date) need a Date object ; provided : " + date);
			return null;
		}
	}

	/**
		Get the start date of the model
		@returns {Date} start date of the model
	*/
	getStartDate(){
		return this.startDate;
	}	

	/**
		Set the start date of the model
		@param {Date} date last modified date
	*/
	setStartDate(date){
		if(date instanceof Date){
			this.startDate = date;
		}else{
			console.error("setStartDate(date) need a Date object ; provided : " + date);
			return null;
		}
	}

	/**
		get all contractors of the model
		@returns {Array(Contractor)} return null if no contractor exist
	*/
	getContractors(){
		const contractors = [];
		const phases = [];
		const milestones = this.getMilestones();
		for(let m in milestones){
			const phases = milestones[m].getPhases();
			for(let p in phases){
				const contractor = phases[p].getContractor();
				if(!contractors.includes(contractor)) contractors[contractors.length] = contractor;
			}
		}
		return contractors;
	}

	/**
		get duration of the model
		@returns {int}
	*/
	getDuration(){
		return 24;
	}

}
export default Model;