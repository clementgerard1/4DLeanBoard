/**
 * @class Timeline
 * @classdesc Timeline of the planning
 */
class Timeline{


	/**
		Timeline Constructor
		@param {Model} [model] Name of model of the timeline.
		@param {int} [starts] list of start nodes.
	*/
	constructor(model, starts = null){
		this.model = model;
		this.steps = [];
		this.starts = starts;
		this._constructTimeline();
	}

	_constructTimeline(){
		for(let s in this.starts){
			const duration =  this.starts[s].getDuration();
			this._addTask(this.starts[s], 0, duration);
			this._nextNode(this.starts[s], duration);
		}
	}

	_addTask(task, start, duration){
		for(let i = start; i < (start + duration); i++){
			this._initialiseStepArray(i);
			this.steps[i].tasks.push(task);
		}
	}

	_nextNode(fromTask, newStart){
		const nexts = fromTask.getFollowingTasks();
		for(let n in nexts){
			this._addTask(nexts[n], newStart, nexts[n].getDuration());
			this._nextNode(nexts[n], newStart + nexts[n].getDuration());
		}
	}

	_initialiseStepArray(t){		
			if(typeof this.steps[t] == "undefined") this.steps[t] = { 
				tasks : []
			};
	}


	isStart(){

	}

	/**
		Get information on a specific date
		@param {int} time date of the information (on relative format).
	*/
	getValueAtTime(time){
		return this.steps[time];
	}

}

export default Timeline;