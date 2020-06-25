class V_taskTableUtils{

	static tokens = {};//{
	//	taskId : null
	//};
	static tasks = [];

	/**
		Add V_Task as listener of TaskTable Changement
		@param {V_task} V_task which become reactive
		@static
	*/
	static addTask(task){
		this.tasks.push(task);
	}	

	/**
		Set the token
		@param {V_task} obj which ask for the token
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
			if(this.tasks[t].task == task){
				this.tasks[t].setSelectedValue(bool);
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
		console.log("hey");
		for( let t in this.tasks){
			if(this.tasks[t].task != null && this.tasks[t].task.getObject4D().getId() == obj4DId) V_taskTableUtils.setToken(this.tasks[t].task, bool);
		}
	}

	/**
		Check if the V_task has the toekn
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
	static highlightTask(task, bool){

		for( let t in this.tasks){
			if(this.tasks[t].task == task) this.tasks[t].hightlight(bool);
		}
	}

	static highlightTaskByIdAndUpdate(taskId, bool){
		for( let t in this.tasks){
			if(this.tasks[t].task != null && this.tasks[t].task.getId() == taskId) this.tasks[t].hightlight(bool);
		}
	}

	static updateStateDisplay(task){
		for( let t in this.tasks){
			if(this.tasks[t].task == task) this.tasks[t].updateStateDisplay();
		}
	}

	static updateStateDisplayById(taskId){
		for( let t in this.tasks){
			if(this.tasks[t].task != null && this.tasks[t].task.getId() == taskId) this.tasks[t].updateStateDisplay();
		}
	}

	/**
		Highlight Task on 6W Planning By Id
		@param {string} taskId 
		@static
	*/
	static highlightTaskById(taskId, bool){
		if(typeof this.tasks[0] != "undefined"){
			const task = this.tasks[0].model.getTaskById(taskId);
			this.setToken(task, bool);
		}
	}

	static selectTaskById(taskid){

	}

	static updateRequirements(task){
		for( let t in this.tasks){
			if(this.tasks[t].task == task) this.tasks[t].updateRequirements();
		}
	}

	static updateTaskState(task){
		for( let t in this.tasks){
			if(this.tasks[t].task == task) this.tasks[t].updateTaskState();
		}
	}

	static updateRequirementByIdAndUpdate(taskId, requirementName, value){
		for( let t in this.tasks){
			if(this.tasks[t].task != null && this.tasks[t].task.getId() == taskId){
				this.tasks[t].task.getRequirement(requirementName).setValue(value);
				this.tasks[t].updateRequirements();
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
					if(previous[p] == task) this.tasks[t].updatePrevious();
				}
			}
		}
	}

}
export default V_taskTableUtils;