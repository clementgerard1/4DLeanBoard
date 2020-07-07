import V_taskTableUtils from "./V_taskTableUtils.class.js";
import V_socketUtils from "./V_socketUtils.class.js";

class V_4DUtils{


	//static viewers = [];
	static viewer = null;
	static highlighted = [];

	/**
		Add ForgeViewer as listener of TaskTable Changement
		@param {V_forgeViewer} V_forgeViewer which become reactive
		@static
	*/
	static setForgeViewer(viewer){
		//this.viewers.push(viewer);
		this.viewer = viewer;
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
			this.viewer.highlight(object4D, bool);
			//}
		//}
		}
	}

	static clearHighlighting(){
		if(this.viewer != null){
			this.viewer.clearHighlighting();
		}
	}

	/**
		Highlight Object4D by id on Forge Viewer
		@param {string} Object4Did id of Object4D to hightlight
		@param {bool} bool
		@static
	*/
	static highlightObject4DById(object4Did, bool){
		const object4D = this.viewer.model.get4DObjectById(object4Did);
		this.highlightObject4D(object4D, bool);
	}

	/**
		Set contractor displayed by id on Forge Viewer
		@param {string} Object4Did id of Object4D to hightlight
		@static
	*/
	static setTeamDisplayedById(teamId){
		const taskTeam = this.viewer.model.getTaskTeamById(teamId);
		if(taskTeam != null){
			this.setTeamDisplayed(taskTeam);
		}
	}

	/**
		Set taskteam displayed on Forge Viewer
		@param {uid} taskTeam id
		@static
	*/
	static setTeamDisplayed(taskTeam){
		if(this.viewer != null){
			this.viewer.setTeamDisplayed(taskTeam);
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
		}
	}

}
export default V_4DUtils;