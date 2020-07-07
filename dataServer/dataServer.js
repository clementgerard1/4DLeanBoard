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
				  		fs.readFile(__dirname + '/models/models' + '/' + files[f], 'utf8', (err, data)=>{

				  			fs.readFile(__dirname + '/models/ifc' + '/' + files[f].split('.').slice(0, -1).join('.') + ".ifc", 'utf8', (err, data2)=>{
					  			const ext = files[f].split('.')[1];
				  				if(ext == "json" || ext == "csv"){
					  				let model = null;
					  				if(ext == "json"){
										model = Loader.fromJSONandIFC(data, data2);

										const json = model.serialize();
										frag2ID[files[f].split('.').slice(0, -1).join('.')] = model.getFragToIdsArray();
										saveModel(files[f].split('.').slice(0, -1).join('.'), json);
									}else if(ext == "csv"){
										model = Loader.fromCSVandIFC(data, data2);
										const json = model.serialize();
										frag2ID[files[f].split('.').slice(0, -1).join('.')] = model.getFragToIdsArray();
										saveModel(files[f].split('.').slice(0, -1).join('.'), json);
									}
								}
								count++;
								if(count == files.length){
								  resolve(frag2ID);
								}
							});

						});
				 	}else{
				  		count++;
				  	}
			  	}else{
			  		count++;
			  	}
		  	}

		});
	});
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
					count++;
					if(count == files.length){
						resolve();
					}

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
				fs.readdir(__dirname + '/models/models_serialized', (err, files) => {

						  // On error, show it and return
						  if(err) return console.error(err);

						  // Display directory entries
						  let count = 0;
						  for(let f in files){

						  	if(files[f].charAt(0) != "."){
							  	Utils.createForgeBucket(oAuth, files[f].split('.').slice(0, -1).join('.'))
									.then( oAuth => {
										return Utils.uploadIFCFileToForge(oAuth, files[f].split('.').slice(0, -1).join('.'), __dirname + '/models/ifc_modified' + '/' + files[f].split('.').slice(0, -1).join('.') + ".ifc");
									})
									.then( datas => {
										urns[files[f].replace(".json", "")] = datas.manifest.urn;
									}).catch( error => {
										console.error(error);
									});
								}

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
		res.sendFile(__dirname + "/models/models_serialized/" + req.query.name + ".json");
		console.log(models, req.query.name);
		const toReturn = {
			model : models[req.query.name].serialize(),
			urn : urns[req.query.name],
		}
		res.json(toReturn);
	});

	app.patch("/requirement", (req, res)=>{
		const model = models[req.query.modelname];
		const tasks = model.getTasks();
		for(let t in tasks){
			const requirement = tasks[t].getRequirementById(req.query.requirementid);
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
	console.log(name);
	// writeFile function with filename, content and callback function
	fs.writeFile(__dirname + "/models/models_serialized/" + name + ".json", json, function (err) {
	  if (err) throw err;
	  console.log('Model file is created/updated successfully.');
	});
}