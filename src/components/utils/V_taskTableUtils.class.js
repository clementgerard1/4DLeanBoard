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
	static getToken(task){
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
		Attribute token from the 4DObject
		@param {Object4D} obj
		@static
	*/
	static highlightTask(obj){
		
	}
}
export default V_TaskTableUtils;