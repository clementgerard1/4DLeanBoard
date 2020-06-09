import "./V_taskTableFrame.scss";
import V_6Wrow from "./V_6Wrow.vue";
import V_6Wrow_header from "./V_6Wrow_header.vue";
import V_taskTableBackground from "./V_taskTableBackground.vue";
import V_taskTableFront from "./V_taskTableFront.vue";
import TimelineUtils from "../Utils/V_timelineUtils.class.js";

export default {
	components: {
		tasktablebackground : V_taskTableBackground,
		tasktablefront : V_taskTableFront,
		row6wheader : V_6Wrow_header,
		row6w : V_6Wrow,
	},
	methods : {
		updateTime : function(time){
			this.time = time;
			this.tasktablestart = Math.trunc(this.time / 6) * 6;
		}
	},
	created : function(){
		TimelineUtils.addListener("time", this, this.updateTime);
	},
	data: function(){
			let taskTableStart = Math.trunc(this.playerinit / 6) * 6;
			return {
				tasktablestart : taskTableStart,
				time : this.playerinit,
				phases : this.timeline.getPhasesBetweenTwoDates(0, this.duration),
				nbopened : 10,
				nbclosed : 1,
			};
	},	
	provide: function(){
		return {
			'timeline' : this.timeline,
			'model' : this.model,
		}
	},
	props:[
		'model',
		'timeline',
		'playerinit',
		'duration',
	],
	template : `
		<div class="taskTableFrame">

			<div class="taskTableWrapper">

				<!-- background -->
				<tasktablebackground v-bind:tasktablestart="tasktablestart" v-bind:time="time" v-bind:nbopened="nbopened" v-bind:nbclosed="nbclosed" id="taskTableBackground"></tasktablebackground>

				<!-- core -->
				<row6wheader v-bind:tasktablestart="tasktablestart" v-bind:time="time" ></row6wheader>
				<row6w v-bind:time="time" v-for="phase in phases" :key="phase.id"></row6w>

				<!-- front -->
				<tasktablefront v-bind:tasktablestart="tasktablestart" v-bind:time="time" v-bind:nbopened="nbopened" v-bind:nbclosed="nbclosed" id="taskTableFront"></tasktablefront>
			</div>
	 	</div>
	`,
}