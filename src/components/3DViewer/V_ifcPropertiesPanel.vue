import "./V_ifcPropertiesPanel.scss";
import Config from "../../../config.js"

export default {

	props:[
		"properties"
	],
	computed:{
		displayed : function(){
			const toReturn = [];
			for(let p in this.properties){
				if(!Config.propertiesHidden.includes(this.properties[p].key)) toReturn.push(this.properties[p]);
			}
			for(let t in toReturn){
				if(typeof Config.propertiesNameConversion[toReturn[t].key] != "undefined") toReturn[t].key = Config.propertiesNameConversion[toReturn[t].key];
			}
			return toReturn;
		}
	},
	template : `
	<div v-if="displayed.length != 0" id="ifcPropertiesPanel">
		<p v-for="prop in displayed" v-html="prop.key + ' : ' + prop.value"></p>
	</div>`,
}