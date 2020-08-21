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
		this.getHammer(domObj).destroy();
		delete this.touchObjects[domObj.getAttribute("hammerid")];
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
					// const double = hammer.get("tap2");
					// if(double != null){
					// 	single.requireFailure(double);
					// }

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



}
export default V_TouchGesturesUtils;