import "./V_taskTableBackground.scss";

export default {
	data : function(){
		return {
		}
	},
	props:[
		"lines"
	],
	template : `
	<div>
		<div class="backgroundcolumn" v-for="c in 6" ></div>
	</div>`,
}