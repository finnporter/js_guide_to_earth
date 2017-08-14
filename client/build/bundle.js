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
  
  countriesApi.getCountryNames(countries);
  countriesApi.getCountryArea(countries);
  countriesApi.getCountryPopulation(countries);
  countriesApi.getCountryRegions(countries);
  countriesApi.getCountryBorders(countries);
};

var app = function() {
 var mainMap = new MapWrapper();
 mainMap.renderMap();

 var url = 'https://restcountries.eu/rest/v2/all';
 makeCountriesRequest(url, requestCountriesComplete)
};






window.addEventListener('load', app);

/***/ }),
/* 1 */
/***/ (function(module, exports) {

var MapWrapper = function() {
  this.options = { sky: true,zoom: 2.0, position: [55.9533, 3.1883] };
  this.earth = new WE.map('earth_div', this.options); 
  this.country = null;
}

MapWrapper.prototype.renderMap = function() {
  WE.tileLayer("http://tileserver.maptiler.com/nasa/{z}/{x}/{y}.jpg", {
    minZoom: 0,
    maxZoom: 5,
    sky:true,
    attribution: "NASA"
  }).addTo(this.earth);
  // console.log(earth)
  this.earth.on("click", this.addMarker.bind(this));
}


MapWrapper.prototype.addMarker = function(evt) {
  if (evt.latitude !== null && evt.longitude !== null) {
    var marker = WE.marker([evt.latitude, evt.longitude], 'http://clipart-finder.com/data/mini/10-flying_saucer_2.png', 50, 12).addTo(this.earth);


    console.log(this) //console logs long and lat
    this.countriesSearch(evt, marker)
    setTimeout(function() {
      marker.closePopup()
    }, 30000)
  }
}

MapWrapper.prototype.countriesSearch = function(evt, marker) {
  this.searchCity(evt);
  var geocoder = new google.maps.Geocoder;
  geocoder.geocode({ 'location': evt.latlng}, function(results, status){
    this.country = results.pop()
    marker.bindPopup(this.fillInfoWindow(this.country));
    console.log(this.country.formatted_address)
  // last array in every click contains the countries name
}.bind(this));
}

MapWrapper.prototype.searchCity = function(evt) {
  var url = "https://api.teleport.org/api/locations/" + evt.latitude + "," + evt.longitude;
  this.makeRequest(url, this.requestComplete);
}

MapWrapper.prototype.makeRequest = function(url, callback) {
  var request = new XMLHttpRequest();
  request.addEventListener('load', callback);
  request.open("GET", url);
  request.send();
}

MapWrapper.prototype.requestComplete = function() {
  if (this.status !== 200) return;

  var jsonString = this.responseText;
  var nearCity = JSON.parse(jsonString);
  console.log(nearCity._embedded);
}

MapWrapper.prototype.fillInfoWindow = function(countryInfo) {
  return '<h3>' + countryInfo.formatted_address + '</h3>'
}

// var fillInfoWindow = function(countryInfo, countryNames) {
//   for (country1 of countryNames) {
//     for (country2 of countryInfo.formatted_address) {
//       if (country1 === country2) {
//         return '<h3>' + country1 + 'random info' + '</h3>'
//       } else {
//         return "Not a country"
//       }
//       }
//     }
//   }

// var transfer = function(countriesTest) {
//   console.log(countriesTest);
// }

module.exports = MapWrapper;

/***/ }),
/* 2 */
/***/ (function(module, exports) {

var ApiProcessing = function() {
};
//processes [countries] in a way that will make it easier for the info window to display
ApiProcessing.prototype.getCountryNames = function(countries) {
  countryNames = [];
  countries.forEach(function(country) {
    countryNames.push(country.name);
  });
  // transfer(countryNames);
  return countryNames;
};

ApiProcessing.prototype.getCountryArea = function(countries) {
  var countryAreas = [];
  var country = {};
  countryAreas = countries.map(function(country) {
    var reformattedCountry = {};
    reformattedCountry[country.alpha3code] = country.area;
    return reformattedCountry;
  });
  return countryAreas;
};

ApiProcessing.prototype.getCountryPopulation = function(countries) {
  var countryPopulations = [];
  var country = {};
  countryPopulations = countries.map(function(country) {
    var reformattedCountry = {};
    reformattedCountry[country.alpha3code] = country.population;
    return reformattedCountry;
  });
  return countryPopulations;
};

ApiProcessing.prototype.getCountryRegions = function(countries) {
  var countryRegions = [];
  var country = {};
  countryRegions = countries.map(function(country) {
    var reformattedCountry = {};
    reformattedCountry[country.alpha3code] = country.region;
    return reformattedCountry;
  });
  return countryRegions;
};

ApiProcessing.prototype.getCountryBorders = function(countries) {
  var countryBorders = [];
  var country = {};
  countryBorders = countries.map(function(country) {
    var reformattedCountry = {};
    reformattedCountry[country.alpha3code] = country.borders;
    return reformattedCountry;
  });
  return countryBorders;
};

module.exports = ApiProcessing;

/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map