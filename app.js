(function(){
  "use strict";
  angular
    .module('weatherApp',[
      'ngRoute'
    ])
    .config(function($routeProvider){
      $routeProvider
        .when('/', {
          templateUrl: 'views/main.html',
          controller: 'MainController'
        })
        .when('/hourly', {
          templateUrl: 'views/hourly.html',
          controller:'MainController'
        })
        .when('/404',{
          template: '<h2>Sorry not found</h2>'
        })
        .otherwise({
          redirectTo: '/404'
        })

    });

})();
