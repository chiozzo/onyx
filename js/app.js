var app = angular.module('onyx', ['ui.router', 'ngMaterial', 'ngMessages']);

app.config(['$stateProvider', '$urlRouterProvider', '$mdThemingProvider', function($stateProvider, $urlRouterProvider, $mdThemingProvider) {
	$urlRouterProvider.otherwise('/');

	$stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'partial/home.html'
    })
    .state('universeList', {
      url:'/universe',
      templateUrl: 'partial/universeList.html',
      controller: 'universeController as universeCtrl'
    });
    $mdThemingProvider.theme('default')
    .primaryPalette('blue')
    .accentPalette('purple')
    .warnPalette('red');
}]);