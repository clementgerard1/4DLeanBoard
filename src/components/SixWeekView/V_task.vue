import taskSVG from "./assets/task.svg";
import taskStatusSVG from "./assets/taskStatus.svg";
import V_taskTableUtils from "../Utils/V_taskTableUtils.class.js";
import V_4DUtils from "../Utils/V_4DUtils.class.js";
import V_socketUtils from "../Utils/V_socketUtils.class.js";
import "./V_task.scss";
import scssVariables from "./assets/_variables.scss";

export default {
	data : function(){

		let previousTask = null;
		if(this.task != null){
			const previous = this.task.getPreviousTasks()[Object.keys(this.task.getPreviousTasks())[0]];
			if(typeof previous != "undefined"){
				previousTask = previous;
			}else{
				previousTask = null;
			}
		}else{
			previousTask =  null;
		}

		let constraint = false;
		if(this.task != null){
			constraint = this.task.getRequirement("constraint").getValue();
		}

		let information = false;
		if(this.task != null){
			information = this.task.getRequirement("information").getValue();
		}

		let materials = false;
		if(this.task != null){
			materials = this.task.getRequirement("materials").getValue();
		}		

		let manpower = false;
		if(this.task != null){
			manpower = this.task.getRequirement("manpower").getValue();
		}		

		let equipement = false;
		if(this.task != null){
			equipement = this.task.getRequirement("equipement").getValue();
		}		

		let safety = false;
		if(this.task != null){
			safety = this.task.getRequirement("safety").getValue();
		}		

		let space = false;
		if(this.task != null){
			space = this.task.getRequirement("space").getValue();
		}		

		let previousColor = null;
		if(previousTask != null){
			previousColor =  scssVariables[previousTask.getParentPhase().getColorClass().replace("BG_", "").toLowerCase()];
		}

		let ready = false
		if(this.task != null){
			ready = this.task.isReady();
		}

		let previousready = false;
		if(previousTask != null){
			previousready = previousTask.isReady();
		}


		return {
			"selected" : false,
			"state" :false,
			"stateDiv" : null,
			"readytaskface" : null,
			"highlighted" : false,
			constraint : constraint, 
			information : information, 
			materials : materials, 
			manpower : manpower, 
			equipement : equipement, 
			safety : safety, 
			space : space,
			ready : ready,
			previousready : previousready,
			previousTask : previousTask,
			previouscolor : previousColor
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
		this.updateStateDiv();
	},
	computed:{
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
			V_socketUtils.highlightObject4D(this.task.getObject4D());
		},
		ready : function(){
			this.updateStateButtons();
		},
		isOpen : function(){
			if(!this.isOpen) this.state = false;
		}
	},
	methods:{
		hightlight: function(bool){
			this.highlighted = bool;
		},
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
		handlePress : function(event){
			const display = event.type == "press";
			const tasks = this.task.getPreviousTasks();
			for(let t  in tasks){
				V_taskTableUtils.highlightTask(tasks[t] , display);
			}

		},
		handleTap: function(event){
			if(this.task != null){
				V_taskTableUtils.setToken(this.task);
			}
			V_socketUtils.highlightObject4D(this.task.getObject4D());
		},
		handleConstraintChange : function(event){
			switch(event.target.id){
				case "constraintTap": this.task.getRequirement("constraint").setValue(!this.task.getRequirement("constraint").getValue()); break;
				case "informationTap": this.task.getRequirement("information").setValue(!this.task.getRequirement("information").getValue()); break;
				case "materialsTap": this.task.getRequirement("materials").setValue(!this.task.getRequirement("materials").getValue()); break;
				case "manpowerTap": this.task.getRequirement("manpower").setValue(!this.task.getRequirement("manpower").getValue()); break;
				case "equipementTap": this.task.getRequirement("equipement").setValue(!this.task.getRequirement("equipement").getValue()); break;
				case "safetyTap": this.task.getRequirement("safety").setValue(!this.task.getRequirement("safety").getValue()); break;
				case "spaceTap": this.task.getRequirement("space").setValue(!this.task.getRequirement("space").getValue()); break;
			}
			event.srcEvent.stopPropagation();
			V_taskTableUtils.updateRequirements(this.task);
		},
		updateRequirements(){
			let previousReady = this.ready;
			let constraint = false;
			if(this.task != null){
				this.constraint = this.task.getRequirement("constraint").getValue();
				this.information = this.task.getRequirement("information").getValue();
				this.materials = this.task.getRequirement("materials").getValue();
				this.manpower = this.task.getRequirement("manpower").getValue();
				this.equipement = this.task.getRequirement("equipement").getValue();
				this.safety = this.task.getRequirement("safety").getValue();
				this.space = this.task.getRequirement("space").getValue();
				this.ready = this.task.isReady();
			}		

			if(this.ready != previousReady){
				V_taskTableUtils.updatePrevious(this.task);
			}

		},
		updatePrevious(){

			if(this.previousTask != null){
				this.previousColor =  scssVariables[this.previousTask.getParentPhase().getColorClass().replace("BG_", "").toLowerCase()];
			}

			if(this.previousTask != null){
				this.previousready = this.previousTask.isReady();
			}

		},
		setSelectedValue(bool){
			this.selected = bool;
		}
	},
	template : `
	<div class="taskWrapper" v-bind:class='[highlighted ? "highlighted" : ""]'>
		<div v-tap='handleTap' v-doubletap='handleDoubleTap' v-bind:class='[selected ? "selected" : "", "task"]'>
			<div v-if="notEmpty" class='taskclass animate__animated animate__flipInY'>` + taskSVG + `</div>
			<div v-if="notEmpty" v-show="state" v-bind:id="taskId + '-' + time" class="taskstate animate__animated animate__faster">` + taskStatusSVG + `</div>
		</div>
	</div>`,
}

/*v-bind:class='phaseColor'*/