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
			V_4DUtils.highlightObject4DById(datas.id);
		});

		this.socket.on("highlightTask", (datas) => {
			V_taskTableUtils.highlightTaskById(datas.id);
		});

		this.socket.on("setTime", (datas) => {
			V_timelineUtils.setTime(datas.time);
		});

		this.socket.on("setContractorDisplayed", (datas) => {
			V_4DUtils.setContractorDisplayedById(datas.contractor);
		});

		this.socket.on("setContractorDisplayMode", (datas) => {
			V_4DUtils.setContractorDisplayMode(datas.bool);
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
	static highlightTask(task){
		V_taskTableUtils.highlightTaskById(task.getId());
  		this.socket.emit("highlightTask", { id : task.getId()});
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
		@static
	*/		
	static highlightObject4D(object4D){
		V_4DUtils.highlightObject4D(object4D);
		this.socket.emit("highlightObject4D", { id : object4D.getId()});
	}

	static setRequirement(model, requirement){
 		DataApi.patchRequirement(model, requirement);
	}

	static setTaskState(model, task){
		DataApi.patchTaskState(model, task);	
	}
	//setDone
	//setPause
	//setReady
	//setDoubleClick
	//setSimple
	//setPushPrevious

}
export default V_socketUtils;