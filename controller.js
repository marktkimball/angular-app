(function(){
  'use strict';
  angular
    .module('weatherApp')
    .controller('MainController', function($scope, WeatherService){
        $scope.getWeather = function(newAddress, time){
          var time = Math.floor(time/1000);
          var addressString = newAddress;
          var geocoder = new google.maps.Geocoder();

          geocoder.geocode( { 'address': addressString}, function(results, status) {

          if (status == google.maps.GeocoderStatus.OK) {
              var latitude = results[0].geometry.location.lat();
              var longitude = results[0].geometry.location.lng();
              WeatherService.read(latitude, longitude, time).success(function(data){
                $scope.data = data;
                console.log()
                //http://maps.googleapis.com/maps/api/geocode/json?latlng=32.708767,-79.95284509999999&sensor=true
                console.log($scope.data);
              });
            }
          });
        }
    });
})();
