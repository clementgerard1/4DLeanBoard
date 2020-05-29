import "regenerator-runtime/runtime";
import ForgeSDK from 'forge-apis';

/**
 * @class Utils
 * @classdesc Utils is a static class provide tools.
 * @hideconstructor
 */
class Utils{

	static ids = {
		"default" : 0
	}

	/**
		Load a text file as string
		@param {string} url of the file.
		@returns {string} string of the file
		@static
	*/
	static async loadTextFile(url){

		let toReturn = null;
		await fetch(url, {
			method : 'GET',
		}).then(response => {
			 	if(!response.ok) {
          throw Error(response.statusText);
        }
				toReturn = response.text();
		}).catch((error) => { 
			throw 'Error on fetching file : ' + url;
		});
		return toReturn;
	}

	/**
		Load a text file as string
		@param {string} [type="default"] name of the category of ids
		@returns {int} id unique for category
		@static
	*/
	static getId(type = "default"){
		if(typeof this.ids[type] == "undefined"){
			this.ids[type] = 0;
		}
		return this.ids[type]++;
	}

	/**
		Get Autodesk Auth token
		@param {string} idClient
		@param {string} secretClient
		@returns {string} Autodesk token
		@static
	*/
	static async getAutodeskAuth(idClient, secretClient){
		const oAuth2TwoLegged = new ForgeSDK.AuthClientTwoLegged(idClient, secretClient, [
		    'data:read',
		    'data:write'
		], true);
		let token = null;
		await oAuth2TwoLegged.authenticate().then(function(credentials){
			token = credentials.access_token;
		}, function(err){
		    throw err;
		});
		return token;

	}

	/**
		Create Bucket
		@param {string} token
		@returns {string} token
		@static
	*/
	static async createForgeBucket(token){
		const bucketsApi = new ForgeSDK.BucketsApi();

		let bucket = null;
		/*console.log("**** Creating Bucket : " + bucketKey);
		var createBucketJson = {
			'bucketKey': bucketKey,
			'policyKey': 'temporary'
		};
		return bucketsApi.createBucket(createBucketJson, {}, oAuth2TwoLegged, oAuth2TwoLegged.getCredentials());
		await bucketsApi.createBucket({
			'bucketKey' : "4DLeanBoard",
			'policyKey': 'temporary'
			).then(function(buck){
			bucket = buck;
		});
		console.log(bucket);*/
		return token;
	}

	/**
		uploadIFCFileToABucket
		@param {string} token
		@returns {string} token
		@static
	*/
	static async uploadIFCFileToForge(token){

	}

}

export default Utils;