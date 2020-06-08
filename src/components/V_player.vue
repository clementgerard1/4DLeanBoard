import "./V_player.scss";
import TimelineUtils from "./utils/V_timelineUtils.class.js";

export default {
	data : function(){
		return {
				time : this.playerinit,
				maximum : Math.trunc(this.duration / 7)
		}
	},
	watch : {
		time : function(){
			TimelineUtils.setTime(this.time);
		}
	},
	props:[
		'playerinit',
		'duration'
	],
	template : `
	<div class="player">
		<input id="taskTablePlayer" min=0 v-bind:max="maximum" type="number" v-model.number="time"/>
	</div>`,
}

/*v-bind:class='phaseColor'*/