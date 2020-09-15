import "./V_taskTableBackground.scss";
import V_socketUtils from "../Utils/V_socketUtils.class.js";
import V_timelineUtils from "../Utils/V_timelineUtils.class.js";
import scssVariables from "./assets/_variables.scss";

export default {
	data : function(){
		return {
			"heightcolumn" : scssVariables.taskSize,
			"minheightcolumn" : "calc(100% - " + scssVariables.taskSize.replace("px", "") + "px)",
			"requestFrame" : null,
		}
	},
	props:[
		"selected",
		"nbopened",
		"nbclosed",
		"time",
		"tasktablestart",
		"tasksize",
	],
	computed:{
		lineplayed : function(){
			return (this.time - this.tasktablestart) + 1;
		}
	},
	methods:{
		handleResize : function(){
			const elems = document.getElementsByClassName("phaserow");
			let toReturn = 0;
			for(let e in elems){
				if(typeof elems[e] == "object"){
					toReturn += elems[e].clientHeight;
					if(elems[e].style.height != "0px"){
						toReturn += 17;
					}
				}
			}
			this.heightcolumn = toReturn + 20;
  		this.requestFrame = requestAnimationFrame(this.handleResize);
			/*padding-top : v.$taskSize;
			padding-bottom : v.$taskSize;*/
		},
		handleTap : function(time){
			if(this.tasktablestart + (time - 1) != this.time){
				V_socketUtils.setTime(this.tasktablestart + (time - 1));
			}
		}
	},
	mounted: function(){	//Calculate height of task
		requestAnimationFrame(this.handleResize);
	},
	destroyed() {
		if(this.requestFrame != null) window.cancelAnimationFrame(this.requestFrame);
	},
	template : `
	<div>
		<div v-for="c in 6" :key="c" v-bind:class='[c == lineplayed ? "played" : "", "backgroundcolumn"]' v-tap="()=>{handleTap(c)}" v-bind:style="{ height : heightcolumn + 'px'}"></div>
	</div>`,
}