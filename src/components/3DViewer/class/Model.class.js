import Utils from "../../../class/Utils.class.js";
import ForgeObject from "./ForgeObject.class.js";
import IFCProperty from "./IFCProperty.class.js";
import Fragment from "./Fragment.class.js";
import Memory from "./Memory.class.js";

class Model{

	#id;
	#loaded;
	#dbObjects;
	#model;

	constructor(id = Utils.getId("forgeModel")){
		this.#id = id;
		this.#loaded = true;
		this.#dbObjects = {};
		this.#model = null;
	}

	load(viewer, path, callback){
		const that = this;
		viewer.loadModel(path, {}, (model)=> {this._onModelLoaded(model, that, callback)});
	}

	setAllMaterials(materialName){
		for(let d in this.#dbObjects){
			this.#dbObjects[d].setAllMaterials(materialName);
		}
	}

	_onModelLoaded(model, that, callback){

		this.#model = model;

    	function userFunction(pdb, tab) {

    		/*pdb.enumAttributes(function(i, attrDef, attrRaw){
    			arr[i] = attrDef.name, attrRaw;
    			console.log(attrDef.nam, attrRaw);
		    });*/
		   	
    		pdb.enumObjects(function(dbId){
    			const properties  = pdb.getObjectProperties(dbId);
    			tab[dbId] = {
    				dbId : dbId,
    				name : properties.name,
    				properties : properties.properties
    			}
			});

    		return tab;

		};

		model.getPropertyDb().executeUserFunction(userFunction, [])
			.then(function(dbObjects){

				const ifcBuildingElements = [
					"IFCBUILDINGELEMENTPROXY", //Pas sur
					"IFCCOVERING", //2
					"IFCBEAM", // Pas sur
					"IFCOLUMN", // Pas sur
					"IFCCURTAINWALL", // Pas sur
					"IFCDOOR", //2 (attention c'est le début d'autres mots)
					"IFCMEMBER", // Pas sur
					"IFCRAILING", // Pas sur
					"IFCRAMP", // Pas sur
					"IFCRAMPFLIGHT", //Pas sur
					"IFCWALL", //Pas sur
					"IFCWALLSTANDARDCASE", //2
					"IFCSLAB",  //2
					"IFCSTAIRFLIGHT",// Pas sur
					"IFCWINDOW", //2
					"IFCSTAIR", // Pas sur
					"IFCROOF", // 2
					"IFCPILE", // Pas sur
					"IFCFOOTING", // Pas sur
					"IFCBUILDINGELEMENTCOMPONENT", // Pas sur
					"IFCPLATE", // Pas sur
					"IFCSTAIR"
				];

				for(let d in dbObjects){

					let isVisible = false;
					for(let p in dbObjects[d].properties){
						if(dbObjects[d].properties[p].displayName == "Type" && ifcBuildingElements.includes(dbObjects[d].properties[p].displayValue)) isVisible = true;
					}
					if(isVisible){

						//IFC Props
						that.#dbObjects[dbObjects[d].dbId] = new ForgeObject(dbObjects[d].dbId);
						that.#dbObjects[dbObjects[d].dbId].setModel(that.#model);
						for(let p in dbObjects[d].properties){
							const property = new IFCProperty(dbObjects[d].properties[p].displayName, dbObjects[d].properties[p]);
							that.#dbObjects[dbObjects[d].dbId].addProperty(property);
						}

						//Materials / Fragments
						const tree = model.getInstanceTree();
						tree.enumNodeFragments(dbObjects[d].dbId, (node)=>{
			    			const material  = model.getFragmentList().getMaterial(node);
			    			Memory.addMaterial(material);
			    			const fragment = new Fragment(node, material);
							that.#dbObjects[dbObjects[d].dbId].addFragment(fragment);
							fragment.setModel(model);
			    		}, true);
					}
				}

				//Temporaire
				callback();

			})
			.catch(function(err){
			  console.log("Something didn't go right...")
			  console.log(err);
			});

	}
}
export default Model;