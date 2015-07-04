(function(){
  'use strict';
  angular
    .module('weatherApp')
    .controller('MainController', function($scope, WeatherService){
        $scope.init = function(){
          $scope.getCurrentLocationWeather();
        }

        $scope.getWeather = function(newAddress){
          var addressString = newAddress;
          var geocoder = new google.maps.Geocoder();

          geocoder.geocode( { 'address': addressString}, function(results, status) {

          if (status == google.maps.GeocoderStatus.OK) {
              var latitude = results[0].geometry.location.lat();
              var longitude = results[0].geometry.location.lng();

              WeatherService.read(latitude, longitude).success(function(data){
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
                $scope.displayLocation = displayLocation;
                console.log($scope.displayLocation);
                $scope.data = data;
                var currentTemperature = data.currently.temperature;
                currentTemperature = Math.round(currentTemperature).toString().concat('°');
                var apparentTemperature = data.currently.apparentTemperature;
                apparentTemperature = Math.round(apparentTemperature).toString().concat('°');
                $scope.currentTemperature = currentTemperature;
                $scope.apparentTemperature = apparentTemperature;

                $scope.icon = data.currently.icon;

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

            WeatherService.read(lat, lng).success(function(data){
              $scope.data = data;
              var currentTemperature = data.currently.temperature;
              currentTemperature = Math.round(currentTemperature).toString().concat('°');
              var apparentTemperature = data.currently.apparentTemperature;
              apparentTemperature = Math.round(apparentTemperature).toString().concat('°');
              $scope.currentTemperature = currentTemperature;
              $scope.apparentTemperature = apparentTemperature;

              $scope.icon = data.currently.icon;

              var daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
              var days = [];
              days.push({day: daysOfWeek[new Date(data.daily.data[1].time * 1000).getDay()], dayHigh: Math.round(data.daily.data[1].temperatureMax).toString().concat('°'), dayLow: Math.round(data.daily.data[1].temperatureMin).toString().concat('°')});
              days.push({day: daysOfWeek[new Date(data.daily.data[2].time * 1000).getDay()], dayHigh: Math.round(data.daily.data[2].temperatureMax).toString().concat('°'), dayLow: Math.round(data.daily.data[2].temperatureMin).toString().concat('°')});
              days.push({day: daysOfWeek[new Date(data.daily.data[3].time * 1000).getDay()], dayHigh: Math.round(data.daily.data[3].temperatureMax).toString().concat('°'), dayLow: Math.round(data.daily.data[3].temperatureMin).toString().concat('°')});

              $scope.tomorrow = days[0];
              $scope.twoDays = days[1];
              $scope.threeDays = days[2];

              $scope.data = data;
              console.log($scope.data);
            });
          });
        }

        $scope.init();
    });
})();
