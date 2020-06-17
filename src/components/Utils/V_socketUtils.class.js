import V_4DUtils from "./V_4DUtils.class.js";
import V_taskTableUtils from "./V_taskTableUtils.class.js";
import V_timelineUtils from "./V_timelineUtils.class.js";

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
	}

	static addViewer(){
		this.socket.emit("addViewer");
	}

	static addW6(){
		this.socket.emit("addW6");
	}

	static highlightTask(task){
		V_taskTableUtils.highlightTaskById(task.getId());
  		this.socket.emit("highlightTask", { id : task.getId()});
	}

	static highlightObject4D(object4D){
		V_4DUtils.highlightObject4D(object4D);
		this.socket.emit("highlightObject4D", { id : object4D.getId()});
	}

	static setTime(time){
		V_timelineUtils.setTime(time);
		this.socket.emit("setTime", { time : time});
	}

}
export default V_socketUtils;