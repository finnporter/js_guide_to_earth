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
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
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
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

var MapWrapper = __webpack_require__(1);
var ApiProcessing = __webpack_require__(6);

var makeCountriesRequest = function(url, callback) {
  var request = new XMLHttpRequest();

  request.addEventListener('load', callback);

  request.open('GET', url);
  request.send();
};

var requestCountriesComplete = function() {
  if (this.status !== 200) return;

  var jsonString = this.responseText;
  var countries = JSON.parse(jsonString);
  console.log(countries);

  var countriesApi = new ApiProcessing(); 
  
  var countriesInfo = {
  name: countriesApi.getCountryNames(countries),
  area: countriesApi.getCountryArea(countries),
  pop: countriesApi.getCountryPopulation(countries),
  reg: countriesApi.getCountryRegions(countries),
  border: countriesApi.getCountryBorders(countries)
};

  var mainMap = new MapWrapper(countriesInfo);
  mainMap.renderMap();
};

var app = function() {
 var url = 'https://restcountries.eu/rest/v2/all';
 makeCountriesRequest(url, requestCountriesComplete);
};






window.addEventListener('load', app);

/***/ }),
/* 1 */
/***/ (function(module, exports) {

throw new Error("Module build failed: Error: ENOENT: no such file or directory, open '/Users/Finn/e13_workingdir/project_week_javascript/js_guide_to_earth/client/public/mapWrapper.js'");

/***/ }),
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */
/***/ (function(module, exports) {

throw new Error("Module build failed: Error: ENOENT: no such file or directory, open '/Users/Finn/e13_workingdir/project_week_javascript/js_guide_to_earth/client/public/apiProcessing.js'");

/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map