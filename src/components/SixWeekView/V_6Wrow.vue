import "./V_6Wrow.scss";
import TimelineUtils from "../Utils/V_timelineUtils.class.js";
import V_socketUtils from "../Utils/V_socketUtils.class.js";
import lineOpen from "./assets/lineOpen.svg";
import lineClose from "./assets/lineClose.svg";
import V_Task from "./V_task.vue";
import V_6Wrow_line from "./V_6Wrow_line.vue";
import V_ModelUtils from "../Utils/V_ModelUtils.class.js";
import V_taskTableUtils from "../Utils/V_taskTableUtils.class.js";

export default {
	components: {
		task : V_Task,
		taskline : V_6Wrow_line
	},
	data : function(){

		const model = V_ModelUtils.getModel();
		const timeline = V_ModelUtils.getTimeline();
		const duration = model.getDuration();

		const isOpen = V_taskTableUtils.isOpen(this.taskteam, this.nth);


		const tasks = timeline.getTasksByTaskTeamAndNthBetweenTwoDatesFromMemory(this.taskteam, this.nth, this.tasktablestart * 7, (this.tasktablestart + 6) * 7 - 1);
		const isVisible = !(tasks.count == 0  && this.nth != 0);

		return {
			"color" : "BG_" + this.taskteam.getColorClass(),
			"isOpen" : isOpen, 
			"isVisible" : isVisible,
			"teamDescription" : false,
			"headerHeight" : "30px",
			"teamDisplayed" : true,
			"model" : model,
			"timeline" : timeline,
			"duration" : duration,
			"tasks" : tasks,
			"updateTask" : 0,

		}
	},
	props :[
		"time",
		"taskteam",
		"tasktablestart",
		"nth",
		"tasksize",
		"ifcProperties",
		"teamuser"
	],
	computed:{
		_teamuser : function(){
			return this.teamuser;
		},
		icon : function(){
			if(this.isOpen){
				return lineOpen;
			}else{
				return lineClose;
			}
		},
		_time : function(){
			return this.time;
		},
		_tasktablestart : function(){
			return this.tasktablestart;
		},
		_team : function(){
			return this.taskteam;
		},
		_nth : function(){
			return this.nth;
		},
		zIndex : function(){
			if(this.teamDescription){
				return {
					zIndex : 2,
				}
			}else{
				return {
					zIndex : 0,
				}
			}
		}
	},
	created: function(){
		V_ModelUtils.addModelListener((model)=>{
			this.model = model;
			this.timeline = V_ModelUtils.getTimeline();
			this.duration = this.model.getDuration();
			this.tasks = this.timeline.getTasksByTaskTeamAndNthBetweenTwoDatesFromMemory(this.taskteam, this.nth, this.tasktablestart * 7, (this.tasktablestart + 6) * 7 - 1);
		});
		V_taskTableUtils.addRow(this);
	},

	mounted : function(){
		this.watchResize();
		window.addEventListener('resize', this.watchResize);
	},
	watch : {
		tasktablestart: function(){
			this.tasks = this.timeline.getTasksByTaskTeamAndNthBetweenTwoDatesFromMemory(this.taskteam, this.nth, this.tasktablestart * 7, (this.tasktablestart + 6) * 7 - 1);
			this.updateTask++;
		}
	},
	methods: {
		handleOpenPhase : function(event){
			if(event.target.tagName != "P" && !(event.target.classList.contains("teamAbr"))){
				this.isOpen = !this.isOpen;
				V_socketUtils.setTeamOpening(this.taskteam, this.nth, this.isOpen); 
			}
		},
		updateOpening : function(){
			this.isOpen = V_taskTableUtils.isOpen(this.taskteam, this.nth);
		},
		watchResize : function(){
			const elem = document.getElementsByClassName("phaserow")[0];
			if(elem != null){
				this.headerHeight = (elem.clientWidth / 40) + "px";
			}
		},
		getProperties(task){
			if(task != null){
				const toReturn = [];
				const objs = task.getObject4D().getObjects3D();
				for(let o in objs){
					const obj = objs[o];
					const properties = this.ifcProperties[obj.getIFCId()];
					for(let p in properties){
						if(properties[p][0][1] == "'Comments'"){
							if(toReturn.indexOf(properties[p][0][2]) == -1) toReturn.push(properties[p][0][2]); 
						}
					}
				}
				return toReturn;
			}else{
				return null;
			}
		},
		getLevels(task){
			if(task != null){
				const toReturn = [];
				const objs = task.getObject4D().getObjects3D();
				for(let o in objs){
					const obj = objs[o];
					const properties = this.ifcProperties[obj.getIFCId()];
					for(let p in properties){
						if(properties[p][0][1] == "'Level'"){
							if(toReturn.indexOf(properties[p][0][2]) == -1) toReturn.push(properties[p][0][2]); 
						}
					}
				}
				return toReturn;
			}else{
				return null;
			}
		},
	}
	,
	template : `
	<div v-if="teamDisplayed" class="phaserow" v-bind:style="[ isVisible ? { paddingBottom : (parseFloat(headerHeight.replace('px', '')) / 3)+ 'px' } : {paddingBottom : '0px', height : '0px' }]">

		<!-- line -->
		<taskline v-show="isVisible" class="phaseLine" v-bind:taskheight="headerHeight" v-doubletap="()=>{}" v-tap="handleOpenPhase" v-bind:time="_time" v-bind:nth="_nth" v-bind:team="_team" v-bind:class="color" v-bind:teamdescription="teamDescription" v-bind:style='zIndex'></taskline>

		<!-- tasks -->
		<div v-bind:key="updateTask" v-show="isVisible" class="tasksWrapper" v-bind:style="{ top : '-' + headerHeight, marginBottom : '-' + headerHeight} ">
			<task v-bind:teamuser="_teamuser" v-bind:headerheight="headerHeight" v-bind:color="color" v-bind:team="_team" nth=0 v-for="(task, i) in tasks.array" :key="i" v-bind:properties="getProperties(task)" v-bind:levels="getLevels(task)" v-bind:isopen="isOpen" v-bind:taskid="[typeof task != 'undefined' && task != null ? task.getId() : null]" v-bind:isOpen="isOpen" v-bind:tasktablestart="_tasktablestart" v-bind:time="_tasktablestart + i"  ></task>
		</div>

		<!-- button -->
		<div v-bind:style="{ top : ((parseFloat(headerHeight.replace('px', '')) / 2) - 15) + 'px' }" v-show="isVisible && tasks.count > 0" v-bind:class='[isOpen ? "open" : "close"]' v-tap="handleOpenPhase" v-html="icon" class="phaseButton"></div>



	</div>`,
}