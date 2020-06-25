import Config from "../config.js";
import "regenerator-runtime/runtime";
import Model from '../src/class/Model.class.js';
import axios from 'axios';

class DataApi{

	static serverPort = '3003';
	static serverIp = '194.199.221.139';
	static serverUrl = 'http://' + DataApi.serverIp + ":" + DataApi.serverPort;

	static async postModel(model, name = model.getName()){
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

	static async patchTaskState(model, task){
		return axios.patch(DataApi.serverUrl + '/task/state?modelname=' + model.getName() + "&taskid=" + task.getId() + "&paused=" + task.isPaused() + "&done=" + task.isDone());
	}

	static async patchRequirement(model, requirement){
		return axios.patch(DataApi.serverUrl + '/requirement/?modelname=' + model.getName() + "&requirementid=" + requirement.getId() + "&requirementvalue=" + requirement.getValue());
	}

	static async isAvailable(){
		return axios.get(DataApi.serverUrl).then( () => {return true;}).catch( () => {return false;});
	}

	static async getModels(){
		return axios.get(DataApi.serverUrl + '/models')
		.then( (json) => {
			return json.data;
		})
		.catch( () => {return false;});
	}

}
export default DataApi;