import Milestone from "./Milestone.class.js";
import Phase from "./Phase.class.js";
import Task from "./Task.class.js";
import Operation from "./Operation.class.js";

class Timeline{

	#model;
	#steps;
	#startDate;

	/**
 		@class Timeline
		@classdesc Timeline of the planning
 
		@constructs

		@param {Model} [model] Name of model of the timeline.
	*/
	constructor(model){
		this.#model = model;
		this.#steps = [];
		this.#startDate = null;
		this.#constructTimeline();
	}

	#constructTimeline(){
		
		const milestones = this.#model.getMilestones();

		//Determine startDate
		this.#startDate = null;
		for(let m in milestones){
			const d = milestones[m].getStartDate();
			if(this.#startDate == null || d < this.#startDate) this.#startDate = d;
		}

		//Fill timeline
		for(let m in milestones){
			this.#fillTimeline(milestones[m]);
			const phases = milestones[m].getPhases();
			for(let p in phases){
				this.#fillTimeline(phases[p]);
				const tasks = phases[p].getTasks();
				for(let t in tasks){
					this.#fillTimeline(tasks[t]);
					const operations = tasks[t].getOperations();
					for(let o in operations){
						this.#fillTimeline(operations[o]);
					}
				}
			}
		}

	}

	#fillTimeline(object){
		const startDate = object.getStartDate();
		const endDate = object.getEndDate();
		const startStepDate = (startDate.getTime() - this.#startDate.getTime()) / (1000 * 3600 * 24);
		const length = (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24);
		for(let i = startStepDate ; i <= startStepDate + length ; i++){
			this.#initialiseStepArray(i);
			if(object instanceof Milestone){
				this.#steps[i]["milestones"].push(object);
			}else if(object instanceof Phase){
				this.#steps[i]["phases"].push(object);
			}else if(object instanceof Task){
				this.#steps[i]["tasks"].push(object);
			}else if(object instanceof Operation){
				this.#steps[i]["operations"].push(object);
			}
		}
	}

	#initialiseStepArray(t){		
			if(typeof this.#steps[t] == "undefined") this.#steps[t] = { 
				milestones : [],
				phases : [],
				tasks : [],
				operations : []
			};
	}


	/**
		Get Model of the timeline
		@returns {Model} 
	*/
	getModel(){
		return this.#model;
	}

	/**
		Get information on a specific date
		@param {int} time date of the information (on relative format).
	*/
	getValueAtTime(time){
		return this.#steps[time];
	}

	/**
		Get taskTeams between two moments
		@param {int} start
		@param {int} end
		@returns {Array(TaskTeam)} 
	*/
	getTaskTeamsBetweenTwoDates(start, end){

		const teams = [];
		for(let i = start; i <= end ; i++){
			const tasks = this.#steps[i].tasks;
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
		Get Phases between two moments
		@param {int} start
		@param {int} end
		@returns {Array(Phase)} 
	*/
	getPhasesBetweenTwoDates(start, end){
		const toReturn = [];
		for(let i = start; i <= end ; i++){
			const phases = this.#steps[i].phases;
			for(let p in phases){
				if(!toReturn.includes(phases[p])){
					toReturn.push(phases[p]);
				}
			}
		}
		return toReturn;
	}

	/**
		get task for a team at a moment for a phase
		@param {int} time
		@param {Team} team
		@param {Phase} [phase=null] 
		@returns {Task} return null if no task exist at this moment 
	*/
	getTaskByTeamAndPhase(time, team, phase = null){
		if(typeof this.#steps[time] != "undefined"){
			const tasks = this.#steps[time].tasks;
			for(let t in tasks){
				if(tasks[t] instanceof Task && (phase == null || tasks[t].getParentPhase() == phase)){
					let isIn = false;
					const teamt = tasks[t].getTaskTeam();
					if(teamt.getId() == team.getId()) isIn = true;
					if(isIn) return tasks[t];
				}
			}
			return null;
		}else{
			return null;
		}
	}

	/**
		Get TaskTeam between two moments for a phase
		@param {Phase} phase
		@param {int} start
		@param {int} end
		@returns {Array(TaskTeam)} 
	*/
	getTaskTeamsBetweenTwoDatesByPhase(phase, start, end){
		const teams = phase.getTaskTeams();
		const toReturn = [];
		for(let t in teams){
			for(let i = start ; i <= end ; i++){
				for(let tt in this.#steps[i].tasks){
					if(!toReturn.includes(teams[t]) && teams[t].getId() == this.#steps[i].tasks[tt].getTaskTeam().getId()) toReturn[toReturn.length] = teams[t];
				}
			}
		}
		return toReturn;
	}

	/**
		Get the start date of the model
		@returns {Date} 
	*/
	getStartDate(){
		return this.#startDate;
	}

}

export default Timeline;