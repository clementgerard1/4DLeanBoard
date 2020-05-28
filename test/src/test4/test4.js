const Vue = require("vue/dist/vue.esm.js").default;

module.exports = () => {

	window.addEventListener("load", function(){
		init();
	});
	
}

function init(){
	const app = new Vue({
		el : '#root',
		components : {
			task : V_task,
		},
		data:{
			message : "Voilà le message",
 		},
 		template : `
 		<div>
 			<task></task>
 			<p>{{message}}</p>
 		</div>
 		`
	})

}