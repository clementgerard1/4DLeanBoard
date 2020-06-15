class V_4DUtils{


	static viewers = [];
	static highlighted = [];

	/**
		Add ForgeViewer as listener of TaskTable Changement
		@param {V_forgeViewer} V_forgeViewer which become reactive
		@static
	*/
	static addForgeViewer(viewer){
		this.viewers.push(viewer);
	}	

	/**
		Highlight Object4D on Forge Viewer
		@param {Object4D} Object4D to hightlight
		@static
	*/
	static highlightTask(object4D){
		for(let v in this.viewers){
			this.viewers[v].clearHighlighting();
			//const objects3D = object4D.getObjects3D();
			//for(let o in objects3D){
			this.viewers[v].highlight(object4D);
			//}
		}
	}


}
export default V_4DUtils;