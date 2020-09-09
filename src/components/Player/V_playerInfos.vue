import "./V_playerInfos.scss";
import V_socketUtils from "../Utils/V_socketUtils.class.js";
import V_timelineUtils from "../Utils/V_timelineUtils.class.js";
import V_playerMilestone from "./V_playerMilestone.vue";
import scssVariables from "../SixWeekView/assets/_variables.scss";
import Utils from "../../class/Utils.class.js";
import V_ModelUtils from "../Utils/V_ModelUtils.class.js";

export default {
	components: {
		"playermilestone" : V_playerMilestone,
	},
	data: function(){

		const model = V_ModelUtils.getModel();
		const timeline = V_ModelUtils.getTimeline();
		const duration = model.getDuration();

		return {
			svg : null,
			widthh : null,
			id : Utils.getId("svgPlayer"),
			time : this.playerinit,
			playerX : 0,
			playerflag : false,
			milestones : model.getMilestones(),
			playerTimeout : null,
			// timeTimeout : null,
			milestoneTimeout : {
				milestoneId : null,
				timeout : null,
			},
			model : model,
			timeline : timeline,
			duration : duration,
		}
	},
	props: [
		"nbweek",
		"playerinit",
		"displayM"
	],
	created : function(){
		window.addEventListener("resize", this.windowUpdate);
		V_timelineUtils.addListener("time", this, this.watchTime);
		V_ModelUtils.addModelListener((model)=>{
			this.model = model;
			this.timeline = V_ModelUtils.getTimeline();
			this.duration = this.model.getDuration();
		})
	},
	mounted : function(){
		this.svg = document.querySelector(".svgPlayer" + this.id);
	},
	methods : {
		windowUpdate : function(event){
			const weekWidth = (this.svg.clientWidth) / this.nbweek;
			const backRect = document.querySelector(".svgPlayer" + this.id + " .playerBackground");
			this.widthh = this.svg.clientWidth;
			backRect.setAttribute("width",  this.svg.clientWidth + 2);
			this.playerX = this.time * weekWidth + (weekWidth / 2);
		},
		setTime(time){
			// if(this.timeTimeout != null){ 
			// 	clearTimeout(this.timeTimeout);
			// 	this.timeTimeout = null;
			// }
			// this.timeTimeout = setTimeout( () => {
				V_socketUtils.setTime(time);
			// }, 50);
		},

		handleTimeChange: function(event){
			this.setTime(event.target.id);
		},
		watchTime : function(time){
			this.time = time;
			if(!this.playerflag){
				this.windowUpdate();
			}
		},
		handlePan : function(event){

			if(event.target.localName == "rect" && event.target.classList.item(0) != null) return;

			const x = event.srcEvent.clientX - this.svg.getBoundingClientRect().x;
			const weekWidth = (this.svg.clientWidth) / this.nbweek;

			//if(event.target.classList.contains("playerButton") || event.type == "panstart" && (x > (this.time * weekWidth) && (x < ((this.time + 1) * weekWidth)))) this.playerflag = true;

			//if(this.playerflag){
				if(event.type == "panmove" || event.type == "panstart"){
					if( x > (weekWidth / 2) && x < ((this.nbweek-1) * weekWidth + (weekWidth / 2)) ){
						this.playerX = x;
						const time = Math.trunc(x / weekWidth);
						if(time != this.time){
							this.setTime(time);
						}
					}
				}

				if(event.type == "panend"){
					this.playerX = this.time * weekWidth + (weekWidth / 2);
					this.playerflag = false;
				}

				if(this.playerTimeout != null){ 
					clearTimeout(this.playerTimeout);
					this.playerTimeout = null;
				}
				this.svg.querySelector("svg").getElementById("playerCircle").style.fill = scssVariables["greenbluish_light"];
				this.svg.querySelector("svg").getElementById("playerCircle").style.r = 25;
				this.playerTimeout = setTimeout( () => {
					this.svg.querySelector("svg").getElementById("playerCircle").style.fill = "white";
					this.svg.querySelector("svg").getElementById("playerCircle").style.r = 21;
				}, 1000);
			//}
		},
		handleTap : function(event){
			if(event.target.localName == "rect" && event.target.classList.item(0) != null){
				let milestone = null;
				for(let m in this.milestones){
					if(this.milestones[m].getId() == parseInt(event.target.classList.item(0).replace("milestone-", ""))){
						milestone = this.milestones[m];
					}
				}
				if(milestone == null) return;


				this.$parent.milestoneSelected = milestone;
				event.target.style.filter = "drop-shadow(1px 1px 15px #97D7C7)";

				if(this.milestoneTimeout.milestoneId != milestone.getId()){

				}
				if(this.milestoneTimeout.timeout != null){
					clearTimeout(this.milestoneTimeout.timeout);
					this.milestoneTimeout.timeout = null;
				}
				this.milestoneTimeout.timeout = setTimeout( ()=>{
					this.$parent.milestoneSelected = null;
				}, 2000);
				return;
			}
			const x = event.srcEvent.clientX - this.svg.getBoundingClientRect().x;
			const weekWidth = (this.svg.clientWidth) / this.nbweek;
			this.playerX = x;
			const time = Math.trunc(x / weekWidth);
			if(time != this.time){
				this.setTime(time);
			}
			if(this.playerTimeout != null){ 
				clearTimeout(this.playerTimeout);
				this.playerTimeout = null;
			}
			this.svg.querySelector("svg").getElementById("playerCircle").style.fill = scssVariables["greenbluish_light"];
			this.svg.querySelector("svg").getElementById("playerCircle").style.r = 25;
			this.playerTimeout = setTimeout( () => {
				this.svg.querySelector("svg").getElementById("playerCircle").style.fill = "white";
				this.svg.querySelector("svg").getElementById("playerCircle").style.r = 21;
			}, 1000);
		},

		handlePress : function(event){
			if(event.target.localName == "rect" && event.target.classList.item(0) != null){
				if(event.type == "press"){
					let milestone = null;
					for(let m in this.milestones){
						if(this.milestones[m].getId() == parseInt(event.target.classList.item(0).replace("milestone-", ""))){
							milestone = this.milestones[m];
						}
					}
					if(milestone == null) return;
					this.$parent.milestoneSelected = milestone;
				}
				
				if(event.type == "pressup"){
					this.$parent.milestoneSelected = null;
				}
			}
		}
	},
	watch : {

		svg : function(){
			const weekWidth = (this.svg.clientWidth) / this.nbweek;
			this.playerX = this.time * weekWidth + (weekWidth / 2);
			this.widthh = this.svg.clientWidth;
		}

	},
	computed : {
		svgClass : function(){
			return "svgPlayer" + this.id;
		}
	},
	template : `
	<div v-tap="handleTap" v-press="handlePress" v-pan="handlePan" class="svgPlayer" v-bind:class="svgClass">
		<svg height="` + scssVariables.playerHeight.replace("px", "") + `" fill="none" xmlns="http://www.w3.org/2000/svg">
			
			<rect class="playerBackground" fill="url(#paint0_linear_playerRect)" stroke-width="2"/>
			<rect class="playerBackgroundFilled" v-bind:width="playerX" stroke-width="2"/>

			<playermilestone v-if="displayM" v-bind:widthh="widthh" v-bind:time="time" v-for="m in milestones" :key="m.getId()" v-bind:milestone="m"></playermilestone>

			<g filter="url(#filter0_d_playerButton)">
				<circle id="playerCircle" class="playerButton" v-bind:cx="playerX" r="21" stroke-width="2" fill="white"/>
			</g>

		</svg>
	</div>`,
}