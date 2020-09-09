module.exports = {
	//For transfert logs from tablette to nodejs console
	"socketConsole" : false,
	"socketConsoleIP" : "localhost",
	"socketConsolePort" : 3002,
	//

	"forgeRenderer" : false,

	"socketServerIp" : "localhost", //"194.199.221.148",//"194.199.221.139", 
	"socketServerPort" : 3001,

	"dataServerIp" : "localhost", ////"194.199.221.139", 
	"dataServerPort" : 3003,

	"autoDeskAccount" : "clement",

	"autoDeskForgeSettings" : {
		"clement" : {
			clientId : "XWL5ytY1an8Adj0jIC3gS2PYZlNamuGT",
			clientSecret : "0yEFdwlXiJt7X94U",
		},
		"antoine" : {
			clientId : null,
			clientSecret : null,
		}
	},

	//Passwords should be on server side with serverside verification
	"passwords" : {
		"EQA" : "a",
		"EQB" : "b",
		"EQC" : "c",
		"EQD" : "d",
		"EQE" : "e",
	},

	//Properties which will not displayed
	"propertiesHidden" : [
		"parent",
		"Icon",
		"Type",
		"Hidden",
		"Required",
		"Source File",
		"Ambient.Red",
		"Ambient.Green",
		"Ambient.Blue",
		"Diffuse.Red",
		"Diffuse.Green",
		"Diffuse.Blue",
		"Specular.Red",
		"Specular.Green",
		"Specular.Blue",
		"Emissive.Red",
		"Emissive.Green",
		"Emissive.Blue",
		"Shininess",
		"Transparency",
		"ext-'Site web'",
		"ext-'IsExternal'",
	],

	

	"propertiesNameConversion" : {
		"viewable_in" : "IFC file",
		"Layer" : "Etage",
		"ext-'Renovation Status'" : "Status"

	}

}