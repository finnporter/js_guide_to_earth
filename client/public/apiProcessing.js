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
    reformattedCountry.latlng = country.latlng;
    return reformattedCountry;
  });
  // console.log(countryStats)
  return countryStats;
};


module.exports = ApiProcessing;