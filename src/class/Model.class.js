import Utils from "./Utils.class.js";
import Property from "./interfaces/Property.class.js";
import Milestone from './Milestone.class.js';
import Phase from './Phase.class.js';
import Task from './Task.class.js';
import Day from './Day.class.js';
import Person from './Person.class.js';
import Operation from './Operation.class.js';
import Contractor from './Contractor.class.js';
import TaskTeam from './TaskTeam.class.js';
import OperationUnit from './OperationUnit.class.js';
import Zone from './Zone.class.js';
import Delivrable from './Delivrable.class.js';
import Requirement from './Requirement.class.js';
import Level from './Level.class.js';
import State from './State.class.js';
import ConstructionType from './ConstructionType.class.js';
import Object3D from './Object3D.class.js';
import Object4D from './Object4D.class.js';
import Serialize from 'serialize-javascript';

class Model{

	#id;
	#name;
	#lastModifiedDate;
	#milestones;
	#startDate;
	#duration;
	#holidays;
	#dayWorked;

	/**
		@class Model
		@classdesc Model represents the root container

		@constructs

		@param {string} [name=""] Name of model.
		@param {int} [id=automaticaly generated] id of the model.
	*/
	constructor(name = "", id = Utils.getId("model")){
		this.#id = id;
		this.#name = name;
		this.#lastModifiedDate = new Date();
		this.#milestones = [];
		this.#startDate = Date.now();
		this.#duration = null;
		this.#holidays = {};
		this.#dayWorked = [true, true, true, true, true, false, false];
	}

	/**
		Add a milestone
		@param {Milestone} [milestone = new Milestone] Milestone to add to the collection
		@param {uint} [order = lastPlace] order place of the milestone
	*/
	addMilestone(milestone = new Milestone(), order = this.#milestones.length){
		this.#milestones.splice(order, 0, milestone);
	}

	/**
		Remove a milestone
		@param {Milestone} milestone Milestone to remove
	*/
	removeMilestone(milestone){
		if(!(milestone instanceof Milestone)){
			console.error("removeMilestone(milestone) : milestone " + milestone + " not of type Milestone");
		}else if(!(this.#milestones.includes(milestone))){
			console.error("removeMilestone(milestone) : milestone " + milestone + " not in the collection");
		}else{
			this.#milestones.splice(this.#milestones.indexOf(milestone), 1);
		}
	}

	/**
		Get all milestones
		@returns {Array} Array of Milestones
	*/
	getMilestones(){
		return this.#milestones;
	}

	/*
		Get dayWorked Array
		@returns {Array}
	*/
	getDayWorked(){
		return this.#dayWorked;
	}

	/**
		Get a milestone by ordernumber
		@param {uint} order order number of the milestone
		@returns {Milestone} Milestone corresponding
	*/
	getMilestone(order){
		if(typeof this.#milestones[order] == "undefined"){
			console.error("getMilestone(order) : order " + order + " unknowned on milestones colleciton")
			return null;
		}else{
			return this.#milestones[order];
		}
	}

	/**
		Get all holidays days
		@returns {Array} Array of Day
	*/
	getHolidays(){
		return this.#holidays;
	}

	/**
		Add a holyday
		@param {Day day Milestone to add to the collection
	*/
	addHoliday(day){
		this.#holidays[day.getId()] = day;
	}

	/**
		Remove a holyday
		@param {Day} day
	*/
	removeHoliday(day){
		if(!(day instanceof Day)){
			console.error("removeHoliday(holyday) : holyday " + day + " not of type Day");
		}else if(!(this.#holidays.includes(day))){
			console.error("removeHoliday(holyday) : holyday " + day + " not in the collection");
		}else{
			delete this.#holidays[day.getId()];
		}
	}

	/**
		Get the id of the model
		@returns {int} id of the model
	*/
	getId(){
		return this.#id;
	}

	/**
		Get the name of the model
		@returns {string} name of the model
	*/
	getName(){
		return this.#name;
	}	

	/**
		Set the name of the model
		@params {string} name 
	*/
	setName(name){
		this.#name = name;
	}	

	/**
		Get the last modified date of the model
		@returns {Date} last modified date of the model
	*/
	getLastModifiedDate(){
		return this.#lastModifiedDate;
	}	

	/**
		Set the last modified date of the model
		@param {Date} date last modified date
	*/
	setLastModifiedDate(date){
		if(date instanceof Date){
			this.#lastModifiedDate = date;
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
		return this.#startDate;
	}	

	/**
		Set the start date of the model
		@param {Date} date last modified date
	*/
	setStartDate(date){
		if(date instanceof Date){
			this.#startDate = date;
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
		get all taskTeams of the model
		@returns {Array(TaskTeam)} return null if no taskTeam exist
	*/
	getTaskTeams(){
		const taskTeams = [];
		const tasks = this.getTasks();
		for(let t in tasks){
			const taskTeam = tasks[t].getTaskTeam();
			if(!taskTeams.includes(taskTeam)) taskTeams[taskTeams.length] = taskTeam;
		}
		return taskTeams;
	}

	getPersons(){
		const teams = this.getTaskTeams();
		const toReturn = [];
		for(let t in teams){
			const persons = teams[t].getPersons();
			toReturn.push(teams[t].getBoss());
			for(let p in persons){
				toReturn.push(persons[p]);
			}
		}
		return toReturn;
	}

	/**
		get all operationUnits of the model
		@returns {Array(OperationUnit)} return null if no operationUnit exist
	*/
	getOperationUnits(){
		const operationUnits = [];
		const operations = this.getOperations();
		for(let o in operations){
			const operationUnit = operations[o].getOperationUnit();
			if(!operationUnits.includes(operationUnit)) operationUnits[operationUnits.length] = operationUnit;
		}
		return operationUnits;
	}

	/**
		get a contractors of the model by id
		@params {uint} contractor id 
		@returns {Contractor} return null if no contractor exist with this id
	*/
	getContractorById(id){
		const contractors = this.getContractors();
		for( let c in contractors){
			if(contractors[c].getId() == id) return contractors[c];
		}
		return null;
	}

	/**
		get a taskteam of the model by id
		@params {uint} taskteam id 
		@returns {Taskteam} return null if no contractor exist with this id
	*/
	getTaskTeamById(id){
		const taskTeams = this.getTaskTeams();
		for( let t in taskTeams){
			if(taskTeams[t].getId() == id) return taskTeams[t];
		}
		return null;
	}

	/**
		get duration of the model
		@returns {int}
	*/
	getDuration(){
		if(this.#duration == null){
			let start = null;
			let end = null;
			for(let m in this.#milestones){
				const startDate = this.#milestones[m].getStartDate();
				const endDate = this.#milestones[m].getEndDate();

				if(start == null || startDate < start) start = startDate;

				if(end == null || endDate > end) end = endDate;

			}

			this.setStartDate(start);
			this.#duration = Math.ceil(((end.getTime() - start.getTime()) / (1000 * 3600 * 24)) + 1);
		}

		return this.#duration;
	}

	/*
		get all phases of the model
		@returns {Array} Array of phases
	*/
	getPhases(){
		const toReturn = [];
		for(let m in this.#milestones){
			const phases = this.#milestones[m].getPhases();
			for(let p in phases){
				toReturn.push(phases[p]);
			}
		}
		return toReturn;
	}

	/*
		get all tasks of the model
		@returns {Array} Array of tasks
	*/
	getTasks(){
		const toReturn = [];
		for(let m in this.#milestones){
			const phases = this.#milestones[m].getPhases();
			for(let p in phases){
				const tasks = phases[p].getTasks();
				for(let t in tasks){
					toReturn.push(tasks[t]);
				}
			}
		}
		return toReturn;
	}

	getLayers(){
		const tasks = this.getTasks();
		const toReturn = {};
		for(let t in tasks){
			const layer = tasks[t].getZone().getValue();
			const layers = layer.split(",");
			for(let l in layers){
				if(typeof toReturn[layers[l].replace(" ", "")] == "undefined" && layers[l] != "") toReturn[layers[l].replace(" ", "")] = layers[l].replace(" ", "");
			}
		}
		return toReturn;
	}

	/*
		get all operations of the model
		@returns {Array} Array of operations
	*/
	getOperations(){
		const toReturn = [];
		for(let m in this.#milestones){
			const phases = this.#milestones[m].getPhases();
			for(let p in phases){
				const tasks = phases[p].getTasks();
				for(let t in tasks){
					const operations = tasks[t].getOperations();
					for(let o in operations){
						toReturn.push(operations[o]);
					}
				}
			}
		}
		return toReturn;
	}


	/*
		get all properties of the model
		@returns {Array} Array of properties
	*/
	getProperties(){
		const toReturn = [];
		for(let m in this.#milestones){
			const propm = this.#milestones[m].getProperties();
			for(let p in propm){
				toReturn.push(propm[p]);
			}
			const phases = this.#milestones[m].getPhases();
			for(let p in phases){
				const propp = phases[p].getProperties();
				for(let p in propp){
					toReturn.push(propp[p]);
				}
				const tasks = phases[p].getTasks();
				for(let t in tasks){
					const propt = tasks[t].getProperties();
					for(let p in propt){
						toReturn.push(propt[p]);
					}
					const operations = tasks[t].getOperations();
					for(let o in operations){
						const propo = operations[o].getProperties();
						for(let p in propo){
							toReturn.push(propo[p]);
						}
					}
				}
			}
		}
		return toReturn;
	}

	/*
		get all delivrables of the model
		@returns {Array} Array of delivrables
	*/
	getDelivrables(){
		const toReturn = [];
		const phases = this.getPhases();
		for(let p in phases){
			const delivrables = phases[p].getDelivrables();
			for(let d in delivrables){
				toReturn.push(delivrables[d]);
			}
		}
		return toReturn;
	}


	/*
		get all objects4D of the model
		@returns {Array} Array of object4D
	*/
	getObjects4D(){
		const toReturn = [];
		const tasks = this.getTasks();
		for(let t in tasks){
			toReturn.push(tasks[t].getObject4D());
		}
		return toReturn;
	}

	/*
		get all objects3D of the model
		@returns {Array} Array of object3D
	*/
	getObjects3D(){
		const toReturn = [];
		const objects4D = this.getObjects4D();
		for(let o in objects4D){
			const objects3D = objects4D[o].getObjects3D();
			for(let oo in objects3D){
				toReturn.push(objects3D[oo]);
			}
		}
		return toReturn;
	}

	/*
		get a 3D object which is included in the model by its id
		@param {String} id id (guid) of the object3D
		@returns {Object3D}
	*/
	get3DObjectById(id){
		const phases = this.getPhases();
		for(let p in phases){
			const result = phases[p].get3DObjectById(id);
			if(result != null){
				return result;
			}
		}
		return null;
	}

	/*
		get a 4DObject
		@param {String} id 
		@returns {Object4D}
	*/
	get4DObjectById(id){
		const phases = this.getPhases();
		for(let p in phases){
			const obj = phases[p].get4DObjectById(id);
			if(obj != null){
				return obj;
			}
		}
		return null;
	}

	/*
		get a Task by its id
		@param {String} id 
		@returns {Task}
	*/	
	getTaskById(id){
		const phases = this.getPhases();
		for(let p in phases){
			const obj = phases[p].getTask(id);
			if(obj != null){
				return obj;
			}
		}
		return null;
	}

	/*
		Serialize the model
		@returns {string}
	*/
	serialize(){
		let jsonObj = {
			name : this.getName(),
			week : this.#dayWorked,
			milestones : [],	
			phases : [],
			tasks : [],
			operations : [],
			holidays : [],

			contractors : [],
			taskTeams : [],
			operationUnits : [],
			persons : [],

			properties : [],
			delivrables : [],
			objects4D : [],
			objects3D : [],
		};
		

		//Milestones
		const milestones = this.getMilestones();
		for(let key in milestones){
			const m = milestones[key];
			
			const previous = m.getPreviousMilestones();
			const previousIds = [];
			for(let p in previous){
				previousIds.psush(previous[p].getId());
			}

			const followings = m.getFollowingMilestones();
			const followingIds = [];
			for(let f in followings){
				followingIds.push(followings[f].getId());
			}

			const properties = m.getProperties();
			const propertyIds = [];
			for(let p in properties){
				propertyIds.push(properties[p].getId());
			}

			const phases = m.getPhases();
			const phaseIds = [];
			for(let p in phases){
				phaseIds.push(phases[p].getId());
			}

			const milestone = {
				id : m.getId(),
				name : m.getName(),
				start : m.getStartDate(),
				end : m.getEndDate(),
				previous : previousIds,
				followings : followingIds,
				properties : propertyIds,
				phases : phaseIds,
				event : m.isEvent(),
			}

			jsonObj.milestones.push(milestone);
		}

		//Phases
		const phases = this.getPhases();
		for(let key in phases){
			const p = phases[key];
			
			const previous = p.getPreviousPhases();
			const previousIds = [];
			for(let pp in previous){
				previousIds.push(previous[pp].getId());
			}

			const followings = p.getFollowingPhases();
			const followingIds = [];
			for(let f in followings){
				followingIds.push(followings[f].getId());
			}

			const properties = p.getProperties();
			const propertyIds = [];
			for(let pp in properties){
				propertyIds.push(properties[pp].getId());
			}

			const tasks = p.getTasks();
			const taskIds = [];
			for(let t in tasks){
				taskIds.push(tasks[t].getId());
			}

			const objs = p.getObjects4D();
			const objIds = [];
			for(let o in objs){
				objIds.push(objs[o].getId());
			}

			const delivrables = p.getDelivrables();
			const delivrableIds = [];
			for(let d in delivrables){
				delivrableIds.push(delivrables[d].getId());
			}

			const phase = {
				id : p.getId(),
				name : p.getName(),
				start : p.getStartDate(),
				end : p.getEndDate(),
				previous : previousIds,
				followings : followingIds,
				properties : propertyIds,
				objects4D : objIds,
				tasks : taskIds,
				contractor : p.getContractor().getId(),
				colorClass : p.getColorClass(),
				delivrables : delivrableIds,
				requirements : p.getRequirementsString(),
			}

			jsonObj.phases.push(phase);
		}		

		//Tasks
		const tasks = this.getTasks();
		for(let key in tasks){
			const t = tasks[key];
			
			const previous = t.getPreviousTasks();
			const previousIds = [];
			for(let p in previous){
				previousIds.push(previous[p].getId());
			}

			const followings = t.getFollowingTasks();
			const followingIds = [];
			for(let f in followings){
				followingIds.push(followings[f].getId());
			}

			const properties = t.getProperties();
			const propertyIds = [];
			for(let p in properties){
				propertyIds.push(properties[p].getId());
			}

			const operations = t.getOperations();
			const operationIds = [];
			for(let o in operations){
				operationIds.push(operations[o].getId());
			}

			const task = {
				id : t.getId(),
				name : t.getName(),
				start : t.getStartDate(),
				end : t.getEndDate(),
				previous : previousIds,
				followings : followingIds,
				properties : propertyIds,
				operations : operationIds,
				taskTeam : t.getTaskTeam().getId(),
				object4D : t.getObject4D().getId(),
				done : t.isDone(),
				paused : t.isPaused(),
				go : t.isGo(),
				description : t.getDescription(),
				workers : t.getWorkers()
			}

			jsonObj.tasks.push(task);
		}		

		//Operations
		const operations = this.getOperations();
		for(let key in operations){
			const o = operations[key];
			
			const previous = o.getPreviousTasks();
			const previousIds = [];
			for(let p in previous){
				previousIds.push(previous[p].getId());
			}

			const followings = o.getFollowingTasks();
			const followingIds = [];
			for(let f in followings){
				followingIds.push(followings[f].getId());
			}

			const properties = o.getProperties();
			const propertyIds = [];
			for(let p in properties){
				propertyIds.push(properties[p].getId());
			}

			const operation = {
				id : o.getId(),
				name : o.getName(),
				start : o.getStartDate(),
				end : o.getEndDate(),
				operationUnit : o.getOperationUnit().getId(),
				previous : previousIds,
				followings : followingIds,
				properties : propertyIds,
			}

			jsonObj.operations.push(operation);
		}

		//Contractors
		const contractors = this.getContractors();
		for(let key in contractors){
			const c = contractors[key];

			const taskTeams = c.getTaskTeams();
			const taskTeamIds = [];
			for(let t in taskTeams){
				taskTeamIds.push(taskTeams[t].getId());
			}

			const contractor = {
				id : c.getId(),
				name : c.getName(),
				taskTeams : taskTeamIds,
			}

			jsonObj.contractors.push(contractor);
		}

		// Persons
		const persons = this.getPersons();
		for(let p in persons){
			const person = {
				id : persons[p].getId(),
				name : persons[p].getName(),
				email : persons[p].getEmail(),
				phone : persons[p].getPhone(),
			};
			jsonObj.persons.push(person);
		}

		//taskTeams
		const taskTeams = this.getTaskTeams();
		for(let key in taskTeams){
			const t = taskTeams[key];

			const operationUnits = t.getOperationUnits();
			const operationUnitIds = [];
			for(let o in operationUnits){
				operationUnitIds.push(operationUnits[o].getId());
			}

			const persons = [];
			const pp = t.getPersons();
			for(let p in pp){
				persons.push(pp[p].getId());
			}

			const taskTeam = {
				id : t.getId(),
				name : t.getName(),
				abr : t.getAbr(),
				operationUnits : operationUnits,
				color : t.getColorClass(),
				boss : t.getBoss().getId(),
				persons : persons,
			}

			jsonObj.taskTeams.push(taskTeam);
		}

		//operationUnits
		const operationUnits = this.getOperationUnits();
		for(let key in operationUnits){
			const o = operationUnits[key];

			const operationUnit= {
				id : o.getId(),
				name : o.getName()
			}

			jsonObj.operationUnits.push(operationUnit);
		}

		//Properties
		const properties = this.getProperties();
		for(let key in properties){
			const p = properties[key];
			let value = null;
			if(p.constructor.name == "Zone" || p.constructor.name == "Zone" || p.constructor.name == "Requirement" || p.constructor.name == "Level" || p.constructor.name == "ConstructionType"){
				value = p.getValue();
			}
			const property = {
				id : p.getId(),
				name : p.getName(),
				type : p.constructor.name,
				value : value,
			}

			jsonObj.properties.push(property);
		}

		//Delivrables
		const delivrables = this.getDelivrables();
		for(let key in delivrables){
			const d = delivrables[key];
			const delivrable = {
				id : d.getId(),
				name : d.getName(),
			}

			jsonObj.delivrables.push(delivrable);
		}

		//Objects4D
		const objs4D = this.getObjects4D();
		for(let key in objs4D){
			const o = objs4D[key];

			const objects3D = o.getObjects3D();
			const object3DIds = [];
			for(let o in objects3D){
				object3DIds.push(objects3D[o].getId());
			}

			const object4D = {
				id : o.getId(),
				name : o.getName(),
				phase : o.getPhase().getId(),
				task : o.getTask().getId(),
				objects3D : object3DIds
			}

			jsonObj.objects4D.push(object4D);
		}

		//Objects3D
		const objs3D = this.getObjects3D();
		for(let key in objs3D){
			const o = objs3D[key];

			const object3D = {
				id : o.getId(),
				name : o.getName(),
				objId : o.getUniqId(),
				parentObject4D : o.getParent().getId(),
				ifcId : o.getIFCId(),
			}

			jsonObj.objects3D.push(object3D);
		}

		//Holidays
		const holidays = this.getHolidays();
		for(let h in holidays){
			const hd = {
				id : holidays[h].getId(),
				date : holidays[h].getDate(),
			}
			jsonObj.holidays.push(hd);
		}

		return Serialize(jsonObj);

	}

	/*
		Deserialize the model
		@param {string} json 
		@returns {Model}
	*/
	deserialize(json){
		const datas = eval('(' + json + ')');

		//Init
		this.setName(datas.name);
		this.#dayWorked = datas.week;
		this.#milestones = [];
		this.#duration = null;

		//Objects creation without links
		const milestones = [];
		const phases = [];
		const tasks = [];
		const operations = [];

		for(let m in datas.milestones){
			const infos = datas.milestones[m];
			const milestone = new Milestone(infos.name, infos.event, infos.id);
			milestone.setStartDate(infos.start);
			milestone.setEndDate(infos.end);
			milestones[milestone.getId()] =  milestone;
		}
		for(let p in datas.phases){
			const infos = datas.phases[p];
			const phase = new Phase(infos.name, infos.id);
			phase.setStartDate(infos.start);
			phase.setEndDate(infos.end);
			phase.setColorClass(infos.colorClass);
			phase.setRequirementsString(infos.requirements);
			phases[phase.getId()] = phase;
		}
		for(let t in datas.tasks){
			const infos = datas.tasks[t];
			const task = new Task(infos.name, infos.id);
			task.setWorkers(infos.workers);
			task.setStartDate(infos.start);
			task.setEndDate(infos.end);
			task.setDone(infos.done);
			task.setDescription(infos.description);
			task.setGo(infos.go);
			task.setPaused(infos.paused);
			tasks[task.getId()] = task;
		}
		for(let o in datas.operations){
			const infos = datas.operations[o];
			const operation = new Operation(infos.name, infos.id);
			operation.setStartDate(infos.start);
			operation.setEndDate(infos.end);
			operations[operation.getId()] = operation;
		}

		const contractors = [];
		const taskTeams = [];
		const operationUnits = [];

		for(let c in datas.contractors){
			const infos = datas.contractors[c];
			const contractor = new Contractor(infos.name, infos.id);
			contractors[contractor.getId()] = contractor;
		}
		for(let t in datas.taskTeams){
			const infos = datas.taskTeams[t];
			const taskTeam = new TaskTeam(infos.name, infos.abr, infos.id);
			//taskTeam.setWorkers(infos.workers);
			taskTeam.setColorClass(infos.color);
			taskTeams[taskTeam.getId()] = taskTeam;
			if(infos.leaderName != "null"){
				taskTeam.setLeader(infos.leaderName, infos.leaderEmail, infos.leaderPhone);
			}
		}
		for(let o in datas.operationUnits){
			const infos = datas.operationUnits[o];
			const operationUnit = new OperationUnit(infos.name, infos.id);
			operationUnits[operationUnit.getId()] = operationUnit;
		}

		const properties = [];
		const delivrables = [];

		for(let p in datas.properties){
			const infos = datas.properties[p];
			if(infos.type == "Zone"){
				const zone = new Zone(infos.value, infos.name, infos.id);
				properties[zone.getId()] = zone;

			}else if(infos.type == "State"){
				const state = new State(infos.value, infos.name, infos.id);
				state.setValue(infos.value);
				properties[state.getId()] = state;

			}else if(infos.type == "Requirement"){
				const requirement = new Requirement(infos.name, infos.id);
				requirement.setValue(infos.value);
				properties[requirement.getId()] = requirement;

			}else if(infos.type == "Level"){
				const level = new Level(infos.value, infos.name, infos.id);
				level.setValue(infos.value);
				properties[level.getId()] = level;

			}else if(infos.type == "ConstructionType"){
				const constructionType = new ConstructionType(infos.value, infos.name, infos.id);
				constructionType.setValue(infos.value);
				properties[constructionType.getId()] = constructionType;

			}else{
				const property = new Property(infos.name, infos.id);
				properties[property.getId()] = property;

			}
		}
		const persons = [];

		for(let p in datas.persons){
			const infos = datas.persons[p];
			const person = new Person(infos.name, infos.id);
			person.setEmail(infos.email);
			person.setPhone(infos.phone);
			persons[person.getId()] = person;
		}

		for(let d in datas.delivrables){
			const infos = datas.delivrables[d];
			const delivrable = new Delivrable(infos.name, infos.id);
			delivrables[delivrable.getId()] = delivrable;
		}

		const objects3D = [];
		const objects4D = [];

		for(let o in datas.objects3D){
			const infos = datas.objects3D[o];
			const object3D = new Object3D(infos.name, infos.objId, infos.ifcId, infos.id);
			objects3D[object3D.getId()] = object3D;
		}
		for(let o in datas.objects4D){
			const infos = datas.objects4D[o];
			const object4D = new Object4D(infos.name, infos.id);
			objects4D[object4D.getId()] = object4D;
		}

		//Links creation
		for(let m in datas.milestones){
			const infos = datas.milestones[m];
			const milestone = milestones[infos.id];
			for(let f in infos.followings){
				milestone.addFollowingMilestone(milestones[infos.followings[f]]);
			}
			for(let p in infos.previous){
				milestone.addPreviousMilestone(milestones[infos.previous[p]]);
			}
			for(let p in infos.properties){
				milestone.addRequirement(properties[infos.properties[p]]);
			}
			for(let p in infos.phases){
				milestone.addPhase(phases[infos.phases[p]]);
			}
			this.addMilestone(milestone);
		}

		for(let p in datas.phases){
			const infos = datas.phases[p];
			const phase = phases[infos.id];
			phase.setContractor(contractors[infos.contractor]);
			for(let f in infos.followings){
				phase.addFollowingPhase(phases[infos.followings[f]]);
			}
			for(let p in infos.previous){
				phase.addPreviousPhase(phases[infos.previous[p]]);
			}
			for(let d in infos.delivrables){
				phase.addDelivrable(delivrable[infos.delivrables[d]]);
			}
			for(let p in infos.properties){
				phase.addProperty(properties[infos.properties[p]]);
			}
			for(let t in infos.tasks){
				phase.addTask(tasks[infos.tasks[t]]);
			}
			for(let o in infos.objects4D){
				phase.addObject4D(objects4D[infos.objects4D[o]]);
			}
		}

		for(let t in datas.tasks){
			const infos = datas.tasks[t];
			const task = tasks[infos.id];
			task.setTaskTeam(taskTeams[infos.taskTeam]);
			task.setObject4D(objects4D[infos.object4D]);
			for(let f in infos.followings){
				task.addFollowingTask(tasks[infos.followings[f]]);
			}
			for(let p in infos.previous){
				task.addPreviousTask(tasks[infos.previous[p]]);
			}
			for(let o in infos.operations){
				phase.addOperation(operations[infos.operations[o]]);
			}
			for(let p in infos.properties){
				const property = properties[infos.properties[p]];

				if(property instanceof Zone){
					task.setZone(property);
				}else if(property  instanceof ConstructionType){
					task.setConstructionType(property);
				}else if(property  instanceof State){
					task.setState(property);
				}else if(property  instanceof Requirement){
					task.addRequirement(property.getName(), property);
				}
			}
		}

		for(let o in datas.operations){
			const infos = datas.operations[o];
			const operation = operations[infos.id];
			operation.setOperationUnit(operationUnits[infos.operationUnit]);
			for(let f in infos.followings){
				operation.addFollowingOperation(operations[infos.followings[f]]);
			}
			for(let p in infos.previous){
				operation.addPreviousOperation(operations[infos.previous[p]]);
			}
			for(let p in infos.properties){
				operation.addProperty(properties[infos.properties[p]]);
			}
		}

		for(let c in datas.contractors){
			const infos = datas.contractors[c];
			const contractor = contractors[infos.id];
			for(let t in infos.taskTeams){
				contractor.addTaskTeam(taskTeams[infos.taskTeams[t]]);
			}
		}		

		for(let t in datas.taskTeams){
			const infos = datas.taskTeams[t];
			const taskTeam = taskTeams[infos.id];

			taskTeam.setBoss(persons[infos.boss]);

			for(let p in infos.persons){
				taskTeam.addPerson(persons[infos.persons[p]]);
			}

			for(let o in infos.operationUnits){
				taskTeam.addOperationUnit(operationUnits[infos.operationUnits[o]]);
			}
		}		

		for(let o in datas.objects4D){
			const infos = datas.objects4D[o];
			const object4D = objects4D[infos.id];
			object4D.setPhase(phases[infos.phase]);
			object4D.setTask(tasks[infos.task]);
			for(let o in infos.objects3D){
				object4D.addObject3D(objects3D[infos.objects3D[o]]);
			}
		}		

		for(let o in datas.objects3D){
			const infos = datas.objects3D[o];
			const object3D = objects3D[infos.id];
			object3D.setParent(objects4D[infos.parentObject4D]);
		}	

		for(let h in datas.holidays){
			const infos = datas.holidays[h];
			const d = new Day(datas.holidays[h].date, datas.holidays[h].id);
			this.addHoliday(d);
		}		
	}

	/*
		get a frag array conversion from Object4D Id of Excel to real id use in forge viewer
		@returns {Array} 
	*/
	getFragToIdsArray(){
		
	}

}
export default Model;