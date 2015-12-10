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
    writtenNotificationDate: null,
    ssDate: null,
    timelyDecision: null,
    timelyEffectuation: null,
    timelyWrittenNotification: null,
    timelySS: null,
    caseType: 'CD',
    casePriority: null,
    decision: 'Pending',
    dueDate: null,
    SLA: null,
    exceptionRequest: "What's an exception?",
    extendedApproval: 'NO'
  };

  $scope.calcTimelyDecision = function() {
    var receivedDate = null;
    var decisionDate = $scope.caseStatus.decisionDate;
    var SLA = $scope.caseStatus.SLA;

    // Determine the actual received date based on exception status
    if ($scope.caseStatus.exceptionRequest === 'YES') {
      receivedDate = $scope.caseStatus.ssDate;
    } else {
      receivedDate = $scope.caseStatus.receivedDate;
    }

    // When decision and received dates are not null, flag decision timely or not
    if(decisionDate !== null && receivedDate !== null) {
      var timeliness = decisionDate - receivedDate;
      if(timeliness >= 0 && timeliness <= SLA) {
        $scope.caseStatus.timelyDecision = true;
        console.log("timeliness", timeliness, $scope.caseStatus.timelyDecision);
      } else {
        $scope.caseStatus.timelyDecision = false;
        console.log("timeliness", timeliness, $scope.caseStatus.timelyDecision);
      }
    }
  };

  $scope.calcTimelyEffectuation = function(){
    var receivedDate = null;
    var effectuationDate = $scope.caseStatus.effectuationDate;
    var SLA = $scope.caseStatus.SLA;

    if ($scope.caseStatus.exceptionRequest === 'YES') {
      receivedDate = $scope.caseStatus.ssDate;
    } else {
      receivedDate = $scope.caseStatus.receivedDate;
    }

    if(effectuationDate !== null && receivedDate !== null) {
      var timeliness = effectuationDate - receivedDate;
      if(timeliness >= 0 && timeliness <= SLA){
        $scope.caseStatus.timelyEffectuation = true;
        console.log("timeliness", timeliness, $scope.caseStatus.timelyEffectuation);
      } else {
        $scope.caseStatus.timelyEffectuation = false;
        console.log("timeliness", timeliness, $scope.caseStatus.timelyEffectuation);
      }
    }
  };

  $scope.calcTimelyWrittenNotification = function() {
    var receivedDate = null;
    var writtenNotificationDate = $scope.caseStatus.writtenNotificationDate;
    var SLA = $scope.caseStatus.SLA;

    if ($scope.caseStatus.exceptionRequest === 'YES') {
      receivedDate = $scope.caseStatus.ssDate;
    } else {
      receivedDate = $scope.caseStatus.receivedDate;
    }

    if(writtenNotificationDate !== null && receivedDate !== null) {
      var timeliness = writtenNotificationDate - receivedDate;
      if(timeliness >= 0 && timeliness <= SLA) {
        $scope.caseStatus.timelyWrittenNotification = true;
      } else {
        $scope.caseStatus.timelyWrittenNotification = false;
      }
    }
  };

  $scope.setDueDate = function() {
    var caseType = $scope.caseStatus.caseType;
    var expedited = $scope.caseStatus.casePriority;
    var receivedDate = null;
    var extendedApproval = $scope.caseStatus.extendedApproval;

    if ($scope.caseStatus.exceptionRequest === 'YES') {
      receivedDate = $scope.caseStatus.ssDate.getTime();
    } else {
      receivedDate = $scope.caseStatus.receivedDate.getTime();
    }

    if(caseType === 'CD') {
      if (expedited === 'Expedited') {
        $scope.caseStatus.SLA = 86400000;
      } else if (expedited === 'Standard') {
        $scope.caseStatus.SLA = 259200000;
      }
      if(extendedApproval === 'YES') {
        $scope.caseStatus.SLA = $scope.caseStatus.SLA + 259200000;
      }
      $scope.caseStatus.dueDate = new Date(receivedDate + $scope.caseStatus.SLA);
    } else if (caseType === 'RD') {
      $scope.caseStatus.dueDate = null;
      if (expedited === 'Expedited') {
        $scope.caseStatus.SLA = 259200000;
      } else if (expedited === 'Standard') {
        $scope.caseStatus.SLA = 604800000;
      }
      $scope.caseStatus.dueDate = new Date(receivedDate + $scope.caseStatus.SLA);
      $scope.caseStatus.dueDate = $scope.caseStatus.dueDate.setHours(23,59,59,999);
      if(extendedApproval === 'YES') {
        $scope.caseStatus.SLA = $scope.caseStatus.SLA + 259200000;
      }
    } else if (caseType === 'DMR') {
      $scope.caseStatus.casePriority = null;
      $scope.caseStatus.SLA = 1209600000;
      $scope.caseStatus.dueDate = new Date(receivedDate + $scope.caseStatus.SLA);
      $scope.caseStatus.dueDate = $scope.caseStatus.dueDate.setHours(23,59,59,999);
    }

    $scope.calcTimelyDecision();
    $scope.calcTimelyWrittenNotification();
  };

/**
 * Since I'm no longer using the AngularUI Bootstrap Datepicker, this code is irrelevent, but it allows for multiple datepickers in one controller.

  $scope.toggleOpen = function($event, which){
    $scope.datePopupStatus[which] = ! $scope.datePopupStatus[which];
  };
 */

}]);