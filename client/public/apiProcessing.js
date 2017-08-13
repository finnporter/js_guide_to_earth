//processes [countries] in a way that will make it easier for the info window to display
var getCountryNames = function(countries) {
  var countryNames = [];
  countries.forEach(function(country) {
    countryNames.push(country.name);
  });
  return countryNames;
};

var getCountryArea = function(countries) {
  var countryAreas = [];
  var country = {};
  countryAreas = countries.map(function(country) {
    var reformattedCountry = {};
    reformattedCountry[country.name] = country.area;
    return reformattedCountry;
  })
    console.log(countryAreas)
  return countryAreas;
};