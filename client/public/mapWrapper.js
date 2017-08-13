var earth;
var options;

var renderMap = function() {
  options = { zoom: 2.0, position: [55.9533, 3.1883] };
  earth = new WE.map('earth_div', options); 
  WE.tileLayer("http://tileserver.maptiler.com/nasa/{z}/{x}/{y}.jpg", {
    minZoom: 0,
    maxZoom: 5,
    attribution: "NASA"
  }).addTo(earth);
  // console.log(earth)
  earth.on("click", addMarker)
}

var addMarker = function(evt) {
  if (evt.latitude !== null && evt.longitude !== null) {
    var marker = WE.marker([evt.latitude, evt.longitude]).addTo(earth)

    // custom marker logo:

    // var marker = WE.marker([evt.latitude, evt.longitude], 'http://clipart-finder.com/data/mini/10-flying_saucer_2.png', 50, 12).addTo(earth);


    console.log(evt) //console logs long and lat
    countriesSearch(evt)
    marker.bindPopup(
      fillInfoWindow(evt.latitude)
    );
  }
}

var countriesSearch = function(evt) {
  var geocoder = new google.maps.Geocoder;
  geocoder.geocode({ 'location': evt.latlng}, function(results, status){
  console.log(results)
  });
}

var fillInfoWindow = function(contentString) {
  return '<b>' + contentString + '</b>'
}


