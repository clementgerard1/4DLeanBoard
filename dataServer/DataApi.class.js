import Config from "../config.js";
import "regenerator-runtime/runtime";
import Model from '../src/class/Model.class.js';
import Utils from '../src/class/Utils.class.js';
import axios from 'axios';

class DataApi{

	static serverPort = Config.dataServerPort;
	static serverIp = Config.dataServerIp;
	static serverUrl = 'http://' + DataApi.serverIp + ":" + DataApi.serverPort;

	static async postModel(model, name = model.getName()){
		const json = model.serialize();

		return await axios.post(DataApi.serverUrl + '/model', {
			name : name,
			model : json
		});
	}

	static async postCSVModel(csv){

	}

	static async getModel(name, forge = false){
		let clientId = Config.autoDeskForgeSettings[Config.autoDeskAccount].clientId;
		let clientSecret = Config.autoDeskForgeSettings[Config.autoDeskAccount].clientSecret;
		let oauth = null;
		if(forge){
			return await Utils.getAutodeskAuth(clientId, clientSecret)
			.then( oAuth => {
				oauth = oAuth
				return axios.get(DataApi.serverUrl + '/model?name=' + name);
			})
			.then( (modelS) => {
				const model = new Model();
				model.deserialize(modelS.data.model);
				return {
					model : model,
					urns : modelS.data.urns,
					oAuth : oauth,
					ifcProperties : modelS.data.ifcProperties,
				};
			});
		}else{
			return await axios.get(DataApi.serverUrl + '/model?name=' + name).then( datas => {
				return datas.data.model;
			});
		}

	}

	static async patchTaskState(model, task){
		return axios.patch(DataApi.serverUrl + '/task/state?modelname=' + model.getName() + "&taskid=" + task.getId() + "&paused=" + task.isPaused() + "&done=" + task.isDone() + "&go=" + task.isGo());
	}

	static async patchRequirement(model, requirement){
		return axios.patch(DataApi.serverUrl + '/requirement/?modelname=' + model.getName() + "&requirementid=" + requirement.getId() + "&requirementvalue=" + requirement.getValue());
	}

	static async patchPerson(model, taskId, personId, bool){
		return axios.patch(DataApi.serverUrl + '/person/?modelname=' + model.getName() + "&taskid=" + taskId + "&personid=" + personId + "&value=" + bool);
	}

	static async patchWorkers(model, taskId, workers){
		return axios.patch(DataApi.serverUrl + '/workers/?modelname=' + model.getName() + "&taskid=" + taskId + "&value=" + workers);
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