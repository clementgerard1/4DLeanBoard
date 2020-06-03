module.exports = () => {

	window.addEventListener("load", function(){
		init();
	});
	
}

function init(){

	let file = null;
	Promise.all([Utils.loadTextFile("/datas/Project1.csv"), Utils.loadTextFile("/datas/Project1.ifc")])
	.then( files => Loader.fromCSVandIFC(files[0], files[1], ";", ","))
	.then( timeline => {
		console.log(timeline);
		console.log(timeline.getModel());
		//Model Loaded

	})
	.catch( error => console.error(error));

}