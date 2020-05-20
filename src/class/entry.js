const Loader = require("./Loader.class.js");
const Utils = require("./Utils.class.js");
const Model = require("./Model.class.js");
const Object4D = require("./Object4D.class.js");
const Task = require("./Task.class.js");
const Phase = require("./Phase.class.js");
const Milestone = require("./Milestone.class.js");

//Allow tests access classes
window.boardClasses = {
	"Loader" : Loader,
	"Utils" : Utils,
	"Model" : Model,
	"Object4D" : Object4D,
	"Task" : Task,
	"Phase" : Phase
}