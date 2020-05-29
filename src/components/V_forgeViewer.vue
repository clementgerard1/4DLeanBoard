import taskSVG from "./assets/task.svg";
import V_4DUtils from "./utils/V_4DUtils.class.js";
import "./V_forgeViewer.css";

export default {
	created: function(){
		V_4DUtils.addForgeViewer(this);
	},
	props:[
		"viewer"
	],
	methods:{
		clearHighlighting(){
			console.log("CLEAR HIGHLIGHT");
		},
		highlight(object3D){
			console.log("HIGHLIGHT : " + object3D.getId());
		}
	},
	template : `
	<div id="forgeViewer">
		<p>FORGE VIEWER</p>
		<!-- forgeViewer -->
	</div>`,
}