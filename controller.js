(function(){
  'use strict';
  angular
    .module('weatherApp')
    .controller('MainController', function($scope, WeatherService){
        $scope.getWeather = function(newAddress, time){
          console.log("request sent, " + newAddress + " time " + time);
          var time = time;

          var addressString = newAddress;

          var geocoder = new google.maps.Geocoder();

          geocoder.geocode( { 'address': addressString}, function(results, status) {

          if (status == google.maps.GeocoderStatus.OK) {
              var latitude = results[0].geometry.location.lat();
              var longitude = results[0].geometry.location.lng();
              WeatherService.read(latitude, longitude, time).success(function(data){
               console.log(data);
              });
            }
          });
        }
    });
})();
