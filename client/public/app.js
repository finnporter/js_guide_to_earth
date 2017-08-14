var MapWrapper = require('./mapWrapper.js');
var ApiProcessing = require('./apiProcessing');

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