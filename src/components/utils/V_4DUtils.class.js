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
	static highlightObject4D(object4D){
		//for(let v in this.viewers){
			//this.viewers[v].clearHighlighting();
			this.viewer.clearHighlighting();
			//const objects3D = object4D.getObjects3D();
			//for(let o in objects3D){
			//this.viewers[v].highlight(object4D);
			this.viewer.highlight(object4D);
			//}
		//}
	}

	/**
		Highlight Object4D by id on Forge Viewer
		@param {string} Object4Did id of Object4D to hightlight
		@static
	*/
	static highlightObject4DById(object4Did){
		const object4D = this.viewer.model.getObject4DById(object4Did);
		this.highlightObject4D(object4D);
	}

	/**
		Highlight Task on 6W Planning
		@param {Object4D} Object4D to hightlight
		@static
	*/
	static highlightTask(object4D){
		V_taskTableUtils.setToken(object4D.getTask());
	}


}
export default V_4DUtils;