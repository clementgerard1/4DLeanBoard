import Config from "../config.js";
import "regenerator-runtime/runtime";
import Model from '../src/class/Model.class.js';
import axios from 'axios';

class DataApi{

	static serverPort = '3003';
	static serverIp = 'localhost';
	static serverUrl = 'http://' + DataApi.serverIp + ":" + DataApi.serverPort;

	static async postModel(model, name=model.getName()){
		const json = model.serialize();

		return await axios.post(DataApi.serverUrl + '/model', {
			name : name,
			model : json
		});
	}

	static async getModel(name){

		return await axios.get(DataApi.serverUrl + '/model?name=' + name).then( (modelS) => {
			const model = new Model();
			model.deserialize(modelS.data);
			return model;
		});

	}

	//static async patchTaskState(task){
	//	return axios.patch(DataApi.serverUrl + '/requirement/?modelname=' + name + "&requirementid=" + id);
	//}

	static async patchRequirement(requirement){
		return axios.patch(DataApi.serverUrl + '/requirement/?modelname=' + name + "&requirementid=" + id);
	}

	static async isAvailable(){
		return axios.get(DataApi.serverUrl).then( () => {return true;}).catch( () => {return false;});
	}

}
export default DataApi;