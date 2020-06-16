class V_TaskTableUtils{

	static token = {
		taskId : null
	};
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
	static setToken(task){
		this.token = {
			taskId : task.getId(),
		};
		for(let t in this.tasks){
			if(this.tasks[t].task != task){
				this.tasks[t].setSelectedValue(false);
			}else{
				this.tasks[t].setSelectedValue(true);
			}
		}
		return true;
	}	

	/**
		Check if the V_task has the toekn
		@param {V_task} obj which ask 
		@returns {boolean}
		@static
	*/
	static isTokenOwner(obj){
		if(this.token != null){
			return (this.token.taskId == obj.task.getId());
		}else{
			return false;
		}
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

	/**
		Highlight Task on 6W Planning By Id
		@param {string} taskId 
		@static
	*/
	static highlightTaskById(taskId){
		const task = this.tasks[0].model.getTaskById(taskId);
		console.log(task);
		this.setToken(task);
	}

	static updateRequirements(task){
		for( let t in this.tasks){
			if(this.tasks[t].task == task) this.tasks[t].updateRequirements();
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
export default V_TaskTableUtils;