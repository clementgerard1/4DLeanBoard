class V_timelineUtils{

	static time = null;
	static listeners = {
		"time" : [],
	};

	/**
		Add a listener
		@param {String} event type of event subscription (event types available: time)
		@param {Object} obj object which subscribe
		@param {function} func callback function
		@static
	*/
	static addListener(event, obj, func){
		if(typeof this.listeners[event] != "undefined"){
			this.listeners[event][obj._uid] = func;
		}else{
			console.error("event " + event + " unknowed");
		}
	}	

	/**
		Remove a listener
		@param {String} event type of event subscription (event types available: time)
		@param {Object} obj object which subscribe
		@static
	*/
	static removeListener(event, obj){
		if(typeof this.listeners[event][obj] != "undefined"){
			delete this.listeners[event][obj];
		}else{
			console.error("event " + event + " unknowed or obj isn't on the list : ", obj);
		}
	}

	/**
		Set actual time
		@param {uint} time new time
		@static
	*/
	static setTime(time){
		this.time = time;
		for(let l in this.listeners["time"]){
			this.listeners["time"][l](this.time);
		}
	}

	/**
		Get actual time
		@returns {uint}
		@static
	*/
	static getTime(){
		return this.time;
	}

}
export default V_timelineUtils;