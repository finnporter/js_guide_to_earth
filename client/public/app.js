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
// window.addEventListener('load', function() {
//   new PieChart();
//   new ColumnChart();
// })