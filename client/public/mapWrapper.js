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

    var marker = WE.marker([evt.latitude, evt.longitude],'http://skymonsters.com/sitebuilder/images/SportMod-294x216.png',50,12).addTo(this.earth);
    button = document.createElement('button')
    marker.appendChild(button)
    console.log(this) //console logs long and lat

    this.countriesSearch(evt, marker)
    setTimeout(function() {
      marker.closePopup()
    }, 30000)
  }
};

// MapWrapper.prototype.countryPopulation = function(info) {
//   for (country of this.countriesInfo.name) {
//     if (country === info.formatted_address) {
//       this.countriesInfo.population.find(function(countObject) {
//         return country === countObject.name
//       }).population
//     }
//   }
// };

MapWrapper.prototype.fillInfoWindow = function(info) {
  // console.log(this.countriesInfo.name)

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