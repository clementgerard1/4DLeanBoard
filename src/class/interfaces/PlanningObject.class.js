import Property from "./Property.class.js";

/**
 * @class PlanningObject
 * @classdesc PlanningObject represents a milestone/phase/task/operation Object, Don't instantiate this class 
 */
class PlanningObject{

	/**
		Constructor of PlanningObject / Only for heritage, don't use it
		@param {string} name
		@param {int} id 
	*/
	constructor(name, id){
		this.id = id;
		this.name = name;
		this.followings = {};
		this.properties = {};
	}

	/**
		Get the id of the planningObject
		@returns {int} id 
	*/
	getId(){
		return this.id;
	}

	/**
		Get the name of the planningObject
		@returns {string} name 
	*/
	getName(){
		return this.name;
	}	

	/**
		Set the name  of the planningObject
		@param {string} name 
	*/
	setName(name){
		if(typeof name != "string"){
			console.error("setName(name) need a string ; provided : " + name);
		}else{
			this.name = name;
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
			this.followings[element.id] = element;
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
		}else if(!(Object.keys(this.followings).includes("" + element.id))){
			console.error("removeFollowing(element) : element " + element + " not in the collection");
		}else{
			delete this.followings[element.id];
		}
	}

	/**
		Get all followingPlanningObjects
		@returns {Array} Array of PlanningObject
	*/
	getFollowings(){
		return this.followings;
	}

	/**
		Add a property / If name already exists, function erases it
		@param {Property} [property = new Property] Property to add to the collection
	*/
	addProperty(property, name = property.id){
		this.properties[name] = property;
	}

	/**
		Remove a property
		@param {Property} property Property to remove
	*/
	removeProperty(property){
		if(!(property instanceof Property)){
			console.error("removeProperty(property) : property " + property + " not of type Property");
		}else if(!(Object.keys(this.properties).includes("" + property.id))){
			console.error("removeProperty(property) : property " + property + " not in the collection");
		}else{
			delete this.properties[property.id];
		}
	}

	/**
		Remove a property by its name
		@param {String} propertyName Name of the property to remove (the same as addProperty name argument)
	*/
	removePropertyByName(propertyName){
		if(!(Object.keys(this.properties).includes(propertyName))){
			console.error("removeProperty(property) : property " + property + " not in the collection");
		}else{
			delete this.properties[propertyName];
		}
	}

	/**
		Get all properties
		@returns {Array} Array of Property
	*/
	getProperties(){
		return this.properties;
	}

	/**
		Get a property with its name
		@returns {string} Name of Property (the same as addProperty name argument)
	*/
	getPropertyByName(name){
		if(!(Object.keys(this.properties).includes(name))){
			console.error("addPropertyByName(name) : name " + name + " not in the collection");
			return null;
		}else{
			return this.properties[name];
		}
	}

	/**
		Get a property by id
		@param {int} id id of the property
		@returns {Property} Property corresponding
	*/
	getProperty(id){
		if(typeof this.properties[id] == "undefined"){
			console.error("getProperty(id) : id " + id + " unknowned on properties colleciton")
			return null;
		}else{
			return this.properties[id];
		}
	}

	/**
		Get duration of the PlanningObject
		@abstract
	*/
	getDuration(){}	

}

export default PlanningObject;