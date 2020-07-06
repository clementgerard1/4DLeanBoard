import Property from "./Property.class.js";

class PlanningObject{

	#id;
	#name;
	#duration;
	#startDate;
	#endDate;
	#followings;
	#previous;
	#properties;

	/**
		@class PlanningObject
 		@classdesc PlanningObject represents a milestone/phase/task/operation Object, Don't instantiate this class  - Don't instanciate it !
		
		@constructs

		@param {string} name
		@param {int} id 
	*/
	constructor(name, id){
		this.#id = id;
		this.#name = name;
		this.#duration = null;
		this.#startDate = null;
		this.#endDate = null;
		this.#followings = {};
		this.#previous = {};
		this.#properties = {};
	}

	/**
		Get the id of the planningObject
		@returns {int} id 
	*/
	getId(){
		return this.#id;
	}

	/**
		Get the name of the planningObject
		@returns {string} name 
	*/
	getName(){
		return this.#name;
	}	

	/**
		Set the name  of the planningObject
		@param {string} name 
	*/
	setName(name){
		if(typeof name != "string"){
			console.error("setName(name) need a string ; provided : " + name);
		}else{
			this.#name = name;
		}
	}	

	/**
		Add a following element
		@param {PlanningObject} element element to add to following collection
		@param {ObjectClass} type type of the element to add to following collection
	*/
	addFollowing(element, type = PlanningObject){
		if(!(element instanceof type)){
			console.error("addFollowing(element) need PlanningObject ; provided : " + element);
		}else{
			this.#followings[element.getId()] = element;
		}
	}

	/**
		Remove a following element
		@param {PlanningObject} element PlanningObject to remove of the following collection
		@param {ObjectClass} type type of the element to add to following collection
	*/
	removeFollowing(element, type = PlanningObject){
		if(!(element instanceof type)){
			console.error("removeFollowing(element) : element " + element + " not of type PlanningObject");
		}else if(!(Object.keys(this.#followings).includes("" + element.getId()))){
			console.error("removeFollowing(element) : element " + element + " not in the collection");
		}else{
			delete this.#followings[element.getId()];
		}
	}

	/**
		Get all followingPlanningObjects
		@returns {Array} Array of PlanningObject
	*/
	getFollowings(){
		return this.#followings;
	}

	/**
		Add a property / If name already exists, function erases it
		@param {Property} [property = new Property] Property to add to the collection
	*/
	addProperty(property, name = property.getId()){
		this.#properties[name] = property;
	}

	/**
		Remove a property
		@param {Property} property Property to remove
	*/
	removeProperty(property){
		if(!(property instanceof Property)){
			console.error("removeProperty(property) : property " + property + " not of type Property");
		}else if(!(Object.keys(this.#properties).includes("" + property.getId()))){
			console.error("removeProperty(property) : property " + property + " not in the collection");
		}else{
			delete this.#properties[property.getId()];
		}
	}

	/**
		Remove a property by its name
		@param {String} propertyName Name of the property to remove (the same as addProperty name argument)
	*/
	removePropertyByName(propertyName){
		if(!(Object.keys(this.#properties).includes(propertyName))){
			console.error("removeProperty(property) : property " + property + " not in the collection");
		}else{
			delete this.#properties[propertyName];
		}
	}

	/**
		Get all properties
		@returns {Array} Array of Property
	*/
	getProperties(){
		return this.#properties;
	}

	/**
		Get a property with its name
		@returns {string} Name of Property (the same as addProperty name argument)
	*/
	getPropertyByName(name){
		if(!(Object.keys(this.#properties).includes(name))){
			console.error("getPropertyByName(name) : name " + name + " not in the collection");
			return null;
		}else{
			return this.#properties[name];
		}
	}

	/**
		Get a property by id
		@param {int} id id of the property
		@returns {Property} Property corresponding
	*/
	getProperty(id){
		let n = null;
		const properties = this.getProperties();
		for(let p in properties){
			if(properties[p].getId() == id) return properties[p];
		}
		return null;
	}

	/**
		Get duration of the PlanningObject
	*/
	getDuration(){
		const startDate = this.#startDate;
		const endDate = this.#endDate;
		const length = (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24);
		return Math.round(length + 1);
		//return this.#duration;
	}	

	/**
		Set duration of the PlanningObject
		@param duration {int}
	*/
	setDuration(duration){
		if(typeof duration == "string") duration = parseInt(duration);
		if(typeof duration != "number"){
			console.error("setDuration(duration) need a number ; provided : " + duration);
		}else{
			this.#duration = duration;
		}
	}	

	/**
		Add a previous element
		@param {PlanningObject} element element to add to previous collection
		@param {ObjectClass} type type of the element to add to previous collection
	*/
	addPrevious(element, type = PlanningObject){
		if(!(element instanceof type)){
			console.error("addPrevious(element) need PlanningObject ; provided : " + element);
		}else{
			this.#previous[element.getId()] = element;
		}
	}

	/**
		Remove a previous element
		@param {PlanningObject} element PlanningObject to remove of the previous collection
		@param {ObjectClass} type type of the element to add to previous collection
	*/
	removePrevious(element, type = PlanningObject){
		if(!(element instanceof type)){
			console.error("removePrevious(element) : element " + element + " not of type PlanningObject");
		}else if(!(Object.keys(this.#previous).includes("" + element.getId()))){
			console.error("removePrevious(element) : element " + element + " not in the collection");
		}else{
			delete this.#previous[element.getId()];
		}
	}

	/**
		Get all previousPlanningObjects
		@returns {Array} Array of PlanningObject
	*/
	getPrevious(){
		return this.#previous;
	}

	/**
		Get startDate of the PlanningObject
		@returns {Date}
	*/
	getStartDate(){
		return this.#startDate;
	}	

	/**
		Set startDate of the PlanningObject
		@param date {int}
	*/
	setStartDate(date){
		if(!(date instanceof Date)){
			console.error("setStartDate(date) need a Date ; provided : " + date);
		}else{
			this.#startDate = date;
		}
	}	

	/**
		Get endDate of the PlanningObject
		@returns {Date}
	*/
	getEndDate(){
		return this.#endDate;
	}	

	/**
		Set endDate of the PlanningObject
		@param date {int}
	*/
	setEndDate(date){
		if(!(date instanceof Date)){
			console.log(this);
			console.error("setEndDate(date) need a Date ; provided : " + date);
		}else{
			this.#endDate = date;
		}
	}	

}

export default PlanningObject;