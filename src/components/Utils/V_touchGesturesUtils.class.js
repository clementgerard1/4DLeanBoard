class V_TouchGesturesUtils{

	static touchObjects = {};

	/**
		Add a HTML which have a touch gesture
		@param {HtmlObject} domObj obj which have a touch gesture
		@static
	*/
	static addHammer(domObj, hammer){
		this.touchObjects[domObj.getAttribute("hammerid")] = hammer;
	}	

	static destroy(domObj){
		if(this.getHammer(domObj) != null){
			this.getHammer(domObj).destroy();
			delete this.touchObjects[domObj.getAttribute("hammerid")];
		}
	}	

	/**
		Get a Hammer Manager with its HTML object
		@param {HtmlObject} domObj obj which have a touch gesture
		@return {HammerManager}
		@static
	*/
	static getHammer(domObj){
		if(typeof this.touchObjects[domObj.getAttribute("hammerid")] != "undefined"){
			return this.touchObjects[domObj.getAttribute("hammerid")];
		}else{
			return null;
		}
	}

	/**
		Update events of a Hammer from his HTML Object
		@param {HtmlObject} domObj obj which have a touch gesture
		@static
	*/
	static updateHammer(domObj){
		if(typeof this.touchObjects[domObj.getAttribute("hammerid")] == "undefined"){
			console.error("Hammer not find in collection ; HTML Object provided : " + domObj);
		}else{
			const hammer = this.touchObjects[domObj.getAttribute("hammerid")];

			for(let k in hammer.handlers){
				
				if(k == "tap1"){//SingleTap

					const single = hammer.get("tap1");
					const double = hammer.get("tap2");
					if(double != null){
						single.requireFailure(double);
					}

				}else if(k == "tap2"){//DoubleTap	
				
					const single = hammer.get("tap1");
					const double = hammer.get("tap2");
					if(single != null){
						double.recognizeWith(single);
						double.requireFail =[];
					}

				}

			}

		}
	}

	static initPressHandler(){
		const domObj = document.getElementById("content");
		const handler = (e) => {
			for(let t in this.touchObjects){
				if(typeof this.touchObjects[t].handlers["pressup"] != "undefined") {
					this.touchObjects[t].handlers["pressup"][0](e, true);
				}
			}
		}
		if(domObj != null){
			domObj.addEventListener("mouseup", handler);
			domObj.addEventListener("touchend", handler);
		}
	}

	static initTapHandler(){
		const domObj = document.getElementById("taskTableFrame");
		const domObj2 = document.querySelector("#forgeV canvas");
		const domObj3 = document.getElementById("filterPanelWrapper");
		const domObj4 = document.getElementById("phaseF");
		const domObj5 = document.getElementById("mainPlayer");
		const handler = (e) => {
			for(let t in this.touchObjects){
				if(typeof this.touchObjects[t].handlers["tap1"] != "undefined") {
					if(this.touchObjects[t].input.target.id == "ifcMenuId"){
						if(document.querySelector(".ifcMenu") != null){
							this.touchObjects[t].handlers["tap1"][0](e, true);
						}
					}else if(this.touchObjects[t].input.target.id == "planningMenuId"){
						if(document.querySelector(".modelName") != null){
							this.touchObjects[t].handlers["tap1"][0](e, true);
						}
					}

				}
			}
		}
		if(domObj != null){
			domObj.addEventListener("mousedown", handler);
			domObj.addEventListener("touchstart", handler);
		}
		if(domObj2 != null){
			domObj2.addEventListener("mousedown", handler);
			domObj2.addEventListener("touchstart", handler);
		}
		if(domObj3 != null){
			domObj3.addEventListener("mousedown", handler);
			domObj3.addEventListener("touchstart", handler);
		}
		if(domObj4 != null){
			domObj4.addEventListener("mousedown", handler);
			domObj4.addEventListener("touchstart", handler);
		}
		if(domObj5 != null){
			domObj5.addEventListener("mousedown", handler);
			domObj5.addEventListener("touchstart", handler);
		}
	}



}
export default V_TouchGesturesUtils;