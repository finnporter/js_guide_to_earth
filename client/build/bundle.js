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
var ApiProcessing = __webpack_require__(2);

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
  var countriesApi = new ApiProcessing(); 
  var countriesInfo = {
    name: countriesApi.getCountryNames(countries),
    stats: countriesApi.processCountriesApi(countries)
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

var MapWrapper = function(countriesInfo) {
  this.countriesInfo = countriesInfo;
  this.options = { sky: true, zoom: 2.0, position: [55.9533, 3.1883] };
  this.earth = new WE.map('earth_div', this.options); 
  this.country = null;
};

MapWrapper.prototype.renderMap = function() {
  WE.tileLayer("http://tileserver.maptiler.com/nasa/{z}/{x}/{y}.jpg", {
    minZoom: 0,
    maxZoom: 5,
    sky:true,
    attribution: "NASA"
  }).addTo(this.earth);
  this.earth.on("click", this.addMarker.bind(this));
};

MapWrapper.prototype.addMarker = function(evt) {
  if (evt.latitude !== null && evt.longitude !== null) {
    var marker = WE.marker([evt.latitude, evt.longitude],'flyingsaucer.png',80,60)
    marker.addTo(this.earth);
      //console.log(this); //console logs long and lat

      this.countriesSearch(evt, marker)
      setTimeout(function() {
        marker.closePopup()
      }, 30000)
    }
  };

  MapWrapper.prototype.fillInfoWindow = function(clickedInfo) {
    console.log(this.countriesInfo)

    for (country of this.countriesInfo.stats) {
      if (country.name === clickedInfo.formatted_address) {
        return  '<h2>' + country.name + '</h2>' + '<br>' +
        '<p>' + 'Population: ' + country.population + '<br>' +
        '<p>' + 'Region: ' + country.region + '<br>' +
        '<p>' + 'Area: ' + country.area + '<br>' +
        '<p>' + 'Nearest City: ' + returnNearCity
        console.log(country)
      }
    }
  };

  MapWrapper.prototype.countriesSearch = function(evt, marker) {
    this.searchCity(evt);
    var geocoder = new google.maps.Geocoder;
    geocoder.geocode({ 'location': evt.latlng}, function(results, status){
      this.country = results.pop()

      marker.bindPopup(this.fillInfoWindow(this.country));
    }.bind(this));
  };

  MapWrapper.prototype.searchCity = function(evt) {
    var url = "https://api.teleport.org/api/locations/" + evt.latitude + "," + evt.longitude;
    this.makeRequest(url, this.requestComplete);
  };

  MapWrapper.prototype.makeRequest = function(url, callback) {
    var request = new XMLHttpRequest();
    request.addEventListener('load', callback);
    request.open("GET", url);
    request.send();
  };

  MapWrapper.prototype.requestComplete = function() {
    if (this.status !== 200) return;

    var jsonString = this.responseText;
    var nearCity = JSON.parse(jsonString);
    returnNearCity = (nearCity._embedded["location:nearest-cities"][0]._links["location:nearest-city"].name);
    return nearCity;
  };

var returnNearCity;

module.exports = MapWrapper;

/***/ }),
/* 2 */
/***/ (function(module, exports) {

var ApiProcessing = function() {
};

ApiProcessing.prototype.getCountryNames = function(countries) {
  var countryNames = [];
  countries.forEach(function(country) {
    countryNames.push(country.name);
  });
  return countryNames;
};

ApiProcessing.prototype.processCountriesApi = function(countries) {
  var countryStats = [];
  countryStats = countries.map(function(country) {
    var reformattedCountry = {};
    reformattedCountry.name = country.name;
    reformattedCountry.area = country.area;
    reformattedCountry.population = country.population;
    reformattedCountry.region = country.region;
    reformattedCountry.borders = country.borders;
    return reformattedCountry;
  });
  console.log(countryStats)
  return countryStats;
};

module.exports = ApiProcessing;

/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map