//processes countries array in a way that will make it easier for the info window to display
var getCountryNames = function(countries) {
  var countryNames = [];
  countries.forEach(function(country) {
    countryNames.push(country.name);
  });
  return countryNames;
};

var getCountryArea = function(countries) {
  var countryAreas = [];
  countries.forEach(function(country) {
    countryAreas.push(countr.area);
  });
  return countryAreas;
};

//will add and refactor after break