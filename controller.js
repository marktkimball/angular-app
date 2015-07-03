(function(){
  'use strict';
  angular
    .module('weatherApp')
    .controller('MainController', function($scope, WeatherService){
        $scope.init = function(){
          $scope.getCurrentLocationWeather();
        }

        $scope.getWeather = function(newAddress, time){
          var time = Math.floor(time/1000);
          var addressString = newAddress;
          var geocoder = new google.maps.Geocoder();

          geocoder.geocode( { 'address': addressString}, function(results, status) {

          if (status == google.maps.GeocoderStatus.OK) {
              var latitude = results[0].geometry.location.lat();
              var longitude = results[0].geometry.location.lng();
              WeatherService.read(latitude, longitude, time).success(function(data){
                var displayLocation = "";
                if(results.length === 1){
                  displayLocation = results[0].formatted_address;
                }else{
                  for(var i = 0; i < results.length; i++){
                    if(results[i].types[0] === "locality"){
                      displayLocation = results[i].formatted_address;
                      break;
                    }
                  };
                }

                console.log(results);
                $scope.displayLocation = displayLocation;
                console.log($scope.displayLocation);
                $scope.data = data;
                console.log($scope.data);
              });
            }
          });
        }

        $scope.getCurrentLocationWeather = function(){
          var geo = navigator.geolocation;

          navigator.geolocation.getCurrentPosition(function(position) {
            var geocoder = new google.maps.Geocoder();
            var lat = position.coords.latitude;
            var lng = position.coords.longitude;
            var latlng = new google.maps.LatLng(lat, lng);

            geocoder.geocode({ 'latLng': latlng }, function (results, status) {
              var displayLocation = "";
              for(var i = 0; i < results.length; i++){
                if(results[i].types[0] === "locality"){
                  displayLocation = results[i].formatted_address;
                  break;
                }
              }
              $scope.displayLocation = displayLocation;
              console.log($scope.displayLocation);
            });

            WeatherService.read(position.coords.latitude, position.coords.longitude).success(function(data){
              $scope.data = data;
              var currentTemperature = data.currently.temperature;
              currentTemperature = Math.round(currentTemperature).toString().concat('°');
              var apparentTemperature = data.currently.apparentTemperature;
              apparentTemperature = Math.round(apparentTemperature).toString().concat('°');
              $scope.currentTemperature = currentTemperature;
              $scope.apparentTemperature = apparentTemperature;
              console.log($scope.data);
            });
          });
        }

        $scope.init();
    });
})();
