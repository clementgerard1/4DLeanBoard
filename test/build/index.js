/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./test/src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./test/src/index.js":
/*!***************************!*\
  !*** ./test/src/index.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var test1 = __webpack_require__(/*! ./test1/test1.js */ \"./test/src/test1/test1.js\");\n\nvar test2 = __webpack_require__(/*! ./test2/test2.js */ \"./test/src/test2/test2.js\");\n\nfor (var n in window.boardClasses) {\n  eval(\"window.\" + n + \" = window.boardClasses[n];\");\n}\n\nvar str = window.location.href.split(\"/\");\n\nif (str[str.length - 1] != \"\") {\n  eval(str[str.length - 1] + \"()\");\n} else if (str[str.length - 2] != \"\" && str[str.length - 2] != \"localhost:3000\") {\n  eval(str[str.length - 2] + \"()\");\n}\n\n//# sourceURL=webpack:///./test/src/index.js?");

/***/ }),

/***/ "./test/src/test1/test1.js":
/*!*********************************!*\
  !*** ./test/src/test1/test1.js ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = function () {\n  window.addEventListener(\"load\", function () {\n    init();\n  });\n};\n\nvar events = {\n  \"click\": false,\n  \"mousedown\": false,\n  \"mouseup\": false,\n  \"mousemove\": false,\n  \"touchstart\": true,\n  \"touchend\": false,\n  \"touchmove\": false\n};\n\nfunction init() {\n  var body = document.getElementsByTagName(\"body\")[0];\n\n  var _loop = function _loop(e) {\n    var c = document.createElement(\"div\");\n    c.classList.add(\"control\");\n    var check = document.createElement(\"input\");\n    check.type = \"checkbox\";\n    check.checked = events[e];\n    var label = document.createElement(\"div\");\n    label.innerHTML = e;\n    c.appendChild(check);\n    c.appendChild(label);\n\n    var eventFunc = function eventFunc(event) {\n      log(event, e);\n    }; //Add EventListeners\n\n\n    if (events[e]) {\n      body.addEventListener(e, eventFunc);\n    }\n\n    check.addEventListener(\"change\", function () {\n      events[e] = !events[e];\n\n      if (events[e]) {\n        body.addEventListener(e, eventFunc);\n      } else {\n        body.removeEventListener(e, eventFunc);\n      }\n    });\n    document.getElementById(\"controls\").appendChild(c);\n  };\n\n  for (var e in events) {\n    _loop(e);\n  }\n}\n\nfunction log(event, message) {\n  if (eval(\"typeof \" + message + \" === 'function'\")) {\n    message = eval(message + \"(event, message)\");\n  }\n\n  var p = document.createElement(\"p\");\n  p.innerHTML = message;\n  p.classList.add(\"log\");\n  document.getElementById(\"content\").appendChild(p);\n}\n\nfunction click(event, message) {\n  return message + \" X : \" + event.clientX + \" Y : \" + event.clientY;\n}\n\nfunction mouse(event, message) {\n  return message + \" X : \" + event.clientX + \" Y : \" + event.clientY;\n}\n\nfunction mousemove(event, message) {\n  return mouse(event, message);\n}\n\nfunction mousedown(event, message) {\n  return mouse(event, message);\n}\n\nfunction mouseup(event, message) {\n  return mouse(event, message);\n}\n\nfunction touch(event, message) {\n  var mes = message + \"<br/>\";\n\n  for (var t in event.changedTouches) {\n    if (typeof event.changedTouches[t].identifier != \"undefined\") {\n      mes += \"TouchId : \" + event.changedTouches[t].identifier;\n      mes += \" ; X : \" + event.changedTouches[t].clientX;\n      mes += \" ; Y : \" + event.changedTouches[t].clientY;\n      mes += \"<br/>\";\n    }\n  }\n\n  return mes;\n}\n\nfunction touchstart(event, message) {\n  return touch(event, message);\n}\n\nfunction touchend(event, message) {\n  console.log(event, message);\n  return touch(event, message);\n}\n\nfunction touchmove(event, message) {\n  return touch(event, message);\n}\n\n//# sourceURL=webpack:///./test/src/test1/test1.js?");

/***/ }),

/***/ "./test/src/test2/test2.js":
/*!*********************************!*\
  !*** ./test/src/test2/test2.js ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = function () {\n  window.addEventListener(\"load\", function () {\n    init();\n  });\n};\n\nfunction init() {}\n\n//# sourceURL=webpack:///./test/src/test2/test2.js?");

/***/ })

/******/ });