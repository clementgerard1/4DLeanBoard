import Task from "./Task.class.js";

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


	/**
		Get Model of the timeline
		@returns {Model} 
	*/
	getModel(){
		return this.model;
	}

	/**
		Get information on a specific date
		@param {int} time date of the information (on relative format).
	*/
	getValueAtTime(time){
		return this.steps[time];
	}

	/**
		Get taskTeams between two moments
		@param {int} start
		@param {int} end
		@returns {Array[TaskTeam]} 
	*/
	getTaskTeams(start, end){
		const teams = [];
		for(let i = start; i <= end ; i++){
			const tasks = this.steps[i].tasks;
			for(let t in tasks){
				const tTeams = tasks[t].getTaskTeams();
				for(let team in tTeams){
					if(!teams.includes(tTeams[team])){
						teams.push(tTeams[team]);
					}
				}
			}
		}
		return teams;
	}

	/**
		get task for a team at a moment
		@param {int} time
		@param {Team} team
		@returns {Task} return null if no task exist at this moment 
	*/
	getTaskByTeam(time, team){
		const tasks = this.steps[time].tasks;
		for(let t in tasks){
			if(tasks[t] instanceof Task){
				let isIn = false;
				const teams = tasks[t].getTaskTeams();
				for(let tea in teams){
					if(teams[tea].getId() == team.getId()) isIn = true;
				}
				if(isIn) return tasks[t];
			}
		}
		return null;
	}

}

export default Timeline;