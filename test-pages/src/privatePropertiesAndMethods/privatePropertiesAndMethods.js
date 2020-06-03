module.exports = () => {

	window.addEventListener("load", function(){
		init();
	});
	
}

function init(){

	let file = null;
	Promise.all([Utils.loadTextFile("/datas/Project1.csv"), Utils.loadTextFile("/datas/Project1.ifc")])
	.then( files => Loader.fromCSVandIFC(files[0], files[1]))
	.then( timeline => {
		console.log(timeline);
		//Model Loaded
		console.log("Must be undefined => " + timeline.model);
		console.log("With GetModel() => ", timeline.getModel());
	})
	.catch( error => console.error(error));

}