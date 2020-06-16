import V_4DUtils from "./V_4DUtils.class.js";

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
			console.log(datas);
			V_4DUtils.highlightObject4DById(datas.id);
		});
	}

	static addViewer(){
		this.socket.emit("addViewer");
	}

	static addW6(){
		this.socket.emit("addW6");
	}

  static highlightObject4D(object4D){
  	V_4DUtils.highlightObject4D(object4D);
  	this.socket.emit("highlightObject4D", { id : object4D.getId()});
  }

}
export default V_socketUtils;