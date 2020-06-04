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
	static #latestJSONVersion = "0.1";

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
					task.setDuration(tasks[t]["duration"]);
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