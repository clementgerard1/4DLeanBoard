import Model from "./Model.class.js";
import Milestone from "./Milestone.class.js";
import Phase from "./Phase.class.js";
import Task from "./Task.class.js";
import Object4D from "./Object4D.class.js";
import Object3D from "./Object3D.class.js";
import Operation from "./Operation.class.js";
import TaskTeam from "./TaskTeam.class.js";
import Timeline from "./Timeline.class.js";
import Level from "./Level.class.js";
import Zone from "./Zone.class.js";
import Contractor from "./Contractor.class.js";
import Requirement from "./Requirement.class.js";

/**
 * @class Loader
 * @classdesc Loader is a static class which allow you to load model from a source.
 * @hideconstructor
 */

class Loader{

	static #latestCSVVersion = "0.1";
	static #latestJSONVersion = "0.3";
	static #ifcBuildingElements = [
		"IFCBUILDINGELEMENTPROXY", //Pas sur
		"IFCCOVERING", //2
		"IFCBEAM", // Pas sur
		"IFCOLUMN", // Pas sur
		"IFCCURTAINWALL", // Pas sur
		"IFCDOOR", //2 (attention c'est le début d'autres mots)
		"IFCMEMBER", // Pas sur
		"IFCRAILING", // Pas sur
		"IFCRAMP", // Pas sur
		"IFCRAMPFLIGHT", //Pas sur
		"IFCWALL", //Pas sur
		"IFCWALLSTANDARDCASE", //2
		"IFCSLAB",  //2
		"IFCSTAIRFLIGHT",// Pas sur
		"IFCWINDOW", //2
		"IFCSTAIR", // Pas sur
		"IFCROOF", // 2
		"IFCPILE", // Pas sur
		"IFCFOOTING", // Pas sur
		"IFCBUILDINGELEMENTCOMPONENT", // Pas sur
		"IFCPLATE", // Pas sur
	]

	/**
		Load model from CSV
		@param {string} CSVFile csv informations.
		@param {string} IFCFile IFC file as string
		@param {string} [delimiterColumn=,]
		@param {string} [delimiterArray=;]
		@param {string} [csvVersion=latest] Version of csv used.
		@static
	*/
	static fromCSVandIFC(CSVFile, IFCFile, delimiterColumn = ";", delimiterArray = ",", csvVersion = this.#latestCSVVersion){
		return eval("this.csv_v" + csvVersion.replace(".", "_")  + "(CSVFile, IFCFile,`" + delimiterColumn + "`,`" + delimiterArray + "`)");
	}

	/**
		Load model from JSON
		@param {string} JSONFile json informations.
		@param {string} [jsonVersion=latest] Version of json used.
		@static
	*/
	static fromJSON(json, jsonVersion = this.#latestJSONVersion){
		return eval("this.json_v" + jsonVersion.replace(".", "_")  + "(json)");
	}

	/**
		Load model from JSON and IFC
		@param {string} JSONFile json informations.
		@param {string} IFCFile json informations.
		@param {string} [jsonVersion=latest] Version of json used.
		@static
	*/
	static fromJSONandIFC(json, ifc, jsonVersion = this.#latestJSONVersion){
		return eval("this.json_v" + jsonVersion.replace(".", "_")  + "(json, ifc)");
	}

	//Version JSON O.3
	static json_v0_3(json, ifc){
		//Errors
		if(json == null){
			throw 'JsonFile needed for import model';
		}
		if(ifc == null){
			throw 'IfcFile needed for import model';
		}

		//Parse IFC file
		let obj3Ds = {};
		const IFClines = ifc.split('\n');
		const ifcDef = /(IFC[A-Z]*)\(([ \-'_:$#A-Z0-9a-z]*),([ \-'_:$#A-Z0-9a-z]*),([ \-'_:$#A-Z0-9a-z]*),([ \-'_:$#A-Z0-9a-z]*),([ \-'_:$#A-Z0-9a-z]*)/g;
		for(let l in IFClines){
			const result = ifcDef.exec(IFClines[l]);
			if(result != null && this.#ifcBuildingElements.includes(result[1])){
				const temp = result[4].split(":");
				obj3Ds[result[2].replace(/['"]/gi, "")] = 
					{
						name : result[6].replace(/['"]/gi, ""),
						id : temp[temp.length-1].replace(/['"]/gi, "")
					}
			}
		}

		const infos = JSON.parse(json);

		const model = new Model();

		const contractors = [];
		const taskTeams = [];
		const zones = [];


		const tasksForPreviousNext = {};
		const tasksCollection = [];

		const milestones = infos["milestones"];
		for(let m in milestones){
			const milestone = new Milestone(milestones[m]["Name"]);
			model.addMilestone(milestone);
			for(let r in milestones[m]["requirements"]){
				const requirement = new Requirement(milestones[m]["requirements"][r]);
				milestone.addRequirement(requirement);
			}

			let MstartDate = null;
			let MendDate = null;
			const phases = milestones[m]["phases"];
			for(let p in phases){
				const phase = new Phase(phases[p]["Name"]);
				phase.setColorClass(phases[p]["color"]);
				if(typeof contractors[phases[p]["contractor"]] == "undefined") contractors[phases[p]["contractor"]] = new Contractor(phases[p]["contractor"]);
				phase.setContractor(contractors[phases[p]["contractor"]]);
				milestone.addPhase(phase);

				const tasks = phases[p]["tasks"];
				let PstartDate = null;
				let PendDate = null;
				for(let t in tasks){
					if(tasks[t] != null){
						const task = new Task(tasks[t]["Name"], tasks[t]["TID"]);
						const object4D = new Object4D(tasks[t]["4DID"], tasks[t]["4DID"]);
						task.setObject4D(object4D);
						object4D.setTask(task);
						//task.setDuration(tasks[t]["Duration"]);
						const startDate = new Date(tasks[t]["Start"].slice(6, 10), parseInt(tasks[t]["Start"].slice(3, 5)) - 1, tasks[t]["Start"].slice(0, 2));
						task.setStartDate(startDate);
						const endDate = new Date(tasks[t]["End"].slice(6, 10), parseInt(tasks[t]["End"].slice(3, 5)) - 1, tasks[t]["End"].slice(0, 2));
						task.setEndDate(endDate);

						if(PstartDate == null || startDate < PstartDate) PstartDate = startDate;
						if(PendDate == null || endDate > PendDate) PendDate = endDate;

						if(typeof taskTeams[tasks[t]["Team"]] == "undefined") taskTeams[tasks[t]["Team"]] = new TaskTeam(tasks[t]["Team"]);
						task.setTaskTeam(taskTeams[tasks[t]["Team"]]);
						taskTeams[tasks[t]["Team"]].setWorkers(tasks[t]["Workers"]);
						if(typeof zones[tasks[t]["Zone"]] == "undefined") zones[tasks[t]["Zone"]] = new Zone(tasks[t]["Zone"]);
						task.setZone(zones[tasks[t]["Zone"]]);

						//Requirements
						const constraint = new Requirement("constraint");
						constraint.setValue(tasks[t]["Requirements"]["Constraint"]);
						const information = new Requirement("information");
						information.setValue(tasks[t]["Requirements"]["Information"]);
						const materials = new Requirement("materials");
						materials.setValue(tasks[t]["Requirements"]["Materials"]);
						const manpower = new Requirement("manpower");
						manpower.setValue(tasks[t]["Requirements"]["Manpower"]);
						const equipement = new Requirement("equipement");
						equipement.setValue(tasks[t]["Requirements"]["Equipement"]);
						const safety = new Requirement("safety");
						safety.setValue(tasks[t]["Requirements"]["Safety"]);
						const space = new Requirement("space");
						space.setValue(tasks[t]["Requirements"]["Space"]);
						task.addRequirement("constraint", constraint);
						task.addRequirement("information", information);
						task.addRequirement("materials", materials);
						task.addRequirement("manpower", manpower);
						task.addRequirement("equipement", equipement);
						task.addRequirement("safety", safety);
						task.addRequirement("space", space);

						for(let o in tasks[t]["GUID"]){
							const object3D = new Object3D(obj3Ds[tasks[t]["GUID"][o]].name, parseInt(obj3Ds[tasks[t]["GUID"][o]].id), tasks[t]["GUID"][o]);
							object4D.addObject3D(object3D);
							object3D.setParent(object4D);
						}

						phase.addTask(task);
						task.setParentPhase(phase);
						phase.addObject4D(object4D);
						object4D.setPhase(phase);
						tasksForPreviousNext[task.getId()] = {
							"previous" : tasks[t]["Previous"],
							"next" : tasks[t]["Next"]
						}
						tasksCollection[task.getId()] = task;
					}

				}

				phase.setStartDate(PstartDate);
				phase.setEndDate(PendDate);

				if(MstartDate == null || PstartDate < MstartDate) MstartDate = PstartDate;
				if(MendDate == null || PendDate > MendDate) MendDate = PendDate;

			}

			milestone.setStartDate(MstartDate);
			milestone.setEndDate(MendDate);

		}
		const phases = model.getPhases();
		for(let p in phases){
			const tasks = phases[p].getTasks();
			for(let t in tasks){
				const actualTask = tasks[t];

				if(tasksForPreviousNext[actualTask.getId()].previous != 0) actualTask.addPreviousTask(tasksCollection[tasksForPreviousNext[actualTask.getId()].previous]);
				if(tasksForPreviousNext[actualTask.getId()].next != 0) actualTask.addFollowingTask(tasksCollection[tasksForPreviousNext[actualTask.getId()].next]);
			}
		}


		model.setStartDate(new Date());
		const timeline = new Timeline(model);

		return timeline;

	}

	//Version JSON O.2
	static json_v0_2(json){
		//Errors
		if(json == null){
			throw 'CSVFile needed for import model';
		}

		const infos = JSON.parse(json);

		const model = new Model();

		const contractors = [];
		const taskTeams = [];
		const zones = [];

		const milestones = infos["milestones"];
		for(let m in milestones){
			const milestone = new Milestone(milestones[m]["Name"]);
			model.addMilestone(milestone);
			for(let r in milestones[m]["requirements"]){
				const requirement = new Requirement(milestones[m]["requirements"][r]);
				milestone.addRequirement(requirement);
			}

			let MstartDate = null;
			let MendDate = null;
			const phases = milestones[m]["phases"];
			for(let p in phases){
				const phase = new Phase(phases[p]["Name"]);
				phase.setColorClass(phases[p]["color"]);
				if(typeof contractors[phases[p]["contractor"]] == "undefined") contractors[phases[p]["contractor"]] = new Contractor(phases[p]["contractor"]);
				phase.setContractor(contractors[phases[p]["contractor"]]);
				milestone.addPhase(phase);

				const tasks = phases[p]["tasks"];
				let PstartDate = null;
				let PendDate = null;
				for(let t in tasks){
					if(tasks[t] != null){
						const task = new Task(tasks[t]["Name"], t);
						const object4D = new Object4D(tasks[t]["4DID"], tasks[t]["4DID"]);
						task.setObject4D(object4D);
						object4D.setTask(task);
						//task.setDuration(tasks[t]["Duration"]);
						const startDate = new Date(tasks[t]["Start"].slice(6, 10), parseInt(tasks[t]["Start"].slice(3, 5)) - 1, tasks[t]["Start"].slice(0, 2));
						task.setStartDate(startDate);
						const endDate = new Date(tasks[t]["End"].slice(6, 10), parseInt(tasks[t]["End"].slice(3, 5)) - 1, tasks[t]["End"].slice(0, 2));
						task.setEndDate(endDate);

						if(PstartDate == null || startDate < PstartDate) PstartDate = startDate;
						if(PendDate == null || endDate > PendDate) PendDate = endDate;

						if(typeof taskTeams[tasks[t]["Team"]] == "undefined") taskTeams[tasks[t]["Team"]] = new TaskTeam(tasks[t]["Team"]);
						task.setTaskTeam(taskTeams[tasks[t]["Team"]]);
						if(typeof zones[tasks[t]["Zone"]] == "undefined") zones[tasks[t]["Zone"]] = new Zone(tasks[t]["Zone"]);
						task.setZone(zones[tasks[t]["Zone"]]);

						for(let o in tasks[t]["GUID"]){
							const object3D = new Object3D(tasks[t]["GUID"][o], tasks[t]["GUID"][o]);
							object4D.addObject3D(object3D);
							object3D.setParent(object4D);
						}

						phase.addTask(task);
						task.setParentPhase(phase);
						phase.addObject4D(object4D);
						object4D.setPhase(phase);
					}

				}

				phase.setStartDate(PstartDate);
				phase.setEndDate(PendDate);

				if(MstartDate == null || PstartDate < MstartDate) MstartDate = PstartDate;
				if(MendDate == null || PendDate > MendDate) MendDate = PendDate;

			}

			milestone.setStartDate(MstartDate);
			milestone.setEndDate(MendDate);

		}
		const phases = model.getPhases();
		for(let p in phases){
			const tasks = phases[p]["tasks"];
			for(let t in tasks){
				const actualTask = phase.getTask(t);

				const previousTask = phase.getTask(tasks[t]["previous"]);
				if(nextTask != null) actualTask.addFollowingTask(nextTask);

				const nextTask = phase.getTask(tasks[t]["next"]);
				if(previousTask != null) actualTask.addPreviousTask(previousTask);
			}
		}


		model.setStartDate(new Date());
		const timeline = new Timeline(model);

		return timeline;

	}

	//Version JSON O.1
	static json_v0_1(json){
		//Errors
		if(json == null){
			throw 'CSVFile needed for import model';
		}

		const infos = JSON.parse(json);

		const model = new Model();

		const contractors = [];
		const taskTeams = [];
		const zones = [];

		const milestones = infos["milestones"];
		for(let m in milestones){
			const milestone = new Milestone(milestones[m]["name"]);
			model.addMilestone(milestone);
			for(let r in milestones[m]["requirements"]){
				const requirement = new Requirement(milestones[m]["requirements"][r]);
				milestone.addRequirement(requirement);
			}

			let MstartDate = null;
			let MendDate = null;
			const phases = milestones[m]["phases"];
			for(let p in phases){
				const phase = new Phase(phases[p]["name"]);
				phase.setColorClass(phases[p]["color"]);
				if(typeof contractors[phases[p]["contractor"]] == "undefined") contractors[phases[p]["contractor"]] = new Contractor(phases[p]["contractor"]);
				phase.setContractor(contractors[phases[p]["contractor"]]);
				milestone.addPhase(phase);

				const tasks = phases[p]["tasks"];
				let PstartDate = null;
				let PendDate = null;
				for(let t in tasks){
					const task = new Task(tasks[t]["name"], t);
					const object4D = new Object4D(tasks[t]["4DID"], tasks[t]["4DID"]);
					task.setObject4D(object4D);
					//task.setDuration(tasks[t]["duration"]);
					const startDate = new Date(tasks[t]["start"].slice(6, 10), parseInt(tasks[t]["start"].slice(3, 5)) - 1, tasks[t]["start"].slice(0, 2));
					task.setStartDate(startDate);
					const endDate = new Date(tasks[t]["end"].slice(6, 10), parseInt(tasks[t]["end"].slice(3, 5)) - 1, tasks[t]["end"].slice(0, 2));
					task.setEndDate(endDate);

					if(PstartDate == null || startDate < PstartDate) PstartDate = startDate;
					if(PendDate == null || endDate > PendDate) PendDate = endDate;

					if(typeof taskTeams[tasks[t]["team"]] == "undefined") taskTeams[tasks[t]["team"]] = new TaskTeam(tasks[t]["team"]);
					task.setTaskTeam(taskTeams[tasks[t]["team"]]);
					if(typeof zones[tasks[t]["zone"]] == "undefined") zones[tasks[t]["zone"]] = new Zone(tasks[t]["zone"]);
					task.setZone(zones[tasks[t]["zone"]]);

					for(let o in tasks[t]["GUID"]){
						const object3D = new Object3D(tasks[t]["GUID"][o], tasks[t]["GUID"][o]);
						object4D.addObject3D(object3D);
					}

					phase.addTask(task);
					task.setParentPhase(phase);
					phase.addObject4D(object4D);

				}

				phase.setStartDate(PstartDate);
				phase.setEndDate(PendDate);

				if(MstartDate == null || PstartDate < MstartDate) MstartDate = PstartDate;
				if(MendDate == null || PendDate > MendDate) MendDate = PendDate;

			}

			milestone.setStartDate(MstartDate);
			milestone.setEndDate(MendDate);

		}
		const phases = model.getPhases();
		for(let p in phases){
			const tasks = phases[p]["tasks"];
			for(let t in tasks){
				const actualTask = phase.getTask(t);

				const previousTask = phase.getTask(tasks[t]["previous"]);
				if(nextTask != null) actualTask.addFollowingTask(nextTask);

				const nextTask = phase.getTask(tasks[t]["next"]);
				if(previousTask != null) actualTask.addPreviousTask(previousTask);
			}
		}


		model.setStartDate(new Date());
		const timeline = new Timeline(model);

		return timeline;

	}

	//Version CSV 0.1
	static csv_v0_1(CSVFile = null, IFCFile = null, delimiterColumn=";", delimiterArray=","){

		//Errors
		if(CSVFile == null){
			throw 'CSVFile needed for import model';
		}
		if(IFCFile == null){
			throw 'IFCFile needed for import model';
		}

		const model = new Model();
		const milestone = new Milestone();
		model.addMilestone(milestone);
		const phase = new Phase();
		milestone.addPhase(phase);

		const contractor = new Contractor();
		phase.setContractor(contractor);

		//CSV Informations
		const lines = CSVFile.split('\n');
		lines.splice(0,1);

		const followings = [];
		const teams = [];
		let startDate = null;

		for(let l in lines){
			if(lines[l] != ""){
				const columns = lines[l].split(delimiterColumn);

				//4D Object
				const obj4D = new Object4D("noName", columns[0]);//, IFCFile);
				phase.addObject4D(obj4D);

				const objects3D = columns[11].split(delimiterArray);
				for(let o in objects3D){
					const obj3D = new Object3D("", objects3D[o].replace(" ", ""));
					obj4D.addObject3D(obj3D);

				}

				//Tasks
				const task = new Task(columns[2], columns[1]);
				task.setObject4D(obj4D);
				if(columns[7] != 0) followings[followings.length] = {
					t : task,
					value : columns[7]
				};

				const operation = new Operation("temp", parseInt(columns[5]));
				task.addOperation(operation);

				let i = 0;
				let notExist = true;
				while(notExist && i < teams.length){
					if(teams[i].getName() == columns[10]){
						notExist = false;
					}
					i++;
				}

				if(notExist){
					teams[teams.length] = new TaskTeam(columns[10]);
					task.setTaskTeam(teams[teams.length - 1]);
				}else{
					task.setTaskTeam(teams[i-1]);
				}

				task.setZone(new Zone(columns[9]));

				phase.addTask(task);
				const newDate = new Date(columns[3].slice(6, 10), parseInt(columns[3].slice(3, 5)) - 1, columns[3].slice(0, 2));
				if(startDate == null || startDate > newDate){
					startDate = newDate;
				}

			}
		}
		//Following tasks
		for(let t in followings){
			followings[t].t.addFollowingTask(phase.getTask(followings[t].value));
		}
  
		model.setStartDate(startDate);
		const timeline = new Timeline(model);

		return timeline;

	}

}

export default Loader;
