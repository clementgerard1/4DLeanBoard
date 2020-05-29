class V_TaskTableUtils{

	static token = {
		time : null,
		team : null,
	};
	static tasks = [];

	/**
		Add V_Task as listener of TaskTable Changement
		@param {V_task} V_task which become reactive
	*/
	static addTask(task){
		this.tasks.push(task);
	}	

	/**
		Set the token
		@param {V_task} obj which ask for the token
	*/
	static getToken(obj){
		this.token = {
			time : obj.time,
			team : obj.team
		};
		for(let t in this.tasks){
			if(this.tasks[t] != obj){
				this.tasks[t].setSelectedValue(false);
			}
		}
		obj.setSelectedValue(true);
		return true;
	}	

	/**
		Check if the V_task has the toekn
		@param {V_task} obj which ask 
		@returns {boolean}
	*/
	static isTokenOwner(obj){
		if(this.token != null){
			return (this.token.time == obj.time && this.token.team == obj.team);
		}else{
			return false;
		}
	}
}
export default V_TaskTableUtils;