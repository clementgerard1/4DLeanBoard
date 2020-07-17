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
	#planningObjects;

	constructor(id = Utils.getId("forgeModel")){
		this.#id = id;
		this.#loaded = true;
		this.#dbObjects = {};
		this.#model = null;
		this.#planningObjects = null;
	}

	load(viewer, path, objs, callback){
		const that = this;
		this.#planningObjects = objs;
		viewer.loadModel(path, {}, (model)=> {this._onModelLoaded(model, that, callback)});
	}

	setAllMaterials(materialName){
		for(let d in this.#dbObjects){
			this.#dbObjects[d].setAllMaterials(materialName);
		}
	}

	getIFCTag(dbObjects, id){
		if(id == null){
			return null;
		}
		let parent = null;
		for(let p in dbObjects[id].properties){
			const prop = dbObjects[id].properties[p];
			if(prop.displayName == "TAG" && prop.displayCategory == "IFC"){
				return prop.displayValue;
			}else if(prop.displayName == "parent"){
				parent = prop.displayValue;
			}
		}
		return this.getIFCTag(dbObjects, parent);
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

		//Link to planning 
		const ifcId2Obj3D = {};
		for(let p in this.#planningObjects){
			ifcId2Obj3D[this.#planningObjects[p].getIFCId()] = this.#planningObjects[p];
		}

		model.getPropertyDb().executeUserFunction(userFunction, [])
			.then(function(dbObjects){

				for(let d in dbObjects){

					let isVisible = false;
					for(let p in dbObjects[d].properties){
						if(dbObjects[d].properties[p].displayName == "Icon" && dbObjects[d].properties[p].displayValue == "Geometry") isVisible = true;
					}
					if(isVisible){

						//IFC Props
						const tag = that.getIFCTag(dbObjects, d);

						that.#dbObjects[dbObjects[d].dbId] = new ForgeObject(dbObjects[d].dbId);

						if(typeof ifcId2Obj3D[tag] != "undefined"){
							that.#dbObjects[dbObjects[d].dbId].setObject3D(ifcId2Obj3D[tag]);
							ifcId2Obj3D[tag].addForgeObject(that.#dbObjects[dbObjects[d].dbId]);
							Memory.addForgeObject(that.#dbObjects[dbObjects[d].dbId], true);
							that.#dbObjects[dbObjects[d].dbId].setModel(that.#model);
							for(let p in dbObjects[d].properties){
								const property = new IFCProperty(dbObjects[d].properties[p].displayName, dbObjects[d].properties[p]);
								that.#dbObjects[dbObjects[d].dbId].addProperty(property);
							}

						}else{
							Memory.addForgeObject(that.#dbObjects[dbObjects[d].dbId], false);
						}

						//Materials / Fragments
						const tree = model.getInstanceTree();
						tree.enumNodeFragments(dbObjects[d].dbId, (node)=>{
			    			const material  = model.getFragmentList().getMaterial(node);
			    			Memory.addMaterial(material);
			    			const ignoredMaterial = new THREE.MeshBasicMaterial({
							    reflectivity: 0.0,
							    flatShading: true,
							    transparent: false,
							    color: "#FFFFFF",
							});
							const darkness = 0.55;
							ignoredMaterial.color = {
						    	r: material.color.r * darkness, 
			    				g: material.color.g * darkness, 
			    				b: material.color.b * (darkness /*+ 0.1*/)
						    }
			    			const fragment = new Fragment(node, material, ignoredMaterial);
							that.#dbObjects[dbObjects[d].dbId].addFragment(fragment);
							fragment.setModel(model);
			    			Memory.addMaterial(ignoredMaterial, true, "ignored-" + material.id);
			    		}, true);

					}else{

						//console.log(dbObjects[d].dbId, dbObjects[d].properties);
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