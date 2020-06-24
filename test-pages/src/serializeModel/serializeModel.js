module.exports = () => {

	window.addEventListener("load", function(){
		init();
	});
	
}

function init(){

	DataApi.getModel("test").then(model =>{
		
	});

	/*const model = tl.getModel();
	DataApi.postModel(model, "test")
	.then(()=>{
		console.log("success");
	}).catch(()=>{
		console.error("error");
	});*/

}

