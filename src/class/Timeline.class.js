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

	_addTask(task, start, end){
		for(let i = start; i <= end; i++){
			this.steps[i] = task;
		}
	}

	_nextNode(from, newStart){
		const nexts = from.getFollowingTasks();
		for(let n in nexts){
			console.log(nexts[n]);
			this._addTask(nexts[n], newStart, nexts[n].getDuration());
		}
	}

	getPhaseVue(nb){

	}

}

export default Timeline;