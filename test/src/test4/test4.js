module.exports = () => {

	window.addEventListener("load", function(){
		init();
	});
	
}

function init(){

	let file = null;
	Promise.all([Utils.loadTextFile("/test2/Project1.csv"), Utils.loadTextFile("/test2/Project1.ifc")])
	.then( files => Loader.fromCSVandIFC(files[0], files[1]))
	.then( timeline => {
		console.log(timeline);
		//Model Loaded
		console.log(timeline.getModel());
	})
	.catch( error => console.error(error));

}