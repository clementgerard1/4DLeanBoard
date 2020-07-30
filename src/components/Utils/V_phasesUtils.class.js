class V_phasesUtils{


	static phasesPanel = {};
	
	static addPhasePanel(phaseP){
		if(phaseP != null){
			this.phasesPanel[phaseP._uid] = phaseP;
		}
	}

	static displayed(bool){
		for(let p in this.phasesPanel){
			this.phasesPanel[p].displayed(bool);
		}
	}

}
export default V_phasesUtils;