module.exports = () => {

	window.addEventListener("load", function(){
		init();
	});
	
}

function init(){

	// DataApi.getModel("test").then(model =>{
		
	// });

	Promise.all([Utils.loadTextFile("datas/Project1.json"), Utils.loadTextFile("datas/test2.ifc")])
	.then( files => {
		return Loader.createIFCFileWithId(files[1]);
	})
	/*const model = tl.getModel();
	DataApi.postModel(model, "test")
	.then(()=>{
		console.log("success");
	}).catch(()=>{
		console.error("error");
	});*/

}

