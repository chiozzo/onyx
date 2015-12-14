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

/**
 * This directive is a copy pasta job and I'm not entirely sure how it works yet.
 * http://stackoverflow.com/questions/25652959/angular-file-upload-without-local-server
 */
app.directive('onReadFile', ['$parse',
  function($parse){
    return {
      restrict: 'A',
      scope: false,
      link: function(scope, ele, attrs) {

        var fn = $parse(attrs.onReadFile);
        ele.on('change', function(onChangeEvent){
          var reader = new FileReader();

          reader.onload = function(onLoadEvent) {
            scope.$apply(function(){
              fn(scope, {$fileContents: onLoadEvent.target.result} );
            });
          };

          reader.readAsText((onChangeEvent.srcElement || onChangeEvent.target).files[0]);
        });

      }
    };
  }
]);

app.controller('caseController', ['$scope', '$log', function ($scope, $log) {
  $scope.fileUpload = null;

  $scope.CMSToDate = function(dateInput, timeInput) {
    dateInput = dateInput.toString().split("");
    timeInput = timeInput.toString().split("");
    var year = dateInput.splice(0,4).join('');
    var month = dateInput.splice(0,2).join('');
    var day = dateInput.splice(0,2).join('');
    var hour = timeInput.splice(0,2).join('');
    var minute = timeInput.splice(0,2).join('');
    var second = timeInput.splice(0,2).join('');
    return new Date(year, month - 1, day, hour, minute, second);
  };

/**
 * This function is a copy pasta job and uses the directive 'onReadFile'.
 */
  $scope.parseInputFile = function(fileText){
    // fileText is still tab delimited, write function to convert to JSON
    var universe = JSON.parse(fileText);

    universe.filter(function(request, index, array) {
      request.receivedDate = $scope.CMSToDate(request["Date the request was received"], request["Time the request was received"]);
      request.decisionDate = $scope.CMSToDate(request["Decision Date"], request["Time of plan decision"]);
      request.effectuationDate = $scope.CMSToDate(request["Date effectuated in the plan's system"], request["Time effectuated in the plans' system"]);
      request.oralNotificationDate = $scope.CMSToDate(request["Date oral notification provided to enrollee"], request["Time oral notification provided to enrollee"]);
      request.writtenNotificationDate = $scope.CMSToDate(request["Date written notification provided to enrollee"], request["Time written notification provided to enrollee"]);
      request.caseType = 'CD';
      request.casePriority = 'Expedited';
      request.decision = request["Was the case approved or denied?"];
      // "Disposition of the request" is also a field that may need to be evaluated
      return request;
    });
    console.log("universe", universe);
    //move JSON file to factory
    $scope.fileUpload = universe;
  };

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

  $scope.setDueDate = function(receivedDate) {
    var caseType = $scope.caseStatus.caseType;
    var priority = $scope.caseStatus.casePriority;
    var extendApproval = $scope.caseStatus.extendApproval;

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
  };

  $scope.validateDueDate = function() {
    var receivedDate = null;

    if ($scope.caseStatus.exceptionRequest === 'YES') {
      if($scope.caseStatus.ssDate !== null) {
        receivedDate = $scope.caseStatus.ssDate.getTime();
        $scope.setDueDate(receivedDate);
      }
    } else {
      if($scope.caseStatus.receivedDate !== null) {
        receivedDate = $scope.caseStatus.receivedDate.getTime();
        $scope.caseStatus.ssDate = null;
        $scope.setDueDate(receivedDate);
      }
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