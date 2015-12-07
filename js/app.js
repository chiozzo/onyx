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

  var today = new Date();

  $scope.userInput = {
    receivedDate: null,
    decisionDate: null,
    notificationDate: null
  };

  $scope.caseStatus = {
    timelyDecision: null,
    timelyNotification: null,
    caseType: 'CD',
    caseExpedited: null,
    dueDate: null,
    SLA: null,
    extend24: false
  };

  $scope.calcTimelyDecision = function(){
    var receivedDate = $scope.userInput.receivedDate;
    var decisionDate = $scope.userInput.decisionDate;
    var expedited = $scope.caseStatus.caseExpedited;
    if(expedited === true){
      $scope.caseStatus.SLA = 86400000;
    } else if(expedited === false){
      $scope.caseStatus.SLA = 259200000;
    }
    if(decisionDate !== null && receivedDate !== null) {
      var timely = decisionDate - receivedDate;
      if(timely >= 0 && timely <= $scope.caseStatus.SLA){
        $scope.caseStatus.timelyDecision = true;
        console.log("timely", timely, $scope.caseStatus.timelyDecision);
      } else {
        $scope.caseStatus.timelyDecision = false;
        console.log("timely", timely, $scope.caseStatus.timelyDecision);
      }
    }
  };




  $scope.calcTimelyNotification = function(){
    var receivedDate = $scope.userInput.receivedDate;
    var notificationDate = $scope.userInput.notificationDate;
    var expedited = $scope.caseStatus.caseExpedited;
    if(expedited === true){
      $scope.caseStatus.SLA = 86400000;
    } else if(expedited === false){
      $scope.caseStatus.SLA = 259200000;
    }
    if(notificationDate !== null && receivedDate !== null) {
      var timely = notificationDate - receivedDate;
      if(timely >= 0 && timely <= $scope.caseStatus.SLA){
        $scope.caseStatus.timelyNotification = true;
        console.log("timely", timely, $scope.caseStatus.timelyNotification);
      } else {
        $scope.caseStatus.timelyNotification = false;
        console.log("timely", timely, $scope.caseStatus.timelyNotification);
      }
    }
  };

  $scope.setDueDate = function(){
    var caseType = $scope.caseStatus.caseType;
    var expedited = $scope.caseStatus.caseExpedited;
    if(caseType === 'CD' && expedited === false) {
      $scope.caseStatus.dueDate = new Date($scope.userInput.receivedDate.getTime() + 259200000);
    } else if(caseType === 'CD' && expedited === true) {
      $scope.caseStatus.dueDate = new Date($scope.userInput.receivedDate.getTime() + 86400000);
    }
    $scope.calcTimelyDecision();
    $scope.calcTimelyNotification();
  };

/**
 * Since I'm no longer using the AngularUI Bootstrap Datepicker, this code is irrelevent, but it allows for multiple datepickers in one controller.

  $scope.toggleOpen = function($event, which){
    $scope.datePopupStatus[which] = ! $scope.datePopupStatus[which];
  };
 */

}]);