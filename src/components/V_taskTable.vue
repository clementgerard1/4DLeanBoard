import "./V_taskTable.css";
import V_task from "./V_task.vue";
import Model from "../class/Model.class.js";

export default {
	components: {
		task : V_task,
	},
	data : function(){
		return {
			nbRow : 0
		}
	},
	template : `
		<div id="taskTable">
			<div class="column">
				<task></task>
				<task></task>
				<task></task>
				<task></task>
				<task></task>
			</div>
			<div class="column">
				<task></task>
				<task></task>
				<task></task>
				<task></task>
				<task></task>
			</div>
			<div class="column played">
				<task></task>
				<task></task>
				<task></task>
				<task></task>
				<task></task>
			</div>
			<div class="column">
				<task></task>
				<task></task>
				<task></task>
				<task></task>
				<task></task>
			</div>
			<div class="column">
				<task></task>
				<task></task>
				<task></task>
				<task></task>
				<task></task>
			</div>
			<div class="column">
				<task></task>
				<task></task>
				<task></task>
				<task></task>
				<task></task>
			</div>
		</div>
	`,
}