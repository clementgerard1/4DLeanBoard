import "./V_playerInfos.scss";
import V_socketUtils from "../Utils/V_socketUtils.class.js";
import V_timelineUtils from "../Utils/V_timelineUtils.class.js";
import V_playerMilestone from "./V_playerMilestone.vue";
import scssVariables from "../SixWeekView/assets/_variables.scss";
import Utils from "../../class/Utils.class.js";

export default {
	components: {
		"playermilestone" : V_playerMilestone,
	},
	data: function(){
		return {
			svg : null,
			widthh : null,
			id : Utils.getId("svgPlayer"),
			time : this.playerinit,
			playerX : 0,
			playerflag : false,
			milestones : this.model.getMilestones(),
		}
	},
	inject:[
		"timeline",
		"model"
	],
	provide:[
		"timeline",
		"model"
	],
	props: [
		"nbweek",
		"playerinit"
	],
	created : function(){
		window.addEventListener("resize", this.windowUpdate);
		V_timelineUtils.addListener("time", this, this.watchTime);
	},
	mounted : function(){
		this.svg = document.querySelector(".svgPlayer" + this.id);
		this.player
	},
	methods : {
		windowUpdate : function(event){
			const weekWidth = (this.svg.clientWidth) / this.nbweek;
			const backRect = document.querySelector(".svgPlayer" + this.id + " .playerBackground");
			this.widthh = this.svg.clientWidth;
			backRect.setAttribute("width",  this.svg.clientWidth + 2);
			this.playerX = this.time * weekWidth + (weekWidth / 2);
		},
		handleTimeChange: function(event){
			V_socketUtils.setTime(event.target.id);
		},
		watchTime : function(time){
			this.time = time;
			if(!this.playerflag){
				this.windowUpdate();
			}
		},
		handlePan : function(event){
			const x = event.srcEvent.clientX - this.svg.getBoundingClientRect().x;
			const weekWidth = (this.svg.clientWidth) / this.nbweek;

			if(event.type == "panstart" && (x > (this.time * weekWidth) && (x < ((this.time + 1) * weekWidth)))) this.playerflag = true;

			if(this.playerflag){
				if(event.type == "panmove" || event.type == "panstart"){
					if( x > (weekWidth / 2) && x < ((this.nbweek-1) * weekWidth + (weekWidth / 2)) ){
						this.playerX = x;
						const time = Math.trunc(x / weekWidth);
						if(time != this.time){
							V_socketUtils.setTime(time);
						}
					}
				}

				if(event.type == "panend"){
					this.playerX = this.time * weekWidth + (weekWidth / 2);
					this.playerflag = false;
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
	<div v-pan="handlePan" class="svgPlayer" v-bind:class="svgClass">
		<svg height="` + scssVariables.playerHeight.replace("px", "") + `" fill="none" xmlns="http://www.w3.org/2000/svg">
			
			<rect class="playerBackground" stroke-width="2"/>
			<rect class="playerBackgroundFilled" v-bind:width="playerX" stroke-width="2"/>

			<g filter="url(#filter0_d_playerButton)">
				<circle class="playerButton" v-bind:cx="playerX" r="21" fill="#97D7C7"/>
			</g>

			<playermilestone v-bind:widthh="widthh" v-bind:time="time" v-for="m in milestones" :key="m.getId()" v-bind:milestone="m"></playermilestone>

		</svg>
	</div>`,
}