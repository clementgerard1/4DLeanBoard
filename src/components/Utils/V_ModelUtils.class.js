import Timeline from "../../class/Timeline.class.js";

class V_ModelUtils{

	static model = null;
	static timeline = null;
	static listeners = [];
	static temporary = false;
	static temporaryModel = null;

	static setModel(model){
		this.model = model;
		this.timeline = new Timeline(this.model);
		if(this.temporary){
			for(let l in this.listeners){
				this.listeners[l](this.temporaryModel);
			}
		}else{
			for(let l in this.listeners){
				this.listeners[l](this.model);
			}
		}
	}

	static getModel(){
		if(this.temporary){
			return this.temporaryModel;
		}else{
			return this.model;
		}
	}

	static getMainModel(){
		return this.model;
	}

	static addModelListener(callback){
		this.listeners.push(callback);
	}

	static dispatchUpdate(){
		if(this.temporary){
			for(let l in this.listeners){
				this.listeners[l](this.temporaryModel);
			}
		}else{
			for(let l in this.listeners){
				this.listeners[l](this.model);
			}
		}
	}

	static getTimeline(){
		return this.timeline;
	}

	static setTemporaryMode(bool, model = null){
		this.temporary = bool;
		if(bool && model != null){
			this.temporaryModel = model;
		}else{
			this.temporaryModel = this.model.clone();
		}
		if(this.temporary){
			for(let l in this.listeners){
				this.listeners[l](this.temporaryModel);
			}
		}else{
			for(let l in this.listeners){
				this.listeners[l](this.model);
			}
		}
	}

	static getDayDifference(){
		let difference = 0;
		//if(this.temporary){
			const startBefore = this.model.getStartDate();	
			const startAfter = this.temporaryModel.getStartDate();
			difference +=  Math.trunc((startAfter.getTime() - startBefore.getTime()) / (1000 * 3600 * 24));
			const endBefore = this.model.getEndDate();	
			const endAfter = this.temporaryModel.getEndDate();
			difference -=  Math.trunc((endAfter.getTime() - endBefore.getTime()) / (1000 * 3600 * 24));
		//

		//}
		return difference;

	}

}
export default V_ModelUtils;