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
		}
	},
	template : `

		<div class="rowHeader" v-tap="clearSelection">
			<date v-bind:style="{ height: tasksize  + 'px' }" class="rowHeaderItem" v-for="i in 6" :key="i" v-bind:time="tasktablestart + (i-1)"></date>
	 	</div>

	`,
}