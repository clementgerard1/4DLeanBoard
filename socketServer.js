const express = require('express')
const app = express();
var http = require('http').createServer(app);
const io = require('socket.io')(http);

const socketPort = 3001;

const viewers = [];
const w6s = [];

io.on("connection", function(client){


    client.on("addViewer", () => {
        viewers.push(client);
    });

    client.on("addW6", () => {
        w6s.push(client);
    });

    client.on("highlightObject4D", (datas) => {
        client.broadcast.emit("highlightObject4D", datas);
    });

    client.on("highlightTask", (datas) => {
        client.broadcast.emit("highlightTask", datas);
    });

    client.on("setTime", (datas) => {
        client.broadcast.emit("setTime", datas);
    });

});

http.listen(socketPort, () => {
    console.log("socket server started on port " + socketPort + "...");
});
