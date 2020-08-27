import Utils from "../Utils.class.js";

class Team{

	#id;
	#name;
	#boss;
	#persons;

	/**
		@class Team
 		@classdesc Team abstract object which represents a generic team - Don't instanciate it !

 		@constructs
 		
		@param {string} name Name of team
		@param {int} id id of the team
	*/
	constructor(name, id){
		if(typeof id == "undefined"){
			id = Utils.getId("team");
		}
		this.#id = id;
		this.#name = name;
		this.#boss = null;
		this.#persons = {};
	}

	/**
		Get the id of the team
		@returns {int} id of the team
	*/
	getId(){
		return this.#id;
	}

	/**
		Get the name of the team
		@returns {string} name of the team
	*/
	getName(){
		return this.#name;
	}	

	/**
		Add a person to the team
		@param {Person} [person = new Person] Person to add to the collection
	*/
	addPerson(person = new Person()){
		this.#persons[person.getId()] = person;
	}

	/**
		Remove a person
		@param {Person} person Person to remove
	*/
	removePerson(person){
		if(!(person instanceof Person)){
			console.error("removePerson(person) : person " + person + " not of type Person");
		}else if(!(Object.keys(this.#persons).includes("" + person.getId()))){
			console.error("removePerson(person) : person " + person + " not in the collection");
		}else{
			delete this.#persons[person.getId()];
		}
	}

	/**
		Get all persons
		@returns {Array} Array of Person
	*/
	getPersons(){
		return this.#persons;
	}

	setBoss(person){
		this.#boss = person;
	}

	getBoss(){
		return this.#boss;
	}

}
export default Team;