const express = require('express')
const app = express();

const port = 3002;


app.listen(port, ()=>{
    console.log("Data server launched on port " + port);
});
