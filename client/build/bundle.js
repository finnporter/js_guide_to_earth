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
  console.log(countries);

  var countriesApi = new ApiProcessing(); 

  var countriesInfo = {
  name: countriesApi.getCountryNames(countries),
  stats: countriesApi.processCountriesApi(countries)
  // area: countriesApi.getCountryArea(countries),
  // population: countriesApi.getCountryPopulation(countries),
  // region: countriesApi.getCountryRegions(countries),
  // border: countriesApi.getCountryBorders(countries)
};
console.log(countriesInfo);

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
  this.options = { sky: true,zoom: 2.0, position: [55.9533, 3.1883] };
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
    var marker = WE.marker([evt.latitude, evt.longitude], 'http://clipart-finder.com/data/mini/10-flying_saucer_2.png', 50, 12).addTo(this.earth);

    console.log(this) //console logs long and lat

    this.countriesSearch(evt, marker)
    setTimeout(function() {
      marker.closePopup()
    }, 30000)
  }
};

MapWrapper.prototype.fillInfoWindow = function(info) {
  // console.log(this.countryInfo.name)
  console.log(this.countriesInfo.name)
  for (country of this.countriesInfo.name) {
    if (country === info.formatted_address) {
      console.log(this.countriesInfo.stats[0]["population"]) //new way of accessing stats
      return '<h3>' + country + '</h3>' + '<br>' +
      this.countriesInfo.population.find(function(countryObject){
        return country === countryObject.name;
      }).population + '<br>' +
      this.countriesInfo.region.find(function(countryObject) {
        return country === countryObject.name;
      }).region + '</h3>'

    }
  }
  return '<p>Not recommended by administration</p>'
};

MapWrapper.prototype.countriesSearch = function(evt, marker) {
  this.searchCity(evt);
  var geocoder = new google.maps.Geocoder;
  geocoder.geocode({ 'location': evt.latlng}, function(results, status){
    this.country = results.pop()

    marker.bindPopup(this.fillInfoWindow(this.country));
    // console.log(this.country.formatted_address)
  // last array in every click contains the countries name
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
  console.log(nearCity._embedded["location:nearest-cities"][0]._links["location:nearest-city"].name);
};

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
  return countryStats;
};

// ApiProcessing.prototype.getCountryArea = function(countries) {
//   var countryAreas = [];
//   countryAreas = countries.map(function(country) {
//     var reformattedCountry = {};
//     reformattedCountry.name = country.name;
//     reformattedCountry.area = country.area;
//     return reformattedCountry;
//   });
//   return countryAreas;
// };

// ApiProcessing.prototype.getCountryPopulation = function(countries) {
//   var countryPopulations = [];
//   countryPopulations = countries.map(function(country) {
//     var reformattedCountry = {};
//     reformattedCountry.name = country.name;
//     reformattedCountry.population = country.population;
//     return reformattedCountry;
//   });
//   return countryPopulations;
// };

// ApiProcessing.prototype.getCountryRegions = function(countries) {
//   var countryRegions = [];
//   countryRegions = countries.map(function(country) {
//     var reformattedCountry = {};
//     reformattedCountry.name = country.name;
//     reformattedCountry.region = country.region;
//     return reformattedCountry;
//   });
//   return countryRegions;
// };

// ApiProcessing.prototype.getCountryBorders = function(countries) {
//   var countryBorders = [];
//   countryBorders = countries.map(function(country) {
//     var reformattedCountry = {};
//     reformattedCountry.name = country.name;
//     reformattedCountry.borders = country.borders;
//     return reformattedCountry;
//   });
//   return countryBorders;
// };

module.exports = ApiProcessing;

/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map