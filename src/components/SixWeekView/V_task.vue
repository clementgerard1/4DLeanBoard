import taskSVG from "./assets/task.svg";
import taskStatusSVG from "./assets/taskStatus.svg";
import V_taskTableUtils from "../Utils/V_taskTableUtils.class.js";
import V_4DUtils from "../Utils/V_4DUtils.class.js";
import "./V_task.scss";
import scssVariables from "./assets/_variables.scss";

export default {
	data : function(){
		const previousTask = null;
		return {
			"selected" : false,
			"state" :false,
			"stateDiv" : null,
			"readytaskface" : null,
		}
	},
	inject : [
		'timeline',
		'model',
	],
	props : [
		"team",
		"nth",
		'time',
		'phase',
		"task",
		"color",
		"isOpen"
	],
	mounted: function(){
		this.updateStateDiv();
		this.updateStateButtons();
	},
	created: function(){
		V_taskTableUtils.addTask(this);
	},
	updated: function(){
		if(this.task != null && this.selected){
			V_4DUtils.highlightObject4D(this.task.getObject4D());
		}
		this.updateStateDiv();
	},
	computed:{
		previousTask : function(){
			if(this.task != null){
				const previous = this.task.getPreviousTasks()[Object.keys(this.task.getPreviousTasks())[0]];
				if(typeof previous != "undefined"){
					return previous;
				}else{
					return null;
				}
			}else{
				return null;
			}
		},
		constraint : function(){
			if(this.task != null){
				return this.task.getRequirement("constraint").getValue();
			}
		}, 
		previousready : function(){
			if(this.previousTask != null){
				return this.previousTask.isReady();
			}
		},
		previouscolor : function(){
			if(this.previousTask != null){
				return scssVariables[this.previousTask.getParentPhase().getColorClass().replace("BG_", "").toLowerCase()];
			}
		},
		information : function(){
			if(this.task != null){
				return this.task.getRequirement("information").getValue();
			}
		}, 
		materials : function(){
			if(this.task != null){
				return this.task.getRequirement("materials").getValue();
			}
		}, 
		manpower : function(){
			if(this.task != null){
				return this.task.getRequirement("manpower").getValue();
			}
		}, 
		equipement : function(){
			if(this.task != null){
				return this.task.getRequirement("equipement").getValue();
			}
		}, 
		safety : function(){
			if(this.task != null){
				return this.task.getRequirement("safety").getValue();
			}
		}, 
		space : function(){
			if(this.task != null){
				return this.task.getRequirement("space").getValue();
			}
		}, 
		ready : function(){
			if(this.task != null){
				return this.task.isReady();
			}
		},
		notEmpty : function(){
			return this.task != null;
		},
		tid : function(){
			return this.task.getId();
		},
		dr : function(){
			return this.task.getDuration();
		},
		svgcolor : function(){
			return scssVariables[this.color.replace("BG_", "").toLowerCase()];
		},
		mn : function(){
			return this.task.getTaskTeam().getWorkers();
		},
		taskname : function(){
			const startWeek = this.timeline.getDateObject(this.time * 7);
			const endWeek = this.timeline.getDateObject(this.time * 7 + 6);
			const duration = this.task.getDuration();
			const startTask = this.task.getStartDate();
			const offset = (startTask.getTime() - startWeek.getTime())  / (1000 * 3600 * 24);

			if(offset >= 0 && (offset + duration) <= 7){
				return this.getTwoLineFormat(this.task.getName());
			}else{
				let nbWeeks = null;
				let index = null;
				const initialOffset = ((offset % 7) + 7) % 7; //https://stackoverflow.com/questions/4467539/javascript-modulo-gives-a-negative-result-for-negative-numbers
				if(offset >= 0){
					index = 1;
					nbWeeks = Math.ceil((duration + initialOffset) / 7);
				}else{
					index = Math.ceil(Math.abs(offset) / 7) + 1;
					nbWeeks = Math.ceil((duration + initialOffset) / 7);
				}

				return this.getTwoLineFormat("(" + index +  "/" + nbWeeks + ")" + this.task.getName());

			}
		},
		taskteam : function(){
			return this.task.getTaskTeam().getName();
		},
		taskId: function(){
			if(this.task != null){
				return this.task.getId();
			}else{
				return "noTask";
			}
		},

	},
	watch:{
		time : function(){
			if(this.task != null){
				this.selected = V_taskTableUtils.isTokenOwner(this);
			}else{
				this.selected = null;
			}
		},
		ready : function(){
			this.updateStateButtons();
		}
	},
	methods:{
		updateStateButtons: function(){
			if(!this.ready){
				this.readytaskface = '<g filter="url(#filter1_d_task)"><circle cx="171" cy="164" r="16" fill="white"></circle><circle cx="171" cy="164" r="15" stroke="black" stroke-width="2"></circle></g>';
			}else{
				this.readytaskface = '<g filter="url(#filter1_d_taskfaceready)"><circle cx="171" cy="164" r="16" fill="black"/></g>';
			}
		},
		updateStateDiv: function(){
			if(this.task != null){
				this.stateDiv = document.getElementById(this.task.getId() + "-" + this.time);
			}
		},
		getTwoLineFormat: function(str){
			if(str.length <= 11){
				return {
					l1: str,
					l2: ""
				};
			}else if(str.length <= 22){
				return {
					l1: str.slice(0, 11),
					l2: str.slice(11, 22)
				};
			}else{
				return {
					l1: str.slice(0, 11),
					l2: str.slice(11, 20) + "..."
				};
			}
		},
		handleDoubleTap: function(event){
			if(this.notEmpty){
				if(!this.state){
					this.state = true;
					this.stateDiv.classList.add('animate__flipInY');
					
				}else{
					const that = this;
					this.stateDiv.classList.remove('animate__flipInY');
					this.stateDiv.classList.add('animate__flipOutY');
					this.stateDiv.addEventListener('animationend', (e) => {
							if(e.animationName == "flipOutY"){	
						  		that.state = false;
						  		this.stateDiv.classList.remove('animate__flipOutY');
						  	}
					});
				}
			}
		},
		handleTap: function(event){
			if(this.task != null){
				V_taskTableUtils.getToken(this.task);
			}
		},
		setSelectedValue(bool){
			this.selected = bool;
		}
	},
	template : `
	<div class="taskWrapper">
		<div v-tap='handleTap' v-doubletap='handleDoubleTap' v-bind:class='[selected ? "selected" : "", "task"]'>
			<div v-if="notEmpty" class='taskclass animate__animated animate__flipInY'>` + taskSVG + `</div>
			<div v-if="notEmpty" v-show="state" v-bind:id="taskId + '-' + time" class="taskstate animate__animated animate__faster">` + taskStatusSVG + `</div>
		</div>
	</div>`,
}

/*v-bind:class='phaseColor'*/