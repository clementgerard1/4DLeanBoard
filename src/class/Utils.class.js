require("regenerator-runtime/runtime");

/**
 * @class Utils
 * @classdesc Utils is a static class provide tools.
 * @hideconstructor
 */
class Utils{

	static latestCSVVersion = "0.0";

	/**
		Load a file
		@param {string} url of the file.
		@returns {type} File
		@static
	*/
	static async loadFile(url){

		let toReturn = null;
		await fetch(url, {
			method : 'GET',
		}).then(response => {
				toReturn = response.text();
			});
		return toReturn;

	}


}

module.exports = Utils;