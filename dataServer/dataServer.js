import express from 'express';
import Model from '../src/class/Model.class.js';
import fs from 'fs';

// Read the contents of the directory /usr/local/bin asynchronously.
// The callback will be invoked once the operation has either completed
// or failed.
fs.readdir(__dirname + '/models', (err, files) => {
  // On error, show it and return
  if(err) return console.error(err);
  // Display directory entries
  console.log(files.join(' '));
});

//const models = 


const app = express();
const port = 3002;



app.listen(port, ()=>{
    console.log("Data server launched on port " + port);
});

app.put("/model", ()=>{

});