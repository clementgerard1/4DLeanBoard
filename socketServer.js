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

    const model = client.handshake.query.model;
    
    client.on("addViewer", () => {
        viewers.push({
            socket : client,
            model : model
        });
    });

    client.on("addW6", () => {
        w6s.push({
            socket : client,
            model : model
        });
    });

    client.on("addPlayer", () => {
        players.push({
            socket : client,
            model : model
        });
    });

    client.on("addFilter", () => {
        filters.push({
            socket : client,
            model : model
        });
    });

    client.on("highlightObject4D", (datas) => {
        //broadcast(client, model, "highlightObject4D", datas);
        client.broadcast.emit("highlightObject4D", datas);
    });

    client.on("highlightTask", (datas) => {
        //broadcast(client, model, "highlightTask", datas);
        client.broadcast.emit("highlightTask", datas);
    });

    client.on("setTime", (datas) => {
        //broadcast(client, model, "setTime", datas);
        client.broadcast.emit("setTime", datas);
    });

    client.on("setRequirement", (datas) => {
        //broadcast(client, model, "setRequirement", datas);
        client.broadcast.emit("setRequirement", datas);
    })

    client.on("setTaskState", (datas) => {
        //broadcast(client, model, "setTaskState", datas);
        client.broadcast.emit("setTaskState", datas);
    })

    client.on("pressHighlightTask", (datas) => {
        //broadcast(client, model, "pressHighlightTask", datas);
        client.broadcast.emit("pressHighlightTask", datas);
    })

    client.on("updateStateDisplay", (datas) => {
        //broadcast(client, model, "updateStateDisplay", datas);
        client.broadcast.emit("updateStateDisplay", datas);
    })

    client.on("clearHighlighting", (datas) => {
        //broadcast(client, model, "clearHighlighting", datas);
        client.broadcast.emit("clearHighlighting", datas);
    })
    
});

function broadcast(client, model, message, datas){
    for(let v in viewers){
        if(viewers[v].model == model && viewers[v].socket != client){
            viewers[v].socket.emit(message, datas);
        }
    }
    for(let p in players){
        if(players[p].model == model && players[p].socket != client){
            players[p].socket.emit(message, datas);
        }
    }
    for(let w in w6s){
        if(w6s[w].model == model && w6s[w].socket != client){
            w6s[w].socket.emit(message, datas);
        }
    }for(let f in filters){
        if(filters[f].model == model && filters[f].socket != client){
            filters[f].socket.emit(message, datas);
        }
    }
}

http.listen(socketPort, () => {
    console.log("socket server started on port " + socketPort + "...");
});
