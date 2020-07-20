import "./V_standardButton.scss";

export default {
	props : [
		"condition",
		"id",
		"color"
	],
	computed : {
		_id : function(){
			return this.id;
		},
		_color : function(){
			if(typeof this.color != "undefined"){
				return this.color;
			}else{
				return "#97D7C7";
			}
		}
	},
	template : `
		<svg v-bind:id="id" width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
			<g v-if="condition" filter="url(#filter0_d_standardItemActive)">
				<circle v-bind:id="id" cx="18" cy="16" r="16" v-bind:fill="_color"/>
			</g>
			<g v-else="condition" filter="url(#filter0_d_standardItem)">
				<circle v-bind:id="id" cx="18" cy="16" r="16" fill="url(#paint0_linear_standardItem)"/>
			</g>
		</svg>
	`,
}