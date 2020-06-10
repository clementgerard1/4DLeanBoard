import "./V_6Wrow_header.scss";
import TimelineUtils from "../Utils/V_timelineUtils.class.js";
import Utils from "../../class/Utils.class.js";
import V_6Wrow_header_date from "./V_6Wrow_header_date.vue";

export default {
	components:{
		"date" : V_6Wrow_header_date
	},
	props:[
		'time',
		'tasktablestart'
	],
	inject : [
		'timeline',
		'model',
	],
	provide : [
		'timeline',
		'model',
	],
	computed: {
		"_time" : function(){
			return this.time;
		}
	},
	template : `

		<div class="rowHeader">
			<date class="rowHeaderItem" v-for="i in 6" :key="i" v-bind:time="tasktablestart + (i-1)"></date>
	 	</div>

	`,
}