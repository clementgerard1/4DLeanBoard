import "./V_6Wrow_header.scss";
import TimelineUtils from "../Utils/V_timelineUtils.class.js";
import V_socketUtils from "../Utils/V_socketUtils.class.js";
import Utils from "../../class/Utils.class.js";
import V_6Wrow_header_date from "./V_6Wrow_header_date.vue";

export default {
	components:{
		"date" : V_6Wrow_header_date,
		"heightt" : "0px",
	},
	props:[
		'time',
		'tasktablestart',
		"tasksize"
	],
	data : function(){
		return {
			'c' : 0,
		}
	},
	inject : [
		'timeline',
		'model',
	],
	provide : [
		'timeline',
		'model',
	],
	methods: {
		clearSelection : function(){
			V_socketUtils.clearHighlighting();
		},

		selectWeek : function(i){
			V_socketUtils.setTime(this.tasktablestart + i);
		},
		handleDoublePan : function(event){
			console.log(event);
			if(event.pointers.length > 1){
				this.c++;
			}
		}

	},
	template : `

		<div v-doublePan="handleDoublePan" class="rowHeader" >
			<p v-html="c"></p>
			<date v-bind:style="{ height: tasksize  + 'px' }" class="rowHeaderItem" v-for="i in 6" :key="i" v-tap="()=>{selectWeek(i-1)}" v-bind:time="tasktablestart + (i-1)"></date>
	 	</div>

	`,
}