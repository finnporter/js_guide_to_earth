var earth;
var options;
var country;

var renderMap = function() {
  options = { sky: true,zoom: 2.0, position: [55.9533, 3.1883] };
  earth = new WE.map('earth_div', options); 
  WE.tileLayer("http://tileserver.maptiler.com/nasa/{z}/{x}/{y}.jpg", {
    minZoom: 0,
    maxZoom: 5,
    sky:true,
    attribution: "NASA"
  }).addTo(earth);
  // console.log(earth)
  earth.on("click", addMarker)
}


var addMarker = function(evt) {
  if (evt.latitude !== null && evt.longitude !== null) {
    var marker = WE.marker([evt.latitude, evt.longitude], 'http://clipart-finder.com/data/mini/10-flying_saucer_2.png', 50, 12).addTo(earth);

    console.log(evt) //console logs long and lat
    countriesSearch(evt, marker)

    setTimeout(function() {
      marker.closePopup()
    }, 30000)
  }
}

var countriesSearch = function(evt, marker) {
  searchCity(evt);
  var geocoder = new google.maps.Geocoder;
  geocoder.geocode({ 'location': evt.latlng}, function(results, status){
    country = results.pop()
    marker.bindPopup(fillInfoWindow(country));
    console.log(country)
  // last array in every click contains the countries name
});
}

var searchCity = function(evt) {
  var url = "https://api.teleport.org/api/locations/" + evt.latitude + "," + evt.longitude;
  makeRequest(url, requestComplete);
}

var makeRequest = function(url, callback) {
  var request = new XMLHttpRequest();
  request.addEventListener('load', callback);
  request.open("GET", url);
  request.send();
}

var requestComplete = function() {
  if (this.status !== 200) return;

  var jsonString = this.responseText;
  var nearCity = JSON.parse(jsonString);
  console.log(nearCity._embedded);
}

var fillInfoWindow = function(countryInfo) {
  return '<h3>' + countryInfo.formatted_address + '</h3>'
}
