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

  var today = new Date();

  $scope.caseStatus = {
    receivedDate: null,
    decisionDate: null,
    effectuationDate: null,
    notificationDate: null,
    supSDate: null,
    timelyDecision: null,
    timelyEffectution: null,
    timelyNotification: null,
    timelySS: null,
    caseType: 'CD',
    caseExpedited: null,
    decision: "Pending",
    dueDate: null,
    SLA: null,
    exceptionRequest: "What's an exception?",
    extendedApproval: false
  };

  $scope.calcTimelyDecision = function(){
    var receivedDate = null;
    var decisionDate = $scope.caseStatus.decisionDate;
    var expedited = $scope.caseStatus.caseExpedited;
    var SLA = $scope.caseStatus.SLA;

    if ($scope.caseStatus.exceptionRequest === 'Yes') {
      receivedDate = $scope.caseStatus.supSDate;
    } else {
      receivedDate = $scope.caseStatus.receivedDate;
    }

    if(decisionDate !== null && receivedDate !== null) {
      var timeliness = decisionDate - receivedDate;
      if(timeliness >= 0 && timeliness <= SLA){
        $scope.caseStatus.timelyDecision = true;
        console.log("timeliness", timeliness, $scope.caseStatus.timelyDecision);
      } else {
        $scope.caseStatus.timelyDecision = false;
        console.log("timeliness", timeliness, $scope.caseStatus.timelyDecision);
      }
    }
  };

  $scope.calcTimelyEffectuation = function(){
    console.log('calcTimelyEffectuation() run');

    var receivedDate = null;
    var effectuationDate = $scope.caseStatus.effectuationDate;
    var SLA = $scope.caseStatus.SLA;

    if ($scope.caseStatus.exceptionRequest === 'Yes') {
      receivedDate = $scope.caseStatus.supSDate;
    } else {
      receivedDate = $scope.caseStatus.receivedDate;
    }

    if(effectuationDate !== null && receivedDate !== null) {
      var timeliness = effectuationDate - receivedDate;
      if(timeliness >= 0 && timeliness <= SLA){
        $scope.caseStatus.timelyEffectution = true;
        console.log("timeliness", timeliness, $scope.caseStatus.timelyEffectution);
      } else {
        $scope.caseStatus.timelyEffectution = false;
        console.log("timeliness", timeliness, $scope.caseStatus.timelyEffectution);
      }
    }
  };




  $scope.calcTimelyNotification = function(){
    var receivedDate = null;
    var notificationDate = $scope.caseStatus.notificationDate;
    var SLA = $scope.caseStatus.SLA;

    if ($scope.caseStatus.exceptionRequest === 'Yes') {
      receivedDate = $scope.caseStatus.supSDate;
    } else {
      receivedDate = $scope.caseStatus.receivedDate;
    }

    if(notificationDate !== null && receivedDate !== null) {
      var timeliness = notificationDate - receivedDate;
      if(timeliness >= 0 && timeliness <= SLA){
        $scope.caseStatus.timelyNotification = true;
        console.log("timeliness", timeliness, $scope.caseStatus.timelyNotification);
      } else {
        $scope.caseStatus.timelyNotification = false;
        console.log("timeliness", timeliness, $scope.caseStatus.timelyNotification);
      }
    }
  };

  $scope.setDueDate = function(){
    var caseType = $scope.caseStatus.caseType;
    var expedited = $scope.caseStatus.caseExpedited;
    var receivedDate = null;

    if ($scope.caseStatus.exceptionRequest === 'Yes') {
      receivedDate = $scope.caseStatus.supSDate.getTime();
    } else {
      receivedDate = $scope.caseStatus.receivedDate.getTime();
    }

    if(expedited === true){
      $scope.caseStatus.SLA = 86400000;
    } else if(expedited === false){
      $scope.caseStatus.SLA = 259200000;
    }

    if(caseType === 'CD') {
      if (expedited === false) {
        $scope.caseStatus.dueDate = new Date(receivedDate + 259200000);
      } else if (expedited === true) {
        $scope.caseStatus.dueDate = new Date(receivedDate + 86400000);
      }
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