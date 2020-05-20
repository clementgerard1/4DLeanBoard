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
	static fromCSVandIFC(CSVFile, IFCFile, csvVersion){
		if(typeof version == "undefined"){
			version = this.latestCSVVersion;
		}
		return eval("this._v" + version.replace(".", "_")  + "(CSVFile, IFCFile)");
	}

	//Version CSV 0.1
	static _v0_1(CSVFile, IFCFile){

		const model = new Model();

		//CSV Informations
		const lines = CSVFile.split('\n');
		lines.splice(0,1);

		const parents = {};
		for(let l in lines){
			if(lines[l] != ""){
				colones = lines[l].split(",");

				//4D Object
				const obj = new Object4D(colones[0], IFCFile);
				model.addObject4D(obj);

				//Tasks
				const task = new Task(colones[1], new Date(colones[3]), new Date(colones[4]));
				if(colones[6] != 0) parents[task] = colones[6];
				task.setName(colones[2]);
				obj.addTask(task);

			}
		}
		//Task parents
		for(let t in parents){
			t.setParent
		}

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

module.exports = Loader;