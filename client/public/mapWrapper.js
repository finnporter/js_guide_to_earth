var MapWrapper = function(countriesInfo) {
  this.countryInfo = countriesInfo;
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
  this.earth.on("click", this.addMarker.bind(this));
}


MapWrapper.prototype.addMarker = function(evt) {
  if (evt.latitude !== null && evt.longitude !== null) {
    var marker = WE.marker([evt.latitude, evt.longitude], 'http://clipart-finder.com/data/mini/10-flying_saucer_2.png', 50, 12).addTo(this.earth);

    // console.log(this) 
    this.countriesSearch(evt, marker)

    setTimeout(function() {
      marker.closePopup()
    }, 30000)
  }
}

MapWrapper.prototype.fillInfoWindow = function(countryInfo) {
  return '<h3>' + countryInfo.formatted_address + '</h3>'
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
  console.log(nearCity._embedded["location:nearest-cities"][0]._links["location:nearest-city"].name);
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

module.exports = MapWrapper;