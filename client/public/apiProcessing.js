var ApiProcessing = function() {
};
//processes [countries] in a way that will make it easier for the info window to display
ApiProcessing.prototype.getCountryNames = function(countries) {
  countryNames = [];
  countries.forEach(function(country) {
    countryNames.push(country.name);
  });
  // transfer(countryNames);
  return countryNames;
};

ApiProcessing.prototype.getCountryArea = function(countries) {
  var countryAreas = [];
  var country = {};
  countryAreas = countries.map(function(country) {
    var reformattedCountry = {};
    reformattedCountry[country.alpha3code] = country.area;
    return reformattedCountry;
  });
  return countryAreas;
};

ApiProcessing.prototype.getCountryPopulation = function(countries) {
  var countryPopulations = [];
  var country = {};
  countryPopulations = countries.map(function(country) {
    var reformattedCountry = {};
    reformattedCountry[country.alpha3code] = country.population;
    return reformattedCountry;
  });
  return countryPopulations;
};

ApiProcessing.prototype.getCountryRegions = function(countries) {
  var countryRegions = [];
  var country = {};
  countryRegions = countries.map(function(country) {
    var reformattedCountry = {};
    reformattedCountry[country.alpha3code] = country.region;
    return reformattedCountry;
  });
  return countryRegions;
};

ApiProcessing.prototype.getCountryBorders = function(countries) {
  var countryBorders = [];
  var country = {};
  countryBorders = countries.map(function(country) {
    var reformattedCountry = {};
    reformattedCountry[country.alpha3code] = country.borders;
    return reformattedCountry;
  });
  return countryBorders;
};

module.exports = ApiProcessing;