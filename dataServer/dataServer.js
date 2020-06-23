import express from 'express';
import Model from '../src/class/Model.class.js';
import cors from 'cors';
import fs from 'fs';
import bodyParser from 'body-parser';

// Read the contents of the directory /usr/local/bin asynchronously.
// The callback will be invoked once the operation has either completed
// or failed.
fs.readdir(__dirname + '/models', (err, files) => {
  // On error, show it and return
  if(err) return console.error(err);
  // Display directory entries
  //console.log(files.join(' '));
});

//const models = 


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

app.get("/model", (req, res)=>{
	res.sendFile(__dirname + "/models/" + req.query.name + ".json");
});

//Is available
app.get("/", (req, res)=>{
	res.send("available");
});

function saveModel(name, json){
	// writeFile function with filename, content and callback function
	fs.writeFile(__dirname + "/models/" + name + ".json", json, function (err) {
	  if (err) throw err;
	  console.log('Model file is created successfully.');
	});
}