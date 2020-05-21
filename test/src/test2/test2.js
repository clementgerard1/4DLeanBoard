module.exports = () => {

	window.addEventListener("load", function(){
		init();
	});
	
}

function init(){

	let file = null;
	Promise.all([Utils.loadTextFile("/test2/Projsdfect1.csv"), Utils.loadTextFile("/test2/Project1.ifc")])
	.then( files => Loader.fromCSVandIFC(files[0], files[1]))
	.then( model => {
		console.log(model);
		//Model Loaded

	})
	.catch( error => console.error(error));

}