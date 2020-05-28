import Model from "./Model.class.js";
import Milestone from "./Milestone.class.js";
import Phase from "./Phase.class.js";
import Task from "./Task.class.js";
import Object4D from "./Object4D.class.js";
import Operation from "./Operation.class.js";
import TaskTeam from "./TaskTeam.class.js";
import Timeline from "./Timeline.class.js";
import Level from "./Level.class.js";
import Zone from "./Zone.class.js";
import Contractor from "./Contractor.class.js";

/**
 * @class Loader
 * @classdesc Loader is a static class which allow you to load model from a source.
 * @hideconstructor
 */

class Loader{

	static #latestCSVVersion = "0.1";

	/**
		Load model from CSV
		@param {string} CSVFile csv informations.
		@param {string} IFCFile IFC file as string
		@param {string} [csvVersion=latest] Version of csv used.
		@static
	*/
	static fromCSVandIFC(CSVFile, IFCFile, csvVersion = this.#latestCSVVersion){
		return eval("this._v" + csvVersion.replace(".", "_")  + "(CSVFile, IFCFile)");
	}

	//Version CSV 0.1
	static _v0_1(CSVFile = null, IFCFile = null){

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
		const starts = [];
		const teams = [];
		let startDate = null;

		for(let l in lines){
			if(lines[l] != ""){
				const columns = lines[l].split(",");

				//4D Object
				const obj = new Object4D("noName", columns[0]);//, IFCFile);
				phase.addObject4D(obj);

				//Tasks
				const task = new Task(columns[2], columns[1]);
				task.setObject4D(obj);
				if(columns[6] == 0) starts[starts.length] = task;
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
				const newDate = new Date(columns[3].slice(6, 10), columns[3].slice(3, 5), columns[3].slice(0, 2));
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
		const timeline = new Timeline(model, starts);

		return timeline;

	}

	/**
		Load model from server
		@param {string} id Identifiant.
		@param {string} pwd Password.
		@static
	*/
	static fromServer(id, pwd, version){

	}

}

export default Loader;