import V_4DUtils from "../Utils/V_4DUtils.class.js";
import V_socketUtils from "../Utils/V_socketUtils.class.js";
import V_timelineUtils from "../Utils/V_timelineUtils.class.js";
import V_taskTableUtils from "../Utils/V_taskTableUtils.class.js";
import Config from "../../../config.js";
import "./V_forgeViewer.scss";
import scssVariables from "../SixWeekView/assets/_variables.scss";
import Utils from "../../class/Utils.class.js";

import Scene from "./class/Scene.class.js";
import Memory from "./class/Memory.class.js";



export default {
	data : function(){
		return {
			scene : null,
			time : null,
		}
	},
	props : [
		"urns",
		"oauth",
		"timeline",
		"model",
	],
	methods : {

		createCustumMaterials(){
			const selectedMaterial = new THREE.MeshBasicMaterial({
			    reflectivity: 0.0,
			    flatShading: true,
			    transparent: true,
			    opacity: 0.8,
			    color: scssVariables["select3DColor"],
			});
			Memory.addMaterial(selectedMaterial, true, "selectedMaterial");

			const nextsWeeksMat = new THREE.MeshBasicMaterial({
				reflectivity: 0.0,
				flatShading: true,
				transparent: true,
				opacity: 0.3,
				color: scssVariables["nextSixWeeks"],
			});
			Memory.addMaterial(nextsWeeksMat, true, "nextsWeeksMat");

			const currWeekMat = new THREE.MeshBasicMaterial({
				reflectivity: 0.0,
				flatShading: true,
				transparent: true,
				opacity: 0.75,
				color: scssVariables["currentWeek"],
			});
			Memory.addMaterial(currWeekMat, true, "currWeekMat");

			const sixWeeksMat = new THREE.MeshBasicMaterial({
				reflectivity: 0.0,
				flatShading: true,
				transparent: true,
				opacity: 0.75,
				color: scssVariables["currentSixWeeks"],
			});
			Memory.addMaterial(sixWeeksMat, true, "sixWeeksMat");

		},

		allSelected(){
			this.scene.setAllMaterials("selectedMaterial");
		},

		watchTime : function(time){
			if(this.time != time){

				this.time = time;

				//State
				const startActualWeek = this.time*7;

				const start6Weeks = Math.trunc(this.time / 6) * 42;
				const previousTasks = this.timeline.getTasksBetweenTwoDates(0, start6Weeks);
				const weeksTasks = this.timeline.getTasksBetweenTwoDates(start6Weeks, start6Weeks + 41);
				const nextTasks = this.timeline.getTasksBetweenTwoDates(start6Weeks, this.model.getDuration() * 7);

				for(let t in previousTasks){
					const objs = previousTasks[t].getObject4D().getObjects3D()
					for(let o in objs){
						const forges = objs[o].getForgeObjects();
						for(let f in forges){
							Memory.setState(forges[f], "built", false);
						}
					}
				}

				for(let n in nextTasks){
					const objs = nextTasks[t].getObject4D().getObjects3D()
					for(let o in objs){
						const forges = objs[o].getForgeObjects();
						for(let f in forges){
							Memory.setState(forges[f], "toBuild", false);
						}
					}
				}

				for(let w in weeksTasks){
					const state = null;
					if(this.timeline.isActiveBetweenTwoDate(weeksTasks[w], startActualWeek, startActualWeek + 6)){
						state = "currentWeek";
					}else{
						state = "builtOn6W";
					}

					const objs = nextTasks[t].getObject4D().getObjects3D()
					for(let o in objs){
						const forges = objs[o].getForgeObjects();
						for(let f in forges){
							Memory.setState(forges[f], state, false);
						}
					}
				}		

				Memory.update();

				//Selection
				const tasks = V_taskTableUtils.getTokens();
				for(let t in tasks){
					this.select(tasks[t].getObject4D(), true);
				}

			}
		},

		highlightTask() {
			const selection = this.viewer.getSelection();
			this.viewer.clearSelection();
			for(let s in selection){
				const dbId = selection[s];
				const task = Memory.getForgeObject(dbId).getObject3D().getParent().getTask();
				V_socketUtils.highlightTask(task, true);
			}
		},

		select(object4D, bool){
			const objs = object4D.getObjects3D();
			for(let o in objs){
				const fobjs = objs[o].getForgeObjects();
				for(let f in fobjs){
					Memory.select(fobjs[f], false);
				}
			}
			Memory.update();
		},

		clearSelection(){
			Memory.clearSelection();
		},

		setTeamDisplayed(taskTeam, bool){
			Memory.setTeamSelected(taskTeam, bool);
		},

		setTeamDisplayMode(bool){
			Memory.setTeamDisplayMode();
		}

	},
	mounted : function(){

		this.scene = new Scene();
		this.scene.init(this.oauth, this.urns, ()=>{
			console.log("init done");
			this.createCustumMaterials();
			this.allSelected();
			const tasks = V_taskTableUtils.getTokens();
			for(let t in tasks){
				this.select(tasks[t].getObject4D(), true);
			}
			V_4DUtils.setForgeViewer(this);
			V_socketUtils.addViewer();
			V_timelineUtils.addListener("time", this, this.watchTime);
		})

	},
	template : `
	<div id="forgeViewer">
		<!-- forgeViewer -->
		<div id="forgeV"></div>
	</div>`,
}