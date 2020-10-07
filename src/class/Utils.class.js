import "regenerator-runtime/runtime";
import ForgeSDK from 'forge-apis';
import fs from 'fs';
import btoa from 'btoa';
import Config from '../../config.js';

/**
 * @class Utils
 * @classdesc Utils is a static class provide tools.
 * @hideconstructor
 */
class Utils{
	
	static forgeBucketName = Config.autoDeskForgeSettings[Config.autoDeskAccount].forgeBucketPrefix;
	static forgeFileName = Config.autoDeskForgeSettings[Config.autoDeskAccount].forgeBucketPrefix;

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
		if(typeof fetch != "undefined"){
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
		}else{
	  	return fs.readFileSync(url, {encoding:'utf8'});
		}
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
	static async createForgeBucket(oAuth, name){
		const bucketsApi = new ForgeSDK.BucketsApi();
		await bucketsApi.createBucket({ 'bucketKey' : Utils.forgeBucketName + "-" + name, 'policyKey' : 'temporary' }, {}, oAuth, oAuth.getCredentials()).then(
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
	static async uploadIFCFileToForge(oAuth, name, url){

		const derivativesApi = new ForgeSDK.DerivativesApi();
		const objectsApi2 = new ForgeSDK.ObjectsApi();
		let manifest = null;

		await Utils.loadTextFile(url).then( file => {
		  const objectsApi = new ForgeSDK.ObjectsApi();
			return objectsApi.uploadObject(Utils.forgeBucketName + "-" + name, /*Utils.forgeFileName*/ name + ".ifc", file.length, file, {}, oAuth, oAuth.getCredentials())
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
					if(result.body.derivatives.length > 0){
						console.log(result.body.derivatives[0].name  + " : " + result.body.status);
					}
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
		uploadRVTFileToABucket
		@param {oAuth2TwoLegged} oAuth
		@param {string} url url of RVT file
		@returns {Object} oAuth2TwoLegged + urn
		@static
	*/
	static async uploadRVTFileToForge(oAuth, name, url){

		const derivativesApi = new ForgeSDK.DerivativesApi();
		const objectsApi2 = new ForgeSDK.ObjectsApi();
		let manifest = null;


		await Utils.loadTextFile(url).then( file => {
		  const objectsApi = new ForgeSDK.ObjectsApi();
		  console.log(Config.autoDeskForgeSettings[Config.autoDeskAccount].clientId.forgeBucketPrefix + "-" + name, /*Utils.forgeFileName*/ name + ".rvt", file.length);
			return objectsApi.uploadObject(Utils.forgeBucketName + "-" + name, /*Utils.forgeFileName*/ name + ".rvt", file.length, file, {}, oAuth, oAuth.getCredentials())
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

					console.log("hey2", response.body.acceptedJobs.output.formats);
					//console.log(response.body.status);
					return derivativesApi.getManifest(response.body.urn, {}, oAuth, oAuth.getCredentials());
				}
			).then( 
				result => {
					console.log("hey3", result);
					console.log(result.body.derivatives[0].name  + " : " + result.body.status);
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
  /**
		getWeekNumber (from stackoverflow)
		@param {Date} date
		@returns {int} number of the week
		@static
	*/
  static getWeekNumber(date){
	  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
	  var dayNum = d.getUTCDay() || 7;
	  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
	  var yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
	  return Math.ceil((((d - yearStart) / 86400000) + 1)/7);
	}

	/**
		getMonthString
		@param {int} monthNumber from 1 to 12
		@returns {string}
		@static
	*/
	static getMonthString(monthNumber){
		switch(monthNumber){
			case 1 : return "Janvier";//return "January";
			case 2 : return "Février";//return "February";
			case 3 : return "Mars";//return "March";
			case 4 : return "Avril";//return "April";
			case 5 : return "Mai";//return "May";
			case 6 : return "Juin";//return "June";
			case 7 : return "Juillet";//return "July";
			case 8 : return "Août";//return "August";
			case 9 : return "Septembre";//return "September";
			case 10 : return "Octobre";//return "October";
			case 11 : return "Novembre";//return "November";
			case 12 : return "Décembre";//return "December";
		}
	}

	/**
		getGuid (from github)
		@returns {string}
		@static
	*/
	static getGuid () {

    let d = new Date().getTime();

    const guid = 'xxxx-xxxx-xxxx-xxxx'.replace(
      /[xy]/g,
      function (c) {
        const r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16);
      });

    return guid;

  };

  static getFormatedDate(date){
  	const temp = date.split("/");
  	if(temp[0].length == 1){
  		temp[0] = "0" + temp[0];
  	}
  	if(temp[1].length == 1){
  		temp[1] = "0" + temp[1];
  	}
  	const tempp = temp[0];
  	temp[0] = temp[1];
  	temp[1] = tempp;
  	return temp.join("/");
  }

  static getFormatedDate2(date){
  	const n = date.split(" ");
  	const temp = [];
  	temp[0] = n[1];
  	temp[2] = n[3];
  	switch(n[2]){
  		case "janvier" : temp[1] = '01'; break;
  		case "fevrier" : temp[1] = '02'; break;
  		case "mars" : temp[1] = '03'; break;
  		case "avril" : temp[1] = '04'; break;
  		case "mai" : temp[1] = '05'; break;
  		case "juin" : temp[1] = '06'; break;
  		case "juillet" : temp[1] = '07'; break;
  		case "aout" : temp[1] = '08'; break;
  		case "septembre" : temp[1] = '09'; break;
  		case "octobre" : temp[1] = '10'; break;
  		case "novembre" : temp[1] = '11'; break;
  		case "decembre" : temp[1] = '12'; break;
  	}
  	if(temp[0].length == 1){
  		temp[0] = "0" + temp[0];
  	}
  	if(temp[1].length == 1){
  		temp[1] = "0" + temp[1];
  	}
  	const tempp = temp[0];
  	temp[0] = temp[1];
  	temp[1] = tempp;
  	return temp.join("/");
  }



  static addDaysToDate(dateInit, nb){
    const date = new Date(dateInit.valueOf());
    date.setDate(date.getDate() + nb);
    return date;
  }

}

export default Utils;