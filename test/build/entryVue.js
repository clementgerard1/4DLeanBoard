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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/components/entry.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/css-loader/dist/cjs.js!./src/components/V_task.css":
/*!*************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/components/V_task.css ***!
  \*************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// Imports\nvar ___CSS_LOADER_API_IMPORT___ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ \"./node_modules/css-loader/dist/runtime/api.js\");\nexports = ___CSS_LOADER_API_IMPORT___(false);\nexports.push([module.i, \"@import url(https://fonts.googleapis.com/css?family=Oswald);\"]);\n// Module\nexports.push([module.i, \".task{\\n\\twidth : 100%;\\n\\theight : 100%;\\n\\tmin-height : 188px;\\n\\tmargin-bottom : 5px;\\n}\", \"\"]);\n// Exports\nmodule.exports = exports;\n\n\n//# sourceURL=webpack:///./src/components/V_task.css?./node_modules/css-loader/dist/cjs.js");

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/api.js":
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\n/*\n  MIT License http://www.opensource.org/licenses/mit-license.php\n  Author Tobias Koppers @sokra\n*/\n// css base code, injected by the css-loader\n// eslint-disable-next-line func-names\nmodule.exports = function (useSourceMap) {\n  var list = []; // return the list of modules as css string\n\n  list.toString = function toString() {\n    return this.map(function (item) {\n      var content = cssWithMappingToString(item, useSourceMap);\n\n      if (item[2]) {\n        return \"@media \".concat(item[2], \" {\").concat(content, \"}\");\n      }\n\n      return content;\n    }).join('');\n  }; // import a list of modules into the list\n  // eslint-disable-next-line func-names\n\n\n  list.i = function (modules, mediaQuery, dedupe) {\n    if (typeof modules === 'string') {\n      // eslint-disable-next-line no-param-reassign\n      modules = [[null, modules, '']];\n    }\n\n    var alreadyImportedModules = {};\n\n    if (dedupe) {\n      for (var i = 0; i < this.length; i++) {\n        // eslint-disable-next-line prefer-destructuring\n        var id = this[i][0];\n\n        if (id != null) {\n          alreadyImportedModules[id] = true;\n        }\n      }\n    }\n\n    for (var _i = 0; _i < modules.length; _i++) {\n      var item = [].concat(modules[_i]);\n\n      if (dedupe && alreadyImportedModules[item[0]]) {\n        // eslint-disable-next-line no-continue\n        continue;\n      }\n\n      if (mediaQuery) {\n        if (!item[2]) {\n          item[2] = mediaQuery;\n        } else {\n          item[2] = \"\".concat(mediaQuery, \" and \").concat(item[2]);\n        }\n      }\n\n      list.push(item);\n    }\n  };\n\n  return list;\n};\n\nfunction cssWithMappingToString(item, useSourceMap) {\n  var content = item[1] || ''; // eslint-disable-next-line prefer-destructuring\n\n  var cssMapping = item[3];\n\n  if (!cssMapping) {\n    return content;\n  }\n\n  if (useSourceMap && typeof btoa === 'function') {\n    var sourceMapping = toComment(cssMapping);\n    var sourceURLs = cssMapping.sources.map(function (source) {\n      return \"/*# sourceURL=\".concat(cssMapping.sourceRoot || '').concat(source, \" */\");\n    });\n    return [content].concat(sourceURLs).concat([sourceMapping]).join('\\n');\n  }\n\n  return [content].join('\\n');\n} // Adapted from convert-source-map (MIT)\n\n\nfunction toComment(sourceMap) {\n  // eslint-disable-next-line no-undef\n  var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));\n  var data = \"sourceMappingURL=data:application/json;charset=utf-8;base64,\".concat(base64);\n  return \"/*# \".concat(data, \" */\");\n}\n\n//# sourceURL=webpack:///./node_modules/css-loader/dist/runtime/api.js?");

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":
/*!****************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar isOldIE = function isOldIE() {\n  var memo;\n  return function memorize() {\n    if (typeof memo === 'undefined') {\n      // Test for IE <= 9 as proposed by Browserhacks\n      // @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805\n      // Tests for existence of standard globals is to allow style-loader\n      // to operate correctly into non-standard environments\n      // @see https://github.com/webpack-contrib/style-loader/issues/177\n      memo = Boolean(window && document && document.all && !window.atob);\n    }\n\n    return memo;\n  };\n}();\n\nvar getTarget = function getTarget() {\n  var memo = {};\n  return function memorize(target) {\n    if (typeof memo[target] === 'undefined') {\n      var styleTarget = document.querySelector(target); // Special case to return head of iframe instead of iframe itself\n\n      if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {\n        try {\n          // This will throw an exception if access to iframe is blocked\n          // due to cross-origin restrictions\n          styleTarget = styleTarget.contentDocument.head;\n        } catch (e) {\n          // istanbul ignore next\n          styleTarget = null;\n        }\n      }\n\n      memo[target] = styleTarget;\n    }\n\n    return memo[target];\n  };\n}();\n\nvar stylesInDom = [];\n\nfunction getIndexByIdentifier(identifier) {\n  var result = -1;\n\n  for (var i = 0; i < stylesInDom.length; i++) {\n    if (stylesInDom[i].identifier === identifier) {\n      result = i;\n      break;\n    }\n  }\n\n  return result;\n}\n\nfunction modulesToDom(list, options) {\n  var idCountMap = {};\n  var identifiers = [];\n\n  for (var i = 0; i < list.length; i++) {\n    var item = list[i];\n    var id = options.base ? item[0] + options.base : item[0];\n    var count = idCountMap[id] || 0;\n    var identifier = \"\".concat(id, \" \").concat(count);\n    idCountMap[id] = count + 1;\n    var index = getIndexByIdentifier(identifier);\n    var obj = {\n      css: item[1],\n      media: item[2],\n      sourceMap: item[3]\n    };\n\n    if (index !== -1) {\n      stylesInDom[index].references++;\n      stylesInDom[index].updater(obj);\n    } else {\n      stylesInDom.push({\n        identifier: identifier,\n        updater: addStyle(obj, options),\n        references: 1\n      });\n    }\n\n    identifiers.push(identifier);\n  }\n\n  return identifiers;\n}\n\nfunction insertStyleElement(options) {\n  var style = document.createElement('style');\n  var attributes = options.attributes || {};\n\n  if (typeof attributes.nonce === 'undefined') {\n    var nonce =  true ? __webpack_require__.nc : undefined;\n\n    if (nonce) {\n      attributes.nonce = nonce;\n    }\n  }\n\n  Object.keys(attributes).forEach(function (key) {\n    style.setAttribute(key, attributes[key]);\n  });\n\n  if (typeof options.insert === 'function') {\n    options.insert(style);\n  } else {\n    var target = getTarget(options.insert || 'head');\n\n    if (!target) {\n      throw new Error(\"Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.\");\n    }\n\n    target.appendChild(style);\n  }\n\n  return style;\n}\n\nfunction removeStyleElement(style) {\n  // istanbul ignore if\n  if (style.parentNode === null) {\n    return false;\n  }\n\n  style.parentNode.removeChild(style);\n}\n/* istanbul ignore next  */\n\n\nvar replaceText = function replaceText() {\n  var textStore = [];\n  return function replace(index, replacement) {\n    textStore[index] = replacement;\n    return textStore.filter(Boolean).join('\\n');\n  };\n}();\n\nfunction applyToSingletonTag(style, index, remove, obj) {\n  var css = remove ? '' : obj.media ? \"@media \".concat(obj.media, \" {\").concat(obj.css, \"}\") : obj.css; // For old IE\n\n  /* istanbul ignore if  */\n\n  if (style.styleSheet) {\n    style.styleSheet.cssText = replaceText(index, css);\n  } else {\n    var cssNode = document.createTextNode(css);\n    var childNodes = style.childNodes;\n\n    if (childNodes[index]) {\n      style.removeChild(childNodes[index]);\n    }\n\n    if (childNodes.length) {\n      style.insertBefore(cssNode, childNodes[index]);\n    } else {\n      style.appendChild(cssNode);\n    }\n  }\n}\n\nfunction applyToTag(style, options, obj) {\n  var css = obj.css;\n  var media = obj.media;\n  var sourceMap = obj.sourceMap;\n\n  if (media) {\n    style.setAttribute('media', media);\n  } else {\n    style.removeAttribute('media');\n  }\n\n  if (sourceMap && btoa) {\n    css += \"\\n/*# sourceMappingURL=data:application/json;base64,\".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), \" */\");\n  } // For old IE\n\n  /* istanbul ignore if  */\n\n\n  if (style.styleSheet) {\n    style.styleSheet.cssText = css;\n  } else {\n    while (style.firstChild) {\n      style.removeChild(style.firstChild);\n    }\n\n    style.appendChild(document.createTextNode(css));\n  }\n}\n\nvar singleton = null;\nvar singletonCounter = 0;\n\nfunction addStyle(obj, options) {\n  var style;\n  var update;\n  var remove;\n\n  if (options.singleton) {\n    var styleIndex = singletonCounter++;\n    style = singleton || (singleton = insertStyleElement(options));\n    update = applyToSingletonTag.bind(null, style, styleIndex, false);\n    remove = applyToSingletonTag.bind(null, style, styleIndex, true);\n  } else {\n    style = insertStyleElement(options);\n    update = applyToTag.bind(null, style, options);\n\n    remove = function remove() {\n      removeStyleElement(style);\n    };\n  }\n\n  update(obj);\n  return function updateStyle(newObj) {\n    if (newObj) {\n      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap) {\n        return;\n      }\n\n      update(obj = newObj);\n    } else {\n      remove();\n    }\n  };\n}\n\nmodule.exports = function (list, options) {\n  options = options || {}; // Force single-tag solution on IE6-9, which has a hard limit on the # of <style>\n  // tags it will allow on a page\n\n  if (!options.singleton && typeof options.singleton !== 'boolean') {\n    options.singleton = isOldIE();\n  }\n\n  list = list || [];\n  var lastIdentifiers = modulesToDom(list, options);\n  return function update(newList) {\n    newList = newList || [];\n\n    if (Object.prototype.toString.call(newList) !== '[object Array]') {\n      return;\n    }\n\n    for (var i = 0; i < lastIdentifiers.length; i++) {\n      var identifier = lastIdentifiers[i];\n      var index = getIndexByIdentifier(identifier);\n      stylesInDom[index].references--;\n    }\n\n    var newLastIdentifiers = modulesToDom(newList, options);\n\n    for (var _i = 0; _i < lastIdentifiers.length; _i++) {\n      var _identifier = lastIdentifiers[_i];\n\n      var _index = getIndexByIdentifier(_identifier);\n\n      if (stylesInDom[_index].references === 0) {\n        stylesInDom[_index].updater();\n\n        stylesInDom.splice(_index, 1);\n      }\n    }\n\n    lastIdentifiers = newLastIdentifiers;\n  };\n};\n\n//# sourceURL=webpack:///./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js?");

/***/ }),

/***/ "./src/components/V_onePage.vue":
/*!**************************************!*\
  !*** ./src/components/V_onePage.vue ***!
  \**************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\n\tdata : function(){\n\t\treturn {\n\t\t\tcount : 0,\n\t\t}\n\t},\n\ttemplate : `\n\t\t<div>\n\t\t\t<p>OnePage</p>\n\t\t\t<one-page></one-page>\n\t\t</div>\n\t`,\n\n});\n\n//# sourceURL=webpack:///./src/components/V_onePage.vue?");

/***/ }),

/***/ "./src/components/V_player.vue":
/*!*************************************!*\
  !*** ./src/components/V_player.vue ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\n\tdata : function(){\n\t\treturn {\n\t\t\tcount : 0,\n\t\t}\n\t},\n\ttemplate : '',\n});\n\n//# sourceURL=webpack:///./src/components/V_player.vue?");

/***/ }),

/***/ "./src/components/V_task.css":
/*!***********************************!*\
  !*** ./src/components/V_task.css ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var api = __webpack_require__(/*! ../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ \"./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js\");\n            var content = __webpack_require__(/*! !../../node_modules/css-loader/dist/cjs.js!./V_task.css */ \"./node_modules/css-loader/dist/cjs.js!./src/components/V_task.css\");\n\n            content = content.__esModule ? content.default : content;\n\n            if (typeof content === 'string') {\n              content = [[module.i, content, '']];\n            }\n\nvar options = {};\n\noptions.insert = \"head\";\noptions.singleton = false;\n\nvar update = api(content, options);\n\n\n\nmodule.exports = content.locals || {};\n\n//# sourceURL=webpack:///./src/components/V_task.css?");

/***/ }),

/***/ "./src/components/V_task.vue":
/*!***********************************!*\
  !*** ./src/components/V_task.vue ***!
  \***********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _assets_task_svg__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./assets/task.svg */ \"./src/components/assets/task.svg\");\n/* harmony import */ var _assets_task_svg__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_assets_task_svg__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _V_task_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./V_task.css */ \"./src/components/V_task.css\");\n/* harmony import */ var _V_task_css__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_V_task_css__WEBPACK_IMPORTED_MODULE_1__);\n\n\n\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\n\tdata : function(){\n\t\treturn {\n\t\t\t\"tid\" : \"TID\",\n\t\t\t\"dr\" : \"DR\",\n\t\t\t\"taskName\" : \"TaskName\",\n\t\t\t\"taskTeam\" : \"TaskTeam\",\n\t\t\t\"r1\" : false, \n\t\t\t\"r2\" : false,\n\t\t\t\"r3\" : false,\n\t\t\t\"r4\" : false,\n\t\t\t\"r5\" : false,\n\t\t\t\"r6\" : false,\n\t\t\t\"r7\" : false,\n\t\t\t\"notEmpty\" : true\n\t\t}\n\t},\n\ttemplate : '<div class=\"task\">' + _assets_task_svg__WEBPACK_IMPORTED_MODULE_0___default.a + '</div>',\n});\n\n//# sourceURL=webpack:///./src/components/V_task.vue?");

/***/ }),

/***/ "./src/components/assets/task.svg":
/*!****************************************!*\
  !*** ./src/components/assets/task.svg ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<svg viewBox=\\\"0 0 188 188\\\" fill=\\\"none\\\" xmlns=\\\"http://www.w3.org/2000/svg\\\"><g filter=\\\"url(#filter0_d)\\\"><path d=\\\"M4 32H184V170C184 175.523 179.523 180 174 180H14C8.47716 180 4 175.523 4 170V32Z\\\" fill=\\\"white\\\"></path><rect x=\\\"8.93335\\\" y=\\\"35\\\" width=\\\"170.133\\\" height=\\\"45\\\" rx=\\\"3\\\" fill=\\\"white\\\"></rect><text fill=\\\"black\\\" xml:space=\\\"preserve\\\" style=\\\"white-space: pre\\\" font-family=\\\"Oswald\\\" font-size=\\\"36\\\" font-weight=\\\"500\\\" letter-spacing=\\\"0em\\\"><tspan x=\\\"10\\\" y=\\\"72.272\\\">TaskName</tspan></text><rect x=\\\"4\\\" width=\\\"180\\\" height=\\\"32\\\" fill=\\\"#E2D46B\\\"></rect><text fill=\\\"black\\\" xml:space=\\\"preserve\\\" style=\\\"white-space: pre\\\" font-family=\\\"Oswald\\\" font-size=\\\"24\\\" font-weight=\\\"300\\\" letter-spacing=\\\"0em\\\"><tspan x=\\\"11\\\" y=\\\"26.848\\\">TID</tspan></text><rect x=\\\"137.5\\\" y=\\\"163.5\\\" width=\\\"9\\\" height=\\\"9\\\" rx=\\\"4.5\\\" fill=\\\"white\\\" stroke=\\\"black\\\"></rect><rect x=\\\"127.5\\\" y=\\\"163.5\\\" width=\\\"9\\\" height=\\\"9\\\" rx=\\\"4.5\\\" fill=\\\"white\\\" stroke=\\\"black\\\"></rect><rect x=\\\"117.5\\\" y=\\\"163.5\\\" width=\\\"9\\\" height=\\\"9\\\" rx=\\\"4.5\\\" fill=\\\"white\\\" stroke=\\\"black\\\"></rect><rect x=\\\"107.5\\\" y=\\\"163.5\\\" width=\\\"9\\\" height=\\\"9\\\" rx=\\\"4.5\\\" fill=\\\"white\\\" stroke=\\\"black\\\"></rect><rect x=\\\"97.5\\\" y=\\\"163.5\\\" width=\\\"9\\\" height=\\\"9\\\" rx=\\\"4.5\\\" fill=\\\"white\\\" stroke=\\\"black\\\"></rect><rect x=\\\"77.5\\\" y=\\\"163.5\\\" width=\\\"9\\\" height=\\\"9\\\" rx=\\\"4.5\\\" fill=\\\"white\\\" stroke=\\\"black\\\"></rect><rect x=\\\"87.5\\\" y=\\\"163.5\\\" width=\\\"9\\\" height=\\\"9\\\" rx=\\\"4.5\\\" fill=\\\"white\\\" stroke=\\\"black\\\"></rect><g filter=\\\"url(#filter1_d)\\\"><circle cx=\\\"163\\\" cy=\\\"160\\\" r=\\\"14.5\\\" fill=\\\"white\\\" stroke=\\\"black\\\" stroke-width=\\\"3\\\"></circle></g><path d=\\\"M9 144H41V173C41 174.657 39.6569 176 38 176H12C10.3431 176 9 174.657 9 173V144Z\\\" fill=\\\"#6C8CBF\\\"></path><path d=\\\"M10 146.4L13 144.6C13.0122 144.593 13.0244 144.586 13.0367 144.579C13.4706 144.354 14 144.667 14 145.166L14 145.2L14 148.8L14 148.834C14 149.335 13.4663 149.649 13.0314 149.418C13.0209 149.412 13.0104 149.406 13 149.4L10 147.6C9.54705 147.328 9.54705 146.672 10 146.4Z\\\" fill=\\\"white\\\"></path><g filter=\\\"url(#filter2_d)\\\"><circle cx=\\\"25\\\" cy=\\\"160\\\" r=\\\"12\\\" fill=\\\"white\\\"></circle><circle cx=\\\"25\\\" cy=\\\"160\\\" r=\\\"11.5\\\" stroke=\\\"black\\\"></circle></g><text fill=\\\"black\\\" xml:space=\\\"preserve\\\" style=\\\"white-space: pre\\\" font-family=\\\"Oswald\\\" font-size=\\\"24\\\" font-weight=\\\"300\\\" letter-spacing=\\\"0em\\\"><tspan x=\\\"145.602\\\" y=\\\"26.848\\\">DR</tspan></text><text fill=\\\"black\\\" xml:space=\\\"preserve\\\" style=\\\"white-space: pre\\\" font-family=\\\"Oswald\\\" font-size=\\\"24\\\" font-weight=\\\"300\\\" letter-spacing=\\\"0em\\\"><tspan x=\\\"10\\\" y=\\\"109.848\\\">TaskTeam</tspan></text></g><defs><filter id=\\\"filter0_d\\\" x=\\\"0\\\" y=\\\"0\\\" width=\\\"188\\\" height=\\\"188\\\" filterUnits=\\\"userSpaceOnUse\\\" color-interpolation-filters=\\\"sRGB\\\"><feFlood flood-opacity=\\\"0\\\" result=\\\"BackgroundImageFix\\\"></feFlood><feColorMatrix in=\\\"SourceAlpha\\\" type=\\\"matrix\\\" values=\\\"0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0\\\"></feColorMatrix><feOffset dy=\\\"4\\\"></feOffset><feGaussianBlur stdDeviation=\\\"2\\\"></feGaussianBlur><feColorMatrix type=\\\"matrix\\\" values=\\\"0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0\\\"></feColorMatrix><feBlend mode=\\\"normal\\\" in2=\\\"BackgroundImageFix\\\" result=\\\"effect1_dropShadow\\\"></feBlend><feBlend mode=\\\"normal\\\" in=\\\"SourceGraphic\\\" in2=\\\"effect1_dropShadow\\\" result=\\\"shape\\\"></feBlend></filter><filter id=\\\"filter1_d\\\" x=\\\"143\\\" y=\\\"144\\\" width=\\\"40\\\" height=\\\"40\\\" filterUnits=\\\"userSpaceOnUse\\\" color-interpolation-filters=\\\"sRGB\\\"><feFlood flood-opacity=\\\"0\\\" result=\\\"BackgroundImageFix\\\"></feFlood><feColorMatrix in=\\\"SourceAlpha\\\" type=\\\"matrix\\\" values=\\\"0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0\\\"></feColorMatrix><feOffset dy=\\\"4\\\"></feOffset><feGaussianBlur stdDeviation=\\\"2\\\"></feGaussianBlur><feColorMatrix type=\\\"matrix\\\" values=\\\"0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0\\\"></feColorMatrix><feBlend mode=\\\"normal\\\" in2=\\\"BackgroundImageFix\\\" result=\\\"effect1_dropShadow\\\"></feBlend><feBlend mode=\\\"normal\\\" in=\\\"SourceGraphic\\\" in2=\\\"effect1_dropShadow\\\" result=\\\"shape\\\"></feBlend></filter><filter id=\\\"filter2_d\\\" x=\\\"9\\\" y=\\\"148\\\" width=\\\"32\\\" height=\\\"32\\\" filterUnits=\\\"userSpaceOnUse\\\" color-interpolation-filters=\\\"sRGB\\\"><feFlood flood-opacity=\\\"0\\\" result=\\\"BackgroundImageFix\\\"></feFlood><feColorMatrix in=\\\"SourceAlpha\\\" type=\\\"matrix\\\" values=\\\"0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0\\\"></feColorMatrix><feOffset dy=\\\"4\\\"></feOffset><feGaussianBlur stdDeviation=\\\"2\\\"></feGaussianBlur><feColorMatrix type=\\\"matrix\\\" values=\\\"0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0\\\"></feColorMatrix><feBlend mode=\\\"normal\\\" in2=\\\"BackgroundImageFix\\\" result=\\\"effect1_dropShadow\\\"></feBlend><feBlend mode=\\\"normal\\\" in=\\\"SourceGraphic\\\" in2=\\\"effect1_dropShadow\\\" result=\\\"shape\\\"></feBlend></filter></defs></svg>\"\n\n//# sourceURL=webpack:///./src/components/assets/task.svg?");

/***/ }),

/***/ "./src/components/entry.js":
/*!*********************************!*\
  !*** ./src/components/entry.js ***!
  \*********************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _V_onePage_vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./V_onePage.vue */ \"./src/components/V_onePage.vue\");\n/* harmony import */ var _V_player_vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./V_player.vue */ \"./src/components/V_player.vue\");\n/* harmony import */ var _V_task_vue__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./V_task.vue */ \"./src/components/V_task.vue\");\n\n\n //Allow tests access classes\n\nwindow.vueClasses = {\n  V_onePage: _V_onePage_vue__WEBPACK_IMPORTED_MODULE_0__[\"default\"],\n  V_player: _V_player_vue__WEBPACK_IMPORTED_MODULE_1__[\"default\"],\n  V_task: _V_task_vue__WEBPACK_IMPORTED_MODULE_2__[\"default\"]\n};\n\n//# sourceURL=webpack:///./src/components/entry.js?");

/***/ })

/******/ });