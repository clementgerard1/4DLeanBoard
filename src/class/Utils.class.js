import "regenerator-runtime/runtime";

/**
 * @class Utils
 * @classdesc Utils is a static class provide tools.
 * @hideconstructor
 */
class Utils{

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


}

export default Utils;