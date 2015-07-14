angular.module('starter.services', [])

.factory('WeatherService', function($http, $rootScope){

  var url = 'https://api.forecast.io/forecast/c834040fc950c6c4f03e7887311fb1fe';

  var useData;

  var getWeather = function(lat, long){
    return $http.jsonp(url + '/' + lat + ',' + long + '?callback=JSON_CALLBACK').success(function(data){
      useData = data;
      $rootScope.$broadcast('weather:updated');
    });
  };

  var getUseData = function(){
    return useData;
  }

  return{
    read: getWeather,
    getUseData: getUseData
  };

});
