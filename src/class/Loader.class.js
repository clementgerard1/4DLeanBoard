/**
 * @class Loader
 * @classdesc Loader is a static class which allow you to load model from a source.
 * @hideconstructor
 */

class Loader{

	static latestCSVVersion = "0.1";

	/**
		Load model from CSV
		@param {string} CSVFile csv informations.
		@param {string} IFCFile IFC file as string
		@param {string} [csvVersion=latest] Version of csv used.
		@static
	*/
	static fromCSVandIFC(CSVFile, IFCFile, csvVersion = this.latestCSVVersion){
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

		//CSV Informations
		const lines = CSVFile.split('\n');
		lines.splice(0,1);

		const followings = {};
		const starts = {};
		const teams = [];

		for(let l in lines){
			if(lines[l] != ""){
				const columns = lines[l].split(",");

				//4D Object
				const obj = new Object4D("noName", columns[0]);//, IFCFile);
				phase.addObject4D(obj);

				//Tasks
				const task = new Task(columns[2], columns[1]);
				task.setObject4D(obj);
				if(columns[6] == 0) starts[starts.length] = columns[6];
				if(columns[7] != 0) followings[task] = columns[7];

				const operation = new Operation("temp", columns[5]);
				task.addOperation(operation);


				phase.addTask(task);

			}
		}
		//Task parents
		for(let t in followings){
			//t.setParent
		}

		return model;

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