import Utils from "./Utils.class.js";
import Milestone from './Milestone.class.js';
import Serialize from 'serialize-javascript';

class Model{

	#id;
	#name;
	#lastModifiedDate;
	#milestones;
	#startDate;
	#duration;

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
			milestones : [],	
			phases : [],
			tasks : [],
			operations : [],

			contractors : [],
			taskTeams : [],
			operationUnits : [],

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
				object4D : t.getObject4D(),
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

		//taskTeams
		const taskTeams = this.getTaskTeams();
		for(let key in taskTeams){
			const t = taskTeams[key];

			const taskTeam = {
				id : t.getId(),
				name : t.getName(),
				workers : t.getWorkers(),
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
			const property = {
				id : p.getId(),
				name : p.getName(),
				type : p.constructor.name
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

		return Serialize(jsonObj);

	}

	/*
		Deserialize the model
		@param {string} json 
		@returns {Model}
	*/
	deserialize(json){
		const model = new Model();
		const datas = eval('(' + json + ')');
		console.log(datas);

		
		return model;
	}

}
export default Model;