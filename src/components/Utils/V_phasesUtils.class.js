class V_phasesUtils{


	static phasesPanel = {};
	static items = {};
	
	static addPhasePanel(phaseP){
		if(phaseP != null){
			this.phasesPanel[phaseP._uid] = phaseP;
		}
	}

	static addItemPhase(obj){
		if(obj != null){
			this.items[obj.phase.getId()] = obj;
		}
	}

	static getItemPhaseByPhaseId(id){
		for(let p in this.items){
			if(p == id) return this.items[p];
		}
	}

	static displayed(bool){
		for(let p in this.phasesPanel){
			this.phasesPanel[p].displayed(bool);
		}
	}

	/**
		Set contractor displayed by id on Forge Viewer
		@param {string} Object4Did id of Object4D to hightlight
		@static
	*/
	static setTeamDisplayedById(teamId, bool){
		for(let p in this.phasesPanel){
			this.phasesPanel[p].displayTeam(teamId, bool);
		}
	}

	/**
		Set contractor displayed by id on Forge Viewer
		@param {string} Object4Did id of Object4D to hightlight
		@static
	*/
	static setTeamDisplayed(team, bool){
		for(let p in this.phasesPanel){
			this.phasesPanel[p].displayTeam(team.getId(), bool);
		}
	}

	static setTeamDisplayMode(bool){
		for(let p in this.phasesPanel){
			this.phasesPanel[p].displayMode(bool);
		}
	}

	static highlightTask(task, display){
		for(let p in this.phasesPanel){
			this.phasesPanel[p].highlightTask(task, display);
		}
	}

}
export default V_phasesUtils;