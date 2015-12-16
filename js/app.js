var app = angular.module('onyx', ['ui.router', 'ui.bootstrap']);

app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.otherwise('/');

	$stateProvider
		.state('singleCase', {
			url:'/case',
			templateUrl: 'partial/case.html',
			controller: 'caseController as caseCtrl'
		})
    .state('universeList', {
      url:'/universe',
      templateUrl: 'partial/universeList.html',
      controller: 'universeController as universeCtrl'
    })
    .state('universeCase', {
      url:'/universe/:index',
      templateUrl: 'partial/universeCase.html',
      controller: 'universeDetailController as universeDetailCtrl'
    });
}]);