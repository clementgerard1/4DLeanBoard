import "./V_standardButton.scss";

export default {
	props : [
		"condition",
		"id"
	],
	computed : {
		_id : function(){
			return this.id;
		}
	},
	template : `
		<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
			<g v-if="condition" filter="url(#filter0_d_standardItemActive)">
				<circle v-bind:id="id" cx="18" cy="16" r="16" fill="#97D7C7"/>
			</g>
			<g v-else="condition" filter="url(#filter0_d_standardItem)">
				<circle v-bind:id="id" cx="18" cy="16" r="16" fill="url(#paint0_linear_standardItem)"/>
			</g>
		</svg>
	`,
}