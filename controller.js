(function(){
  'use strict';
  angular
    .module('weatherApp')
    .controller('MainController', function($scope, $sce, WeatherService){
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
                weatherFunction(data);
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
            });

            WeatherService.read(lat, lng).success(function(data){
                weatherFunction(data);
              }
            );
          });
        }

        function weatherFunction(data){
          $scope.data = data;
          var currentTemperature = data.currently.temperature;
          currentTemperature = Math.round(currentTemperature).toString().concat('°');
          var apparentTemperature = data.currently.apparentTemperature;
          apparentTemperature = "Feels like " + Math.round(apparentTemperature).toString().concat('°');
          $scope.currentTemperature = currentTemperature;
          $scope.apparentTemperature = apparentTemperature;
          $scope.precipProbability = (Math.round(data.currently.precipProbability * 100)).toString().concat('% chance of precip.');
          $scope.summary = (data.daily.data[0].summary);

          $scope.icon = data.currently.icon;

          var daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
          var days = [];
          days.push({day: daysOfWeek[new Date(data.daily.data[0].time * 1000).getDay()], dayHigh: "High " + Math.round(data.daily.data[0].temperatureMax).toString().concat('°'), dayLow: "Low " + Math.round(data.daily.data[0].temperatureMin).toString().concat('°'), dailyIcon: data.daily.data[0].icon, dailyPrecip: "Precip. " + (Math.round(data.daily.data[0].precipProbability * 100)).toString().concat('%')});
          days.push({day: daysOfWeek[new Date(data.daily.data[1].time * 1000).getDay()], dayHigh: "High " + Math.round(data.daily.data[1].temperatureMax).toString().concat('°'), dayLow: "Low " + Math.round(data.daily.data[1].temperatureMin).toString().concat('°'), dailyIcon: data.daily.data[1].icon, dailyPrecip: "Precip. " + (Math.round(data.daily.data[1].precipProbability * 100)).toString().concat('%')});
          days.push({day: daysOfWeek[new Date(data.daily.data[2].time * 1000).getDay()], dayHigh: "High " + Math.round(data.daily.data[2].temperatureMax).toString().concat('°'), dayLow: "Low " + Math.round(data.daily.data[2].temperatureMin).toString().concat('°'), dailyIcon: data.daily.data[2].icon, dailyPrecip: "Precip. " + (Math.round(data.daily.data[2].precipProbability * 100)).toString().concat('%')});
          days.push({day: daysOfWeek[new Date(data.daily.data[3].time * 1000).getDay()], dayHigh: "High " + Math.round(data.daily.data[3].temperatureMax).toString().concat('°'), dayLow: "Low " + Math.round(data.daily.data[3].temperatureMin).toString().concat('°'), dailyIcon: data.daily.data[3].icon, dailyPrecip: "Precip. " + (Math.round(data.daily.data[3].precipProbability * 100)).toString().concat('%')});
          days.push({day: daysOfWeek[new Date(data.daily.data[4].time * 1000).getDay()], dayHigh: "High " + Math.round(data.daily.data[4].temperatureMax).toString().concat('°'), dayLow: "Low " + Math.round(data.daily.data[4].temperatureMin).toString().concat('°'), dailyIcon: data.daily.data[4].icon, dailyPrecip: "Precip. " + (Math.round(data.daily.data[4].precipProbability * 100)).toString().concat('%')});

          $scope.today = days[0]
          $scope.tomorrow = days[1];
          $scope.twoDays = days[2];
          $scope.threeDays = days[3];
          $scope.fourDays = days[4];

          $scope.hourlyLink = $sce.trustAsHtml("<a href='#hourly'>Hourly Forecast</a>");

          var hoursOfDay = {
            0: "12 AM",
            1: "1 AM",
            2: "2 AM",
            3: "3 AM",
            4: "4 AM",
            5: "5 AM",
            6: "6 AM",
            7: "7 AM",
            8: "8 AM",
            9: "9 AM",
            10: "10 AM",
            11: "11 AM",
            12: "12 PM",
            13: "1 PM",
            14: "2 PM",
            15: "3 PM",
            16: "4 PM",
            17: "5 PM",
            18: "6 PM",
            19: "7 PM",
            20: "8 PM",
            21: "9 PM",
            22: "10 PM",
            23: "11 PM",
            24: "12 PM"
          }

          var hours = [];

          hours.push({hour: hoursOfDay[new Date(data.hourly.data[0].time * 1000).getHours()], hourTemp: Math.round(data.hourly.data[0].temperature).toString().concat('°'), hourIcon: data.hourly.data[0].icon, hourPrecip: "Precip. " + (Math.round(data.hourly.data[0].precipProbability * 100)).toString().concat('%')});
          hours.push({hour: hoursOfDay[new Date(data.hourly.data[1].time * 1000).getHours()], hourTemp: Math.round(data.hourly.data[1].temperature).toString().concat('°'), hourIcon: data.hourly.data[1].icon, hourPrecip: "Precip. " + (Math.round(data.hourly.data[1].precipProbability * 100)).toString().concat('%')});
          hours.push({hour: hoursOfDay[new Date(data.hourly.data[2].time * 1000).getHours()], hourTemp: Math.round(data.hourly.data[2].temperature).toString().concat('°'), hourIcon: data.hourly.data[2].icon, hourPrecip: "Precip. " + (Math.round(data.hourly.data[2].precipProbability * 100)).toString().concat('%')});
          hours.push({hour: hoursOfDay[new Date(data.hourly.data[3].time * 1000).getHours()], hourTemp: Math.round(data.hourly.data[3].temperature).toString().concat('°'), hourIcon: data.hourly.data[3].icon, hourPrecip: "Precip. " + (Math.round(data.hourly.data[3].precipProbability * 100)).toString().concat('%')});
          hours.push({hour: hoursOfDay[new Date(data.hourly.data[4].time * 1000).getHours()], hourTemp: Math.round(data.hourly.data[4].temperature).toString().concat('°'), hourIcon: data.hourly.data[4].icon, hourPrecip: "Precip. " + (Math.round(data.hourly.data[4].precipProbability * 100)).toString().concat('%')});
          hours.push({hour: hoursOfDay[new Date(data.hourly.data[5].time * 1000).getHours()], hourTemp: Math.round(data.hourly.data[5].temperature).toString().concat('°'), hourIcon: data.hourly.data[5].icon, hourPrecip: "Precip. " + (Math.round(data.hourly.data[5].precipProbability * 100)).toString().concat('%')});
          hours.push({hour: hoursOfDay[new Date(data.hourly.data[6].time * 1000).getHours()], hourTemp: Math.round(data.hourly.data[6].temperature).toString().concat('°'), hourIcon: data.hourly.data[6].icon, hourPrecip: "Precip. " + (Math.round(data.hourly.data[6].precipProbability * 100)).toString().concat('%')});
          hours.push({hour: hoursOfDay[new Date(data.hourly.data[7].time * 1000).getHours()], hourTemp: Math.round(data.hourly.data[7].temperature).toString().concat('°'), hourIcon: data.hourly.data[7].icon, hourPrecip: "Precip. " + (Math.round(data.hourly.data[7].precipProbability * 100)).toString().concat('%')});

          $scope.oneHour = hours[0];
          $scope.twoHour = hours[1];
          $scope.threeHour = hours[2];
          $scope.fourHour = hours[3];
          $scope.fiveHour = hours[4];
          $scope.sixHour = hours[5];
          $scope.sevenHour = hours[6];

          $scope.currentWeatherLink = $sce.trustAsHtml("<a href='#/'>Current Weather</a>");
        }

        $scope.init();
    });
})();
