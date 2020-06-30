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
        broadcast(client, model, "highlightObject4D", datas);
        //client.broadcast.emit("highlightObject4D", datas);
    });

    client.on("highlightTask", (datas) => {
        broadcast(client, model, "highlightTask", datas);
        //client.broadcast.emit("highlightTask", datas);
    });

    client.on("setTime", (datas) => {
        broadcast(client, model, "setTime", datas);
        //client.broadcast.emit("setTime", datas);
    });

    client.on("setRequirement", (datas) => {
        broadcast(client, model, "setRequirement", datas);
        //client.broadcast.emit("setRequirement", datas);
    })

    client.on("setTaskState", (datas) => {
        broadcast(client, model, "setTaskState", datas);
        //client.broadcast.emit("setTaskState", datas);
    })

    client.on("pressHighlightTask", (datas) => {
        broadcast(client, model, "pressHighlightTask", datas);
        //client.broadcast.emit("pressHighlightTask", datas);
    })

    client.on("updateStateDisplay", (datas) => {
        broadcast(client, model, "updateStateDisplay", datas);
        //client.broadcast.emit("updateStateDisplay", datas);
    })

    client.on("clearHighlighting", (datas) => {
        broadcast(client, model, "clearHighlighting", datas);
        //client.broadcast.emit("clearHighlighting", datas);
    })

    client.on("disconnect", function(){
        for(let v in viewers){
            if(viewers[v].socket.id == client.id){
                viewers.splice(v, 1);
            }
        }
        for(let p in players){
            if(players[p].socket.id == client.id){
                players.splice(p, 1);
            }
        }
        for(let w in w6s){
            if(w6s[w].socket.id == client.id){
                w6s.splice(w, 1);
            }
        }for(let f in filters){
            if(filters[f].socket.id == client.id){
                filters.splice(f, 1);
            }
        }
    });
    
});

function broadcast(client, model, message, datas){
    const already = [];
    for(let v in viewers){
        if(!already.includes(client.id) && viewers[v].model == model && viewers[v].socket.id != client.id){
            viewers[v].socket.emit(message, datas);
            already.push(client.id);
        }
    }
    for(let p in players){
        if(!already.includes(client.id) && players[p].model == model && players[p].socket.id != client.id){
            players[p].socket.emit(message, datas);
            already.push(client.id);
        }
    }
    for(let w in w6s){
        if(!already.includes(client.id) && w6s[w].model == model && w6s[w].socket.id != client.id){
            w6s[w].socket.emit(message, datas);
            already.push(client.id);
        }
    }for(let f in filters){
        if(!already.includes(client.id) && filters[f].model == model && filters[f].socket.id != client.id){
            filters[f].socket.emit(message, datas);
            already.push(client.id);
        }
    }
}

http.listen(socketPort, () => {
    console.log("socket server started on port " + socketPort + "...");
});
