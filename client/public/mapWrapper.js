var _ = require('lodash');

//constructor for mainMap
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

      this.searchCity(evt, marker)
      setTimeout(function() {
        marker.closePopup()
      }, 5000)
    }
  };

  MapWrapper.prototype.searchCity = function(evt, marker) {
    var url = "https://api.teleport.org/api/locations/" + evt.latitude + "," + evt.longitude;

    this.makeRequest(url, function (cityData) { // this anonymous function is requestComplete
      var nearestCity = cityData._embedded["location:nearest-cities"]

      // nearestCities might be null 
      if (nearestCity === null) {
        var nearCity = "Good landing spot. No cities nearby."
      }
      else {
        var nearCity = (nearestCity[0]._links["location:nearest-city"].name);
      }

      this.geocode(marker, nearCity, evt)
    }.bind(this));
  };
  
  MapWrapper.prototype.makeRequest = function(url, callback) {
    var request = new XMLHttpRequest();
    request.addEventListener('load', function () {
      if (this.status !== 200) return;

      var jsonString = this.responseText;
      var data = JSON.parse(jsonString);
      callback(data)
    });
    request.open("GET", url);
    request.send();
  };

  MapWrapper.prototype.geocode = function(marker, nearCity, evt) {
    var geocoder = new google.maps.Geocoder;
    geocoder.geocode({ 'location': evt.latlng}, function(results, status){
      console.log('results from geocode', results.length)

      if (results.length === 0) {
        nearCity = "Uncharted Waters";
        // console.log(nearCity);
        this.fillInfoWindow(marker, nearCity);
      }
      else {
        this.country = results.pop();
        console.log(this.country);
        this.fillInfoWindow(marker, nearCity, this.country.formatted_address);
      }
    }.bind(this));
  };

  MapWrapper.prototype.fillInfoWindow = function(marker, nearCity, clickedInfo) {

    if (nearCity === "Uncharted Waters") {
      clickedInfo = "Uncharted Waters"
    }
    console.log(clickedInfo);
    console.log(nearCity);
    // up to here both above variables are uncharted
    var country = _.find(this.countriesInfo.stats, {name: clickedInfo})
    // console.log(country)
    if (country !== undefined){
              var html = '<h2>' + country.name + '</h2>' + '<br>' +
              '<p>' + 'Population: ' + country.population + '<br>' +
              '<p>' + 'Region: ' + country.region + '<br>' +
              '<p>' + 'Area: ' + country.area + '<br>' +
              '<p>' + 'Nearest City: ' + nearCity
              marker.bindPopup(html);
            } else {
              this.unmatchedCountries(marker, nearCity, clickedInfo);
            }
  };

  MapWrapper.prototype.unmatchedCountries = function(marker, nearCity, clickedInfo) {
    var cleanedCountryNames = {
      "United Kingdom": "United Kingdom of Great Britain and Northern Ireland",
      "United States": "United States of America",
      "Russia": "Russian Federation",
      "Czechia": "Czech Republic",
      "Uncharted Waters": "Unless you're vehicles can land on water. Stay away!"
    };

    this.fillInfoWindow(marker, nearCity, cleanedCountryNames[clickedInfo]);
  };

module.exports = MapWrapper;