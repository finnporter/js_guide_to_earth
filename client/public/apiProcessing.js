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
    reformattedCountry[country.alpha3code] = country.area;
    return reformattedCountry;
  });
  return countryAreas;
};

var getCountryPopulation = function(countries) {
  var countryPopulations = [];
  var country = {};
  countryPopulations = countries.map(function(country) {
    var reformattedCountry = {};
    reformattedCountry[country.alpha3code] = country.population;
    return reformattedCountry;
  });
  return countryPopulations;
};

var getCountryRegions = function(countries) {
  var countryRegions = [];
  var country = {};
  countryRegions = countries.map(function(country) {
    var reformattedCountry = {};
    reformattedCountry[country.alpha3code] = country.region;
    return reformattedCountry;
  });
  return countryRegions;
};

var getCountryBorders = function(countries) {
  var countryBorders = [];
  var country = {};
  countryBorders = countries.map(function(country) {
    var reformattedCountry = {};
    reformattedCountry[country.alpha3code] = country.borders;
    return reformattedCountry;
  });
  return countryBorders;
};