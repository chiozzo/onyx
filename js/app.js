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

  var hours24 = 86400000;
  var hours72 = 259200000;
  var days7   = 604800000;
  var days14  = 1209600000;
  var expeditedCDSLA = hours24;
  var standardCDSLA = hours72;
  var expeditedRDSLA = hours72;
  var standardRDSLA = days7;
  var DMRSLA = days14;
  var today = new Date();

  $scope.restrictInput = null;

  $scope.makeRestrictions = function() {
    $scope.restrictInput = {
      receivedMinDate: new Date(today.getTime() - days7),
      //Could this next line be a problem if the user stays logged in for many days?
      receivedMaxDate: new Date(today.getTime() + hours24)
    };
  };
  $scope.makeRestrictions();


  $scope.caseStatus = {
    receivedDate: null,
    ssDate: null,
    decisionDate: null,
    effectuationDate: null,
    writtenNotificationDate: null,
    oralNotificationDate: null,
    timelyDecision: null,
    timelyEffectuation: null,
    timelyWrittenNotification: null,
    timelyOralNotification: null,
    caseType: 'CD',
    casePriority: null,
    decision: 'Pending',
    dueDate: null,
    SLA: null,
    exceptionRequest: "What's an exception?",
    extendApproval: 'NO'
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

    // Determine the actual received date based on exception status
    if ($scope.caseStatus.exceptionRequest === 'YES') {
      receivedDate = $scope.caseStatus.ssDate;
    } else {
      receivedDate = $scope.caseStatus.receivedDate;
    }

    // When effectuation and received dates are not null, flag effectuation timely or not
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

  $scope.calcTimelyOralNotification = function() {
    var receivedDate = null;
    var oralNotificationDate = $scope.caseStatus.oralNotificationDate;
    var SLA = $scope.caseStatus.SLA;

    // Determine the actual received date based on exception status
    if ($scope.caseStatus.exceptionRequest === 'YES') {
      receivedDate = $scope.caseStatus.ssDate;
    } else {
      receivedDate = $scope.caseStatus.receivedDate;
    }

    // When effectuation and received dates are not null, flag effectuation timely or not
    if(oralNotificationDate !== null && receivedDate !== null) {
      var timeliness = oralNotificationDate - receivedDate;
      if(timeliness >= 0 && timeliness <= SLA) {
        $scope.caseStatus.timelyOralNotification = true;
      } else {
        $scope.caseStatus.timelyOralNotification = false;
      }
    }
    if($scope.caseStatus.writtenNotificationDate !== null) {
      $scope.calcTimelyWrittenNotification();
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

    if($scope.caseStatus.timelyOralNotification === true && ($scope.caseStatus.caseType === 'CD' || $scope.caseStatus.caseType === 'RD') && $scope.caseStatus.casePriority === 'Expedited') {
      SLA += hours24;
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
    var priority = $scope.caseStatus.casePriority;
    var receivedDate = null;
    var extendApproval = $scope.caseStatus.extendApproval;

    if ($scope.caseStatus.exceptionRequest === 'YES') {
      receivedDate = $scope.caseStatus.ssDate.getTime();
    } else {
      receivedDate = $scope.caseStatus.receivedDate.getTime();
      $scope.caseStatus.ssDate = null;
    }

    if(caseType === 'CD') {
      if (priority === 'Expedited') {
        $scope.caseStatus.SLA = expeditedCDSLA;
      } else if (priority === 'Standard') {
        $scope.caseStatus.SLA = standardCDSLA;
      }
      if($scope.caseStatus.SLA !== null) {
        if(extendApproval === 'YES') {
          $scope.caseStatus.SLA += hours24;
        }
        $scope.caseStatus.dueDate = new Date(receivedDate + $scope.caseStatus.SLA);
      }
    } else if (caseType === 'RD') {
      if (priority === 'Expedited') {
        $scope.caseStatus.SLA = expeditedRDSLA;
      } else if (priority === 'Standard') {
        $scope.caseStatus.SLA = standardRDSLA;
      } else {
        $scope.caseStatus.SLA = null;
      }
      if($scope.caseStatus.SLA !== null) {
        if(extendApproval === 'YES') {
          $scope.caseStatus.SLA += hours24;
        }
        $scope.caseStatus.dueDate = new Date(receivedDate + $scope.caseStatus.SLA);
        $scope.caseStatus.dueDate = $scope.caseStatus.dueDate.setHours(23,59,59,999);
      }
    } else if (caseType === 'DMR') {
      $scope.caseStatus.casePriority = null;
      $scope.caseStatus.SLA = days14;
      $scope.caseStatus.dueDate = new Date(receivedDate + $scope.caseStatus.SLA);
      $scope.caseStatus.dueDate = $scope.caseStatus.dueDate.setHours(23,59,59,999);
    }

    $scope.calcTimelyDecision();
    $scope.calcTimelyEffectuation();
    $scope.calcTimelyOralNotification();
    $scope.calcTimelyWrittenNotification();
  };

/**
 * Since I'm no longer using the AngularUI Bootstrap Datepicker, this code is irrelevent, but it allows for multiple datepickers in one controller.

  $scope.toggleOpen = function($event, which){
    $scope.datePopupStatus[which] = ! $scope.datePopupStatus[which];
  };
 */

}]);