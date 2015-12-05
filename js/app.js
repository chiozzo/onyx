var app = angular.module('onyx', ['ui.router', 'ui.bootstrap']);

app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.otherwise('/');

	$stateProvider
		.state('case', {
			url:'/',
			templateUrl: 'partial/case.html',
			controller: 'caseController'
		});
}]);

app.controller('caseController', ['$scope', '$log', function ($scope, $log) {

  console.log('Onyx is live!');


/**
 * ui.bootstrap datepicker
 */
  $scope.dateStatus = {
    receivedDate: false,
    decisionDate: false
  };

  $scope.today = function() {
    $scope.receivedDate = new Date();
    $scope.decisionDate = new Date();
  };
  $scope.today();

  $scope.toggleOpen = function($event, which) {
    $event.preventDefault();
    $event.stopPropagation();

    $scope.dateStatus[which] = ! $scope.dateStatus[which];
  };

  $scope.dateOptions = {
    'year-format': "'yy'",
    'starting-day': 1
  };

  $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'shortDate'];
  $scope.format = $scope.formats[0];
  /**
   * END datepicker
   */

}]);