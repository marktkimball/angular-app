angular.module('starter.controllers', [])

.controller('CurrentController', function($scope, WeatherService) {
  // $scope.Model = $scope.Model || {Name : "xxx"};
  $scope.init = function(){
    $scope.getCurrentLocationWeather();
  }


  $scope.getAddress = function(newAddress){
    $scope.getWeather(newAddress);
    this.address = "";
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
            $scope.displayLocation = results[0].formatted_address;
          }else{
            for(var i = 0; i < results.length; i++){
              if(results[i].types[0] === "locality"){
                $scope.displayLocation = results[i].formatted_address;
                break;
              }
            };
          }
          var newData = WeatherService.getUseData();
          weatherFunction(newData);
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
        var newData = WeatherService.getUseData();
        weatherFunction(newData);
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
  }

  $scope.init();

})

.controller('DailyController', function($scope, WeatherService) {

  var newData = WeatherService.getUseData();

  weatherFunction(newData);

  function weatherFunction(data){

    var daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var days = [];
    for(var i = 0; i < 6; i++){
      days.push({day: daysOfWeek[new Date(data.daily.data[i].time * 1000).getDay()], dayHigh: "High " + Math.round(data.daily.data[i].temperatureMax).toString().concat('°'), dayLow: "Low " + Math.round(data.daily.data[i].temperatureMin).toString().concat('°'), dailyIcon: data.daily.data[i].icon, dayPrecip: "Precip. " + (Math.round(data.daily.data[i].precipProbability * 100)).toString().concat('%')});
    };

    $scope.days = days;
  }

  var watchCallback = function(){
    var newData = WeatherService.getUseData();
    weatherFunction(newData);
  }

  $scope.$on('weather:updated', watchCallback);
})

.controller('HourlyController', function($scope, WeatherService) {
  var newData = WeatherService.getUseData();

  weatherFunction(newData);

  function weatherFunction(data){
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
    for(var j = 0; j < 7; j++){
      hours.push({hour: hoursOfDay[new Date(data.hourly.data[j].time * 1000).getHours()], hourTemp: Math.round(data.hourly.data[j].temperature).toString().concat('°'), hourIcon: data.hourly.data[j].icon, hourPrecip: "Precip. " + (Math.round(data.hourly.data[j].precipProbability * 100)).toString().concat('%')});
    };

    $scope.hours = hours;
  }

  var watchCallback = function(){
    var newData = WeatherService.getUseData();
    weatherFunction(newData);
  }

  $scope.$on('weather:updated', watchCallback);
});
