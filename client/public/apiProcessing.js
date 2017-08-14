var ApiProcessing = function() {
};

ApiProcessing.prototype.getCountryNames = function(countries) {
  var countryNames = [];
  countries.forEach(function(country) {
    countryNames.push(country.name);
  });
  return countryNames;
};

ApiProcessing.prototype.processCountriesApi = function(countries) {
  var countryStats = [];
  countryStats = countries.map(function(country) {
    var reformattedCountry = {};
    reformattedCountry.name = country.name;
    reformattedCountry.area = country.area;
    reformattedCountry.population = country.population;
    reformattedCountry.region = country.region;
    reformattedCountry.borders = country.borders;
    return reformattedCountry;
  });
  return countryStats;
};

// ApiProcessing.prototype.getCountryArea = function(countries) {
//   var countryAreas = [];
//   countryAreas = countries.map(function(country) {
//     var reformattedCountry = {};
//     reformattedCountry.name = country.name;
//     reformattedCountry.area = country.area;
//     return reformattedCountry;
//   });
//   return countryAreas;
// };

// ApiProcessing.prototype.getCountryPopulation = function(countries) {
//   var countryPopulations = [];
//   countryPopulations = countries.map(function(country) {
//     var reformattedCountry = {};
//     reformattedCountry.name = country.name;
//     reformattedCountry.population = country.population;
//     return reformattedCountry;
//   });
//   return countryPopulations;
// };

// ApiProcessing.prototype.getCountryRegions = function(countries) {
//   var countryRegions = [];
//   countryRegions = countries.map(function(country) {
//     var reformattedCountry = {};
//     reformattedCountry.name = country.name;
//     reformattedCountry.region = country.region;
//     return reformattedCountry;
//   });
//   return countryRegions;
// };

// ApiProcessing.prototype.getCountryBorders = function(countries) {
//   var countryBorders = [];
//   countryBorders = countries.map(function(country) {
//     var reformattedCountry = {};
//     reformattedCountry.name = country.name;
//     reformattedCountry.borders = country.borders;
//     return reformattedCountry;
//   });
//   return countryBorders;
// };

module.exports = ApiProcessing;