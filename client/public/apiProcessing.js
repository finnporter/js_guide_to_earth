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
  });
  return countryAreas;
};

var getCountryPopulation = function(countries) {
  var countryPopulations = [];
  var country = {};
  countryPopulations = countries.map(function(country) {
    var reformattedCountry = {};
    reformattedCountry[country.name] = country.population;
    return reformattedCountry;
  });
  return countryPopulations;
};

var getCountryRegions = function(countries) {
  var countryRegions = [];
  var country = {};
  countryRegions = countries.map(function(country) {
    var reformattedCountry = {};
    reformattedCountry[country.name] = country.region;
    return reformattedCountry;
  });
    console.log(countryRegions)
  return countryRegions;
};

var getCountryBorders = function(countries) {
  var countryBorders = [];
  var country = {};
  countryBorders = countries.map(function(country) {
    var reformattedCountry = {};
    reformattedCountry[country.name] = country.borders;
    return reformattedCountry;
  });
    console.log(countryBorders)
  return countryBorders;
};