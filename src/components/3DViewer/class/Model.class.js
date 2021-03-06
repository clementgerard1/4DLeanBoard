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
	#name;
	#hide;
	#style;
	#properties;
	#callback;


	constructor(id = Utils.getId("forgeModel")){
		this.#id = id;
		this.#treeLoaded = false;
		this.#modelLoaded = false;
		this.#dbObjects = {};
		this.#model = null;
		this.#planningObjects = null;
		this.#viewer = null;
		this.#name = null;
		this.#hide = false;
		this.#style = null;
		this.#properties = null;
	}

	setEdgeStyle(stg){

	}

	load(viewer, style, path, objs, properties, callback){

		const that = this;
		this.#style = style;
		this.#planningObjects = objs;
		this.#viewer = viewer;
		this.#callback = callback;
		this.#properties = properties;
		this.#viewer.addEventListener(Autodesk.Viewing.OBJECT_TREE_CREATED_EVENT, () => { this._onTreeLoaded(this, this.#id) });
		//console.log(path);
		viewer.loadModel(path, {
            keepCurrentModels: true,
            globalOffset: {x:0,y:0,z:0},
            isAEC:true,
		}, (model)=> {this._onModelLoaded(model, that)});
	}

	getId(){
		return this.#id;
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

	isShown(){
		return !this.#hide;
	}

	_allLoaded(that){


		Memory.addEdgeStyle(that.#style, that.#model);

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

					//console.log(dbObjects[d].properties);
					// for(let p in dbObjects[d].properties){
					// 	for(let t in dbObjects[d].properties[p]){
					// 		console.log(p, t, dbObjects[d].properties[p][t]);
					// 		if(dbObjects[d].properties[p][t] == "IFCPROPERTYSINGLEVALUE") console.log("HEY");
					// 		if(dbObjects[d].properties[p][t] == "temporary") console.log("Temp");
					// 	}
					// }
					//Disable on start
					Memory.getViewer().impl.visibilityManager.setNodeOff(dbObjects[d].dbId, true, that.#model);


						let isVisible = false;
						for(let p in dbObjects[d].properties){
							if(dbObjects[d].properties[p].displayName == "Icon" && dbObjects[d].properties[p].displayValue == "Geometry") isVisible = true;
						}
						if(isVisible){



							
							// if(Math.random() > 0.01){
							// 	that.#viewer.impl.visibilityManager.setNodeOff(dbObjects[d].dbId, true, that.#model);
							// }
							//IFC Props
							const tag = that.getIFCTag(dbObjects, d);
							const nameDone = false;

							that.#dbObjects[dbObjects[d].dbId] = new ForgeObject(dbObjects[d].dbId, that.#model);
							//that.#viewer.impl.highlightObjectNode(that.#model, dbObjects[d].dbId, true, false);
						

							// if(typeof ifcId2Obj3D[tag] == "undefined"){
							// 	that.#viewer.lockSelection(dbObjects[d].dbId, true, that.#model);
							// }

							// if(typeof ifcId2Obj3D[tag] == "undefined"){
							// 	that.#viewer.lockSelection(dbObjects[d].dbId, true, that.#model);
							// }else{
							// 	that.#viewer.unlockSelection(dbObjects[d].dbId, that.#model);
							// }

							if(that.#style == null){

								//that.#dbObjects[dbObjects[d].dbId].setModel(that.#model);
								if(typeof ifcId2Obj3D[tag] != "undefined"){
									that.#dbObjects[dbObjects[d].dbId].setObject3D(ifcId2Obj3D[tag]);
									that.#dbObjects[dbObjects[d].dbId].isLinked(true);
									ifcId2Obj3D[tag].addForgeObject(that.#dbObjects[dbObjects[d].dbId]);
									Memory.addForgeObject(that.#dbObjects[dbObjects[d].dbId], true);

									for(let p in dbObjects[d].properties){
										if(!nameDone && dbObjects[d].properties[p].displayName == "Source File"){
											const toSplit = dbObjects[d].properties[p].displayValue.split("_");
											const namee = toSplit[toSplit.length - 1].replace(".ifc", "");
											that.setName(namee.charAt(0).toUpperCase() + namee.slice(1));
										}
										if(dbObjects[d].properties[p].displayName == "Layer") Memory.addLayer(dbObjects[d].properties[p].displayValue);
										const property = new IFCProperty(dbObjects[d].properties[p].displayName, dbObjects[d].properties[p]);
										that.#dbObjects[dbObjects[d].dbId].addProperty(property);
									}

									//ExtractProperties
									if(typeof that.#properties[tag] != "undefined"){
										const props = that.#properties[tag].props;
										for(let pr in props){
											 const property = new IFCProperty("ext-" + props[pr][1], props[pr][2]);
											 that.#dbObjects[dbObjects[d].dbId].addProperty(property);
										}
									}else{
										//console.log(tag);
									}
									//console.log(prop);

								}else{
									for(let p in dbObjects[d].properties){
										if(!nameDone && dbObjects[d].properties[p].displayName == "Source File"){
											const toSplit = dbObjects[d].properties[p].displayValue.split("_");
											const namee = toSplit[toSplit.length - 1].replace(".ifc", "");
											that.setName(namee.charAt(0).toUpperCase() + namee.slice(1));
										}
									}

									for(let p in dbObjects[d].properties){
										if(!nameDone && dbObjects[d].properties[p].displayName == "Source File"){
											const toSplit = dbObjects[d].properties[p].displayValue.split("_");
											const namee = toSplit[toSplit.length - 1].replace(".ifc", "");
											that.setName(namee.charAt(0).toUpperCase() + namee.slice(1));
										}
										if(dbObjects[d].properties[p].displayName == "Layer") Memory.addLayer(dbObjects[d].properties[p].displayValue);
										const property = new IFCProperty(dbObjects[d].properties[p].displayName, dbObjects[d].properties[p]);
										that.#dbObjects[dbObjects[d].dbId].addProperty(property);
									}

									that.#dbObjects[dbObjects[d].dbId].isLinked(false);
									//that.#dbObjects[dbObjects[d].dbId].setColor(true, new THREE.Vector4(1, 1, 1, 1));
									// <that.#viewer.lockSelection(dbObjects[d].dbId, true, that.#model)
									Memory.addForgeObject(that.#dbObjects[dbObjects[d].dbId], false);
								}

								//Materials / Fragments
								const tree = that.#model.getInstanceTree();
								tree.enumNodeFragments(dbObjects[d].dbId, (node)=>{
					    		const material  = that.#model.getFragmentList().getMaterial(node);

									Memory.addMaterial(material);

									if(typeof material != "undefined"){
						    			const ignoredMaterial = new THREE.MeshBasicMaterial({
										    reflectivity: 0.0,
										    flatShading: true,
											transparent: true,
											opacity: 0.5,
										    color: "#FFFFFF",
										});
										const in6WeeksMaterial = new THREE.MeshBasicMaterial({
										    reflectivity: 0.0,
										    flatShading: true,
											transparent: true,
											opacity: 0.45,
										    color: "#FFFFFF",
										});

										const darkness = 0.55;
										ignoredMaterial.color = {
									    	r: material.color.r,/*  * darkness, */ 
						    				g: material.color.g,/*  * darkness, */ 
						    				b: material.color.b,/*  * (darkness + 0.1) */
										}
										in6WeeksMaterial.color = {
									    	r: material.color.r, 
						    				g: material.color.g,
						    				b: material.color.b,
										}
										in6WeeksMaterial.reflectivity = 1;
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
										in6WeeksMaterial.needsUpdate = true;

						    			const fragment = new Fragment(node, material, ignoredMaterial, in6WeeksMaterial);
										that.#dbObjects[dbObjects[d].dbId].addFragment(fragment);
										fragment.setModel(that.#model);
										Memory.addMaterial(ignoredMaterial, true, "ignored-" + material.id);
										Memory.addMaterial(in6WeeksMaterial, true, "in6Weeks-" + material.id);


										//const clone = that.cloneOriginalMaterial(material);
										//console.log("1",clone.id);
										//Memory.addMaterial(clone, true, material.id + "-cloned");
										//that.#model.getFragmentList().setMaterial(node, clone);
										//console.log("2",that.#model.getFragmentList().getMaterialId(node));
									}
			    			}, true);

							}

					}else{

						//console.log(dbObjects[d].dbId, dbObjects[d].properties);
					}
				
			}

		}).then(function(){
			that.#callback();
		})
		.catch(function(err){
		  console.log("Something didn't go right...")
		  console.log(err);
		});
	}

	setName(name){
		this.#name = name;
	}

	getName(){
		return this.#name;
	}

	hide(bool){
		this.#hide = bool;
		for(let f in this.#dbObjects){
			this.#dbObjects[f].hide(bool);
		}
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
		Memory.addLoadCounter();

		this.#model = model;
		this.#modelLoaded = true;
		if(this.#treeLoaded && this.#modelLoaded){
			this._allLoaded(this);
		}
	}

	cloneOriginalMaterial(material){
		const mat = material.clone();
		mat.bloublou = "BROU";
		mat.cutplanes = material.cutplanes;
		mat.envMapExposure = material.envMapExposure;
		mat.envRotationCos = material.envRotationCos;
		mat.envRotationSin = material.envRotationSin;
		mat.exposureBias = material.exposureBias;
		mat.irradianceMap = material.irradianceMap;
		mat.lol = material.lol;
		mat.mrtIdBuffer = material.mrtIdBuffer;
		mat.mrtNormals = material.mrtNormals;
		mat.packedNormals = material.packedNormals;
		mat.textureMaps = material.textureMaps;
		mat.texturesLoaded = material.texturesLoaded;
		mat.tonemapOutput = material.tonemapOutput;
		mat.vertexIds = material.vertexIds;
		return mat;
	}

	getModel(){
		return this.#model;
	}

}
export default Model;