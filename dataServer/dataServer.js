import express from 'express';
import Model from '../src/class/Model.class.js';
import Loader from '../src/class/Loader.class.js';
import Utils from '../src/class/Utils.class.js';
import Config from "../config.js";
import cors from 'cors';
import fs from 'fs';
import bodyParser from 'body-parser';

// Read the contents of the directory /usr/local/bin asynchronously.
// The callback will be invoked once the operation has either completed
// or failed.


const models = [];
const urns = [];
const ifcProperties = [];
init();

function init(){
	getNewModels().then(getNewIfcFiles).then(updateForge).then(getSerializedModels).then(launchServer).catch(error => console.error(error));

}

function getNewModels(){

	return new Promise((resolve, reject) => {

		fs.readdir(__dirname + '/models/models', (err, files) => {

		  // On error, show it and return
		  if(err) return console.error(err);

		  // Display directory entries
		  let count = 0;
		  let frag2ID = []; 
		  for(let f in files){
		  	if(!fs.lstatSync(__dirname + '/models/models' + '/' + files[f]).isDirectory()){
		  		if(!fs.existsSync(__dirname + '/models/models_serialized' + '/' + files[f].split('.').slice(0, -1).join('.') + ".json")){
				  		const data = fs.readFileSync(__dirname + '/models/models' + '/' + files[f], 'utf8');

				  		const ifcFiles = [];
			  			const ifcDir = fs.readdirSync(__dirname + '/models/ifc');
			  			for(let ff in ifcDir){
			  				if(ifcDir[ff].slice(0, 1) != "."){
				  				if(!fs.lstatSync(__dirname + '/models/ifc/' + ifcDir[ff]).isDirectory()){
				  					ifcFiles.push(fs.readFileSync(__dirname + '/models/ifc' + '/' + ifcDir[ff], 'utf8'));
				  				}else{
				  					const ifcDir2 = fs.readdirSync(__dirname + '/models/ifc/' + ifcDir[ff]);
				  					for(let fff in ifcDir2){
				  						ifcFiles.push(fs.readFileSync(__dirname + '/models/ifc/' + ifcDir[ff] + "/" + ifcDir2[fff], 'utf8'));
				  					}
				  				}
				  			}
			  				
			  				//const data2 = fs.readFileSync(__dirname + '/models/ifc' + '/' + ifcDir[ff].split('.').slice(0, -1).join('.') + ".ifc", 'utf8');
			  			}



			  			const ext = files[f].split('.')[1];
		  				if(ext == "json" || ext == "csv"){
			  				let model = null;
			  				if(ext == "json"){
								model = Loader.fromJSONandIFC(data, data2);
								model.setName(files[f].split('.').slice(0, -1));
								const json = model.serialize();
								frag2ID[files[f].split('.').slice(0, -1).join('.')] = model.getFragToIdsArray();
								saveModel(files[f].split('.').slice(0, -1).join('.'), json);
							}else if(ext == "csv"){
								model = Loader.fromCSVandIFCS(data, ifcFiles);
								model.setName(files[f].split('.').slice(0, -1));
								const json = model.serialize();
								frag2ID[files[f].split('.').slice(0, -1).join('.')] = model.getFragToIdsArray();
								saveModel(files[f].split('.').slice(0, -1).join('.'), json);
							}
						}
						count++;
						if(count == files.length){
						  resolve(frag2ID);
						}

							/*fs.readFile(__dirname + '/models/ifc' + '/' + files[f].split('.').slice(0, -1).join('.') + ".rvt", 'utf8', (err, data2)=>{
				  				
					  			const ext = files[f].split('.')[1];
				  				if(ext == "json" || ext == "csv"){
					  				let model = null;
					  				if(ext == "json"){
										model = Loader.fromJSONandRVT(data, data2);
										model.setName(files[f].split('.').slice(0, -1));
										const json = model.serialize();
										frag2ID[files[f].split('.').slice(0, -1).join('.')] = model.getFragToIdsArray();
										saveModel(files[f].split('.').slice(0, -1).join('.'), json);
									}else if(ext == "csv"){
										model = Loader.fromJSONandRVT(data, data2);
										model.setName(files[f].split('.').slice(0, -1));
										const json = model.serialize();
										frag2ID[files[f].split('.').slice(0, -1).join('.')] = model.getFragToIdsArray();
										saveModel(files[f].split('.').slice(0, -1).join('.'), json);
									}
								}
								count++;
								if(count == files.length){
								  resolve(frag2ID);
								}
							});*/
				 	}else{
				  	count++;
			  	}
		  	}else{
		  		count++;
		  	}
		  	if(count == files.length){
				  resolve(frag2ID);
				}
	  	}

		});
	});
	resolve(null);
}

function getNewIfcFiles(fragToIds){
	return new Promise((resolve, reject) => {
		fs.readdir(__dirname + '/models/ifc', (err, files) => {

		  	// On error, show it and return
		  	if(err) return console.error(err);

		  	// Display directory entries
		  	let count = 0;
		  	for(let f in files){
		  		if(!fs.lstatSync(__dirname + '/models/ifc' + '/' + files[f]).isDirectory()){
		  			const ext = files[f].split('.')[1];
		  			if(ext == "ifc"){
		  				if(!fs.existsSync(__dirname + '/models/ifc_modified' + '/' + files[f].split('.').slice(0, -1).join('.') + ".ifc")){
			  				if(files[f].split('.').slice(0, -1).join('.') != ""){
						  		fs.readFile(__dirname + '/models/ifc' + '/' + files[f], 'utf8', (err, data)=>{

						  			fs.writeFile(__dirname + "/models/ifc_modified/" + files[f].split('.').slice(0, -1).join('.') + ".ifc", Loader.createIFCFileWithId(data, fragToIds[files[f].split('.').slice(0, -1).join('.')]), function (err) {
									  	if (err) throw err;
									  	console.log('Modified IFC created.');
										});

								});
						  	}
						}
		  			}else if(ext == "rvt"){
		  				if(!fs.existsSync(__dirname + '/models/ifc_modified' + '/' + files[f].split('.').slice(0, -1).join('.') + ".rvt")){
			  				fs.copyFile(__dirname + '/models/ifc' + '/' + files[f].split('.').slice(0, -1).join('.') + ".rvt", __dirname + '/models/ifc_modified' + '/' + files[f].split('.').slice(0, -1).join('.') + ".rvt", (err) => {
							  if (err) throw err;
							  console.log('source.txt was copied to destination.txt');
							});
						}
		  			}
					

			 	}else{

			 		const files2 = fs.readdirSync(__dirname + '/models/ifc/' + files[f]);

			 		for(let ff in files2){
			 			const ext = files2[ff].split('.')[1];
		  				if(ext == "ifc"){
			 				if(!fs.existsSync(__dirname + "/models/ifc_modified/" + files[f].toLowerCase() + "" + files2[ff].toLowerCase().split('.').slice(0, -1).join('.') + ".ifc")){
			 					if(files2[ff].split('.').slice(0, -1).join('.') != ""){
							  		fs.readFile(__dirname + "/models/ifc/" + files[f] + "/" + files2[ff].toLowerCase().split('.').slice(0, -1).join('.') + ".ifc", 'utf8', (err, data)=>{
							  			
					  					fs.writeFile(__dirname + "/models/ifc_modified/" + files[f].toLowerCase() + "_" + files2[ff].toLowerCase().split('.').slice(0, -1).join('.') + ".ifc", Loader.createIFCFileWithId(data, fragToIds[files2[ff].split('.').slice(0, -1).join('.')]), function (err) {
										  	if (err) throw err;
										  	console.log('Modified IFC created.');


											});

											//Get properties
											const props = Loader.createJSONfromIFC(data);
											if(typeof ifcProperties[files[f].toLowerCase()] == "undefined") ifcProperties[files[f].toLowerCase()] = [];
											ifcProperties[files[f].toLowerCase()][ifcProperties[files[f].toLowerCase()].length] = props;
											fs.writeFile(__dirname + "/models/ifc_properties/" + files[f].toLowerCase() + "_" + files2[ff].toLowerCase().split('.').slice(0, -1).join('.') + ".json", props, function (err) {
										  	if (err) throw err;
										  	console.log('Modified IFC properties created.');
											});

									});
							  }

							}

			 			}

			 		}

			 	}

			 	count++;
				if(count == files.length){
					resolve();
				}
		  	}

		});
	});

}

function updateForge(){
	return new Promise((resolve, reject) => {

		//Création du viewer
		let clientId = Config.autoDeskForgeSettings[Config.autoDeskAccount].clientId;
		let clientSecret = Config.autoDeskForgeSettings[Config.autoDeskAccount].clientSecret;
		Utils.getAutodeskAuth(clientId, clientSecret).then(
			oAuth => {
				fs.readdir(__dirname + '/models/ifc_modified', (err, files) => {

						  // On error, show it and return
						  if(err) return console.error(err);

						  // Display directory entries
						  let count = 0;
						  for(let f in files){

						  	const ext = files[f].split('.')[1];
		  					if(ext == "ifc"){

						  		if(files[f].charAt(0) != "."){
								  	Utils.createForgeBucket(oAuth, files[f].split('.').slice(0, -1).join('.'))
										.then( oAuth => {
											console.log("hey");
											return Utils.uploadIFCFileToForge(oAuth, files[f].split('.').slice(0, -1).join('.'), __dirname + '/models/ifc_modified' + '/' + files[f].split('.').slice(0, -1).join('.') + ".ifc");
										})
										.then( datas => {
											console.log("hoy");
											urns[files[f].replace(".ifc", "")] = datas.manifest.urn;
										}).catch( error => {
											console.error(error);
										});
								}
							}/*else if(ext == "rvt"){
								if(files[f].charAt(0) != "."){
								  	Utils.createForgeBucket(oAuth, files[f].split('.').slice(0, -1).join('.'))
										.then( oAuth => {

											return Utils.uploadRVTFileToForge(oAuth, files[f].split('.').slice(0, -1).join('.'), __dirname + '/models/ifc_modified' + '/' + files[f].split('.').slice(0, -1).join('.') + ".rvt");
										})
										.then( datas => {
											urns[files[f].replace(".ifc", "")] = datas.manifest.urn;
										}).catch( error => {
											console.error(error);
										});
								}
							}*/
							count++;
							if(count == files.length){
							  	resolve();
							}
						  }

				});
			}
		).catch( error => console.error(error));
	});
		
}

function getSerializedModels(){
	return new Promise((resolve, reject) => {

		fs.readdir(__dirname + '/models/models_serialized', (err, files) => {
		  // On error, show it and return
		  if(err) return console.error(err);

			  // Display directory entries
			  let count = 0;
			  for(let f in files){

		  		if(files[f].charAt(0) != "."){
				  	if(!fs.lstatSync(__dirname + '/models/models_serialized' + '/' + files[f]).isDirectory()){
					  	fs.readFile(__dirname + '/models/models_serialized' + '/' + files[f], 'utf8', (err, data)=>{
					  		const model = new Model();
					  		model.deserialize(data);
					  		models[files[f].replace(".json", "")] = model;
					  	});
					  }
					}

				  count++;
				  if(count == files.length){
				  	resolve();
				  }
			  }

		});
	});

}

function launchServer(){
	const port = 3003;
	const app = express();
	app.use(cors());
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(bodyParser.json())


	app.listen(port, ()=>{
	    console.log("Data server launched on port " + port);
	});

	app.post("/model", (req, res)=>{
		saveModel(req.body.name, req.body.model);
		models[req.body.name] = new Model();
		models[req.body.name].setName(req.body.name);
		models[req.body.name].deserialize(req.body.model);
		res.send('Model saved');
	});

	app.get("/models", (req, res)=>{
		const toReturn = [];
		for(let m in models){
			toReturn.push(m);
		}
		res.json(toReturn);
	});

	app.get("/model", (req, res)=>{
		const urnSended  = [];
		for(let u in urns){
			if(u.slice(0, req.query.name.length) == req.query.name){
				urnSended.push(urns[u]);
			}
		}
		//res.sendFile(__dirname + "/models/models_serialized/" + req.query.name + ".json");
		const toReturn = {
			model : models[req.query.name].serialize(),
			ifcProperties : ifcProperties[req.query.name],
			urns : urnSended,
		}
		res.json(toReturn);
	});

	app.patch("/requirement", (req, res)=>{
		const model = models[req.query.modelname];
		const tasks = model.getTasks();
		for(let t in tasks){

			const requirement = tasks[t].getRequirementById(parseInt(req.query.requirementid));
			if(requirement != null) {
				requirement.setValue(req.query.requirementvalue === "true");
			};
		}
		saveModel(req.query.modelname, model.serialize());
		res.send('Requirement updated');
	});

	app.patch("/task/state", (req, res)=>{
		const model = models[req.query.modelname];
		const tasks = model.getTasks();
		for(let t in tasks){
			if(tasks[t].getId() == req.query.taskid){
				tasks[t].setDone(req.query.done === "true");
				tasks[t].setPaused(req.query.paused === "true");
			}
		}
		saveModel(req.query.modelname, model.serialize());
		res.send('TaskState updated');
	});

	//Is available
	app.get("/", (req, res)=>{
		res.send("available");
	});
}

function saveModel(name, json){
	// writeFile function with filename, content and callback function
	fs.writeFile(__dirname + "/models/models_serialized/" + name + ".json", json, function (err) {
	  if (err) throw err;
	  console.log('Model file is created/updated successfully.');
	});
}