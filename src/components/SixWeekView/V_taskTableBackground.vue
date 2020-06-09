import "./V_taskTableBackground.scss";
import scssVariables from "./assets/_variables.scss";

export default {
	data : function(){
		return {
			"heightcolumn" : scssVariables.taskSize,
			"minheightcolumn" : "calc(100% - " + scssVariables.taskSize.replace("px", "") + "px)",
		}
	},
	props:[
		"selected",
		"nbopened",
		"nbclosed",
		"time",
		"tasktablestart"
	],
	computed:{
		lineplayed : function(){
			return (this.time - this.tasktablestart) + 1;
		}
	},
	methods:{
		handleResize : function(){
			const heightOpened = Math.max(((document.getElementById("taskTableFrame").clientWidth - 30) / 6) - 20, scssVariables.taskSize.replace("px", ""));
			this.heightcolumn =  (this.nbopened * heightOpened + this.nbclosed * (heightOpened * (scssVariables.taskHeightClosedPourcent.replace("%", "") / 100)));
			this.minheightcolumn = "calc(100% - " + heightOpened + "px)";

		}
	},
	mounted: function(){	//Calculate height of task
		this.handleResize();
		window.addEventListener("resize", this.handleResize);
	},
	destroyed() {
	  window.removeEventListener("resize", this.handleResize);
	},
	template : `
	<div>
		<div v-for="c in 6" :key="c" class="backgroundcolumn" v-bind:style="{ height : heightcolumn + 'px', 'min-height' : minheightcolumn}"></div>
	</div>`,
}