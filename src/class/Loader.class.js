import Model from "./Model.class.js";
import Milestone from "./Milestone.class.js";
import Phase from "./Phase.class.js";
import Task from "./Task.class.js";
import Person from "./Person.class.js";
import Object4D from "./Object4D.class.js";
import Object3D from "./Object3D.class.js";
import Operation from "./Operation.class.js";
import TaskTeam from "./TaskTeam.class.js";
import Timeline from "./Timeline.class.js";
import Level from "./Level.class.js";
import Zone from "./Zone.class.js";
import Contractor from "./Contractor.class.js";
import Requirement from "./Requirement.class.js";
import Utils from "./Utils.class.js";
import Day from "./Day.class.js";

/**
 * @class Loader
 * @classdesc Loader is a static class which allow you to load model from a source.
 * @hideconstructor
 */

class Loader{

	static #latestCSVVersion = "0.2";
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
		"IFCSTAIR",
		"IFCFURNISHINGELEMENT",
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
		Load model from CSV
		@param {string} CSVFile csv informations.
		@param {Array} IFCFiles IFC file as string
		@param {string} [delimiterColumn=,]
		@param {string} [delimiterArray=;]
		@param {string} [csvVersion=latest] Version of csv used.
		@static
	*/
	static fromCSVandIFCS(CSVFile, IFCFiles, delimiterColumn = ";", delimiterArray = ",", csvVersion = this.#latestCSVVersion){

		return eval("this.csv_v" + csvVersion.replace(".", "_")  + "(CSVFile, IFCFiles,`" + delimiterColumn + "`,`" + delimiterArray + "`)");
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

	static csv_v0_2(csv, ifcs){

		const json = {
			name: null,
			milestones : [],
			teams : [],
			holidays : []
		}

		let memoMilestone = null;
		let memoPhase = null;
		let memoTask = null;

		const lines = csv.split('\n');
		lines.forEach(function (value, i) {
			const columns = value.split(';');
			if(columns.length > 1){
				if(i==0){
					json.name = columns[0];
				}else if(i>1){

					//New milestone
					if(columns[0] != ''){
						json.milestones[json.milestones.length] = {};
						json.milestones[json.milestones.length - 1]["Num"] = columns[0];
						json.milestones[json.milestones.length - 1]["Name"] = columns[1];
						json.milestones[json.milestones.length - 1]["StartDate"] = columns[2];
						json.milestones[json.milestones.length - 1]["EndDate"] = columns[3];
						json.milestones[json.milestones.length - 1]["Previous"] = columns[4];
						json.milestones[json.milestones.length - 1]["Next"] = columns[5];
						if(columns[1] == columns[2]){
							json.milestones[json.milestones.length - 1]["Event"] = true;
							json.milestones[json.milestones.length - 1]["Next"] = columns[1];
						}else{
							json.milestones[json.milestones.length - 1]["Event"] = false;
							json.milestones[json.milestones.length - 1]["Next"] = null;
						}
						json.milestones[json.milestones.length - 1]["Requirements"] = [];
						json.milestones[json.milestones.length - 1]["Phases"] = [];
						memoMilestone = json.milestones.length - 1;

					}

					//New phase
					if(columns[6] != ''){
						const milestone = json.milestones[memoMilestone];
						milestone["Phases"][milestone["Phases"].length] = {};

						milestone["Phases"][milestone["Phases"].length - 1]["Num"] = columns[6];
						milestone["Phases"][milestone["Phases"].length - 1]["Name"] = columns[7];
						milestone["Phases"][milestone["Phases"].length - 1]["StartDate"] = columns[8];
						milestone["Phases"][milestone["Phases"].length - 1]["EndDate"] = columns[9];
						milestone["Phases"][milestone["Phases"].length - 1]["Previous"] = columns[10];
						milestone["Phases"][milestone["Phases"].length - 1]["Requirements"] = columns[11];
						milestone["Phases"][milestone["Phases"].length - 1]["Tasks"] = [];

						memoPhase = milestone["Phases"].length - 1;
					}

					//New task
					if(columns[12] != ''){
						const phase = json.milestones[memoMilestone]["Phases"][memoPhase];
						phase["Tasks"][phase["Tasks"].length] = {};

						phase["Tasks"][phase["Tasks"].length - 1]["Name"] = columns[12];
						phase["Tasks"][phase["Tasks"].length - 1]["TID"] = columns[13];
						phase["Tasks"][phase["Tasks"].length - 1]["StartDate"] = columns[14];
						phase["Tasks"][phase["Tasks"].length - 1]["EndDate"] = columns[15];
						phase["Tasks"][phase["Tasks"].length - 1]["Duration"] = columns[16];
						phase["Tasks"][phase["Tasks"].length - 1]["Workers"] = columns[17];
						phase["Tasks"][phase["Tasks"].length - 1]["Previous"] = columns[18];
						phase["Tasks"][phase["Tasks"].length - 1]["Team"] = columns[19];
						phase["Tasks"][phase["Tasks"].length - 1]["IDS4D"] = columns[20];
						phase["Tasks"][phase["Tasks"].length - 1]["Level"] = columns[21];
						phase["Tasks"][phase["Tasks"].length - 1]["Zone"] = columns[23];
						phase["Tasks"][phase["Tasks"].length - 1]["Description"] = columns[24];
						phase["Tasks"][phase["Tasks"].length - 1]["State"] = columns[25];
						phase["Tasks"][phase["Tasks"].length - 1]["Requirements"] = {
							"Constraint" : columns[26] != "No", 
							"Information" : columns[27] != "No",
							"Materials" : columns[28] != "No",
							"Manpower" : columns[29] != "No",
							"Equipement" : columns[30] != "No",
							"Safety" : columns[31] != "No",
							"Space" : columns[32] != "No",
						}
						memoTask = phase["Tasks"].length - 1;
					}


					//Teams
					if(columns[33] != '' && typeof columns[33] != "undefined"){

						json.teams[json.teams.length] = {
							name : columns[33],
							color : columns[34].replace("\r", ""),
							bossName : columns[35].replace("\r", ""),
							bossMail : columns[36].replace("\r", ""),
							bossPhone : columns[37].replace("\r", ""),
							teamPersons : columns[38].replace("\r", "").split(","),
						}
					}

					if(columns[39].replace("\r", "") != ''){
						json.holidays.push(columns[39].replace("\r", ""));
					}

				}
			}
		});

		return Loader.json_v0_4(JSON.stringify(json), ifcs);
	}
	static json_v0_4(json, ifcs){
		let rvt = false;
		//Errors
		if(json == null){
			throw 'JsonFile needed for import model';
		}
		if(ifcs == null){
			//throw 'IfcFile needed for import model';
			rvt = true;
		}

		//Parse IFC file
		let obj3Ds = {};
		if(!rvt){
			for(let f in ifcs){
				const ifc = ifcs[f];
				const IFClines = ifc.split('\n');
				for(let l in IFClines){
					const ifcDef = /(IFC[A-Z]*)\(([ \-'_:$#A-Z0-9a-z]*),([ \-'_:$#A-Z0-9a-z]*),([ \-'_:$#A-Z0-9a-z]*),([ \-'_:$#A-Z0-9a-z]*),([ \-'_:$#A-Z0-9a-z]*),([ \-'_:$#A-Z0-9a-z]*),([ \-'_:$#A-Z0-9a-z]*),([ \-'_:$#A-Z0-9a-z]*)/g;
					const result = ifcDef.exec(IFClines[l]);
					if(result != null && this.#ifcBuildingElements.includes(result[1])){
						obj3Ds[result[9].replace(/['"]/gi, "")] = 
							{
								name : result[4].replace(/['"]/gi, ""),
								id : result[9].replace(/['"]/gi, "")
							}
					}
				}
			}
		}

		const infos = JSON.parse(json);
		console.log(infos);
		const model = new Model();

		const contractors = [];
		const taskTeams = [];
		const zones = [];


		const tasksForPreviousNext = {};
		const phasesForPreviousNext = {};
		const tasksCollection = [];
		const phasesCollection = [];

		const milestones = infos["milestones"];

		//Teams
		for(let i in infos.teams){
			taskTeams[infos.teams[i].name] = new TaskTeam(infos.teams[i].name);

			//Boss 
			const boss = new Person(infos.teams[i].bossName);
			boss.setEmail(infos.teams[i].bossMail);
			boss.setPhone(infos.teams[i].bossPhone);
			taskTeams[infos.teams[i].name].setBoss(boss);
			//TeamPersons
			for(let p in infos.teams[i].teamPersons){
				const person = new Person(infos.teams[i].teamPersons[p]);
				taskTeams[infos.teams[i].name].addPerson(person);
			}

			//taskTeams[infos.teams[i].name].setLeader("Michel Dupond", "michel@dupond.com", "06 35 48 03 02");
			taskTeams[infos.teams[i].name].setColorClass(infos.teams[i].color);
		}

		//Holidays
		for(let h in infos.holidays){
			if(infos.holidays[h] != ''){
				const hd = new Day(new Date(Utils.getFormatedDate2(infos.holidays[h])));
				model.addHoliday(hd);
			}
		}
		//Model
		for(let m in milestones){

			let milestone = null;
			if(milestones[m]["Event"]){
				milestone = new Milestone(milestones[m]["Name"], true);
			}else{
				milestone = new Milestone(milestones[m]["Name"]);
			}
			milestone.setNum(milestones[m]["Num"]);

			model.addMilestone(milestone);
			for(let r in milestones[m]["Requirements"]){
				const requirement = new Requirement(milestones[m]["Requirements"][r]);
				milestone.addRequirement(requirement);
			}

			const startDate = new Date(Utils.getFormatedDate2(milestones[m]["StartDate"]));
			milestone.setStartDate(startDate);
			const endDate = new Date(Utils.getFormatedDate2(milestones[m]["EndDate"]));
			milestone.setEndDate(endDate);

			const phases = milestones[m]["Phases"];
			for(let p in phases){
				const phase = new Phase(phases[p]["Name"]);
				if(typeof contractors["facticeContractor"] == "undefined") contractors["facticeContractor"] = new Contractor("facticeContractor");
				phase.setContractor(contractors["facticeContractor"]);
				phase.setNum(phases[p]["Num"]);
				milestone.addPhase(phase);

				const PstartDate = new Date(Utils.getFormatedDate2(phases[p]["StartDate"]));
				phase.setStartDate(PstartDate);
				const PendDate = new Date(Utils.getFormatedDate2(phases[p]["EndDate"]));
				phase.setEndDate(PendDate);
				phase.setRequirementsString(phases[p]["Requirements"]);

				const tasks = phases[p]["Tasks"];
				let actualDate = PstartDate;

				phasesForPreviousNext[phase.getNum()] = {
					"previous" : phases[p]["Previous"],
				}
				phasesCollection[phase.getNum()] = phase;
				
				for(let t in tasks){
					if(tasks[t] != null){
						const task = new Task(tasks[t]["Name"], tasks[t]["TID"]);
						const object4D = new Object4D(tasks[t]["TID"], tasks[t]["TID"]);
						task.setObject4D(object4D);
						object4D.setTask(task);
						//task.setDuration(tasks[t]["Duration"]);
						
						//const startDate = actualDate;
						//const startDate = new Date(tasks[t]["Start"].slice(6, 10), parseInt(tasks[t]["Start"].slice(3, 5)) - 1, tasks[t]["Start"].slice(0, 2));
						//console.log("hey", startDate);
						const TstartDate = new Date(Utils.getFormatedDate2(tasks[t]["StartDate"]));
						task.setStartDate(TstartDate);
						//const endDate = Utils.addDaysToDate(startDate, parseInt(tasks[t]["Duration"]) - 1);
						//const endDate = new Date(tasks[t]["End"].slice(6, 10), parseInt(tasks[t]["End"].slice(3, 5)) - 1, tasks[t]["End"].slice(0, 2));
						const TendDate = new Date(Utils.getFormatedDate2(tasks[t]["EndDate"]));
						task.setEndDate(TendDate);


						actualDate = endDate;

						//const teams = taskTeams[tasks[t]["Team"]].split(",");
						task.setTaskTeam(taskTeams[tasks[t]["Team"]]);
						task.setWorkers(parseInt(tasks[t]["Workers"]));
						if(typeof zones[tasks[t]["Zone"]] == "undefined") zones[tasks[t]["Zone"]] = new Zone(tasks[t]["Zone"]);
						task.setZone(zones[tasks[t]["Zone"]]);
						task.setDescription(tasks[t]["Description"]);
						task.setStateFromString(tasks[t]["State"]);

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

						if(tasks[t]["IDS4D"] != "Later"){
							const ids4D = tasks[t]["IDS4D"].split(",");
							for(let o in ids4D){
								if(typeof obj3Ds[ids4D[o].replace(/[ '"]/gi, "")] != "undefined"){
									const object3D = new Object3D(obj3Ds[ids4D[o].replace(/[ '"]/gi, "")].name, parseInt(obj3Ds[ids4D[o].replace(/[ '"]/gi, "")].id), ids4D[o].replace(/[ '"]/gi, ""));
									object4D.addObject3D(object3D);
									object3D.setParent(object4D);
								}
							}
						}

						phase.addTask(task);
						task.setParentPhase(phase);
						phase.addObject4D(object4D);
						object4D.setPhase(phase);
						tasksForPreviousNext[task.getId()] = {
							"previous" : tasks[t]["Previous"],
						}
						tasksCollection[task.getId()] = task;
					}

				}


			}

		}
		const phases = model.getPhases();
		for(let p in phases){
			const tasks = phases[p].getTasks();
			for(let t in tasks){
				const actualTask = tasks[t];

				if(tasksForPreviousNext[actualTask.getId()].previous != 0 && tasksForPreviousNext[actualTask.getId()].previous != null && tasksForPreviousNext[actualTask.getId()].previous != ""){
					const mults = tasksForPreviousNext[actualTask.getId()].previous.split(",");
					for(let m in mults){
						actualTask.addPreviousTask(tasksCollection[mults[m]]);
						tasksCollection[mults[m]].addFollowingTask(actualTask);
					}
				} 
			}
		}

		for(let p in phases){
			const actualPhase = phases[p];
			if(phasesForPreviousNext[actualPhase.getNum()].previous != 0 && phasesForPreviousNext[actualPhase.getNum()].previous != null && phasesForPreviousNext[actualPhase.getNum()].previous != ""){
				const mults = phasesForPreviousNext[actualPhase.getNum()].previous.split(",");
				for(let m in mults){
					actualPhase.addPreviousPhase(phasesCollection[mults[m]]);
					phasesCollection[mults[m]].addFollowingPhase(actualPhase);
				}
			} 
		}



		return model;
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
		for(let l in IFClines){
			const ifcDef = /(IFC[A-Z]*)\(([ \-'_:$#A-Z0-9a-z]*),([ \-'_:$#A-Z0-9a-z]*),([ \-'_:$#A-Z0-9a-z]*),([ \-'_:$#A-Z0-9a-z]*),([ \-'_:$#A-Z0-9a-z]*)/g;
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

			let milestone = null;
			if(milestones[m]["event"]){
				milestone = new Milestone(milestones[m]["Name"], true);
			}else{
				milestone = new Milestone(milestones[m]["Name"]);
			}
			milestone.setNum(milestones[m]["Num"]);

			model.addMilestone(milestone);
			for(let r in milestones[m]["requirements"]){
				const requirement = new Requirement(milestones[m]["requirements"][r]);
				milestone.addRequirement(requirement);
			}

			let MstartDate = null;
			let MendDate = null;

				
			
			if(milestones[m]["event"]){
				const date = new Date(milestones[m]["eventDate"].slice(6, 10), parseInt(milestones[m]["eventDate"].slice(3, 5)) - 1, milestones[m]["eventDate"].slice(0, 2));
				milestone.setStartDate(date);	
				milestone.setEndDate(date);
			}else{
				const phases = milestones[m]["phases"];
				for(let p in phases){
					const phase = new Phase(phases[p]["name"]);
					phase.setColorClass(phases[p]["color"]);
					if(typeof contractors[phases[p]["contractor"]] == "undefined") contractors[phases[p]["contractor"]] = new Contractor(phases[p]["contractor"]);
					phase.setContractor(contractors[phases[p]["contractor"]]);
					phase.setNum(phases[p]["num"]);
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

							if(typeof taskTeams[tasks[t]["Team"]] == "undefined") {
								taskTeams[tasks[t]["Team"]] = new TaskTeam(tasks[t]["Team"]);
								taskTeams[tasks[t]["Team"]].setColorClass(phases[p]["color"]);
							}
							task.setTaskTeam(taskTeams[tasks[t]["Team"]]);
							//taskTeams[tasks[t]["Team"]].setWorkers(tasks[t]["Workers"]);
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


		}
		const phases = model.getPhases();
		for(let p in phases){
			const tasks = phases[p].getTasks();
			for(let t in tasks){
				const actualTask = tasks[t];
				console.log("NON")
				if(tasksForPreviousNext[actualTask.getId()].previous != 0) actualTask.addPreviousTask(tasksCollection[tasksForPreviousNext[actualTask.getId()].previous]);
				if(tasksForPreviousNext[actualTask.getId()].next != 0) actualTask.addFollowingTask(tasksCollection[tasksForPreviousNext[actualTask.getId()].next]);
			}
		}


		model.setStartDate(new Date());

		return model;

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

		return model;

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

		return model;

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

		return model;

	}

	static createJSONfromIFC(ifcSource){
		const IFClines = ifcSource.split('\n');
		let newFile = "";
		let count = 0;
		const tab = {};
		//Build ifc tab with index
		for(let l in IFClines){
			const regex = /#([0-9]*)=/;
			const result = regex.exec(IFClines[l]);
			if(result != null){
				tab[result[1]] = IFClines[l];
			}
		}

		const infos= {};

		for(let t in tab){
			//Properties
			const relDef = /(IFCRELDEFINESBYPROPERTIES)\(([\(\) \-'_:$#A-Z0-9a-z]*),([\(\) \-'_:$#A-Z0-9a-z]*),([\(\) \-'_:$#A-Z0-9a-z]*),([\(\) \-'_:$#A-Z0-9a-z]*),([\(\) \-'_:$#A-Z0-9a-z]*),([\(\) \-'_:$#A-Z0-9a-z]*)\)/g;
			const res1 = relDef.exec(tab[t]);
			if(res1 != null){

				//Propertiess
				infos[t] = {};
				const n = tab[res1[7].replace("#", "")];
				const relDef2 = /(IFCPROPERTYSET)\(([\\\(\) \-'_:$#A-Z0-9a-z]*),([\\\(\) \-'_:$#A-Z0-9a-z]*),([\\\(\) \-'_:$#A-Z0-9a-z]*),([\\\(\) \-'_:$#A-Z0-9a-z]*),([,\\\(\) \-'_:$#A-Z0-9a-z]*)\)/g;
				const res2 = relDef2.exec(n);
				if(res2 != null){
					infos[t]["desc"] = res2[4];
					//info1 = res2[4];
					const n2s = res2[6].replace("(", "").replace(")", "").split(",");
					for(let s in n2s){
						const n2 = tab[n2s[s].replace("#", "")];
						const relDef4 = /(IFCPROPERTYSINGLEVALUE)\(([/\.=+\\\(\) \-'_:$#A-Z0-9a-z]*),([/\.=+\\\(\) \-'_:$#A-Z0-9a-z]*),([/\.=+\\\(\) \-'_:$#A-Z0-9a-z]*),([/\.=+\\\(\) \-'_:$#A-Z0-9a-z]*)\)/g;
						const res3 = relDef4.exec(n2);
						infos[t][s] = {};
						infos[t][s][0] = 'IFCPROPERTYSINGLEVALUE';
						infos[t][s][1] = res3[2];
						infos[t][s][2] = res3[4].replace("IFCLABEL(", "").replace(")", "");
					}
				}else{
					 const relDef3 = /(IFCELEMENTQUANTITY)\(([/\.=+\\\(\) \-'_:$#A-Z0-9a-z]*),([/\.=+\\\(\) \-'_:$#A-Z0-9a-z]*),([/\.=+\\\(\) \-'_:$#A-Z0-9a-z]*),([/\.=+\\\(\) \-'_:$#A-Z0-9a-z]*),([/\.=+\\\(\) \-'_:$#A-Z0-9a-z]*),([,/\.=+\\\(\) \-'_:$#A-Z0-9a-z]*)\)/g;
					 const res3 = relDef3.exec(n);
						if(res3 != null){
							infos[t]["desc"] = res3[4];
							const n2s = res3[7].replace("(", "").replace(")", "").split(",");
							for(let s in n2s){
								const n2 = tab[n2s[s].replace("#", "")];
								const relDef4 = /(IFC[A-Z]*)\(([/\.=+\\\(\) \-'_:$#A-Z0-9a-z]*),([/\.=+\\\(\) \-'_:$#A-Z0-9a-z]*),([/\.=+\\\(\) \-'_:$#A-Z0-9a-z]*),([/\.=+\\\(\) \-'_:$#A-Z0-9a-z]*)\)/g;
								const res4 = relDef4.exec(n2);
								infos[t][s] = [];
								infos[t][s][0] = res4[1];
								infos[t][s][1] = res4[2];
								infos[t][s][2] = res4[5];
							}
						}
				}

				//Objects 3D
				const n2ss = res1[6].replace("(", "").replace(")", "").split(",");
				for(let s in n2ss){
					const n2 = tab[n2ss[s].replace("#", "")];
					const relDef5 = /(IFC[A-Z]*)\(([/\.=+\\\(\) \-'_:$#A-Z0-9a-z]*),([/\.=+\\\(\) \-'_:$#A-Z0-9a-z]*),([/\.=+\\\(\) \-'_:$#A-Z0-9a-z]*),([/\.=+\\\(\) \-'_:$#A-Z0-9a-z]*),([/\.=+\\\(\) \-'_:$#A-Z0-9a-z]*),([/\.=+\\\(\) \-'_:$#A-Z0-9a-z]*),([/\.=+\\\(\) \-'_:$#A-Z0-9a-z]*),([/\.=+\\ \-'_:$#A-Z0-9a-z]*)/g;
					const res5 = relDef5.exec(n2);
					if(res5 != null){
						infos[t].objs3D = [];
						infos[t].objs3D[infos[t].objs3D.length] = {};
						//console.log(res5);
						// switch(res5[1]){
							// case 'IFCWALLSTANDARDCASE' : 
							// 	infos[t].objs3D[infos[t].objs3D.length - 1].name = res5[4].slice(1, -1);
							// 	infos[t].objs3D[infos[t].objs3D.length - 1].tag = res5[9].slice(1, -1);
							// 	break;
							// case 'IFCDOOR' : 
							// 	console.log(res5, res5[9]);
							// 	infos[t].objs3D[infos[t].objs3D.length - 1].name = res5[4].slice(1, -1);
							// 	infos[t].objs3D[infos[t].objs3D.length - 1].tag = res5[9].slice(1, -1);
							// 	break;
							// case 'IFCCOLUMN' : 
							// 	infos[t].objs3D[infos[t].objs3D.length - 1].name = res5[4].slice(1, -1);
							// 	infos[t].objs3D[infos[t].objs3D.length - 1].tag = res5[9].slice(1, -1);
							// 	break;
							// case 'IFCPLATE' : 
							// 	infos[t].objs3D[infos[t].objs3D.length - 1].name = res5[4].slice(1, -1);
							// 	infos[t].objs3D[infos[t].objs3D.length - 1].tag = res5[9].slice(1, -1);
							// 	break;
							// case 'IFCWINDOW' : 
							// 	infos[t].objs3D[infos[t].objs3D.length - 1].name = res5[4].slice(1, -1);
							// 	infos[t].objs3D[infos[t].objs3D.length - 1].tag = res5[9].slice(1, -1);
							// 	break;
							// default : 
							infos[t].objs3D[infos[t].objs3D.length - 1].name = res5[4].slice(1, -1);
							infos[t].objs3D[infos[t].objs3D.length - 1].tag = res5[9].slice(1, -1);
						}
					// }

					//console.log(res5[1], infos[t].objs3D[infos[t].objs3D.length - 1].tag);
				}

			}
			
		}

		return JSON.stringify(infos);
	}

	//createIFCFileWithId
	static createIFCFileWithId(ifcSource, fragToIdArray){
		const IFClines = ifcSource.split('\n');
		let newFile = "";
		let count = 0;
		for(let l in IFClines){

			const ifcDef = /(IFC[A-Z]*)\(/g;
			let lineTemp = IFClines[l];
			const result = ifcDef.exec(IFClines[l]);
			if(result != null && this.#ifcBuildingElements.includes(result[1])){
				const idDef = /(IFC[A-Z]*)\(([ \-'_:$#A-Z0-9a-z]*),([ \-'_:$#A-Z0-9a-z]*),([ \-'_:$#A-Z0-9a-z]*),([ \-'_:$#A-Z0-9a-z]*),([ \-'_:$#A-Z0-9a-z]*),([ \-'_:$#A-Z0-9a-z]*),([ \-'_:$#A-Z0-9a-z]*),([ \-'_:$#A-Z0-9a-z]*)/g;
				const res = idDef.exec(IFClines[l]);
				if(res != null){
					const index = IFClines[l].indexOf(res[4]);
					const pos = index + res[4].length;
					if(res.input.charAt(index + res[4].length - res[9].length) != ":"){
						lineTemp = lineTemp.slice(0, pos - 1) + ":" + /*res[9].replace("'", "")*/ count++ + "'" + lineTemp.slice(pos);
					}
				}
			}
			newFile += lineTemp + "\n";
		}
		return newFile;
	}

}

export default Loader;
