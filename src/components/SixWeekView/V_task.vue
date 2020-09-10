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

import V_ModelUtils from "../Utils/V_ModelUtils.class.js";
import Utils from "../../class/Utils.class.js";

export default {
	data : function(){

		const model = V_ModelUtils.getModel();
		const timeline = V_ModelUtils.getTimeline();
		const duration = model.getDuration();
		let task = model.getTask(this.taskid);
		if(typeof task == "undefined") task = null;

		let previousTask = null;
		if(task != null){
			const previous = task.getPreviousTasks()[Object.keys(task.getPreviousTasks())[0]];
			if(typeof previous != "undefined"){
				previousTask = previous;
			}else{
				previousTask = null;
			}
		}else{
			previousTask =  null;
		}

		let constraint = false;
		if(task != null){
			constraint = task.getRequirement("constraint").getValue();
		}

		let information = false;
		if(task != null){
			information = task.getRequirement("information").getValue();
		}

		let materials = false;
		if(task != null){
			materials = task.getRequirement("materials").getValue();
		}		

		let manpower = false;
		if(task != null){
			manpower = task.getRequirement("manpower").getValue();
		}		

		let equipement = false;
		if(task != null){
			equipement = task.getRequirement("equipement").getValue();
		}		

		let safety = false;
		if(task != null){
			safety = task.getRequirement("safety").getValue();
		}		

		let space = false;
		if(task != null){
			space = task.getRequirement("space").getValue();
		}		

		let previousColor = null;
		if(previousTask != null){
			previousColor =  scssVariables[previousTask.getTaskTeam().getColorClass().replace("BG_", "").toLowerCase()];
		}

		let ready = false
		if(task != null){
			ready = task.isReady();
		}

		let paused = false;
		if(task != null){
			paused = task.isPaused();
		}

		let done = false;
		if(task != null){
			done = task.isDone();
		}

		let previousready = false;
		if(previousTask != null){
			previousready = previousTask.isReady();
		}

		//For avoid tap propagation, need to delete it
		let constraintTap = false

		let startWeekDate = null;
		let endWeekDate = null;
		let twoLineDates = null;
		if(task != null){
			startWeekDate = this.addDays(task.getStartDate(), -(task.getStartDate().getDay() - 1));
			endWeekDate = this.addDays(task.getEndDate(), -(task.getEndDate().getDay() - 1));
			twoLineDates = true || startWeekDate.getTime() !== endWeekDate.getTime();
		}

		let persons = {};
		let mn = 0;
		let dr = 0;
		if(task != null){
			const pers = task.getTaskTeam().getPersons();
			for(let p in pers){
				persons[pers[p].getId()] = false;
			}
			mn = task.getWorkers();
			dr =  task.getDuration();
		}



		return {
			"selected" : false,
			"state" :false,
			"stateDiv" : null,
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
			previousarrow : previousColor,
			previousfill : previousColor,
			previousborder : previousColor,
			done : done,
			go : false,
			paused : paused,
			constraintTap : constraintTap,
			isFirst : false,
			index : null,
			taskHeight : 0,
			idFace : false,
			lpsFace : false,
			calFace : false,
			manFace : false,
			descriptionFace : false,
			lpsHighlightTimeout : null,
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
			startweek : startWeekDate,
			endweek : endWeekDate,
			openFlag : false,
			persons : persons,
			mn : mn,
			actualassign : 0,
			task : task,
			model : model,
			timeline : timeline,
			duration : duration,
			dr : dr,
			modifymode : false,
			twoLineDates : twoLineDates,
			updateCalendars : 0,
			pressed : false,
			originalStartDate : null,
			originalEndDate : null,
			eventToRemove : [],
		}
	},
	props : [
		"team",
		"nth",
		'time',
		"taskid",
		"color",
		"isOpen",
		"isopen",
		"headerheight",
		"properties",
		"teamuser",
		"tasktablestart"
	],
	mounted: function(){
		this.updateStateDiv();
		this.watchResize();
		const handler = (e)=>{
			const offset = document.getElementById(this._uid + '-refmovetask');

			if(this.pressed){
				const elems = document.getElementsByClassName(this.task.getId() + "-formoving");

				const possibilitiesLeft = [];
				for(let i = this.tasktablestart ; i < this.tasktablestart + 6 ; i++){
					possibilitiesLeft[i] = document.querySelector(".positiontask-" + i).getBoundingClientRect().left;
				}
				let distance = null;
				for(let p in possibilitiesLeft){
					const dist = Math.abs(possibilitiesLeft[p] - e.clientX);
					if(distance == null || distance.distance > dist){
						distance = {
							distance : dist,
							id : p,
							newTime : this.tasktablestart + p,
						};
					}
				}

				if(this.task != null){
					const possibilitiesTop = [];
					for(let j = this.tasktablestart ; j < this.tasktablestart + 6 ; j++){
						const elemss = document.querySelectorAll(".positiontask-" + j + ".equipetask-" + this.task.getTaskTeam().getId());
						for(let i = 0 ; i < elemss.length ; i++){
							if(possibilitiesTop.indexOf(elemss[i].getBoundingClientRect().top) == -1) possibilitiesTop.push(elemss[i].getBoundingClientRect().top);
						}
					}

					let distance2 = null;
					for(let p in possibilitiesTop){
						const dist = Math.abs(possibilitiesTop[p] - e.clientY);
						if(distance2 == null || distance2.distance > dist){
							distance2 = {
								distance : dist,
								id : p,
							};
						}
					}

					for(let e in elems){
						if(typeof elems[e].style != "undefined"){
							elems[e].style.top = (possibilitiesTop[distance2.id] - offset.getBoundingClientRect().top) + "px";
							elems[e].style.left = (possibilitiesLeft[distance.id] - offset.getBoundingClientRect().left) + "px";
							elems[e].style.width = "100%";
							elems[e].style.position = "absolute";
							elems[e].style.zIndex = 3000;
							elems[e].style.backgroundColor = "blue";
							elems[e].style.borderRadius = "5px";
							elems[e].style.filter = 'drop-shadow(2px 4px 4px rgba(0, 0, 0, 0.5))';

						}
					}

					this.task.setStartDate(Utils.addDaysToDate(this.originalStartDate, (distance.newTime - this.time) * 7));
					this.task.setEndDate(Utils.addDaysToDate(this.originalEndDate, (distance.newTime - this.time) * 7));
				}

				
				
			}

		}

		document.getElementById("planningFrame").addEventListener("touchmove", handler);
		document.getElementById("planningFrame").addEventListener("mousemove", handler);
		window.addEventListener('resize', this.watchResize);
		this.eventToRemove = [handler, this.watchResize];

	},
	created: function(){

		V_taskTableUtils.addTask(this);
		if(this.task != null){
			V_ModelUtils.addModelListener((model)=>{
				this.model = model;
				this.timeline = V_ModelUtils.getTimeline();
				this.duration = this.model.getDuration();
				this.task = model.getTask(this.taskid);
				if(typeof this.task == "undefined") this.task = null;
				if(this.task != null){
					this.dr = this.task.getDuration();
					this.startweek =  this.addDays(this.task.getStartDate(), -(this.task.getStartDate().getDay() - 1));
					this.endweek = this.addDays(this.task.getEndDate(), -(this.task.getEndDate().getDay() - 1));
					this.twoLineDates = true || this.startweek.getTime() !== this.endweek.getTime();
					this.updateCalendars++;
				}
			});
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
			if(this.selected) result += "selected ";
			return result;
		},
		notEmpty : function(){
			return this.task != null;
		},
		tid : function(){
			return this.task.getId();
		},
		svgcolor : function(){
			return scssVariables[this.color.replace("BG_", "").toLowerCase()];
		},
		idcolor : function(){
			if(this.go){
				return scssVariables["greenbluish_light"];
			}else if(this.paused){
				return "red";
			}if(!this.ready){
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
		_properties : function(){
			let toReturn = '';
			for(let p in this.properties){
				toReturn += this.properties[p].replace("'New'", "Nouveau").replace("'Existing'", "Existant").replace("'Existing'", "Existant").replace("'To Be Demolished'", "Demolition");
			}
			return toReturn;
		}

	},
	watch:{
		ready : function(){
			if(!this.ready){
				this.done = false;
				this.go = false;
				this.paused = false;
			}
		},
		isOpen : function(){
			this.idFace = false;
			this.manFace = false;
			this.lpsFace = false;
			this.descriptionFace = false;
			if(!this.isOpen) this.state = false;
		}
	},
	methods:{
		addDays : function(date, days){
			var dat = new Date(date.valueOf());
		    dat.setDate(dat.getDate() + days);
		    return dat;
		},
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

			let go = false;
			if(this.task != null){
				go = this.task.isGo();
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
			this.ready = ready;
			this.paused = paused;
			this.done = done;
			this.go = go;
			this.updatePrevious();
		},
		hightlight: function(bool){
			this.highlighted = bool;
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
			const display = event.type == "press";
			// if(!this.constraintTap){
			if(this.task != null){
				V_socketUtils.highlightObject4D(this.task.getObject4D(), display);
			}

			// }else{
			// 	this.constraintTap = false;
			// }
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
				this.go = this.task.isGo();

				if(this.paused){
					document.getElementById("pauseIcon").style.color = "red";
				}else{
					document.getElementById("pauseIcon").style.color = "black";
				}

				if(this.go){
					document.getElementById("goIcon").style.color = scssVariables["greenbluish_light"];
				}else{
					document.getElementById("goIcon").style.color = "black";
				}
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

			//if(this.ready != previousReady){
				V_taskTableUtils.updatePrevious(this.task);
			//}

			if(!this.ready){
				this.done = false;
				this.task.setDone(false);
				this.paused = false;
				this.task.setPaused(false);
				this.go = false;
				this.task.setGo(false);
			}

		},
		updatePrevious(){

			if(this.previousTask != null){
				this.previouscolor =  scssVariables[this.previousTask.getTaskTeam().getColorClass().replace("BG_", "").toLowerCase()];
				if(this.previousTask.isPaused()){
					this.previousfill = "white";
					this.previousborder = this.previouscolor;
					this.previousarrow = "red";
				}else if(this.previousTask.isDone()){
					this.previousfill = this.previouscolor;
					this.previousborder = this.previouscolor;
					this.previousarrow = "black";
				}else if(this.previousTask.isGo()){
					this.previousfill = "white";
					this.previousborder = this.previouscolor;
					this.previousarrow = scssVariables["greenbluish_light"];
				}else if(this.previousTask.isReady()){
					this.previousfill = this.previouscolor;
					this.previousborder = "white";
					this.previousarrow = "white";
				}else{
					this.previousfill = "white";
					this.previousborder = this.previouscolor;
					this.previousarrow = this.previouscolor;
				} 
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
				this.taskHeight = elem.clientWidth;
			}
		},

		handleIdTap(){

			if(!this.openFlag && this.isOpen && this.taskname != ""){
				const temp = this.calFace;
				this.idFace = !this.idFace;
				this.lpsFace = false;
				this.manFace = false;
				this.descriptionFace = false;
				this.calFace = false;

				if(this.calFace != temp){
					const temp = V_ModelUtils.getModel();
					V_ModelUtils.setTemporaryMode(false);
					V_ModelUtils.setModel(temp);
				}
			}

			this.openFlag = false;
		},

		handleLpsTap(event){
			if(!this.openFlag && this.isOpen && this.taskname != ""){
				if(event.target.classList.contains("lpsSelected")){
					this.handleLpsButtonTap();
					return;
				}
				this.lpsFace = !this.lpsFace;
				this.idFace = false;
				this.manFace = false;
				this.descriptionFace = false;
				this.calFace = false;
			}

			this.openFlag = false;
		},

		handleDescriptionTap(){
			if(this.isOpen && this.taskname != ""){
				this.descriptionFace = !this.descriptionFace;
				this.idFace = false;
				this.lpsFace = false;
				this.manFace = false;
				this.calFace = false;
			}
		},

		handleCalendarTap(){
			if(this.isOpen && this.taskname != ""){
				this.descriptionFace = false;
				this.idFace = false;
				this.lpsFace = false;
				this.manFace = false;
				this.calFace = !this.calFace;
				if(!this.calFace){
					const temp = V_ModelUtils.getModel();
					V_ModelUtils.setTemporaryMode(false);
					V_ModelUtils.setModel(temp);
				}
			}
		},

		handleManTap(){
			if(this.isOpen && this.taskname != ""){
				this.descriptionFace = false;
				this.idFace = false;
				this.lpsFace = false;
				this.manFace = !this.manFace;
				this.calFace = false;
			}
		},

		handleCheckPerson(person){
			const persons = this.task.getPersons();
			if(typeof persons[person.getId()] == "undefined"){
				this.task.addPerson(person);
				this.$set(this.persons, person.getId(), true);
				this.actualassign++;
			}else{
				this.task.removePerson(person);
				this.$set(this.persons, person.getId(), false);
				this.actualassign--;
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
			if(!this.ready) return this.highlightRequirements();
			this.task.setDone(false);
			this.task.setPaused(false);
			this.task.setGo(!this.go);
			this.go = !this.go;
			V_socketUtils.setTaskState(this.model, this.task);
		},
		handleDoneTap(){
			if(!this.ready) return this.highlightRequirements();
			this.task.setDone(!this.done);
			this.task.setPaused(false);
			this.task.setGo(false);
			this.done = !this.done;
			V_socketUtils.setTaskState(this.model, this.task);
		},
		handlePauseTap(){
			if(!this.ready) return this.highlightRequirements();
			this.task.setPaused(!this.paused);
			this.task.setDone(false);
			this.task.setGo(false);
			this.paused = !this.paused;
			V_socketUtils.setTaskState(this.model, this.task);
		},

		highlightRequirements(){
			document.getElementById("lpsRequirements-" + this._uid).style.border = "2px solid red";
			if(this.lpsHighlightTimeout != null) clearTimeout(this.lpsHighlightTimeout);
			this.lpsHighlightTimeout = setTimeout( ()=>{
				document.getElementById("lpsRequirements-" + this._uid).style.border = "0px solid red";
			}, 500);

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
		getMonthAbr(num){
			switch(num){
				case 0 : return "Janv";
				case 1 : return "Fevr";
				case 2 : return "Mars";
				case 3 : return "Avril";
				case 4 : return "Mai";
				case 5 : return "Juin";
				case 6 : return "Juil";
				case 7 : return "Aout";
				case 8 : return "Sept";
				case 9 : return "Oct";
				case 10 : return "Nov";
				case 11 : return "Dec";
			}
		},
		getCalendarClass(i, startBool){
			let comp = null; 
			let comp2 = null;
			let comp3 = null;
			if(this.timeline.isHoliday((this.time * 7) + (i-1))) return ["holiday", "#808080"];
			if(startBool){
				comp = this.addDays(this.startweek, (i-1));
				comp2 = this.task.getStartDate();
				comp3 = this.task.getEndDate();
				if(comp.getTime() < comp2.getTime()){
					return ["previous", "white"];
				}else if(comp.getTime() == comp2.getTime()){
					return ["startTask", this.svgcolor];
				}else if(comp.getTime() < comp3.getTime()){
					return ["inTask", this.svgcolor];
				}else if(comp.getTime() == comp3.getTime()){
					return ["inTask", this.svgcolor];
				}else{
					return ['next', 'white'];
				}
			}else{
				comp = this.addDays(this.endweek, (i-1));
				comp2 = this.task.getStartDate();
				comp3 = this.task.getEndDate();
				if(comp.getTime() < comp2.getTime()){
					return ["previous", "white"];
				}else if(comp.getTime() == comp2.getTime() && comp2.getTime() != comp3.getTime()){
					return ["inTask", this.svgcolor];
				}else if(comp.getTime() < comp3.getTime()){
					return ["inTask", this.svgcolor];
				}else if(comp.getTime() == comp3.getTime()){
					return ["endTask", this.svgcolor];
				}else{
					return ["next", "white"];;
				}
			}


		},
		handleOpen(event){
			if(!this.isOpen){
				this.$parent.isOpen = true;
			}
		},

		handleManChange(bool){
			if(bool){
				this.mn++;
			}else{
				this.mn--;
			}
			this.task.setWorkers(this.mn);
		},

		handleCalendarChange(bool){

			if(!this.modifymode){
				this.modifymode = true;
				V_ModelUtils.setTemporaryMode(true);
			}
			if(bool){
				this.task.setEndDate(this.timeline.addWorkingDaysToDate(this.task.getEndDate(), 1));
			}else{
				this.task.setEndDate(this.timeline.addWorkingDaysToDate(this.task.getEndDate(), -1));
			}

			V_ModelUtils.dispatchUpdate();

		},
		handleCalendarStartTap(i){
			if(!this.modifymode){
				this.modifymode = true;
				V_ModelUtils.setTemporaryMode(true);
			}
			
			this.task.setStartDate(Utils.addDaysToDate(this.startweek, i-1 ));

			V_ModelUtils.dispatchUpdate();
		},
		handleCalendarEndTap(i){
			if(!this.modifymode){
				this.modifymode = true;
				V_ModelUtils.setTemporaryMode(true);
			}
			
			this.task.setEndDate(Utils.addDaysToDate(this.endweek, i-1 ));

			V_ModelUtils.dispatchUpdate();
		},

		handleDoublePress(event){

			this.pressed = event.type == "press";

			if(this.pressed){
				if(!this.modifymode){
					this.originalStartDate = this.task.getStartDate();
					this.originalEndDate = this.task.getEndDate();
					this.modifymode = true;
					V_ModelUtils.setTemporaryMode(true);
				}
			}else{

				const elems = document.getElementsByClassName(this.task.getId() + "-formoving");
				for(let e in elems){
					if(typeof elems[e].style != "undefined"){
						elems[e].style.top = this.mouseTop;
						elems[e].style.left = this.mouseLeft;
						elems[e].style.width = "100%";
						elems[e].style.position = "initial";
						elems[e].style.zIndex = 0;
						elems[e].style.backgroundColor = "rgba(0,0,0,0)";
						elems[e].style.borderRadius = "0px";
						elems[e].style.filter = '';
					}
				}

				this.modifymode = false;
				const temp = V_ModelUtils.getModel();
				V_ModelUtils.setTemporaryMode(false);
				V_ModelUtils.setModel(temp);

				V_ModelUtils.dispatchUpdate();
			}

		},

	},

	template : `
	<div v-tap="handleOpen" class="taskWrapper" v-bind:class='wrapclass'>
		<div v-doublepress="handleDoublePress" v-bind:class="[ task != null ? 'task positiontask-' + time + ' equipetask-' + task.getTaskTeam().getId() : 'task positiontask-' + time]" v-bind:id="_uid + '-refmovetask'">
			
			<div v-bind:id="_uid + '-movetask'" v-bind:class="taskid + '-formoving'">

				<div v-if="notEmpty" v-bind:id="_uid + '-task'" v-bind:style="[!isOpen ? { pointerEvents : 'none'} : {}] ">

					<div v-press="handleTap" class="taskHeader" v-bind:style="{ height : headerheight }">
						<div>
							<!-- man face -->
							<div v-if="manFace" v-bind:style="{backgroundColor : headercolors.body, borderColor : headercolors.border}" >
								<p v-tap="handleIdTap" v-bind:style="{ color : idcolor }" v-html="'#' + task.getId()"></p>
							</div>

							<!-- calendar face -->
							<div v-else-if="calFace" v-bind:style="{backgroundColor : headercolors.body, borderColor : headercolors.border}" >
								<p v-tap="handleIdTap" v-bind:style="{ color : idcolor }" v-html="'#' + task.getId()"></p>
							</div>

							<!-- description face -->
							<div v-else-if="descriptionFace" v-bind:style="{backgroundColor : headercolors.body, borderColor : headercolors.border}" >
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
								<p v-bind:id="'lpsRequirements-' + _uid" v-tap="handleLpsTap" v-html="tasksSVG"></p>
							</div>
							<!-- home face -->
							<div v-else v-bind:style="{backgroundColor : headercolors.body, borderColor : headercolors.border}" >
								<p v-tap="handleIdTap"v-bind:style="{ color : idcolor }" v-html="'#' + task.getId()"></p>
								<p v-tap="handleLpsTap" v-html="tasksSVG"></p>
							</div>



						</div>
					</div>

					<div v-if="isOpen" class="taskContent" v-bind:style="{ height : (taskHeight - parseFloat(headerheight.replace('px', '')))  + 'px'}">
						
						<!-- man face -->
						<div v-if="manFace" class="manFaceFrame">
							<div v-press="handleTap" v-bind:style="{ height : '80%'}" class="body">
								<div v-for=" person in task.getTaskTeam().getPersons()">
									<p v-tap="()=>{handleCheckPerson(person)}">
										<span class="checkbox" v-bind:style="[persons[person.getId()] ? { backgroundColor : svgcolor} : '']"></span>
										<span v-if="teamuser != null && teamuser.toLowerCase() == team.getName().toLowerCase()" v-html="person.getName()"></span>
										<span v-else v-html="'worker id : ' + person.getId()"></span>
									</p>
								</div>
							</div>
							<div v-press="handleTap" v-bind:style="{ height : '20%'}" class="manFaceFooter">
								<p></p>
								<div>
									<p v-tap="()=>{handleManChange(false)}" v-bind:style="{ backgroundColor : svgcolor}" >-</p>
									<p v-tap="()=>{handleManChange(true)}" v-bind:style="{ backgroundColor : svgcolor}" >+</p>
								</div>
								<p v-tap="handleManTap" >` + manIcon + `<span v-bind:style="[ actualassign != mn ? { color : 'red'} :{}]" v-html="actualassign + '/' + mn"></span></p>
							</div>
						</div>

						<!-- calendar face -->
						<div v-press="handleTap" v-else-if="calFace" class="calendarFaceFrame">
							<div class="calendarFaceContent">
								<p>Début : <span v-html="task.getStartDate().getDate() + ' ' + getMonthAbr(task.getStartDate().getMonth()) + ' ' + task.getStartDate().getFullYear()" ></span></p>
								<div class="calendarWeek" :key="updateCalendars">
									<p v-for="i in 7" v-tap="()=>{ handleCalendarStartTap(i)}" v-bind:class="getCalendarClass(i, true)[0]" v-bind:style="{ backgroundColor : getCalendarClass(i, true)[1]}" ><span v-html="addDays(startweek, (i-1)).getDate()"></span></p>
								</div>
								<div v-if="twoLineDates" class="calendarWeek" :key="updateCalendars + '2'">
									<p v-for="i in 7" v-tap="()=>{ handleCalendarEndTap(i)}" v-bind:class="getCalendarClass(i, false)[0]" v-bind:style="{ backgroundColor : getCalendarClass(i, false)[1]}"><span v-html="addDays(endweek, (i-1)).getDate()"></span></p>
								</div>
								<p>Fin : <span v-html="task.getEndDate().getDate() + ' ' + getMonthAbr(task.getEndDate().getMonth()) + ' ' + task.getEndDate().getFullYear()" ></span></p>
							</div>
							<!--footer-->
							<div class="calendarFaceFooter">
								<p v-tap="()=>{handleCalendarChange(false)}" v-bind:style="{ backgroundColor : svgcolor}" >-</p>
								<p  v-tap="handleCalendarTap"><span>` + calendarIcon + `</span><span v-html="dr"></span></p>
								<p v-tap="()=>{handleCalendarChange(true)}" v-bind:style="{ backgroundColor : svgcolor}" >+</p>
							</div>
						</div>

						<!-- description face -->
						<div v-tap="handleDescriptionTap" v-else-if="descriptionFace" class="descriptionFaceFrame">
							<div class="descriptionTask">
								<div class="descriptionTitle"><p v-html="task.getName()"></p></div>
								<div class="descriptionDescription"><p v-html="task.getDescription()"></p></div>
							</div>
							<div class="descriptionInfos"><p><span v-show="task.getZone().getValue() != ''" v-bind:style="{ color : svgcolor}">Zone </span><span v-html="task.getZone().getValue()"></span></p><p><span v-bind:style="{ color : svgcolor}">Type </span><span v-html="_properties"></span></p></div>
						</div>

						<!-- lps face -->
						<div v-press="handleTap" v-else-if="lpsFace" class="lpsFaceFrame">
							<div>` + arrowL + `<p v-html="lpsList[lpsIndex]"></p>` + arrowR + `</div>
						</div>

						<!-- id face -->
						<div v-press="handleTap" v-else-if="idFace" class="idFaceFrame">
							<div id="goIcon" class="icon"><p v-tap="handleGoTap">` + goIcon + `Launch</p></div>
							<div id="doneIcon" class="icon"><p v-tap="handleDoneTap">` + doneIcon + `Done</p></div>
							<div id="pauseIcon" class="icon"><p v-tap="handlePauseTap">` + pauseIcon + `Pause</p></div>
						</div>

						<!-- home face -->
						<div v-else>
							<div v-if="taskname != ''">
								<div v-press="handleTap" v-tap="handleDescriptionTap" class="main" v-bind:style="{ height : ((taskHeight - parseFloat(headerheight.replace('px', ''))) * 0.7)  + 'px'}">
									<p class="taskDescription" v-html="taskname"></p>
								</div>
								<div class="footer" v-bind:style="{ height : ((taskHeight - parseFloat(headerheight.replace('px', ''))) * 0.3)  + 'px'}">
									<p v-press="handlePress" >

									<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
										<g v-if="previousTask != null">
											<rect width="28" height="20" rx="2" x="2" v-bind:fill="previousfill" stroke-width="4" v-bind:stroke="previousborder" y="5"></rect>
											<path d="M15 10L9 15L15 20" v-bind:stroke="previousarrow" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
											<path d="M23 10L17 15L23 20" v-bind:stroke="previousarrow" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
										</g>
									</svg>
									</p>

									<p v-press="handleTap" v-tap="handleCalendarTap">` + calendarIcon + `<span v-html="dr"></span></p>
									<p v-press="handleTap" v-tap="handleManTap" >` + manIcon + `<span v-bind:style="[ actualassign != mn ? { color : 'red'} :{}]" v-html="mn"></span></p>
								</div>
							</div>
						</div>


					</div>


				</div>
			</div>
		</div>
	</div>`,
}

/*v-bind:class='phaseColor'*/