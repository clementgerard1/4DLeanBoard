import taskStatusSVG from "./assets/taskStatus.svg";
import previousTask from "./assets/previousTask.svg";
import V_taskTableUtils from "../Utils/V_taskTableUtils.class.js";
import V_4DUtils from "../Utils/V_4DUtils.class.js";
import V_socketUtils from "../Utils/V_socketUtils.class.js";
import "./V_task.scss";
import scssVariables from "./assets/_variables.scss";

import lpsEmpty from "./assets/lpsEmpty.svg";
import lpsDone from "./assets/lpsDone.svg";

import manIcon from "./assets/mans.svg";
import calendarIcon from "./assets/calendar.svg";

import arrowL from "./assets/arrowL.svg";
import arrowR from "./assets/arrowR.svg";

import doneIcon from "./assets/done.svg";
import goIcon from "./assets/go.svg";
import pauseIcon from "./assets/pause.svg";

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
			previousColor =  scssVariables[previousTask.getTaskTeam().getColorClass().replace("BG_", "").toLowerCase()];
		}

		let ready = false
		if(this.task != null){
			ready = this.task.isReady();
		}

		let paused = false;
		if(this.task != null){
			paused = this.task.isPaused();
		}

		let done = false;
		if(this.task != null){
			done = this.task.isDone();
		}

		let previousready = false;
		if(previousTask != null){
			previousready = previousTask.isReady();
		}

		//For avoid tap propagation, need to delete it
		let constraintTap = false

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
			previouscolor : previousColor,
			done : done,
			go : false,
			paused : paused,
			constraintTap : constraintTap,
			isFirst : false,
			index : null,
			taskHeight : "0px",
			idFace : false,
			lpsFace : false,
			descriptionFace : false,
			lpsList : [
				"Constraint",
				"Information",
				"Materials",
				"Manpower",
				"Equipement",
				"Safety",
				"Space",
			],
			lpsIndex : 0,
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
		"task",
		"color",
		"isOpen",
		"isopen"
	],
	mounted: function(){
		this.updateStateDiv();
		this.updateStateButtons();
		this.watchResize();
		window.addEventListener('resize', this.watchResize);
	},
	created: function(){
		V_taskTableUtils.addTask(this);
		if(this.task != null){
			this.selected = V_taskTableUtils.isTokenOwner(this);
			//if(this.selected){
				//V_socketUtils.highlightObject4D(this.task.getObject4D(), true);
			//}
		}else{
			this.selected = null;
		}
	},
	updated: function(){
		this.updateDatas();
		this.updateStateDiv();

		V_taskTableUtils.updateTask(this);
		if(this.task != null){
			this.selected = V_taskTableUtils.isTokenOwner(this);
			//if(this.selected){
				//V_socketUtils.highlightObject4D(this.task.getObject4D(), true);
			//}
		}else{
			this.selected = null;
		}
	},
	computed:{
		wrapclass : function(){
			let result = "";
			if(this.highlighted) result += "highlighted ";
			if(this.task == null) result += "empty ";
			return result;
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
		idcolor : function(){
			if(!this.ready){
				return this.svgcolor;
			}else{
				return "black";
			}
		},
		headercolors : function(){
			if(this.done){
				return {
					body : this.svgcolor,
					border : this.svgcolor
				};
			}else if(this.paused){
				return {
					body : this.svgcolor,
					border : "red"
				};
			}else if(this.ready){
				return {
					body : this.svgcolor,
					border : "white"
				};
			}else{
				return {
					body : "white",
					border : this.svgcolor
				};
			}
		},
		mn : function(){
			return this.task.getTaskTeam().getWorkers();
		},
		taskname : function(){
			const startWeek = this.timeline.getDateObject(this.time * 7);
			const endWeek = this.timeline.getDateObject(this.time * 7 + 6);
			const duration = this.task.getDuration();
			const startTask = this.task.getStartDate();
			const offset = Math.round((startTask.getTime() - startWeek.getTime())  / (1000 * 3600 * 24));
			// if(this.task.getId() == 139 || this.task.getId() == 140){
			// }
			 if(offset >= 0 && (offset + duration) <= 7){
			 	this.index = 1;
			 	return this.task.getName();
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
				this.index = index;
				if(index == 1 || ((this.time % 6) == 0)){
					return this.task.getName();
					//return this.getTwoLineFormat(/*"(" + index +  "/" + nbWeeks + ")" + */this.task.getName());
				}else{
					return "";
				}

			}
		},
		taskteam : function(){
			return this.task.getTaskTeam().getName();
		},
		tasksSVG2 : function(){
			let result = "";
			if(this.constraint){
				this.lpsIndex == 0 ? result += "<div v-tap='handleLpsButtonTap' class='lpsSelected'>" + lpsDone.replace("<circle ", "<circle class='lpsSelected' ") + "</div>" : result += lpsDone;
			}else{
				this.lpsIndex == 0 ? result += "<div v-tap='handleLpsButtonTap' class='lpsSelected'>" + lpsEmpty.replace("<circle ", "<circle class='lpsSelected' ") + "</div>"  : result += lpsEmpty;
			}
			if(this.information){
				this.lpsIndex == 1 ? result += "<div v-tap='handleLpsButtonTap' class='lpsSelected'>" + lpsDone.replace("<circle ", "<circle class='lpsSelected' ") + "</div>"  : result += lpsDone;
			}else{
				this.lpsIndex == 1 ? result += "<div v-tap='handleLpsButtonTap' class='lpsSelected'>" + lpsEmpty.replace("<circle ", "<circle class='lpsSelected' ") + "</div>"  : result += lpsEmpty;
			}
			if(this.materials){
				this.lpsIndex == 2 ? result += "<div v-tap='handleLpsButtonTap' class='lpsSelected'>" + lpsDone.replace("<circle ", "<circle class='lpsSelected' ") + "</div>"  : result += lpsDone;
			}else{
				this.lpsIndex == 2 ? result += "<div v-tap='handleLpsButtonTap' class='lpsSelected'>" + lpsEmpty.replace("<circle ", "<circle class='lpsSelected' ") + "</div>"  : result += lpsEmpty;
			}
			if(this.manpower){
				this.lpsIndex == 3 ? result += "<div v-tap='handleLpsButtonTap' class='lpsSelected'>" + lpsDone.replace("<circle ", "<circle class='lpsSelected' ") + "</div>"  : result += lpsDone;
			}else{
				this.lpsIndex == 3 ? result += "<div v-tap='handleLpsButtonTap' class='lpsSelected'>" + lpsEmpty.replace("<circle ", "<circle class='lpsSelected' ") + "</div>"  : result += lpsEmpty;
			}
			if(this.equipement){
				this.lpsIndex == 4 ? result += "<div v-tap='handleLpsButtonTap' class='lpsSelected'>" + lpsDone.replace("<circle ", "<circle class='lpsSelected' ") + "</div>"  : result += lpsDone;
			}else{
				this.lpsIndex == 4 ? result += "<div v-tap='handleLpsButtonTap' class='lpsSelected'>" + lpsEmpty.replace("<circle ", "<circle class='lpsSelected' ") + "</div>"  : result += lpsEmpty;
			}
			if(this.safety){
				this.lpsIndex == 5 ? result += "<div v-tap='handleLpsButtonTap' class='lpsSelected'>" + lpsDone.replace("<circle ", "<circle class='lpsSelected' ") + "</div>"  : result += lpsDone;
			}else{
				this.lpsIndex == 5 ? result += "<div v-tap='handleLpsButtonTap' class='lpsSelected'>" + lpsEmpty.replace("<circle ", "<circle class='lpsSelected' ") + "</div>"  : result += lpsEmpty;
			}
			if(this.space){
				this.lpsIndex == 6 ? result += "<div v-tap='handleLpsButtonTap' class='lpsSelected'>" + lpsDone.replace("<circle ", "<circle class='lpsSelected' ") + "</div>"  : result += lpsDone;
			}else{
				this.lpsIndex == 6 ? result += "<div v-tap='handleLpsButtonTap' class='lpsSelected'>" + lpsEmpty.replace("<circle ", "<circle class='lpsSelected' ") + "</div>"  : result += lpsEmpty;
			}
			result = result.replace(/svgcolor/g, this.svgcolor);
			return result;
		},
		tasksSVG : function(){
			let result = "";
			if(this.constraint){
				result += lpsDone;
			}else{
				result += lpsEmpty;
			}
			if(this.information){
				result += lpsDone;
			}else{
				result += lpsEmpty;
			}
			if(this.materials){
				result += lpsDone;
			}else{
				result += lpsEmpty;
			}
			if(this.manpower){
				result += lpsDone;
			}else{
				result += lpsEmpty;
			}
			if(this.equipement){
				result += lpsDone;
			}else{
				result += lpsEmpty;
			}
			if(this.safety){
				result += lpsDone;
			}else{
				result += lpsEmpty;
			}
			if(this.space){
				result += lpsDone;
			}else{
				result += lpsEmpty;
			}
			result = result.replace(/svgcolor/g, this.svgcolor);
			return result;

		},

	},
	watch:{
		time : function(){
			if(this.task != null){
				this.selected = V_taskTableUtils.isTokenOwner(this);
				if(this.selected){
					V_socketUtils.highlightObject4D(this.task.getObject4D(), true);
				}
			}else{
				this.selected = null;
			}
		},
		ready : function(){
			this.updateStateButtons();
		},
		isOpen : function(){
			if(!this.isOpen) this.state = false;
		}
	},
	methods:{
		updateDatas: function(){
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
				previousColor =  scssVariables[previousTask.getTaskTeam().getColorClass().replace("BG_", "").toLowerCase()];
			}

			let ready = false
			if(this.task != null){
				ready = this.task.isReady();
			}

			let paused = false;
			if(this.task != null){
				paused = this.task.isPaused();
			}

			let done = false;
			if(this.task != null){
				done = this.task.isDone();
			}

			let previousready = false;
			if(previousTask != null){
				previousready = previousTask.isReady();
			}

			this.previousTask = previousTask;
			this.constraint = constraint;
			this.information = information;
			this.materials = materials;
			this.manpower = manpower;
			this.equipement = equipement;
			this.safety = safety;
			this.space = space;
			this.previouscolor = previousColor;
			this.ready = ready;
			this.paused = paused;
			this.done = done;
			this.previousready = previousready;
		},
		hightlight: function(bool){
			this.highlighted = bool;
		},
		updateStateButtons: function(){
			if(!this.ready){
				this.readytaskface = '<g filter="url(#filter1_d_task)"><circle cx="171" cy="164" r="16" fill="white"></circle><circle cx="171" cy="164" r="15" stroke="black" stroke-width="2"></circle></g>';
			}else{ 
				if(this.done){
					this.readytaskface = '<g filter="url(#filter1_d_donetask)"><circle cx="171" cy="164" r="16" fill="black"/></g>';
				}else if(this.paused){
					this.readytaskface = '<g filter="url(#filter1_d_pausedtask)"><circle cx="171" cy="164" r="16" fill="black"/></g>';
				}else{
					this.readytaskface = '<g filter="url(#filter1_d_taskfaceready)"><circle cx="171" cy="164" r="16" fill="black"/></g>';
				}
			}
		},
		updateStateDiv: function(){
			if(this.task != null){
				this.stateDiv = document.getElementById(this.task.getId() + "-" + this.time);
			}
		},
		getTwoLineFormat: function(str){
			if(str.length <= 15){
				return {
					l1: str,
					l2: ""
				};
			}else if(str.length <= 30){
				return {
					l1: str.slice(0, 15),
					l2: str.slice(15, 30)
				};
			}else{
				return {
					l1: str.slice(0, 15),
					l2: str.slice(15, 28) + "..."
				};
			}
		},
		updateStateDisplay : function(bool){
			if(this.notEmpty){
				if(bool){
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
		handleDoubleTap: function(event){

			if(!this.constraintTap){
				if(this.isopen){
					V_socketUtils.updateStateDisplay(this.task, !this.state);
				}
			}else{
				this.constraintTap = false;
			}
		},
		handlePress : function(event){
			const display = event.type == "press";
			const tasks = this.task.getPreviousTasks();
			for(let t  in tasks){
				V_socketUtils.pressHighlightTask(tasks[t] , display);
			}

		},
		handleTap: function(event){
			if(!this.constraintTap){
				if(this.task != null){
					V_socketUtils.highlightObject4D(this.task.getObject4D(), !this.selected);
				}
			}else{
				this.constraintTap = false;
			}
		},
		handleReadyTap: function(event){
			this.constraintTap = true;
			this.task.setDone(false);
			this.task.setPaused(false);
			if(this.ready){
				V_socketUtils.setTaskState(this.model, this.task);
			}else{
				if(!this.task.getRequirement("constraint").getValue()){
					this.task.getRequirement("constraint").setValue(true);
					V_socketUtils.setRequirement(this.model, this.task.getRequirement("constraint"), this.task);
				}
				if(!this.task.getRequirement("information").getValue()){
					this.task.getRequirement("information").setValue(true);
					V_socketUtils.setRequirement(this.model, this.task.getRequirement("information"), this.task);
				}
				if(!this.task.getRequirement("materials").getValue()){
					this.task.getRequirement("materials").setValue(true);
					V_socketUtils.setRequirement(this.model, this.task.getRequirement("materials"), this.task);
				}
				if(!this.task.getRequirement("manpower").getValue()){
					this.task.getRequirement("manpower").setValue(true);
					V_socketUtils.setRequirement(this.model, this.task.getRequirement("manpower"), this.task);
				}
				if(!this.task.getRequirement("equipement").getValue()){
					this.task.getRequirement("equipement").setValue(true);
					V_socketUtils.setRequirement(this.model, this.task.getRequirement("equipement"), this.task);
				}
				if(!this.task.getRequirement("safety").getValue()){
					this.task.getRequirement("safety").setValue(true);
					V_socketUtils.setRequirement(this.model, this.task.getRequirement("safety"), this.task);
				}
				if(!this.task.getRequirement("space").getValue()){
					this.task.getRequirement("space").setValue(true);
					V_socketUtils.setRequirement(this.model, this.task.getRequirement("space"), this.task);
				}
				this.updateRequirements();
			}
		},
		handleDoneTap: function(event){
			this.constraintTap = true;
			if(this.ready){
				this.task.setDone(true);
				this.task.setPaused(false);
				V_socketUtils.setTaskState(this.model, this.task);
			}
		},
		handlePausedTap: function(event){
			this.constraintTap = true;
			if(this.ready){
				this.task.setPaused(true);
				this.task.setDone(false);
				V_socketUtils.setTaskState(this.model, this.task);
			}
		},
		handleConstraintChange : function(event){
			this.constraintTap = true;
			switch(event.target.id){
				case "constraintTap": 	this.task.getRequirement("constraint").setValue(!this.task.getRequirement("constraint").getValue());
										V_socketUtils.setRequirement(this.model, this.task.getRequirement("constraint"), this.task);
										break;
				case "informationTap": 	this.task.getRequirement("information").setValue(!this.task.getRequirement("information").getValue()); 
										V_socketUtils.setRequirement(this.model, this.task.getRequirement("information"), this.task);
										break;
				case "materialsTap": 	this.task.getRequirement("materials").setValue(!this.task.getRequirement("materials").getValue()); 
										V_socketUtils.setRequirement(this.model, this.task.getRequirement("materials"), this.task);
										break;
				case "manpowerTap": 	this.task.getRequirement("manpower").setValue(!this.task.getRequirement("manpower").getValue()); 
										V_socketUtils.setRequirement(this.model, this.task.getRequirement("manpower"), this.task);
										break;
				case "equipementTap": 	this.task.getRequirement("equipement").setValue(!this.task.getRequirement("equipement").getValue()); 
										V_socketUtils.setRequirement(this.model, this.task.getRequirement("equipement"), this.task);
										break;
				case "safetyTap": 		this.task.getRequirement("safety").setValue(!this.task.getRequirement("safety").getValue()); 
										V_socketUtils.setRequirement(this.model, this.task.getRequirement("safety"), this.task);
										break;
				case "spaceTap": 		this.task.getRequirement("space").setValue(!this.task.getRequirement("space").getValue()); 
										V_socketUtils.setRequirement(this.model, this.task.getRequirement("space"), this.task);
										break;
			}
		},
		updateTaskState(){
			if(this.ready){
				this.paused = this.task.isPaused();
				this.done = this.task.isDone();
			}
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
				this.done = this.task.isDone();
				this.paused = this.task.isPaused();
			}

			if(this.ready != previousReady){
				V_taskTableUtils.updatePrevious(this.task);
			}

			if(!this.ready){
				this.done = false;
				this.task.setDone(false);
				this.paused = false;
				this.task.setPaused(false);
			}

		},
		updatePrevious(){

			if(this.previousTask != null){
				this.previouscolor =  scssVariables[this.previousTask.getTaskTeam().getColorClass().replace("BG_", "").toLowerCase()];
			}

			if(this.previousTask != null){
				this.previousready = this.previousTask.isReady();
			}

		},
		setSelectedValue(bool){
			this.selected = bool;
		},

		watchResize(){
			const elem = document.getElementById(this._uid + "-" + "task");
			if(elem != null){
				this.taskHeight = ((elem.clientWidth) - 30);
			}
		},

		handleIdTap(){
			if(this.isOpen){
				this.idFace = !this.idFace;
				this.lpsFace = false;
				this.descriptionFace = false;
			}
		},

		handleLpsTap(event){
			if(this.isOpen){
				if(event.target.classList.contains("lpsSelected")){
					this.handleLpsButtonTap();
					return;
				}
				this.lpsFace = !this.lpsFace;
				this.idFace = false;
				this.descriptionFace = false;
			}
		},

		handleDescriptionTap(){
			if(this.isOpen){
				this.descriptionFace = !this.descriptionFace;
				this.idFace = false;
				this.lpsFace = false;
			}
		},

		handleLpsPlus(){
			this.lpsIndex = (this.lpsIndex + 1) % 7
		},

		handleLpsMinus(){
			if(this.lpsIndex == 0){
				this.lpsIndex = 6;
			}else{
				this.lpsIndex--;
			}
		},

		handleGoTap(){
			this.go = !this.go;
		},
		handleDoneTap(){
			this.task.setDone(!this.done);
			this.task.setPaused(false);
			this.done = !this.done;
		},
		handlePauseTap(){
			this.task.setPaused(!this.paused);
			this.task.setDone(false);
			this.paused = !this.paused;
		},

		handleLpsButtonTap(){
			this.constraintTap = true;
			switch(this.lpsIndex){
				case 0: 	this.task.getRequirement("constraint").setValue(!this.task.getRequirement("constraint").getValue()); 
							V_socketUtils.setRequirement(this.model, this.task.getRequirement("constraint"), this.task);
							break;
				case 1: 	this.task.getRequirement("information").setValue(!this.task.getRequirement("information").getValue());
							V_socketUtils.setRequirement(this.model, this.task.getRequirement("information"), this.task);
							break;
				case 2: 	this.task.getRequirement("materials").setValue(!this.task.getRequirement("materials").getValue()); 
							V_socketUtils.setRequirement(this.model, this.task.getRequirement("materials"), this.task);
							break;
				case 3: 	this.task.getRequirement("manpower").setValue(!this.task.getRequirement("manpower").getValue()); 
							V_socketUtils.setRequirement(this.model, this.task.getRequirement("manpower"), this.task);
							break;
				case 4: 	this.task.getRequirement("equipement").setValue(!this.task.getRequirement("equipement").getValue()); 
							V_socketUtils.setRequirement(this.model, this.task.getRequirement("equipement"), this.task);
							break;
				case 5: 	this.task.getRequirement("safety").setValue(!this.task.getRequirement("safety").getValue()); 
							V_socketUtils.setRequirement(this.model, this.task.getRequirement("safety"), this.task);
							break;
				case 6: 	this.task.getRequirement("space").setValue(!this.task.getRequirement("space").getValue()); 
							V_socketUtils.setRequirement(this.model, this.task.getRequirement("space"), this.task);
							break;
			}
		},
	},

	template : `
	<div class="taskWrapper" v-bind:class='wrapclass'>
		<div class="task">
			
			<div v-if="notEmpty" v-bind:id="_uid + '-task'" >

				<div class="taskHeader">
					<div >
						
						<!-- description face -->
						<div v-if="descriptionFace" v-bind:style="{backgroundColor : headercolors.body, borderColor : headercolors.border}" >
							<p v-tap="handleIdTap" v-bind:style="{ color : idcolor }" v-html="'#' + task.getId()"></p>
						</div>
						<!-- lps face -->
						<div v-else-if="lpsFace" v-bind:style="{backgroundColor : headercolors.body, borderColor : headercolors.border}" >
							<p v-tap="handleIdTap" v-bind:style="{ color : idcolor }" v-html="'#' + task.getId()"></p>
							<p v-tap="handleLpsTap" v-html="tasksSVG2">` + `</p>
						</div>
						<!-- id face -->
						<div v-else-if="idFace" v-bind:style="{backgroundColor : headercolors.body, borderColor : headercolors.border}" >
							<p v-tap="handleIdTap" v-bind:style="{ color : idcolor }" v-html="'#' + task.getId()"></p>
							<p v-tap="handleLpsTap" v-html="tasksSVG"></p>
						</div>
						<!-- home face -->
						<div v-else v-bind:style="{backgroundColor : headercolors.body, borderColor : headercolors.border}" >
							<p v-tap="handleIdTap"v-bind:style="{ color : idcolor }" v-html="'#' + task.getId()"></p>
							<p v-tap="handleLpsTap" v-html="tasksSVG"></p>
						</div>



					</div>
				</div>

				<div v-if="isOpen" class="taskContent" v-bind:style="{ height : taskHeight  + 'px'}">
					
					<!-- description face -->
					<div v-tap="handleDescriptionTap" v-if="descriptionFace" class="descriptionFaceFrame">
						<div><p>Description</p></div>
					</div>

					<!-- lps face -->
					<div v-else-if="lpsFace" class="lpsFaceFrame">
						<div>` + arrowL + `<p v-html="lpsList[lpsIndex]"></p>` + arrowR + `</div>
					</div>

					<!-- id face -->
					<div v-else-if="idFace" class="idFaceFrame">
						<div class="icon"><p v-tap="handleGoTap">` + goIcon + `Launch</p></div>
						<div class="icon"><p v-tap="handleDoneTap">` + doneIcon + `Done</p></div>
						<div class="icon"><p v-tap="handlePauseTap">` + pauseIcon + `Pause</p></div>
					</div>

					<!-- home face -->
					<div v-else>
						<div v-if="taskname != ''">
							<div v-tap="handleDescriptionTap" class="main" v-bind:style="{ height : (taskHeight * 0.7)  + 'px'}">
								<p class="taskDescription" v-html="taskname"></p>
							</div>
							<div class="footer" v-bind:style="{ height : (taskHeight * 0.3)  + 'px'}">
								<p v-press="handlePress" >` + previousTask + `</p>
								<p>` + calendarIcon + `<span v-html="dr"></span></p>
								<p>` + manIcon + `<span v-html="mn"></span></p>
							</div>
						</div>
					</div>


				</div>


			</div>
		</div>
	</div>`,
}

/*v-bind:class='phaseColor'*/