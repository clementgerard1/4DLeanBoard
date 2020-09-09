import "./V_6Wrow_header.scss";
import TimelineUtils from "../Utils/V_timelineUtils.class.js";
import V_socketUtils from "../Utils/V_socketUtils.class.js";
import Utils from "../../class/Utils.class.js";
import V_6Wrow_header_date from "./V_6Wrow_header_date.vue";
import V_ModelUtils from "../Utils/V_ModelUtils.class.js";
import Larrow from "./assets/WeekSwitcher.svg";
import Rarrow from "./assets/WeekSwitcherR.svg";
import LarrowClicked from "./assets/WeekSwitcherOnClick.svg";

export default {
	components:{
		"date" : V_6Wrow_header_date,
		"heightt" : "0px",
	},
	data: function(){

		const model = V_ModelUtils.getModel();
		const duration = model.getDuration();

		return {
			"Larrow" : Larrow,
			"Rarrow" : Rarrow,
			"duration" : duration
		}
	},
	props:[
		'time',
		'tasktablestart',
		"tasksize",
	],
	created : function(){
		V_ModelUtils.addModelListener((model)=>{
			this.duration = model.getDuration();
		});
	},
	methods: {
		clearSelection : function(){
			V_socketUtils.clearHighlighting();
		},

		selectWeek : function(i){
			V_socketUtils.setTime(this.tasktablestart + i);
		},
		handleDoublePan : function(event){
			console.log("doublepan");
		},
		handlePreviousWeek : function(event){
			V_socketUtils.setTime(this.tasktablestart - 1);
		},
		handleNextWeek : function(event){
			V_socketUtils.setTime(this.tasktablestart + 6);
		}

	},
	computed : {
		_duration : function(){
			return Math.trunc(this.duration / 7);
		}
	},
	template : `

		<div v-doublePan="handleDoublePan" class="rowHeader" >
			<div v-if="tasktablestart != 0" v-tap="handlePreviousWeek" :key="'previous'" class="Larrow" v-html="Larrow"></div>
			<date v-bind:style="{ height: (tasksize / 2)  + 'px' }" class="rowHeaderItem" v-for="i in 6" :key="i" v-tap="()=>{selectWeek(i-1)}" v-bind:time="tasktablestart + (i-1)"></date>
			<div v-if="(tasktablestart + 7) < _duration" v-tap="handleNextWeek" :key="'next'" class="Rarrow" v-html="Rarrow"></div>
	 	</div>

	`,
}