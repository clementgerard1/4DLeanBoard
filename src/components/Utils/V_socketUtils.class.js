import V_4DUtils from "./V_4DUtils.class.js";
import V_filterMenuUtils from "./V_filterMenuUtils.class.js";
import V_playerUtils from "./V_playerUtils.class.js";
import V_taskTableUtils from "./V_taskTableUtils.class.js";
import V_timelineUtils from "./V_timelineUtils.class.js";
import V_phasesUtils from "./V_phasesUtils.class.js";
import V_planningMenuUtils from "./V_planningMenuUtils.class.js";
import V_blockUtils from "./V_blockUtils.class.js";
import DataApi from "../../../dataServer/DataApi.class.js";

class V_socketUtils{

	static socket = null;
	static socketInitFlag = false;
	static appInitFlag = false;
	static initDatas = null;
	
	/**
		Set the socket object for connexion
		@param {Socket} socket
		@static
	*/
	static setSocket(socket){
		this.socket = socket;
		this.initSocket();
	}

	static initApp(){
		if(this.appInitFlag && this.socketInitFlag){
			V_timelineUtils.setTime(this.initDatas.playerTime);

			V_taskTableUtils.clearTokens();
			V_4DUtils.clearHighlighting();

			for(let d in this.initDatas.taskSelected){
				V_taskTableUtils.setTokenByTaskId(this.initDatas.taskSelected[d], true);
			}

			for(let d in this.initDatas.pushed){
				V_taskTableUtils.highlightTaskByIdAndUpdate(this.initDatas.pushed[d], true);
			}

			for(let d in this.initDatas.backgroundTasks){
				V_taskTableUtils.updateStateDisplayById(this.initDatas.backgroundTasks[d], true);
			}

			//Team tab opening
			for(let t in this.initDatas.teamOpen){
				const teamId = t.split("-")[0];
				const nth = t.split("-")[1];
				V_taskTableUtils.setTeamById(teamId, nth, this.initDatas.teamOpen[t]);
			}

			//Team info tab opening
			for(let t in this.initDatas.teamInfosDisplayed){
				const teamId = t.split("-")[0];
				const nth = t.split("-")[1];
				V_taskTableUtils.setTeamDisplay(teamId, nth, this.initDatas.teamInfosDisplayed[t]);
			}

			//filter menu		
			//IFC Menu
			V_4DUtils.setIfcMenuChange(this.initDatas.ifcmenu);
			//Play menu
			V_taskTableUtils.setPlanningDisplay(this.initDatas.playmenu[0], this.initDatas.playmenu[1], this.initDatas.playmenu[2], this.initDatas.playmenu[3]);
			V_playerUtils.displayMilestones(this.initDatas.playmenu[0]);
			V_phasesUtils.displayed(this.initDatas.playmenu[1]);
			V_planningMenuUtils.setPlanningMenuChange(this.initDatas.playmenu[0], this.initDatas.playmenu[1], this.initDatas.playmenu[2], this.initDatas.playmenu[3]);
			//V_filterMenuUtils.setPlanningMenuChange(this.initDatas.playmenu);
			//V_playerUtils.displayMilestones(this.initDatas.playmenu > 1);
			//Team Display
			V_filterMenuUtils.setDisplayMenuChange(this.initDatas.teamdisplay);
			V_4DUtils.setTeamDisplayMode(this.initDatas.teamdisplay == 2);
			V_phasesUtils.setTeamDisplayMode(this.initDatas.teamdisplay == 2);
			//Teams	
			for(let d in this.initDatas.teamDisplayed){
				V_filterMenuUtils.setTeamDisplayedById(d, this.initDatas.teamDisplayed[d]);
				V_4DUtils.setTeamDisplayedById(d, this.initDatas.teamDisplayed[d]);
				V_taskTableUtils.setTeamDisplayedById(d, this.initDatas.teamDisplayed[d]);
				V_phasesUtils.setTeamDisplayedById(d, this.initDatas.teamDisplayed[d]);
			}

		}
	}

	static setInitAppFlag(bool){
		this.appInitFlag = bool;
	}

	/**
		Init the socket the socket object for connexion / Private
		@static
	*/
	static initSocket(){
		this.socket.on("highlightObject4D", (datas) => {
			V_taskTableUtils.setTokenByObject4DId(datas.objId, datas.value);
			V_4DUtils.highlightObject4DById(datas.objId, datas.value);

		});

		this.socket.on("highlightTask", (datas) => {
			V_taskTableUtils.highlightTaskById(datas.id, datas.value);
		});

		this.socket.on("sendInit", (datas) => {
			this.socketInitFlag = true;
			this.initDatas = datas;
			this.initApp();
		});

		let timeBlockBool = false;
		let timeBlockTimeout = null;
		const timeBlock = 2000;
		this.socket.on("setTime", (datas) => {

			V_blockUtils.setDisplay(true);
			if(timeBlockBool){
				clearTimeout(timeBlockTimeout);
				timeBlockBool = true;
			}
			timeBlockTimeout = setTimeout(function(){ 
				V_blockUtils.setDisplay(false);
			}, timeBlock);

			V_timelineUtils.setTime(datas.time);
		});



		this.socket.on("setTeamDisplay" , (datas) => {
			V_taskTableUtils.setTeamDisplay(datas.teamId, datas.nth, datas.value);
		});

		this.socket.on("setCamera" , (datas) => {
			V_blockUtils.setDisplay(true);
			if(timeBlockBool){
				clearTimeout(timeBlockTimeout);
				timeBlockBool = true;
			}
			timeBlockTimeout = setTimeout(function(){ 
				V_blockUtils.setDisplay(false);
			}, timeBlock);
			V_4DUtils.setCamera(datas.infos);
		});

		this.socket.on("setRequirement", (datas) => {
			V_taskTableUtils.updateRequirementByIdAndUpdate(datas.taskId, datas.requirementName, datas.value);
		});

		this.socket.on("setTaskState", (datas) => {
			V_taskTableUtils.setTaskStateByIdAndUpdate(datas.taskId, datas.done, datas.paused, datas.go);
		});

		this.socket.on("updateStateDisplay", (datas) => {
			V_taskTableUtils.updateStateDisplayById(datas.taskId, datas.value);
		});

		this.socket.on("pressHighlightTask", (datas) => {
			V_taskTableUtils.highlightTaskByIdAndUpdate(datas.taskId, datas.value);
		});	

		this.socket.on("updateTeamDisplayed", (datas) => {
			V_4DUtils.setTeamDisplayedById(datas.team, datas.value);
			V_filterMenuUtils.setTeamDisplayedById(datas.team, datas.value);
			V_taskTableUtils.setTeamDisplayedById(datas.team, datas.value);
			V_phasesUtils.setTeamDisplayedById(datas.team, datas.value);
		});

		this.socket.on("updateDisplayMenu", (datas) => {
			V_filterMenuUtils.setDisplayMenuChange(datas.choice);
			V_4DUtils.setTeamDisplayMode(datas.choice == 2);
			V_phasesUtils.setTeamDisplayMode(datas.choice == 2);
		});

		this.socket.on("clearHighlighting", (datas) => {
			V_taskTableUtils.clearTokens();
			V_4DUtils.clearHighlighting();
		});
		this.socket.on("setCameraLocked", (datas) => {
			V_filterMenuUtils.setCameraLocked(datas.value);
			V_4DUtils.setCameraLocked(datas.value);
		});
		this.socket.on("updateIfcMenu", (datas) => {
			V_4DUtils.setIfcMenuChange(datas.ifcs);
		});
		this.socket.on("updatePlanningMenu", (datas) => {
			//V_filterMenuUtils.setPlanningMenuChange(datas.choices);
			V_playerUtils.displayMilestones(datas.choices[0]);
		});
		this.socket.on("setTeamOpening", (datas) => {
			V_taskTableUtils.setTeamById(datas.teamId, datas.nth, datas.value);
		});
		this.socket.on("setLayerDisplayed", (datas) => {
			V_filterMenuUtils.setLayerDisplayed(datas.layer, datas.value);
			V_4DUtils.setLayerDisplayed(datas.layer, datas.value);
		});
		this.socket.on("setZoneDisplayed", (datas) => {
			V_filterMenuUtils.setZoneDisplayed(datas.zone, datas.value);
			V_4DUtils.setZoneDisplayed(datas.zone, datas.value);
		});

		this.socket.on("setConstructionStateDisplayed", (datas) => {
			V_filterMenuUtils.setConstructionStateDisplayed(datas.state, datas.value);
			V_4DUtils.setConstructionStateDisplayed(datas.state, datas.value);
		});
		this.socket.on("setPlanningDisplay", (datas) => {
			V_planningMenuUtils.setPlanningMenuChange(datas.choices[0], datas.choices[1], datas.choices[2], datas.choices[3]);
			V_taskTableUtils.setPlanningDisplay(datas.choices[0], datas.choices[1], datas.choices[2], datas.choices[3]);
			V_playerUtils.displayMilestones(datas.choices[0]);
			V_phasesUtils.displayed(datas.choices[1]);
		});

		this.socket.on("triggerPhaseDisplay", (datas) => {
			V_4DUtils.triggerPhaseDisplayById(datas.phaseId, datas.value);
			V_phasesUtils.setPhasePressed(datas.phaseId, datas.value);
		});

		this.socket.on("triggerPhaseDescription", (datas) => {
			V_phasesUtils.triggerPhaseDescription(datas.phaseId);
		});

		this.socket.on("displayMilestone" , (datas) => {
			V_playerUtils.displayMilestoneInfo(datas.milestoneId, datas.value);
		});

	}

	/**
		Add this socket as a viewer
		@static
	*/	
	static addViewer(){
		this.socket.emit("addViewer");
	}

	/**
		Add this socket as a W6Planning
		@static
	*/	
	static addW6(){
		this.socket.emit("addW6");
	}

	/**
		Add this socket as a W6Planning
		@static
	*/	
	static addPlayer(){
		this.socket.emit("addPlayer");
	}

	/**
		Add this socket as a W6Planning
		@static
	*/	
	static addFilter(){
		this.socket.emit("addFilter");
	}

	/* ---------------------------- PLAYER INTERACTIONS ---------------------------- */

	/**
		Set global time
		@param {uint} time
		@static
	*/	
	static setTime(time){
		V_timelineUtils.setTime(time);
		this.socket.emit("setTime", { time : time});
	}

	/* ---------------------------- 3D INTERACTIONS ---------------------------- */

	/**
		Highlight a task on W6Planning from Viewer
		@param {Task} task 
		@static
	*/		
	static highlightTask(task, bool){
		V_taskTableUtils.highlightTaskById(task.getId(), bool);
   		this.socket.emit("highlightTask", { id : task.getId(), value : bool});
	}

	static setCamera(infos){
		this.socket.emit("setCamera", { infos : infos});
	}


/* ---------------------------- 3D filter INTERACTIONS ---------------------------- */
	/**
		Set the team displayed on viewer
		@param {TaskTeam} team
		@static
	*/	
	static setTeamDisplayed(team, bool){
		V_filterMenuUtils.setTeamDisplayed(team, bool);
		V_4DUtils.setTeamDisplayed(team, bool);
		V_taskTableUtils.setTeamDisplayed(team, bool);
		V_phasesUtils.setTeamDisplayed(team, bool);
		if(team != null){
			this.socket.emit("updateTeamDisplayed", { team : team.getId(), value : bool});
		}else{
			this.socket.emit("updateTeamDisplayed", { team : null, value : null});
		}
	}

	/**
		Set the team displayed on viewer
		@param {TaskTeam} team
		@static
	*/	
	static setLayerDisplayed(layer, bool){
		V_filterMenuUtils.setLayerDisplayed(layer, bool);
		V_4DUtils.setLayerDisplayed(layer, bool);
		if(layer != null){
			this.socket.emit("setLayerDisplayed", { layer : layer, value : bool});
		}
	}

	/**
		Set the team displayed on viewer
		@param {TaskTeam} team
		@static
	*/	
	static setZoneDisplayed(zone, bool){
		V_filterMenuUtils.setZoneDisplayed(zone, bool);
		V_4DUtils.setZoneDisplayed(zone, bool);
		if(zone != null){
			this.socket.emit("setZoneDisplayed", { zone : zone, value : bool});
		}
	}

	/**
		Set the team displayed on viewer
		@param {TaskTeam} team
		@static
	*/	
	static setConstructionStateDisplayed(constructionState, bool){
		V_filterMenuUtils.setConstructionStateDisplayed(constructionState, bool);
		V_4DUtils.setConstructionStateDisplayed(constructionState, bool);
		if(constructionState != null){
			this.socket.emit("setConstructionStateDisplayed", { state : constructionState, value : bool});
		}
	}

	/**
		Set the team mode of viewer
		@param {bool} active
		@static
	*/	
	static setTeamDisplayMode(active){
		V_4DUtils.setTeamDisplayMode(active);
		V_phasesUtils.setTeamDisplayMode(active);
		if(active){
			V_filterMenuUtils.setDisplayMenuChange(2);
		}else{
			V_filterMenuUtils.setDisplayMenuChange(1);
		}
		if(active){
			this.socket.emit("updateDisplayMenu", { choice : 2});
		}else{
			this.socket.emit("updateDisplayMenu", { choice : 1});
		}
	}


	/* PLAYER INTERACTION */
	static displayMilestone(milestone, bool){
		if(milestone != null){
			this.socket.emit("displayMilestone", { 
				milestoneId : milestone.getId(),
				value : bool,
			});
		}else{
			this.socket.emit("displayMilestone", { 
				milestoneId : null,
				value : bool,
			});
		}
		
	}

	/* ---------------------------- W6 INTERACTIONS ---------------------------- */

	/**
		Highlight a object4D on Viewer from 6WPlanning
		@param {Task} task 
		@param {bool} bool
		@static
	*/		
	static highlightObject4D(object4D, bool){
		V_taskTableUtils.setToken(object4D.getTask(), bool);
		V_4DUtils.highlightObject4D(object4D, bool);
		this.socket.emit("highlightObject4D", { taskId : object4D.getTask().getId(), objId : object4D.getId(), value:bool});
	}

	static clearHighlighting(){
		V_taskTableUtils.clearTokens();
		V_4DUtils.clearHighlighting();
		this.socket.emit("clearHighlighting");
	}

	static setRequirement(model, requirement, task){
 		DataApi.patchRequirement(model, requirement);
 		V_taskTableUtils.updateRequirements(task);
 		this.socket.emit("setRequirement", { 
 			taskId : task.getId(),
			requirementName : requirement.getName(),
			value : requirement.getValue(),
		});
	}

	static setTaskState(model, task){
		DataApi.patchTaskState(model, task);
		V_taskTableUtils.updateTaskState(task);
		V_taskTableUtils.updateRequirements(task);
		this.socket.emit("setTaskState", { 
			taskId : task.getId(),
			done : task.isDone(),
			paused : task.isPaused(),
			go : task.isGo(),
		});
	}

	static pressHighlightTask(task , display){
		V_taskTableUtils.highlightTask(task, display);
		V_playerUtils.highlightTask(task, display);
		V_phasesUtils.highlightTask(task, display);
		this.socket.emit("pressHighlightTask", { 
			taskId : task.getId(),
			value : display
		});
	}

	static updateStateDisplay(task, bool){
		V_taskTableUtils.updateStateDisplay(task, bool);
		this.socket.emit("updateStateDisplay", { 
			taskId : task.getId(),
			value : bool
		});
	}

	static setTeamOpening(team, nth, bool){
		V_taskTableUtils.setTeam(team, nth, bool);
		this.socket.emit("setTeamOpening", { 
			teamId : team.getId(),
			nth : nth,
			value : bool
		});
	}

	static setTeamDisplay(teamId, nth, bool){
		V_taskTableUtils.setTeamDisplay(teamId, nth, bool);
		this.socket.emit("setTeamDisplay", { 
			teamId : teamId,
			nth : nth,
			value : bool
		});
	}

	static triggerTeamDisplay(team, bool){
		V_4DUtils.triggerTeamDisplay(team, bool);
		this.socket.emit("triggerTeamDisplay", { 
			teamId : team.getId(),
			value : bool
		});
	}

	/* ---------------------------- FILTER MENU INTERACTIONS ---------------------------- */

	static setIfcMenuChange(ifcs){
		const toReturn = [];
		for(let i in ifcs){
			toReturn.push(//{
					/*model : ifcs[i].model.getId(),
					shown : */ifcs[i].shown
				//}
			);
		}
		this.socket.emit("updateIfcMenu", { 
			ifcs : toReturn
		});
	}

	static setDisplayMenuChange(choice){
		V_filterMenuUtils.setDisplayMenuChange(choice);
		this.socket.emit("updateDisplayMenu", { 
			choice : choice
		});
	}

	static setLockCameraDisplay(bool){
		V_filterMenuUtils.setCameraLocked(bool);
		V_4DUtils.setCameraLocked(bool);
		this.socket.emit("setCameraLocked", { 
			value : bool
		});
	}

	/* ----------------------------- PLANNING MENU INTERACTION --------------------------- */
	static setPlanningDisplay(milestone, phases, weeks, week){
		V_taskTableUtils.setPlanningDisplay(milestone, phases, weeks, week);
		V_playerUtils.displayMilestones(milestone);
		V_phasesUtils.displayed(phases);
		this.socket.emit("setPlanningDisplay", { 
			choices : [milestone, phases, weeks, week]
		});
	}

	/* ----------------------------- PHASE PANEL INTERACTION --------------------------- */
	static triggerPhaseDisplay(phase, bool){
		V_4DUtils.triggerPhaseDisplay(phase, bool);
		this.socket.emit("triggerPhaseDisplay", { 
			phaseId : phase.getId(),
			value : bool
		});
	}

	static  triggerPhaseDescription(phase){
		this.socket.emit("triggerPhaseDescription", { 
			phaseId : phase.getId(),
		});
	}

}
export default V_socketUtils;