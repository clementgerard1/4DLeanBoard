class V_4DUtils{


	//static viewers = [];
	static viewer = null;
	static highlighted = [];
	static waitViewer = {
		teamDisplayMode : null,
		teamsDisplayed : [],
		teamsDisplayedId : [],
		ifcs : null,
	};
	static needInit = false;

	/**
		Add ForgeViewer as listener of TaskTable Changement
		@param {V_forgeViewer} V_forgeViewer which become reactive
		@static
	*/
	static setForgeViewer(viewer){
		//this.viewers.push(viewer);
		this.viewer = viewer;
		if(this.needInit){
			if(this.waitViewer.teamDisplayMode != null) this.setTeamDisplayMode(this.waitViewer.teamDisplayMode);
			for(let t in this.waitViewer.teamsDisplayed){
				this.setTeamDisplayed(this.waitViewer.teamsDisplayed[t].taskTeam, this.waitViewer.teamsDisplayed[t].bool);
			}
			for(let t in this.waitViewer.teamsDisplayedId){
				this.setTeamDisplayedById(this.waitViewer.teamsDisplayedId[t].taskTeamId, this.waitViewer.teamsDisplayedId[t].bool);
			}
			if(this.waitViewer.ifcs != null) this.viewer.setIfcMenuChange(this.waitViewer.ifcs);
		}
		this.needInit = false;
	}	

	/**
		Highlight Object4D on Forge Viewer
		@param {Object4D} Object4D to hightlight
		@static
	*/
	static highlightObject4D(object4D, bool){

		if(this.viewer != null){
		//for(let v in this.viewers){
			//this.viewers[v].clearHighlighting();
			//this.viewer.clearHighlighting();
			//const objects3D = object4D.getObjects3D();
			//for(let o in objects3D){
			//this.viewers[v].highlight(object4D);
			this.viewer.clearSelection();
			this.viewer.select(object4D, bool);
			//}
		//}
		}
	}

	static clearHighlighting(){
		if(this.viewer != null){
			this.viewer.clearSelection();
		}
	}

	static setCamera(infos){
		if(this.viewer != null){
			this.viewer.setCamera(infos);
		}
	}

	/**
		Highlight Object4D by id on Forge Viewer
		@param {string} Object4Did id of Object4D to hightlight
		@param {bool} bool
		@static
	*/
	static highlightObject4DById(object4Did, bool){
		if(this.viewer != null){
			const object4D = this.viewer.model.get4DObjectById(object4Did);
			this.highlightObject4D(object4D, bool);
		}
	}

	/**
		Set contractor displayed by id on Forge Viewer
		@param {string} Object4Did id of Object4D to hightlight
		@static
	*/
	static setTeamDisplayedById(teamId, bool){
		if(this.viewer != null){
			const taskTeam = this.viewer.model.getTaskTeamById(teamId, bool);
			if(taskTeam != null){
				this.setTeamDisplayed(taskTeam, bool);
			}
		}else{
			this.waitViewer.teamsDisplayedId[this.waitViewer.teamsDisplayedId.length] = {
				taskTeamId : teamId,
				bool : bool
			}
		}
	}

	/**
		Set taskteam displayed on Forge Viewer
		@param {uid} taskTeam id
		@static
	*/
	static setTeamDisplayed(taskTeam, bool){
		if(this.viewer != null){
			this.viewer.setTeamDisplayed(taskTeam, bool);
		}else{
			this.waitViewer.teamsDisplayed[this.waitViewer.teamsDisplayed.length] = {
				taskTeam : taskTeam,
				bool : bool
			}
			this.needInit = true;
		}
	}

	/**
		Set contractor display mode on Forge Viewer
		@param {bool} bool
		@static
	*/
	static setTeamDisplayMode(bool){
		if(this.viewer != null){
			this.viewer.setTeamDisplayMode(bool);
		}else{
			this.waitViewer.teamDisplayMode = bool;
			this.needInit = true;
		}
	}

	/**
		Change menu ifc choices
		@param {bool} archi
		@param {bool} struct
		@param {bool} mep
		@param {bool} construction
	*/
	static setIfcMenuChange(ifcs){
		if(this.viewer != null){
			this.viewer.setIfcMenuChange(ifcs);
		}else{
			this.waitViewer.ifcs = ifcs;
			this.needInit = true;
		}
	}

	static triggerPhaseDisplay(phase, bool){
		if(this.viewer != null){
			this.viewer.triggerPhaseDisplay(phase, bool);
		}/*else{
			this.waitViewer.ifcs = ifcs;
			this.needInit = true;
		}*/
	}

	static triggerTeamDisplay(team, bool){
		if(this.viewer != null){
			this.viewer.triggerTeamDisplay(team, bool);
		}/*else{
			this.waitViewer.ifcs = ifcs;
			this.needInit = true;
		}*/
	}

	static setCameraLocked(bool){
		if(this.viewer != null){
			this.viewer.setCameraLocked(bool);
		}
	}

	static setLayerDisplayed(layer, bool){
		if(this.viewer != null){
			this.viewer.setLayerDisplayed(layer, bool);
		}
	}

	static setZoneDisplayed(zone, bool){
		if(this.viewer != null){
			this.viewer.setZoneDisplayed(zone, bool);
		}
	}

	static setConstructionStateDisplayed(constructionState, bool){
		if(this.viewer != null){
			this.viewer.setConstructionStateDisplayed(constructionState, bool);
		}
	}

}
export default V_4DUtils;