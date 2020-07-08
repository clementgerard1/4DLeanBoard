class V_taskTableUtils{

	static tokens = {};//{
	//	taskId : null
	//};
	static tasks = [];
	static taskObjects = [];

	static setAllTasks(tasks){
		for(let t in tasks){
			this.taskObjects[tasks[t].getId()] = tasks[t];
		}
	}

	/**
		Add V_Task as listener of TaskTable Changement
		@param {V_task} V_task which become reactive
		@static
	*/
	static addTask(vTask){
		if(vTask.task != null){
			this.tasks[vTask._uid] = {
				task : this.taskObjects[vTask.task.getId()],
				vTask : vTask
			}
		}
	}	

	/**
		Update V_Task listener
		@param {V_task} 
		@static
	*/
	static updateTask(vTask){
		if(vTask.task != null){
			this.tasks[vTask._uid] = {
				task : this.taskObjects[vTask.task.getId()],
				vTask : vTask
			}
		}
	}

	/**
		Set the token activation
		@param {Task} task which ask for the token
		@param {bool} bool true if on false off
		@static
	*/
	static setToken(task, bool){
		if(bool){
			this.tokens[task.getId()] = {
				task : task,
			};
		}else{
			delete this.tokens[task.getId()];
		}

		for(let t in this.tasks){
			if(this.tasks[t].task == task && this.tasks[t].vTask != null){
				this.tasks[t].vTask.setSelectedValue(bool);
			}
		}

		return true;
	}	

	static clearTokens(){
		for(let t in this.tokens){
			V_taskTableUtils.setToken(this.tokens[t].task, false);
		}
	}

	static setTokenByObject4DId(obj4DId, bool){
		for( let t in this.tasks){
			if(this.tasks[t].task != null && this.tasks[t].task.getObject4D().getId() == obj4DId) V_taskTableUtils.setToken(this.tasks[t].task, bool);
		}
	}

	static setTokenByTaskId(taskId, bool){
		for( let t in this.taskObjects){
			if(this.taskObjects[t] != null && this.taskObjects[t].getId() == taskId) V_taskTableUtils.setToken(this.taskObjects[t], bool);
		}
	}

	/**
		Check if the V_task has the token
		@param {V_task} obj which ask 
		@returns {boolean}
		@static
	*/
	static isTokenOwner(obj){
		if(this.tokens.length != 0){
			return (typeof this.tokens[obj.task.getId()] != "undefined");
		}else{
			return false;
		}
	}

	static getTokens(){
		const toReturn = [];
		for(let t in this.tokens){
			toReturn.push(this.tokens[t].task);
		}
		return toReturn;
	}

	/**
		Highlight a task with bool
		@param {Task} task
		@param {bool} bool
		@static
	*/
	static highlightTask(task, bool){;
		for( let t in this.tasks){
			if(this.tasks[t].task == task) this.tasks[t].vTask.hightlight(bool);
		}
	}

	static highlightTaskByIdAndUpdate(taskId, bool){
		for( let t in this.tasks){
			if(this.tasks[t].task != null && this.tasks[t].task.getId() == taskId) this.tasks[t].vTask.hightlight(bool);
		}
	}

	static updateStateDisplay(task, bool){
		for( let t in this.tasks){
			if(this.tasks[t].task == task) this.tasks[t].vTask.updateStateDisplay(bool);
		}
	}

	static updateStateDisplayById(taskId, bool){
		for( let t in this.tasks){
			if(this.tasks[t].task != null && this.tasks[t].task.getId() == taskId) this.tasks[t].vTask.updateStateDisplay(bool);
		}
	}

	/**
		Highlight Task on 6W Planning By Id
		@param {string} taskId 
		@static
	*/
	static highlightTaskById(taskId, bool){
		let test = true;
		let i = 0;
		while(test){
			if(typeof this.tasks[i] != "undefined"){
				test = false;
			}
			i++;
		}
		if(typeof this.tasks[i - 1] != "undefined"){
			const task = this.tasks[i - 1].vTask.model.getTaskById(taskId);
			this.setToken(task, bool);
		}
	}

	static selectTaskById(taskid){

	}

	static updateRequirements(task){
		for( let t in this.tasks){
			if(this.tasks[t].task == task) this.tasks[t].vTask.updateRequirements();
		}
	}

	static updateTaskState(task){
		for( let t in this.tasks){
			if(this.tasks[t].task == task) this.tasks[t].vTask.updateTaskState();
		}
	}

	static updateRequirementByIdAndUpdate(taskId, requirementName, value){
		for( let t in this.tasks){
			if(this.tasks[t].task != null && this.tasks[t].task.getId() == taskId){
				this.tasks[t].task.getRequirement(requirementName).setValue(value);
				this.tasks[t].vTask.updateRequirements();
			} 
		}
	}

	static setTaskStateByIdAndUpdate(taskId, done, paused){
		for( let t in this.tasks){
			if(this.tasks[t].task != null && this.tasks[t].task.getId() == taskId){
				this.tasks[t].task.setPaused(paused);
				this.tasks[t].task.setDone(done);
				V_taskTableUtils.updateTaskState(this.tasks[t].task);
				V_taskTableUtils.updateRequirements(this.tasks[t].task);
			} 
		}
	}

	static updatePrevious(task){
		for( let t in this.tasks){
			if(this.tasks[t].task != null){
				const previous = this.tasks[t].task.getPreviousTasks();
				for(let p in previous){
					if(previous[p] == task) this.tasks[t].vTask.updatePrevious();
				}
			}
		}
	}

}
export default V_taskTableUtils;