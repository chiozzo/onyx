var app = angular.module('onyx', ['ui.router', 'ngMaterial']);

app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.otherwise('/');

	$stateProvider
  /**
    .state('auditType', {
      url: '/auditType',
      //I want multiple templatesUrls and/or controllers
    })
   */
    .state('materialTest', {
      url: '/materialTest',
      templateUrl: 'partial/materialTest.html'
    })
    .state('fileUpload', {
      url: '/fileUpload',
      templateUrl: 'partial/fileUpload.html'
    })
		.state('singleCase', {
			url:'/singleCase',
			templateUrl: 'partial/singleCase.html',
			controller: 'singleCaseController as singleCaseCtrl'
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