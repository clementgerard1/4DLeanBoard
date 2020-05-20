module.exports = function(){

	window.addEventListener("load", function(){
		init();
	});
	
}

function init(){

	let file = null;
	Promise.all([Utils.loadFile("/test2/Project1.csv"), Utils.loadFile("/test2/Project1.ifc")])
	.then( files => Loader.fromCSVandIFC(files[0], files[1]))
	.then( model => {
		//Model Loaded

	});

}