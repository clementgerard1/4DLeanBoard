import Milestone from "./Milestone.class.js";
import Phase from "./Phase.class.js";
import Task from "./Task.class.js";
import Operation from "./Operation.class.js";
import Utils from "./Utils.class.js";

class Timeline{

	#model;
	#steps;
	#startDate;
	#startWeekDate;
	#optimisationResult;
	#tasksNth;

	/**
 		@class Timeline
		@classdesc Timeline of the planning
 
		@constructs

		@param {Model} [model] Name of model of the timeline.
	*/
	constructor(model){
		this.#model = model;
		this.#steps = [];
		this.#tasksNth = {};
		this.#startDate = null;
		this.#startWeekDate = null;
		this.#optimisationResult = {};
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
		this.#startWeekDate = new Date(this.#startDate);
		this.#startWeekDate.setDate(this.#startWeekDate.getDate() - (this.#startDate.getDay() - 1));


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

		this.#determineNths();

		// console.log(this.#steps);

	}

	#fillTimeline(object){
		const startDate = object.getStartDate();
		const endDate = object.getEndDate();
		const startStepDate = Math.ceil(this.getTime(startDate));
		const length = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24));
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

	#determineNths(){
		//Per week
		for(let i = 0 ; i < this.#steps.length / 7 ; i++){

			//tasks on a week
			const taskTeams = this.getTaskTeamsBetweenTwoDates(i*7, (i * 7) + 6);
			for(let team in taskTeams){
				const tasks = this.getTasksByTeamBetweenTwoDates(taskTeams[team], i*7, (i * 7) + 6);
				for(let t in tasks){
					if(typeof this.#tasksNth[tasks[t].getId()] == "undefined"){
						const temp = [];
						for(let tt in tasks){
							if((tasks[tt] != tasks[t]) && (typeof this.#tasksNth[tasks[tt].getId()] != "undefined")){
								temp[this.#tasksNth[tasks[tt].getId()]] = true;
							}
						}
						let i = 0;
						let result = null;
						while(i < temp.length && (result == null)){
							if(typeof temp[i] == "undefined"){
								result = i;
							}
							i++;
						}

						if(result == null){
							result = temp.length;
						}

						this.#tasksNth[tasks[t].getId()] = result;
					}
				}
			}

		}
	}

	#initialiseStepArray(t){		

			//Holiday
			const date = this.getDateObject(t);
			const week = this.#model.getDayWorked()[date.getDay() - 1];	
			let holiday = false;	
			const holidays = this.#model.getHolidays();
			for(let h in holidays){
				if((date.getDate() == holidays[h].getDate().getDate()) && (date.getMonth() == holidays[h].getDate().getMonth()) && (date.getFullYear() == holidays[h].getDate().getFullYear())) holiday = true;
			}

			if(typeof this.#steps[t] == "undefined") this.#steps[t] = { 
				milestones : [],
				phases : [],
				tasks : [],
				operations : [],
				holiday : (!week || holiday)
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

	isHolidayBetweenTwoDates(start, end){
		for(let i = start; i <= end; i++){
			if(!this.#steps[i].holiday) return false;
		}
		return true;
	}

	isHoliday(i){
		return (typeof this.#steps[i] != "undefined" && this.#steps[i].holiday)
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

			this.#initialiseStepArray(i);
			const tasks = this.#steps[i].tasks;
			for(let t in tasks){
				//const tTeams = tasks[t].getTaskTeam();
				//for(let team in tTeams){
					if(!teams.includes(tasks[t].getTaskTeam())){
						teams.push(tasks[t].getTaskTeam());
					}
				//}
			}
		}
		return teams;
	}

	getNbTaskDoneByTeamAndTime(team, time){
		let done = 0;
		let notDone = 0;
		const tasks = this.#model.getTasks();
		for(let t in tasks){
			if(tasks[t].getTaskTeam().getId() == team.getId()){
				if(this.getTime(tasks[t].getEndDate()) > time){
					notDone++;
				}else{
					done++;
				}
			}
		}
		return done + "/" + (notDone + done);

	}

	getStartEndDateByTeam(team){
		let start = null;
		let end = null;
		const tasks = this.#model.getTasks();
		for(let t in tasks){
			if(tasks[t].getTaskTeam().getId() == team.getId()){

				if(start == null || tasks[t].getStartDate().getTime() < start.getTime()) start = tasks[t].getStartDate();
				if(end == null || tasks[t].getEndDate().getTime() > end.getTime()) end = tasks[t].getEndDate();
			}
		}
		return start.getDate() + "/" + (start.getMonth()+1) + "/" + start.getFullYear() + "-" + end.getDate() + "/" + (end.getMonth()+1) + "/" + end.getFullYear();
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
	getTaskByTeamAndPhase(time, team, phase = null,){
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

	/**
		Check if a planningobject is active on a specific time
		@param {PlanningObject} obj
		@param {int} time
		@returns {bool} 
	*/
	isActive(obj, time){
		if(obj instanceof Milestone){
			return typeof this.#steps[time] != "undefined" && this.#steps[time]["milestones"].includes(obj);
		}else if(obj instanceof Phase){
			return typeof this.#steps[time] != "undefined" && this.#steps[time]["phases"].includes(obj);
		}else if(obj instanceof Task){
			return typeof this.#steps[time] != "undefined" && this.#steps[time]["tasks"].includes(obj);
		}else if(obj instanceof Operation){
			return typeof this.#steps[time] != "undefined" && this.#steps[time]["operations"].includes(obj);
		}
	}

	/**
		Check if a planningobject is active between two dates
		@param {PlanningObject} obj
		@param {int} start
		@param {int} end
		@returns {bool} 
	*/
	isActiveBetweenTwoDate(obj, start , end){
		let i = start;
		while(i <= end){
			if(this.isActive(obj, i)) return true;
			i++;
		}
		return false;
	}

	/**
		Get tasks for a team and a phase between two date
		@param {Phase} phase
		@param {Team} team
		@param {int} start
		@param {int} end
 		@returns {Array} 
	*/
	getTasksByTeamAndPhaseBetweenTwoDates(phase, team, start, end){
		const toReturn = [];
		for(let i = start ; i <= end ; i++){
			if(typeof this.#steps[i] != "undefined"){
				const tasks = this.#steps[i].tasks;

				for(let t in tasks){
					if(!toReturn.includes(tasks[t]) && tasks[t].getParentPhase() == phase && tasks[t].getTaskTeam() == team) toReturn.push(tasks[t]);
				}
			}
		}
		return toReturn;
	}

	/**
		Get task for a team and a phase and an number of task for the team between two date
		@param {Phase} phase
		@param {Team} team
		@param {int} start
		@param {int} end
		@param {int} nth
 		@returns {Task} 
	*/
	getTaskByPhaseTeamAndNthBetweenTwoDates(phase, team, start, end, nth){
		const toReturn = [];
		let counter = 0;
		let already = [];
		for(let time = start; time <= end; time++){
			if(typeof this.#steps[time] != "undefined"){
				const tasks = this.#steps[time].tasks;
				for(let t in tasks){
					if(tasks[t].getParentPhase() == phase && tasks[t].getTaskTeam() == team){
						if(!already.includes(tasks[t]) && nth == counter){
							already.push(tasks[t]);
							return tasks[t];
						}else{
							if(!already.includes(tasks[t])){
								already.push(tasks[t]);
								counter++;
							}
						}
					}
				}
			}
		}
		return null;
	}

	/*
		get date object from time
		@param {int} time
		@returns {Date}
	*/
	getDateObject(time){
		return new Date(this.#startWeekDate.getTime() + ( time * 1000 * 3600 * 24) + (3 * 3600 * 1000)); // Add 3 hours for summer hour
	}

	/*
		get the max number of simultaneous tasks on a phase between two moments
		@param {Phase} phase
		@param {TaskTeam} taskTeam
		@param {uint} start
		@param {uint} end
		@returns {int}
	*/
	getMaxSimultaneousTasksByPhaseAndTaskTeamBetweenTwoDates(phase, taskTeam, start, end){
		const phaseTasks = phase.getTasksByTaskTeam(taskTeam);
		let max = 0;
		for(let i = start; i <= end ; i++){
			const tasks = this.#steps[i].tasks;
			let count = 0;
			for(let t in tasks){
				for(let tt in phaseTasks){
					if(phaseTasks[tt] == tasks[t]) count++;
				}
			}
			if(max < count) max = count;
		}
		return max;
	}

	/*
		get the max number of simultaneous tasks for a taskteam between two moments
		@param {Phase} phase
		@param {TaskTeam} taskTeam
		@param {uint} start
		@param {uint} end
		@returns {int}
	*/
	getMaxSimultaneousTasksByTaskTeamBetweenTwoDates(taskTeam, start, end){
		const phases = this.#model.getTasks();
		let max = 0;
		for(let i = start; i <= (end / 7) ; i++){

			let count = 0;
			const temp = [];
			for(let j = (i * 7) ; j < ((i+1) * 7) ; j++){
					const tasks = this.#steps[j].tasks;
					for(let t in tasks){
						if(!temp.includes(tasks[t].getId()) && tasks[t].getTaskTeam() == taskTeam){
							temp.push(tasks[t].getId());
							count++
						}
					}
			}

			if(max < count) max = count;
		}
		return max;
	}

	/*
		get the tasks on a phase between two moments
		@param {Phase} phase
		@param {TaskTeam} taskTeam
		@param {int} nth id of line for this taskTeam (for a phase)
		@param {uint} start
		@param {uint} end
		@returns {object} array : tasks, count : number of tasks
	*/
	getTasksByPhaseTaskTeamAndNthBetweenTwoDates(taskTeam, nth, start, end){

		const arrayReturn = Array(6);
		let count = 0;

		for(let i = 1 ; i <= 6 ; i++){

			const tasks = this.getTasksByTeamBetweenTwoDates(taskTeam, start+ (((end - start + 1) / 6) * (i - 1)), start + (((end - start + 1) / 6) * i) - 1);			
			
			for(let t in tasks){
				const originNth = this.getOriginNthByPhase(phase, taskTeam, tasks[t]);
				if(originNth == nth){
					arrayReturn[i-1] = tasks[t];
					count++;
					break;
				}else{
					arrayReturn[i-1] = null;
				}
			}

		}
		return {
			array : arrayReturn,
			count : count
		}
	}

	getTasksByTeamBetweenTwoDates(taskTeam, start, end){
		const toReturn = [];
		//console.log(start,end);
		for(let i = start; i <= end ; i++){
			if(typeof this.#steps[i] != "undefined"){
				const tasks = this.#steps[i].tasks;
				for(let t in tasks){
					if((!toReturn.includes(tasks[t])) && tasks[t].getTaskTeam() == taskTeam) toReturn.push(tasks[t]);
				}
			}
		}
		return toReturn;

	}

	/*
		get task for a taskteam between two date
		@param {TaskTeam} taskTeam
		@param {int} nth id of line for this taskTeam
		@param {uint} start
		@param {uint} end
		@returns {object} array : tasks, count : number of tasks
	*/
	getTasksByTaskTeamAndNthBetweenTwoDates(taskTeam, nth, start, end){

		const arrayReturn = Array(6);
		let count = 0;

		for(let i = 1 ; i <= 6 ; i++){

			const tasks = this.getTasksByTeamBetweenTwoDates(taskTeam, start+ (((end - start + 1) / 6) * (i - 1)), start + (((end - start + 1) / 6) * i) - 1);	
			for(let t in tasks){
				const originNth = this.getOriginNth(taskTeam, tasks[t]);

				if(originNth == nth){
					arrayReturn[i-1] = tasks[t];
					count++;
					break;
				}else{
					arrayReturn[i-1] = null;
				}
			}

		}

		this.#optimisationResult[taskTeam.getId() + "-" + nth + "-" + start + "-" + end] = {
			array : arrayReturn,
			count : count
		}

		return {
			array : arrayReturn,
			count : count
		}
	}

	/*
		get task for a taskteam between two date with Memory
		@param {TaskTeam} taskTeam
		@param {int} nth id of line for this taskTeam
		@param {uint} start
		@param {uint} end
		@returns {object} array : tasks, count : number of tasks
	*/
	getTasksByTaskTeamAndNthBetweenTwoDatesFromMemory(taskTeam, nth, start, end){
		if(typeof this.#optimisationResult[taskTeam.getId() + "-" + nth + "-" + start + "-" + end] != "undefined") return this.#optimisationResult[taskTeam.getId() + "-" + nth + "-" + start + "-" + end];
		return this.getTasksByTaskTeamAndNthBetweenTwoDates(taskTeam, nth, start, end);
	}



	/*
		get tasks between two moments
		@param {uint} start
		@param {uint} end
		@returns {Array} 
	*/
	getTasksBetweenTwoDates(start, end){
		const toReturn = [];
		for(let i = start; i <= end ; i++){
			if(typeof this.#steps[i] != "undefined"){
				const tasks = this.#steps[i].tasks;
				for(let t in tasks){
					if(!toReturn.includes(tasks[t])) toReturn.push(tasks[t]);
				}
			}
		}
		return toReturn;
	}

	getTime(date){
		return (date.getTime() - this.#startDate.getTime()) / (1000 * 3600 * 24);
	}

	getOriginNth(taskTeam, task){
		return this.#tasksNth[task.getId()];
	}

	getOriginNthByPhase(phase, taskTeam, task){
		const time = this.getTime(task.getStartDate());
		const startWeekTime = Math.trunc(time / 7) * 7;
		const tasks = this.getTasksByTeamAndPhaseBetweenTwoDates(phase, taskTeam, startWeekTime, startWeekTime + 6);
		return tasks.indexOf(task);
	}

	getWeeks(task){
		const toReturn = [];
		const start = this.getTime(task.getStartDate());
		const end = this.getTime(task.getEndDate());
		for(let i = start; i <= end ; i++){
			if(typeof toReturn[Math.trunc(i / 7)] == "undefined") toReturn.push(Math.trunc(i / 7));
		}
		return toReturn;
	}

	addWorkingDaysToDate(date, days){
		let toAdd = 0;
		for(let i = 1 ; i <= (days + toAdd) ; i++){
			if(this.isHoliday(parseInt(this.getTime(Utils.addDaysToDate(date, i))))) toAdd++;
		}
		return Utils.addDaysToDate(date, days + toAdd);
	}

}

export default Timeline;