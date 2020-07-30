import "./V_taskTableBackground.scss";
import V_socketUtils from "../Utils/V_socketUtils.class.js";
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
		"tasktablestart",
		"tasksize"
	],
	computed:{
		lineplayed : function(){
			return (this.time - this.tasktablestart) + 1;
		}
	},
	methods:{
		handleResize : function(){
			const heightOpened = this.tasksize + 30;
			this.heightcolumn =  (this.nbopened * heightOpened + this.nbclosed * (heightOpened * (scssVariables.taskHeightClosedPourcent.replace("%", "") / 100))) + 30;
			this.minheightcolumn = "calc(100vh - " + (2 * heightOpened) + "px)";
			/*padding-top : v.$taskSize;
			padding-bottom : v.$taskSize;*/
		},
		handleTap : function(time){
			if(this.tasktablestart + (time - 1) != this.time){
				V_socketUtils.setTime(this.tasktablestart + (time - 1));
			}
		}
	},
	watch:{
		nbopened : function(){
			this.handleResize();
		},
		nbclosed : function(){
			this.handleResize();
		},
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
		<div v-for="c in 6" :key="c" v-bind:class='[c == lineplayed ? "played" : "", "backgroundcolumn"]' v-tap="()=>{handleTap(c)}" v-bind:style="{ height : heightcolumn + 'px', minHeight : minheightcolumn}"></div>
	</div>`,
}