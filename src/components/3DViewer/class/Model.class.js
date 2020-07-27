import Utils from "../../../class/Utils.class.js";
import ForgeObject from "./ForgeObject.class.js";
import IFCProperty from "./IFCProperty.class.js";
import Fragment from "./Fragment.class.js";
import Memory from "./Memory.class.js";

class Model{

	#id;
	#treeLoaded;
	#modelLoaded;
	#dbObjects;
	#model;
	#planningObjects;
	#viewer;


	constructor(id = Utils.getId("forgeModel")){
		this.#id = id;
		this.#treeLoaded = false;
		this.#modelLoaded = false;
		this.#dbObjects = {};
		this.#model = null;
		this.#planningObjects = null;
		this.#viewer = null;
	}

	load(viewer, path, objs, callback){
		const that = this;
		this.#planningObjects = objs;
		this.#viewer = viewer;
		this.callback = callback;
		this.#viewer.addEventListener(Autodesk.Viewing.OBJECT_TREE_CREATED_EVENT, () => { this._onTreeLoaded(this, this.#id) });
		viewer.loadModel(path, {}, (model)=> {this._onModelLoaded(model, that)});
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

	_allLoaded(that){

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
			ifcId2Obj3D[this.#planningObjects[p].getIFCId()] = that.#planningObjects[p];
		}
		that.#model.getPropertyDb().executeUserFunction(userFunction, [])
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
						that.#viewer.lockSelection(dbObjects[d].dbId, true, that.#model)
						Memory.addForgeObject(that.#dbObjects[dbObjects[d].dbId], false);
					}

					//Materials / Fragments
					const tree = that.#model.getInstanceTree();
					tree.enumNodeFragments(dbObjects[d].dbId, (node)=>{
		    			const material  = that.#model.getFragmentList().getMaterial(node);
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
					 // 	material.map = null;
					 // 	const ignoredMaterial = new THREE.MeshPhongMaterial({
					 // 		color : new THREE.Color(material.color.r, material.color.g, material.color.b),
					 // 		emissive : new THREE.Color(material.color.r, material.color.g, material.color.b),
					 // 		specular : new THREE.Color(material.color.r, material.color.g, material.color.b),
					 // 		side : THREE.DoubleSide,
					 // 		shininess : 0
					 // 	});
					 	material.needsUpdate = true;
					 	ignoredMaterial.needsUpdate = true;

		    			const fragment = new Fragment(node, material, ignoredMaterial);
						that.#dbObjects[dbObjects[d].dbId].addFragment(fragment);
						fragment.setModel(that.#model);
		    			Memory.addMaterial(ignoredMaterial, true, "ignored-" + material.id);
		    		}, true);

				}else{

					//console.log(dbObjects[d].dbId, dbObjects[d].properties);
				}
			}

		}).then(function(){
			that.callback();
		})
		.catch(function(err){
		  console.log("Something didn't go right...")
		  console.log(err);
		});
	}

	_onTreeLoaded(that, id){
		if(!that.#treeLoaded && id == this.#id){
			that.#treeLoaded = true;
			if(that.#treeLoaded && that.#modelLoaded){
				that._allLoaded(that);
			}
		}
	}

	_onModelLoaded(model, that){

		this.#model = model;
		this.#modelLoaded = true;
		if(this.#treeLoaded && this.#modelLoaded){
			this._allLoaded(this);
		}
	}
}
export default Model;