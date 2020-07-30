
class V_planningMenuUtils{

	static planningsMenu = {};

	static addPlanningMenu(planningMenu){
		if(planningMenu != null){
			this.planningsMenu[planningMenu._uid] = planningMenu;
		}
	}

	/**
		Change menu planning choice
		@param {int} choice
	*/
	static setPlanningMenuChange(milestone, phases, weeks, week){
		for(let p in this.planningsMenu){
			this.planningsMenu[p].setPlanningMenuChange(milestone, phases, weeks, week);
		}
	}

}

export default V_planningMenuUtils;