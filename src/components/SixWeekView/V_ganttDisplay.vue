import "./V_ganttDisplay.scss";

export default {
	data : function(){
		return {
			rotate : 0
		}
	},
	mounted: function(){
		const that= this;
		function step(timestamp) {
			that.rotate++;
		   	window.requestAnimationFrame(step);
		}

		window.requestAnimationFrame(step);
	},
	template : `
	<div v-bind:style="{filter : 'hue-rotate(' + rotate + 'deg)'}" id="gantt">
		<img src="/gantt1.png" />
		<img src="/gantt2.png" />
	</div>`,
}