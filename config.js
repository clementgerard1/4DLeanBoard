module.exports = {
	//For transfert logs from tablette to nodejs console
	"socketConsole" : false,
	"socketConsoleIP" : "localhost",
	"socketConsolePort" : 3002,
	//
	"forgeRenderer" : false,

	//En local (serveur directement sur l'ordinateur)
	"socketServerIp" : "localhost",
	"dataServerIp" : "localhost",
	//Sur le Server
	//"socketServerIp" : "194.199.221.148"
	//"dataServerIp" : "194.199.221.148",


	"socketServerPort" : 3001,
	"dataServerPort" : 3003,

	"autoDeskAccount" : "clement",

	"autoDeskForgeSettings" : {
		"clement" : {
			//Compte clément de test post stage
			//clientId : "XWL5ytY1an8Adj0jIC3gS2PYZlNamuGT", 
			//clientSecret : "0yEFdwlXiJt7X94U", 
			//forgeBucketPrefix : "veronikaa_4dlbbb" 

			//Compte du stage
			clientId : "XWL5ytY1an8Adj0jIC3gS2PYZlNamuGT",
			clientSecret : "0yEFdwlXiJt7X94U",
			forgeBucketPrefix : "veronikaa_4dlb_bonjourbonjour"
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
		"OBJECTTYPE",
		"LoadBearing",
		"Slope",
		"Reference",
		"Span",
		"FireRating",
		"EnvironmentalClass",
		"LifeCycleEnvironmentalLoad",
		"DimensionalAccuracyClass",
		"ConstructionToleranceClass",
		"ConstructionType",
		"Color",
		"BarCode",
		"SerialNumber",
		"ModelReference",
		"Category",
		"Host",
		"AssetIdentifier",
		"Family",
		"Family and Type",
		"InstallationDate",
		"TagNumber",
		"Type Id",
		"WarrantyStartDate",
		"Rebar Cover",
		"Default Elevation",
		"EdgeDetails",
		"EnvironmentalProductDeclaration",
		"Author",
		"BIMObjectName",
		"ManufacturerURL",
		"NBSCertification" ,
		"NBSDescription" ,
		"NBSNote" ,
		"NBSOfficeMasterTag" ,
		"NBSReference" ,
		"NBSTypeID" ,
		"ProductInformation" ,
		"Revision" ,
		"Uniclass2015Code" ,
		"Uniclass2015Title" ,
		"Uniclass2015Version" ,
		"Version" ,
		"AccessibilityPerformance" ,
		"AssetType" ,
		"CodePerformance" ,
		"Constituents" ,
		"DurationUnit" ,
		"ExpectedLife" ,
		"Family Name" ,
		"Features" ,
		"Finish" ,
		"Grade" ,
		"ModelNumber" ,
		"SustainabilityPerformance" ,
		"WarrantyDescription" ,
		"WarrantyDurationLabor" ,
		"WarrantyDurationParts" ,
		"WarrantyDurationUnit" ,
		"WarrantyGuarantorLabor" ,
		"WarrantyGuarantorParts" ,
		"PREDEFINEDTYPE" ,
		"parent" ,

	],



	
	"propertiesNameConversion" : {
		"viewable_in" : "IFC file",
		"Layer" : "Etage",
		"ext-'Renovation Status'" : "Status"

	},


	"licorne" : 5, //minutes

}