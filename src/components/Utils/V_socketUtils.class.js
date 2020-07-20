import V_4DUtils from "./V_4DUtils.class.js";
import V_filterMenuUtils from "./V_filterMenuUtils.class.js";
import V_playerUtils from "./V_playerUtils.class.js";
import V_taskTableUtils from "./V_taskTableUtils.class.js";
import V_timelineUtils from "./V_timelineUtils.class.js";
import DataApi from "../../../dataServer/DataApi.class.js";

class V_socketUtils{

	static socket = null;
	static socketInitFlag = false;
	static appInitFlag = false;
	static initDatas = null;
	
	/**
		Set the socket object for connexion
		@param {Socket} socket
		@static
	*/
	static setSocket(socket){
		this.socket = socket;
		this.initSocket();
	}

	static initApp(){
		if(this.appInitFlag && this.socketInitFlag){
			V_timelineUtils.setTime(this.initDatas.playerTime);

			V_taskTableUtils.clearTokens();
			V_4DUtils.clearHighlighting();

			for(let d in this.initDatas.taskSelected){
				V_taskTableUtils.setTokenByTaskId(this.initDatas.taskSelected[d], true);
			}

			for(let d in this.initDatas.pushed){
				V_taskTableUtils.highlightTaskByIdAndUpdate(this.initDatas.pushed[d], true);
			}

			for(let d in this.initDatas.backgroundTasks){
				V_taskTableUtils.updateStateDisplayById(this.initDatas.backgroundTasks[d], true);
			}

			//filter menu		
			//IFC Menu
			V_filterMenuUtils.setIfcMenuChange(this.initDatas.ifcmenu[0], this.initDatas.ifcmenu[1], this.initDatas.ifcmenu[2], this.initDatas.ifcmenu[3]);
			//Play menu
			V_filterMenuUtils.setPlanningMenuChange(this.initDatas.playmenu);
			V_playerUtils.displayMilestones(this.initDatas.playmenu > 1);
			//Team Display
			V_filterMenuUtils.setDisplayMenuChange(this.initDatas.teamdisplay);
			V_4DUtils.setTeamDisplayMode(this.initDatas.teamdisplay == 2);
			//Teams	
			for(let d in this.initDatas.teamDisplayed){
				V_filterMenuUtils.setTeamDisplayedById(d, this.initDatas.teamDisplayed[d]);
				V_4DUtils.setTeamDisplayedById(d, this.initDatas.teamDisplayed[d]);
			}
		}
	}

	static setInitAppFlag(bool){
		this.appInitFlag = bool;
	}

	/**
		Init the socket the socket object for connexion / Private
		@static
	*/
	static initSocket(){
		this.socket.on("highlightObject4D", (datas) => {
			V_taskTableUtils.setTokenByObject4DId(datas.objId, datas.value);
			V_4DUtils.highlightObject4DById(datas.objId, datas.value);

		});

		this.socket.on("highlightTask", (datas) => {
			V_taskTableUtils.highlightTaskById(datas.id, datas.value);
		});

		this.socket.on("sendInit", (datas) => {
			this.socketInitFlag = true;
			this.initDatas = datas;
			this.initApp();
		});

		this.socket.on("setTime", (datas) => {
			V_timelineUtils.setTime(datas.time);
		});

		this.socket.on("setRequirement", (datas) => {
			V_taskTableUtils.updateRequirementByIdAndUpdate(datas.taskId, datas.requirementName, datas.value);
		});

		this.socket.on("setTaskState", (datas) => {
			V_taskTableUtils.setTaskStateByIdAndUpdate(datas.taskId, datas.done, datas.paused);
		});

		this.socket.on("updateStateDisplay", (datas) => {
			V_taskTableUtils.updateStateDisplayById(datas.taskId, datas.value);
		});

		this.socket.on("pressHighlightTask", (datas) => {
			V_taskTableUtils.highlightTaskByIdAndUpdate(datas.taskId, datas.value);
		});	

		this.socket.on("updateTeamDisplayed", (datas) => {
			V_4DUtils.setTeamDisplayedById(datas.team, datas.value);
			V_filterMenuUtils.setTeamDisplayed(datas.team, datas.value);
		});

		this.socket.on("updateDisplayMenu", (datas) => {
			V_filterMenuUtils.setDisplayMenuChange(datas.choice);
			V_4DUtils.setTeamDisplayMode(datas.choice == 2);
		});

		this.socket.on("clearHighlighting", (datas) => {
			V_taskTableUtils.clearTokens();
			V_4DUtils.clearHighlighting();
		});
		this.socket.on("updateIfcMenu", (datas) => {
			V_filterMenuUtils.setIfcMenuChange(datas.archi, datas.struct, datas.mep, datas.construction);
		});
		this.socket.on("updatePlanningMenu", (datas) => {
			V_filterMenuUtils.setPlanningMenuChange(datas.choice);
			V_playerUtils.displayMilestones(datas.choice > 1);
		});

	}

	/**
		Add this socket as a viewer
		@static
	*/	
	static addViewer(){
		this.socket.emit("addViewer");
	}

	/**
		Add this socket as a W6Planning
		@static
	*/	
	static addW6(){
		this.socket.emit("addW6");
	}

	/**
		Add this socket as a W6Planning
		@static
	*/	
	static addPlayer(){
		this.socket.emit("addPlayer");
	}

	/**
		Add this socket as a W6Planning
		@static
	*/	
	static addFilter(){
		this.socket.emit("addFilter");
	}

	/* ---------------------------- PLAYER INTERACTIONS ---------------------------- */

	/**
		Set global time
		@param {uint} time
		@static
	*/	
	static setTime(time){
		V_timelineUtils.setTime(time);
		this.socket.emit("setTime", { time : time});
	}

	/* ---------------------------- 3D INTERACTIONS ---------------------------- */

	/**
		Highlight a task on W6Planning from Viewer
		@param {Task} task 
		@static
	*/		
	static highlightTask(task, bool){
		V_taskTableUtils.highlightTaskById(task.getId(), bool);
   		this.socket.emit("highlightTask", { id : task.getId(), value : bool});
	}


/* ---------------------------- 3D filter INTERACTIONS ---------------------------- */
	/**
		Set the team displayed on viewer
		@param {TaskTeam} team
		@static
	*/	
	static setTeamDisplayed(team, bool){
		V_filterMenuUtils.setTeamDisplayed(team, bool);
		V_4DUtils.setTeamDisplayed(team, bool);
		if(team != null){
			this.socket.emit("updateTeamDisplayed", { team : team.getId(), value : bool});
		}else{
			this.socket.emit("updateTeamDisplayed", { team : null, value : null});
		}
	}

	/**
		Set the team mode of viewer
		@param {bool} active
		@static
	*/	
	static setTeamDisplayMode(active){
		V_4DUtils.setTeamDisplayMode(active);
		if(active){
			V_filterMenuUtils.setDisplayMenuChange(2);
		}else{
			V_filterMenuUtils.setDisplayMenuChange(1);
		}
		if(active){
			this.socket.emit("updateDisplayMenu", { choice : 2});
		}else{
			this.socket.emit("updateDisplayMenu", { choice : 1});
		}
	}

	/* ---------------------------- W6 INTERACTIONS ---------------------------- */

	/**
		Highlight a object4D on Viewer from 6WPlanning
		@param {Task} task 
		@param {bool} bool
		@static
	*/		
	static highlightObject4D(object4D, bool){
		V_taskTableUtils.setToken(object4D.getTask(), bool);
		V_4DUtils.highlightObject4D(object4D, bool);
		this.socket.emit("highlightObject4D", { taskId : object4D.getTask().getId(), objId : object4D.getId(), value:bool});
	}

	static clearHighlighting(){
		V_taskTableUtils.clearTokens();
		V_4DUtils.clearHighlighting();
		this.socket.emit("clearHighlighting");
	}

	static setRequirement(model, requirement, task){
 		DataApi.patchRequirement(model, requirement);
 		V_taskTableUtils.updateRequirements(task);
 		this.socket.emit("setRequirement", { 
 			taskId : task.getId(),
			requirementName : requirement.getName(),
			value : requirement.getValue(),
		});
	}

	static setTaskState(model, task){
		DataApi.patchTaskState(model, task);
		V_taskTableUtils.updateTaskState(task);
		V_taskTableUtils.updateRequirements(task);
		this.socket.emit("setTaskState", { 
			taskId : task.getId(),
			done : task.isDone(),
			paused : task.isPaused()
		});
	}

	static pressHighlightTask(task , display){
		V_taskTableUtils.highlightTask(task, display);
		this.socket.emit("pressHighlightTask", { 
			taskId : task.getId(),
			value : display
		});
	}

	static updateStateDisplay(task, bool){
		V_taskTableUtils.updateStateDisplay(task, bool);
		this.socket.emit("updateStateDisplay", { 
			taskId : task.getId(),
			value : bool
		});
	}

	/* ---------------------------- FILTER MENU INTERACTIONS ---------------------------- */

	static setIfcMenuChange(archi, struct, mep, construction){
		V_filterMenuUtils.setIfcMenuChange(archi, struct, mep, construction);
		this.socket.emit("updateIfcMenu", { 
			archi : archi,
			struct : struct,
			mep : mep,
			construction : construction,
		});
	}

	static setPlanningMenuChange(choice){
		V_filterMenuUtils.setPlanningMenuChange(choice);
		V_playerUtils.displayMilestones(choice > 1);
		this.socket.emit("updatePlanningMenu", { 
			choice : choice
		});
	}

	static setDisplayMenuChange(choice){
		V_filterMenuUtils.setDisplayMenuChange(choice);
		this.socket.emit("updateDisplayMenu", { 
			choice : choice
		});
	}

}
export default V_socketUtils;