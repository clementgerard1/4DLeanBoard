const express = require('express')
const app = express();
var http = require('http').createServer(app);
const io = require('socket.io')(http);
import DataApi from './dataServer/DataApi.class.js';
import Model from './src/class/Model.class.js';
import Timeline from './src/class/Timeline.class.js';

const socketPort = 3001;

const viewers = [];
const players = [];
const w6s = [];
const filters = [];

const models = [];

io.on("connection", function(client){

    const modelName = client.handshake.query.model;
    if(typeof models[modelName] == "undefined"){

        //Initialisation
        DataApi.getModel(modelName).then((data)=>{
            const model = new Model();
            model.deserialize(data)

            //IFC Menu
            //Play menu
            //Team Display
            //Teams    
            /*for(let d in this.initDatas.teamDisplayed){

            }*/
            const teams = model.getTaskTeams();
            const teamDisplayed = [];
            for(let t in teams){
                teamDisplayed.push(teams[t].getId());
            }

            const timeline = new Timeline(model);
            const selected = timeline.getTasksBetweenTwoDates(0 * 7, (0 * 7) + 6);
            let sel = [];
            for(let s in selected){
                sel.push(selected[s].getId());
            }
            models[modelName] = {
                model : model,
                playerTime : 0,
                taskSelected : sel,
                pushed : [],
                backgroundTasks : [],
                timeline : timeline,
                ifcmenu : [true, true, true, true],
                playmenu : 4,
                teamdisplay : 1,
                teamDisplayed : teamDisplayed
            };
            client.emit("sendInit", models[modelName]);
        }).catch(error => console.error(error));

    }else{
        client.emit("sendInit", models[modelName]);
    }
    
    client.on("addViewer", () => {
        console.log("addViewer", client.id);
        viewers.push({
            socket : client,
            model : modelName
        });
    });

    client.on("addW6", () => {
        console.log("addW6", client.id);
        w6s.push({
            socket : client,
            model : modelName
        });
    });

    client.on("addPlayer", () => {
        console.log("addPlayer", client.id);
        players.push({
            socket : client,
            model : modelName
        });
    });

    client.on("addFilter", () => {
        console.log("addFilter", client.id);
        filters.push({
            socket : client,
            model : modelName
        });
    });

    client.on("highlightObject4D", (datas) => {
        if(datas.value && !models[modelName].taskSelected.includes(datas.taskId)){
            models[modelName].taskSelected.push(datas.taskId);
        }else if(!datas.value){
            models[modelName].taskSelected.splice(models[modelName].taskSelected.indexOf(datas.taskId), 1);
        }
        broadcast(client, modelName, "highlightObject4D", datas);
        //client.broadcast.emit("highlightObject4D", datas);
    });

    client.on("highlightTask", (datas) => {
        if(datas.value && !models[modelName].taskSelected.includes(datas.id)){
            models[modelName].taskSelected.push(datas.id);
        }else if(!datas.value){
            models[modelName].taskSelected.splice(models[modelName].taskSelected.indexOf(datas.id), 1);
        }
        broadcast(client, modelName, "highlightTask", datas);
        //client.broadcast.emit("highlightTask", datas);
    });

    client.on("setTime", (datas) => {
        models[modelName].playerTime = datas.time;
        models[modelName].taskSelected = [];
        const model = models[modelName].model;
        const timeline = models[modelName].timeline;
        const selected = timeline.getTasksBetweenTwoDates(datas.time * 7, (datas.time * 7) + 6);
        for(let s in selected){
            models[modelName].taskSelected.push(selected[s].getId());
        }

        broadcast(client, modelName, "setTime", datas);
        //client.broadcast.emit("setTime", datas);
    });

    client.on("setRequirement", (datas) => {
        broadcast(client, modelName, "setRequirement", datas);
        //client.broadcast.emit("setRequirement", datas);
    })

    client.on("setTaskState", (datas) => {
        broadcast(client, modelName, "setTaskState", datas);
        //client.broadcast.emit("setTaskState", datas);
    })

    client.on("pressHighlightTask", (datas) => {
        if(datas.value && !models[modelName].pushed.includes(datas.taskId)){
            models[modelName].pushed.push(datas.taskId);
        }else if(!datas.value){
            models[modelName].pushed.splice(models[modelName].pushed.indexOf(datas.taskId), 1);
        }
        broadcast(client, modelName, "pressHighlightTask", datas);
        //client.broadcast.emit("pressHighlightTask", datas);
    })

    client.on("updateStateDisplay", (datas) => {
        if(datas.value && !models[modelName].backgroundTasks.includes(datas.taskId)){
            models[modelName].backgroundTasks.push(datas.taskId);
        }else if(!datas.value){
            models[modelName].backgroundTasks.splice(models[modelName].backgroundTasks.indexOf(datas.taskId), 1);
        }
        broadcast(client, modelName, "updateStateDisplay", datas);
        //client.broadcast.emit("updateStateDisplay", datas);
    })

    client.on("clearHighlighting", (datas) => {
        models[modelName].ifcmenu = datas.choice;
        broadcast(client, modelName, "clearHighlighting", datas);
        //client.broadcast.emit("clearHighlighting", datas);
    })


    client.on("updateIfcMenu", (datas) => {
        models[modelName].ifcmenu = [datas.archi, datas.struct, datas.mep, datas.construction];
        broadcast(client, modelName, "updateIfcMenu", datas);
        //client.broadcast.emit("clearHighlighting", datas);
    })
    client.on("updatePlanningMenu", (datas) => {
        models[modelName].playmenu = datas.choice;
        broadcast(client, modelName, "updatePlanningMenu", datas);
        //client.broadcast.emit("clearHighlighting", datas);
    })
    client.on("updateDisplayMenu", (datas) => {
        models[modelName].teamdisplay = datas.choice;
        broadcast(client, modelName, "updateDisplayMenu", datas);
        //client.broadcast.emit("clearHighlighting", datas);
    })
    client.on("updateTeamDisplayed", (datas) => {
        if(datas.value && !models[modelName].teamDisplayed.includes(datas.team)){
            models[modelName].teamDisplayed.push(datas.team);
        }else if(!datas.value){
            models[modelName].teamDisplayed.splice(models[modelName].teamDisplayed.indexOf(datas.team), 1);
        }
        broadcast(client, modelName, "updateTeamDisplayed", datas);
        //client.broadcast.emit("clearHighlighting", datas);
    })

    client.on("disconnect", function(){
        console.log("disconnect", client.id);
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
        if(!already.includes(viewers[v].socket.id) && viewers[v].model == model && viewers[v].socket.id != client.id){
            viewers[v].socket.emit(message, datas);
            already.push(viewers[v].socket.id);
        }
    }
    for(let p in players){
        if(!already.includes(players[p].socket.id) && players[p].model == model && players[p].socket.id != client.id){
            players[p].socket.emit(message, datas);
            already.push(players[p].socket.id);
        }
    }
    for(let w in w6s){
        if(!already.includes(w6s[w].socket.id) && w6s[w].model == model && w6s[w].socket.id != client.id){
            w6s[w].socket.emit(message, datas);
            already.push(w6s[w].socket.id);
        }
    }for(let f in filters){
        if(!already.includes(filters[f].socket.id) && filters[f].model == model && filters[f].socket.id != client.id){
            filters[f].socket.emit(message, datas);
            already.push(filters[f].socket.id);
        }
    }
}

http.listen(socketPort, () => {
    console.log("socket server started on port " + socketPort + "...");
});
