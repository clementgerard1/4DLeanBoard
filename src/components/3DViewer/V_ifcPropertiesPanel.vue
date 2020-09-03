import "./V_ifcPropertiesPanel.scss";

export default {

	props:[
		"properties"
	],
	computed:{
		displayed : function(){
			console.log(this.properties);
			return this.properties;
		}
	},
	template : `
	<div v-if="displayed.length != 0" id="ifcPropertiesPanel">
		<p v-for="prop in displayed" v-html="prop.key + ' : ' + prop.value"></p>
	</div>`,
}