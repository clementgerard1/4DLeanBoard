const express = require('express');
const app = express();
const fs = require('fs');
const config = require("./config.js");
const io = require('socket.io')();

//Hack tablette console
let logScript = `
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.3.0/socket.io.js"></script>
<script>`;
	
	if(config["socketConsoleIP"] == "localhost"){
		 logScript += "const logSocket = io.connect(window.location.host.replace('3000', " + config["socketConsolePort"] + "));"
	}else{
		logScript += "const logSocket = io.connect(window.location.host.replace(" + config["socketConsoleIP"] + ", " + config["socketConsolePort"] + "));"
	}

  logScript += `
  const log = console.log.bind(console);
  console.log = (...args) => {
    log(...args);
    sendToServerConsole("log",args);
  }
  const error = console.error.bind(console);
  console.error = (...args) => {
    error(...args);
    sendToServerConsole("error", args);
  }
  function sendToServerConsole(type, args){
  	 logSocket.emit("message", {
  	 		t : type,
  	 		a : args
  	 });
  }
</script>`;
if(config["socketConsole"]){
	io.on("connection", function(client){
		client.on("message", function(msg){
			if(msg.t == "log"){
				console.log(msg.a);
			}
			if(msg.t == "error"){
				console.error(msg.a);
			}
		});
	});
	io.listen(config["socketConsolePort"]);
}
//End hack tablette

if(process.argv[2] == "dev"){
 
	app.get('/', function(req,res){
		if(config["socketConsole"]){
			fs.readFile(__dirname + '/public/index.html', "utf8", function(err, html){
				res.send(html.slice(0, html.indexOf("<body>")) + logScript + html.slice(html.indexOf("<body>") + 6));
			});
		}else{
			res.sendFile(__dirname + '/public/index.html');
		}
	});

	app.get('/3D', function(req,res){
		if(config["socketConsole"]){
			fs.readFile(__dirname + '/public/3D.html', "utf8", function(err, html){
				res.send(html.slice(0, html.indexOf("<body>")) + logScript + html.slice(html.indexOf("<body>") + 6));
			});
		}else{
			res.sendFile(__dirname + '/public/3D.html');
		}
	});

		app.get('/W6', function(req,res){
		if(config["socketConsole"]){
			fs.readFile(__dirname + '/public/W6.html', "utf8", function(err, html){
				res.send(html.slice(0, html.indexOf("<body>")) + logScript + html.slice(html.indexOf("<body>") + 6));
			});
		}else{
			res.sendFile(__dirname + '/public/W6.html');
		}
	});

	app.get('/datas/:url',function(req,res){
		if(req.params.url != "favicon.ico"){
			if(fs.existsSync(__dirname + '/public/datas/' + req.params.url)){
	    	res.sendFile(__dirname + '/public/datas/' + req.params.url);
	    }else{
	    	res.sendFile(__dirname + '/dev/' + req.params.url);
	    }
		}else{
			res.status(404).send(null);
		}
	});

	app.get('/:url',function(req,res){
		if(req.params.url != "favicon.ico"){
			if(fs.existsSync(__dirname + '/public/' + req.params.url)){
	    	res.sendFile(__dirname + '/public/' + req.params.url);
	    }else{
	    	res.sendFile(__dirname + '/dev/' + req.params.url);
	    }
		}else{
			res.status(404).send(null);
		}
	});
	 
	app.listen(3000);
	console.log('\x1b[32m', "SERVER STARTED ON PORT 3000, DEV MODE...", '\x1b[0m');

}else if(process.argv[2] == "test"){

	app.get('/', function(req,res){
		if(!req.query.test){
			if(config["socketConsole"]){
				fs.readFile(__dirname + '/test-pages/public/index.html', "utf8", function(err, html){
					res.send(html.slice(0, html.indexOf("<body>")) + logScript + html.slice(html.indexOf("<body>") + 6));
				});
			}else{
				res.sendFile(__dirname + '/test-pages/public/index.html');
			}
		}
	});

	app.get('/index.js', function(req,res){
		if(!req.query.test){
			res.sendFile(__dirname + '/test-pages/build/index.js');
		}
	});

	app.get('/entry.js', function(req,res){
		if(!req.query.test){
			res.sendFile(__dirname + '/test-pages/build/entry.js');
		}
	});

	app.get('/entryVue.js', function(req,res){
		if(!req.query.test){
			res.sendFile(__dirname + '/test-pages/build/entryVue.js');
		}
	});

	app.get('/:url',function(req,res){
		if(req.params.url != "favicon.ico"){
			if(fs.existsSync(__dirname + '/test-pages/public/' + req.params.url + "/index.html")){
				if(config["socketConsole"]){
					fs.readFile(__dirname + '/test-pages/public/' + req.params.url + "/index.html", "utf8", function(err, html){
						res.send(html.slice(0, html.indexOf("<body>")) + logScript + html.slice(html.indexOf("<body>") + 6));
					});
				}else{
					res.sendFile(__dirname + '/test-pages/public/' + req.params.url + "/index.html");
				}
			}else if(fs.existsSync(__dirname + '/test-pages/public/' + req.params.url)){
	    	res.sendFile(__dirname + '/test-pages/public/' + req.params.url);
	    }else{
	    	res.sendFile(__dirname + '/test-pages/' + req.params.url);
	    }
		}else{
			res.status(404).send(null);
		}
	});

	app.get('/:url/:file',function(req,res){
		if(fs.existsSync(__dirname + '/test-pages/public/' + req.params.url + "/" + req.params.file)){
    	res.sendFile(__dirname + '/test-pages/public/' + req.params.url + "/" + req.params.file);
		}else{
			res.status(404).send(null);
		}
	});
	 
	app.listen(3000);
	console.log('\x1b[32m', "SERVER STARTED ON PORT 3000, DEV MODE...", '\x1b[0');


}else{

	app.get('/', function (req, res) {
	  res.sendFile(__dirname + "/dist/index.html");
	});

	app.get('/3D', function(req,res){
		res.sendFile(__dirname + '/dist/3D.html');
	});

	app.get('/W6', function(req,res){
		res.sendFile(__dirname + '/dist/W6.html');
	});

	app.get('/:url',function(req,res){
		if(req.params.url != "favicon.ico"){
	    res.sendFile(__dirname + '/dist/' + req.params.url);
		}else{
			res.status(404).send(null);
		}
	});

	app.get('/*',function(req,res){
		if(req.params.url != "favicon.ico"){
	    res.sendFile(__dirname + '/dist' + req.url);
		}else{
			res.status(404).send(null);
		}
	});
	 
	app.listen(80);
	console.log('\x1b[32m', "SERVER STARTED ON STANDART PORT 80, PROD MODE...", '\x1b[0m');

}