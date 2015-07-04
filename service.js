(function(){
  'use strict';
  angular
    .module('weatherApp')
    .factory('WeatherService', function($http){
      var url = 'https://api.forecast.io/forecast/c834040fc950c6c4f03e7887311fb1fe';

      var getWeather = function(lat, long){
        return $http.jsonp(url + '/' + lat + ',' + long + '?callback=JSON_CALLBACK');
      };

      return{
        read: getWeather
      };
    });

})();
