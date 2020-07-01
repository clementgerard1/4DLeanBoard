import V_4DUtils from "./V_4DUtils.class.js";
import V_taskTableUtils from "./V_taskTableUtils.class.js";
import V_timelineUtils from "./V_timelineUtils.class.js";
import DataApi from "../../../dataServer/DataApi.class.js";

class V_socketUtils{

	static socket = null;
	
	/**
		Set the socket object for connexion
		@param {Socket} socket
		@static
	*/
	static setSocket(socket){
		this.socket = socket;
		this.initSocket();
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
			V_timelineUtils.setTime(datas.playerTime);
			//if(datas.taskSelected.length != 0){
				V_taskTableUtils.clearTokens();
				V_4DUtils.clearHighlighting();
			//}
			for(let d in datas.taskSelected){

				V_taskTableUtils.setTokenByTaskId(datas.taskSelected[d], true);
			}
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
			V_taskTableUtils.updateStateDisplayById(datas.taskId);
		});

		this.socket.on("pressHighlightTask", (datas) => {
			V_taskTableUtils.highlightTaskByIdAndUpdate(datas.taskId, datas.value);
		});	

		this.socket.on("setContractorDisplayed", (datas) => {
			V_4DUtils.setContractorDisplayedById(datas.contractor);
		});

		this.socket.on("setContractorDisplayMode", (datas) => {
			V_4DUtils.setContractorDisplayMode(datas.bool);
		});
		this.socket.on("setTaskState", (datas) => {
			V_4DUtils.setContractorDisplayMode(datas.bool);
		});
		this.socket.on("clearHighlighting", (datas) => {
			V_taskTableUtils.clearTokens();
			V_4DUtils.clearHighlighting();
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


/* ---------------------------- 3D Filter INTERACTIONS ---------------------------- */
	/**
		Set the contractor displayed on viewer
		@param {Contractor} contractor
		@static
	*/	
	static setContractorDisplayed(contractor){
		V_4DUtils.setContractorDisplayed(contractor);
		if(contractor != null){
			this.socket.emit("setContractorDisplayed", { contractor : contractor.getId()});
		}else{
			this.socket.emit("setContractorDisplayed", { contractor : null});
		}
	}

	/**
		Set the contractor mode of viewer
		@param {bool} active
		@static
	*/	
	static setContractorDisplayMode(active){
		V_4DUtils.setContractorDisplayMode(active);
		this.socket.emit("setContractorDisplayMode", { bool : active});
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

	static updateStateDisplay(task){
		V_taskTableUtils.updateStateDisplay(task);
		this.socket.emit("updateStateDisplay", { 
			taskId : task.getId(),
		});
	}

}
export default V_socketUtils;