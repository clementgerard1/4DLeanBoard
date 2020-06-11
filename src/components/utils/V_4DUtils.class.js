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
			console.log("bang");
			const objects4D = object4D.getObjects3D();
			for(let o in objects4D){
				this.viewers[v].highlight(objects4D[o]);
			}
		}
	}


}
export default V_4DUtils;