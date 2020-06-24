const express = require('express')
const app = express();
var http = require('http').createServer(app);
const io = require('socket.io')(http);

const socketPort = 3001;

const viewers = [];
const players = [];
const w6s = [];
const filters = [];

io.on("connection", function(client){


    client.on("addViewer", () => {
        viewers.push(client);
    });

    client.on("addW6", () => {
        w6s.push(client);
    });

    client.on("addPlayer", () => {
        players.push(client);
    });

    client.on("addFilter", () => {
        filters.push(client);
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

    client.on("setRequirement", (datas) => {
        client.broadcast.emit("setRequirement", datas);
    })

    client.on("setTaskState", (datas) => {
        client.broadcast.emit("setTaskState", datas);
    })

    client.on("pressHighlightTask", (datas) => {
        client.broadcast.emit("pressHighlightTask", datas);
    })

    client.on("updateStateDisplay", (datas) => {
        client.broadcast.emit("updateStateDisplay", datas);
    })

    client.on("clearHighlighting", (datas) => {
        client.broadcast.emit("clearHighlighting", datas);
    })
    
});

http.listen(socketPort, () => {
    console.log("socket server started on port " + socketPort + "...");
});
