import "regenerator-runtime/runtime";
import ForgeSDK from 'forge-apis';

/**
 * @class Utils
 * @classdesc Utils is a static class provide tools.
 * @hideconstructor
 */
class Utils{
	
	static forgeBucketName = '4d-lean-board';
	static forgeFileName = '4d-lean-board-file.ifc';
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
		    'data:write',
		    'bucket:create'
		], true);
		let token = null;
		await oAuth2TwoLegged.authenticate().catch(e => console.error(e));
		return oAuth2TwoLegged;
	}

	/**
		Create Bucket
		@param {oAuth2TwoLegged} oAuth Forge Object
		@returns {oAuth2TwoLegged} oAuth
		@static
	*/
	static async createForgeBucket(oAuth){
		const bucketsApi = new ForgeSDK.BucketsApi();
		await bucketsApi.createBucket({ 'bucketKey' : Utils.forgeBucketName, 'policyKey' : 'temporary' }, {}, oAuth, oAuth.getCredentials()).then(
			bucket => {
				console.log("Bucket created");
			}
		).catch( error => {
			console.log("Bucket already exist");
		});
		return oAuth;
	}

	/**
		uploadIFCFileToABucket
		@param {oAuth2TwoLegged} oAuth
		@param {string} url url of IFC file
		@returns {Object} oAuth2TwoLegged + urn
		@static
	*/
	static async uploadIFCFileToForge(oAuth, url){

		const derivativesApi = new ForgeSDK.DerivativesApi();
		const objectsApi2 = new ForgeSDK.ObjectsApi();
		let manifest = null;

		await Utils.loadTextFile(url).then( file => {
		  const objectsApi = new ForgeSDK.ObjectsApi();
			return objectsApi.uploadObject(Utils.forgeBucketName, Utils.forgeFileName, file.length, file, {}, oAuth, oAuth.getCredentials())
			.then(
				response => {

					const urn = this.getEncodedUrn(response.body.objectId).replace("urn:", "");

					const job = {
						input : 
						{
							urn : urn
						}, 
						output : 
						{
							formats : 
							[
								{
									type: "svf",
									views: ["3d"]
								}
							]
						}
					}

					return derivativesApi.translate(job , {}, oAuth, oAuth.getCredentials());
				}
			).then( 
				response => {
					return derivativesApi.getManifest(response.body.urn, {}, oAuth, oAuth.getCredentials());
				}
			).then( 
				result => {
					manifest = result.body;
				})
			.catch(
				error => console.log(error)
			);
		});

		return {
			"manifest" : manifest,
			"oAuth" : oAuth
		};
	}

	/**
		getEncodedURn (from forge-vuer github)
		@param {string} urn
		@returns {string} urn
		@static
	*/
	static getEncodedUrn(urn) {
    let encoded;
    if (urn.indexOf('adsk') != -1) {
        encoded = `urn:${btoa(urn)}`;
    }
    else if (urn.indexOf('urn') == -1) {
        encoded = `urn:${urn}`;
    }
    else {
        encoded = urn;
    }
    return encoded;
  }

}

export default Utils;