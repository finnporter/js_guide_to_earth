var _ = require('lodash');

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
      }, 5000)
    }
  };

  MapWrapper.prototype.fillInfoWindow = function(clickedInfo, marker) {
    console.log(clickedInfo)
    var country = _.find(this.countriesInfo.stats, {name: clickedInfo})
    console.log(country)
    if (country !== undefined){
              var html = '<h2>' + country.name + '</h2>' + '<br>' +
              '<p>' + 'Population: ' + country.population + '<br>' +
              '<p>' + 'Region: ' + country.region + '<br>' +
              '<p>' + 'Area: ' + country.area + '<br>' +
              '<p>' + 'Nearest City: ' + returnNearCity
              marker.bindPopup(html);
            } else {
              this.unmatchedCountries(clickedInfo, marker);
            }
  };

  MapWrapper.prototype.unmatchedCountries = function(clickedInfo, marker) {
    var unmatchedCounts = ['States of America', 'Kingdom of Great Britain and Northern Ireland', 'Russia', 'Czechia'];

    var cleanedCountryNames = {
      "United Kingdom": "United Kingdom of Great Britain and Northern Ireland",
      "United States": "United States of America"
    };

    this.fillInfoWindow(cleanedCountryNames[clickedInfo], marker);
  };

  MapWrapper.prototype.countriesSearch = function(evt, marker) {
    this.searchCity(evt);
    var geocoder = new google.maps.Geocoder;
    geocoder.geocode({ 'location': evt.latlng}, function(results, status){
      this.country = results.pop()

      this.fillInfoWindow(this.country.formatted_address, marker);
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
  };

var returnNearCity;

module.exports = MapWrapper;