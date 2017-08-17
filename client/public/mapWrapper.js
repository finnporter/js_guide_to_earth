var _ = require('lodash');
var numeral = require('numeral');


//constructor for mainMap
var MapWrapper = function(countriesInfo) {
  this.countriesInfo = countriesInfo;
  this.options = { sky: true, zoom: 2.0, position: [55.9533, 3.1883] };
  this.earth = new WE.map('earth_div', this.options); 
  this.country = null;
  this.animated = true;
};

MapWrapper.prototype.renderMap = function() {
  WE.tileLayer("http://tileserver.maptiler.com/nasa/{z}/{x}/{y}.jpg", {
    minZoom: 0,
    maxZoom: 5,
    sky:true,
    attribution: "NASA"
  }).addTo(this.earth);
  this.earth.on("dblclick", this.addMarker.bind(this));
  this.animateEarth();
};

MapWrapper.prototype.animateEarth = function() {
  var before = null;
  window.requestAnimationFrame(function animate(now) {
    if (this.animated === true) {
      var c = this.earth.getPosition();
      var elapsed = before? now - before: 0;
      before = now;
      this.earth.setCenter([c[0], c[1] + 0.1*(elapsed/30)]);
      window.requestAnimationFrame(animate.bind(this));
    };
  }.bind(this))
}

MapWrapper.prototype.addMarker = function(evt) {
  if (evt.latitude !== null && evt.longitude !== null) {
    var marker = WE.marker([evt.latitude, evt.longitude],'flyingsaucer.png',80,60)
    marker.addTo(this.earth);
    this.searchCity(evt, marker)
    setTimeout(function() {
      marker.closePopup()
    }, 5000)
  }
};

MapWrapper.prototype.searchCity = function(evt, marker) {
  var url = "https://api.teleport.org/api/locations/" + evt.latitude + "," + evt.longitude;

  this.makeRequest(url, function (cityData) {
    var nearestCity = cityData._embedded["location:nearest-cities"]

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

    if (results.length === 0) {
      nearCity = "Uncharted Waters";
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
  console.log(clickedInfo);
  console.log(nearCity);
  var country = _.find(this.countriesInfo.stats, {name: clickedInfo})
  if (nearCity === "Uncharted Waters") {
    var html = '<h2>' + "Unless your vehicle can land on water, stay away!" + '</h2>'
    marker.bindPopup(html);
    return;
  }

  if (country !== undefined){
    var population = numeral(country.population).format("0,0");
    var area = numeral(country.area).format("0,0");
    var html = '<h2>' + country.name + '</h2>' + '<br>' +
    '<p>' + 'Population: ' + population + '<br>' +
    '<p>' + 'Region: ' + country.region + '<br>' +
    '<p>' + 'Area: ' + area + " km2" + '<br>' +
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
    "Czechia": "Czech Republic"
  };

  this.fillInfoWindow(marker, nearCity, cleanedCountryNames[clickedInfo]);
};

  MapWrapper.prototype.flyToCountry = function() {
    //console.log(this.countriesInfo.stats)
    var optionValue = document.querySelector('select');
    var test = optionValue.value
    console.log(test)
    var singleCountry = _.find(this.countriesInfo.stats, {name: test})
    this.earth.flyTo(singleCountry.latlng[0], singleCountry.latlng[1], this.zoomSizeCap(singleCountry));
  }

  MapWrapper.prototype.zoomSizeCap = function(singleCountry) {
    if (singleCountry.area <= 50000) {
      return singleCountry.area * 50
    }
    else if (singleCountry.area > 50000 && singleCountry.area <= 110000 ) {
      return singleCountry.area * 15;
    } else if (singleCountry.area > 110000 && singleCountry.area <= 500000) {
      return singleCountry.area * 10;
    } else if (singleCountry.area > 500000 && singleCountry.area <= 2000000) {
      return singleCountry.area * 8;
    }
    else if (singleCountry.area <= 17000000) { 
      return singleCountry.area;
    } else {
      return singleCountry.area * 0.7;
    }
  };

  MapWrapper.prototype.toggleButton = function() {
    var overlay = document.querySelector('.earth_overlay');
    if (overlay.style.display === 'none' && this.animated === false) {
      overlay.style.display = 'block';
      this.animated = true;
      this.animateEarth();
    } else {
      overlay.style.display = 'none';
      this.animated = false;
    }
  };

  MapWrapper.prototype.playSound = function() {
    var sound = document.getElementById("audio");
    sound.play();
  }

  module.exports = MapWrapper;