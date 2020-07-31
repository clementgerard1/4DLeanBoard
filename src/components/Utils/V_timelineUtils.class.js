import V_taskTableUtils from "./V_taskTableUtils.class.js";

class V_timelineUtils{

	static time = null;
	static offset = 0;
	static timeline = null;
	static listeners = {
		"time" : {},
		"offset" : {}
	};

	static setTimeline(timeline){
		this.timeline = timeline;
	}

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
		if(typeof this.listeners[event][obj] == "undefined"){
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
		V_taskTableUtils.clearTokens();
		const selected = this.timeline.getTasksBetweenTwoDates(time * 7, (time * 7) + 6);
		for(let s in selected){
			V_taskTableUtils.setToken(selected[s], true);
		}
		for(let l in this.listeners["time"]){
			this.listeners["time"][l](this.time);
		}
	}

	static setOffset(offset){
		this.offset = offset;
		for(let l in this.listeners["offset"]){
			this.listeners["offset"][l](this.offset);
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

	static getOffset(){
		return this.offset;
	}

}
export default V_timelineUtils;