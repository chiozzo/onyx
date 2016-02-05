var app = angular.module('onyx', ['ui.router', 'ngMaterial', 'ngMessages']);

app.config(['$stateProvider', '$urlRouterProvider', '$mdThemingProvider', function($stateProvider, $urlRouterProvider, $mdThemingProvider) {
	$urlRouterProvider.otherwise('/');

	$stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'partial/home.html'
    })
    .state('materialTest', {
      url: '/materialTest',
      templateUrl: 'partial/materialTest.html',
    })
    .state('universeList', {
      url:'/universe',
      templateUrl: 'partial/universeList.html',
      controller: 'universeController as universeCtrl'
    })
    .state('intro', {
      url:'/intro',
      templateUrl: 'intro.html'
    });
    $mdThemingProvider.theme('default')
    .primaryPalette('blue')
    .accentPalette('purple')
    .warnPalette('red');
}]);