import "./V_taskTable.scss";
import V_tasksInPhase from "./V_tasksInPhase.vue";
import V_taskTableHeader from "./V_taskTableHeader.vue";
import Model from "../class/Model.class.js";

export default {
	components: {
		tasksinphase : V_tasksInPhase,
		tasktableheader : V_taskTableHeader
	},
	data : function(){
		return {
			
		}
	},
	props : [
		'model',
		'timeline',
		'tasktablestart',
		'time',
		'duration'
	],
	provide: function(){
		return {
			'timeline' : this.timeline,
			'model' : this.model,
		}
	},
	computed: {
		phasesInfos: function(){
			this.tasktablestart = parseInt(this.tasktablestart);
			let phases = null;
			if(this.tasktablestart + 5 <= this.duration){
				phases = this.timeline.getPhasesBetweenTwoDates(this.tasktablestart, this.tasktablestart + 5);
			}else{
				phases = this.timeline.getPhasesBetweenTwoDates(this.tasktablestart, this.duration);
			}
			const infos = [];
			for(let p in phases){
				infos[infos.length] = {
					id : phases[p].id,
					phase : phases[p]
				};
			}
			return infos;
		},
		lineplayed : function(){
			/*if(this.time < 2){
				return this.time;
			}else if(this.time > this.duration - 3){
				return 5 + -(this.duration - this.time);
			}else{
				return 2;
			}*/
			return this.time - this.tasktablestart;
		},
		_tasktablestart: function(){
			return this.tasktablestart;	
		},
		_duration: function(){
			return this.duration;
		}

	},
	template : `
		<div id="taskTable">
			<div v-bind:class="[lineplayed == 0 ? 'played' : '', 'column']">
				<tasktableheader v-bind:time="tasktablestart"></tasktableheader>
				<tasksinphase v-bind:duration="_duration" v-bind:time="tasktablestart" v-bind:tasktablestart="_tasktablestart" v-for="phase in phasesInfos" :key="phase.id" v-bind:phase="phase.phase"></tasksinphase>
			</div>
			<div v-bind:class="[lineplayed == 1 ? 'played' : '', 'column']">
				<tasktableheader v-bind:time="tasktablestart + 1"></tasktableheader>
				<tasksinphase v-bind:duration="_duration" v-bind:time="tasktablestart + 1" v-bind:tasktablestart="_tasktablestart" v-for="phase in phasesInfos" :key="phase.id" v-bind:phase="phase.phase"></tasksinphase>
			</div>
			<div v-bind:class="[lineplayed == 2 ? 'played' : '', 'column']">
				<tasktableheader v-bind:time="tasktablestart + 2"></tasktableheader>
				<tasksinphase v-bind:duration="_duration" v-bind:time="tasktablestart + 2" v-bind:tasktablestart="_tasktablestart" v-for="phase in phasesInfos" :key="phase.id" v-bind:phase="phase.phase"></tasksinphase>
			</div>
			<div v-bind:class="[lineplayed == 3 ? 'played' : '', 'column']">
				<tasktableheader v-bind:time="tasktablestart + 3"></tasktableheader>
				<tasksinphase v-bind:duration="_duration" v-bind:time="tasktablestart + 3" v-bind:tasktablestart="_tasktablestart" v-for="phase in phasesInfos" :key="phase.id" v-bind:phase="phase.phase"></tasksinphase>
			</div>
			<div v-bind:class="[lineplayed == 4 ? 'played' : '', 'column']">
				<tasktableheader v-bind:time="tasktablestart + 4"></tasktableheader>
				<tasksinphase v-bind:duration="_duration" v-bind:time="tasktablestart + 4" v-bind:tasktablestart="_tasktablestart" v-for="phase in phasesInfos" :key="phase.id" v-bind:phase="phase.phase"></tasksinphase>
			</div>
			<div v-bind:class="[lineplayed == 5 ? 'played' : '', 'column']">
				<tasktableheader v-bind:time="tasktablestart + 5"></tasktableheader>
				<tasksinphase v-bind:duration="_duration" v-bind:time="tasktablestart + 5" v-bind:tasktablestart="_tasktablestart" v-for="phase in phasesInfos" :key="phase.id" v-bind:phase="phase.phase"></tasksinphase>
			</div>
		</div>
	`,
}