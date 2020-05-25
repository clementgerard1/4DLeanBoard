import Vue from "vue/dist/vue.esm.js";
import Utils from "./class/Utils.class.js";
import Loader from "./class/Loader.class.js";
import V_taskTable from "./components/V_taskTable.vue";

window.addEventListener("load", function(){
	init();
});

function init(){

	Promise.all([Utils.loadTextFile("/datas/Project1.csv"), Utils.loadTextFile("/datas/Project1.ifc")])
	.then( files => Loader.fromCSVandIFC(files[0], files[1]))
	.then( model => {
		console.log(model);
		//Model Loaded
		const app = new Vue({
			el : '#content',
			components : {
				tasktable : V_taskTable,
			},
			data:{
				message : "Voilà le message",
	 		},
	 		template : `
	 		<div>
	 			<tasktable></tasktable>
	 		</div>
	 		`
		});

	})
	.catch( error => console.error(error));

}