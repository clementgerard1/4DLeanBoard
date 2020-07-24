import "./V_playerMilestone.scss";
import Utils from "../../class/Utils.class.js";
import scssVariables from "../SixWeekView/assets/_variables.scss";

export default {
	data: function(){
		return {
			id : Utils.getId("milestonePlayer"),
			size : scssVariables.playerHeight.replace("px", "") / 4,
			size2 : scssVariables.playerHeight.replace("px", "") / 4.5
		}
	},
	props: [
		"milestone",
		"time",
		"widthh"
	],
	created : function(){
		window.addEventListener("resize", this.windowUpdate);
	},
	computed : {
		done : function(){
			const safeDate = new Date(this.milestone.getEndDate().valueOf());
			safeDate.setTime(safeDate.getTime() + (2*60*60*1000));
			return this.timeline.getDateObject(this.time * 7) > safeDate;
		},
		milestoneClass : function(){
			return "milestoneplayer" + this.id;
		},
		transform : function(){
			this.milestone.getEndDate();
			const time = Math.ceil(((this.milestone.getEndDate().getTime() - this.model.getStartDate().getTime()) / (1000 * 3600 * 24)) + 1) - 1;
			const duration = Math.ceil(this.model.getDuration() / 7) * 7;
			const x = ((time / duration) * (this.widthh + 10)) - 19;// - (scssVariables.playerHeight.replace("px", "") / 9);
			const y = (scssVariables.playerHeight.replace("px", "") * 0.55);
			return "translate(" + x + "," + y + ")";
		}
	},
	methods: {
		windowUpdate : function(event){
			const backRect = document.querySelector(".svgPlayer" + this.id + " .playerBackground");
		},
	},
	inject:[
		"timeline",
		"model"
	],
	template : `
	<g class="milestonePlayer" v-bind:class="milestoneClass">
		<g v-if="done" v-bind:transform="transform" filter="url(#filter0_d_playermilestonedone)">
			<rect x="2" y="22.5" v-bind:width="size" v-bind:height="size" rx="3" transform="rotate(-45 2 22.5)" fill="#808080" fill-opacity="1"/>
			<rect x="4.12132" y="22.5" v-bind:width="size2" v-bind:height="size2" rx="1.5" transform="rotate(-45 4.12132 22.5)" stroke="black" stroke-width="3"/>
			<text fill="black" xml:space="preserve" style="white-space: pre" font-family="Oswald" font-size="1em" font-weight="500" letter-spacing="0em"><tspan x="-80" y="0.373" v-html="milestone.getName()"></tspan></text>
		</g>
		<g v-else="done" v-bind:transform="transform" class="playermilestone" filter="url(#filter0_d_ms_player)">
			<rect x="2" y="22.5" v-bind:width="size" v-bind:height="size" rx="3" transform="rotate(-45 2 22.5)" fill="#D9D9D9"/>
			<rect x="4.12132" y="22.5" v-bind:width="size2" v-bind:height="size2" rx="1.5" transform="rotate(-45 4.12132 22.5)" stroke="black" stroke-width="3"/>
			<text fill="black" xml:space="preserve" style="white-space: pre" font-family="Oswald" font-size="1em" font-weight="500" letter-spacing="0em"><tspan x="-80" y="0.373" v-html="milestone.getName()"></tspan></text>
		</g>
	</g>`,
}