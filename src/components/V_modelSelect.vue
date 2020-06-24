import DataApi from "../../dataServer/DataApi.class.js";
import "./V_modelSelect.scss";

export default {
	data: function(){
		return {
			models : null,
			modelSelected : "test",
		}
	},
	created : function(){
		DataApi.getModels().then((models) => { this.models = models });
	},
	methods: {
		confirm : function(){
			this.$emit('setModel', this.modelSelected);
		}
	},
	template : `
	<div class="modelSelect">
		<div>
			<select v-model="modelSelected">
				<option v-for="model in models" v-html="model"></option>
			</select>
			<button v-tap="confirm" >OK</button>
		</div>
	</div>`,
}