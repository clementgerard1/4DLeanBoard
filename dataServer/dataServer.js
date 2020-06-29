import express from 'express';
import Model from '../src/class/Model.class.js';
import Loader from '../src/class/Loader.class.js';
import cors from 'cors';
import fs from 'fs';
import bodyParser from 'body-parser';

// Read the contents of the directory /usr/local/bin asynchronously.
// The callback will be invoked once the operation has either completed
// or failed.

const models = [];
getNewModels()

function getNewModels(){

	fs.readdir(__dirname + '/models/models', (err, files) => {

	  // On error, show it and return
	  if(err) return console.error(err);

	  // Display directory entries
	  for(let f in files){
	  	if(!fs.lstatSync(__dirname + '/models/models' + '/' + files[f]).isDirectory()){
	  		if(!fs.existsSync(__dirname + '/models/models_serialized' + '/' + files[f].split('.').slice(0, -1).join('.'))){
			  	fs.readFile(__dirname + '/models/models' + '/' + files[f], 'utf8', (err, data)=>{

			  		fs.readFile(__dirname + '/models/ifc' + '/' + files[f].split('.').slice(0, -1).join('.') + ".ifc", 'utf8', (err, data2)=>{
							const model = Loader.fromJSONandIFC(data, data2);
							const json = model.serialize();
							saveModel(files[f].split('.').slice(0, -1).join('.'), json);
						});

					});
			  }
		  }
	  }

	});

	getSerializedModels();

}

function getSerializedModels(){

	fs.readdir(__dirname + '/models/models_serialized', (err, files) => {

	  // On error, show it and return
	  if(err) return console.error(err);

	  // Display directory entries
	  for(let f in files){
	  	if(!fs.lstatSync(__dirname + '/models/models_serialized' + '/' + files[f]).isDirectory()){
		  	fs.readFile(__dirname + '/models/models_serialized' + '/' + files[f], 'utf8', (err, data)=>{
		  		const model = new Model();
		  		model.deserialize(data);
		  		models[files[f].replace(".json", "")] = model;
		  	});
		  }
	  }

	});

	launchServer();

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
		res.sendFile(__dirname + "/models/" + req.query.name + ".json");
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
	// writeFile function with filename, content and callback function
	fs.writeFile(__dirname + "/models/models_serialized/" + name + ".json", json, function (err) {
	  if (err) throw err;
	  console.log('Model file is created/updated successfully.');
	});
}