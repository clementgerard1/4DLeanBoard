module.exports = () => {

	window.addEventListener("load", function(){
		init();
	});
	
}

function init(){

	Promise.all([Utils.loadTextFile("datas/Project1v2.json"), Utils.loadTextFile("datas/Project1.ifc")])
	.then( files => {
			return Loader.fromJSONandIFC(files[0], files[1]);
		})
	.then( tl => {
			const model = tl.getModel();
			const json = model.serialize();
			console.log(json);
			const model2 = model.deserialize(json);
			console.log(model2);

	 	})
	.catch( error => console.error(error));

}

