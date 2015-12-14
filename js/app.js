var app = angular.module('onyx', ['ui.router', 'ui.bootstrap']);

app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.otherwise('/');

	$stateProvider
		.state('case', {
			url:'/case',
			templateUrl: 'partial/case.html',
			controller: 'caseController'
		})
    .state('universe', {
      url:'/universe',
      templateUrl: 'partial/universeList.html',
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

    universe.map(function(request, index, array) {
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

  $scope.calcTimelyDecision = function(request) {
    var receivedDate = null;
    var decisionDate = request.decisionDate;
    var SLA = request.SLA;

    // Determine the actual received date based on exception status
    if (request.exceptionRequest === 'YES') {
      receivedDate = request.ssDate;
    } else {
      receivedDate = request.receivedDate;
    }

    // When decision and received dates are not null, flag decision timely or not
    if(decisionDate !== null && receivedDate !== null) {
      var timeliness = decisionDate - receivedDate;
      if(timeliness >= 0 && timeliness <= SLA) {
        request.timelyDecision = true;
        console.log("timeliness", timeliness, request.timelyDecision);
      } else {
        request.timelyDecision = false;
        console.log("timeliness", timeliness, request.timelyDecision);
      }
    }
  };

  $scope.calcTimelyEffectuation = function(request){
    var receivedDate = null;
    var effectuationDate = request.effectuationDate;
    var SLA = request.SLA;

    // Determine the actual received date based on exception status
    if (request.exceptionRequest === 'YES') {
      receivedDate = request.ssDate;
    } else {
      receivedDate = request.receivedDate;
    }

    // When effectuation and received dates are not null, flag effectuation timely or not
    if(effectuationDate !== null && receivedDate !== null) {
      var timeliness = effectuationDate - receivedDate;
      if(timeliness >= 0 && timeliness <= SLA){
        request.timelyEffectuation = true;
        console.log("timeliness", timeliness, request.timelyEffectuation);
      } else {
        request.timelyEffectuation = false;
        console.log("timeliness", timeliness, request.timelyEffectuation);
      }
    }
  };

  $scope.calcTimelyOralNotification = function(request) {
    var receivedDate = null;
    var oralNotificationDate = request.oralNotificationDate;
    var SLA = request.SLA;

    // Determine the actual received date based on exception status
    if (request.exceptionRequest === 'YES') {
      receivedDate = request.ssDate;
    } else {
      receivedDate = request.receivedDate;
    }

    // When effectuation and received dates are not null, flag effectuation timely or not
    if(oralNotificationDate !== null && receivedDate !== null) {
      var timeliness = oralNotificationDate - receivedDate;
      if(timeliness >= 0 && timeliness <= SLA) {
        request.timelyOralNotification = true;
      } else {
        request.timelyOralNotification = false;
      }
    }
    if(request.writtenNotificationDate !== null) {
      $scope.calcTimelyWrittenNotification(request);
    }
  };

  $scope.calcTimelyWrittenNotification = function(request) {
    var receivedDate = null;
    var writtenNotificationDate = request.writtenNotificationDate;
    var SLA = request.SLA;

    if (request.exceptionRequest === 'YES') {
      receivedDate = request.ssDate;
    } else {
      receivedDate = request.receivedDate;
    }

    if(request.timelyOralNotification === true && (request.caseType === 'CD' || request.caseType === 'RD') && request.casePriority === 'Expedited') {
      SLA += hours24;
    }

    if(writtenNotificationDate !== null && receivedDate !== null) {
      var timeliness = writtenNotificationDate - receivedDate;
      if(timeliness >= 0 && timeliness <= SLA) {
        request.timelyWrittenNotification = true;
      } else {
        request.timelyWrittenNotification = false;
      }
    }
  };

  $scope.setDueDate = function(receivedDate, request) {
    var caseType = request.caseType;
    var priority = request.casePriority;
    var extendApproval = request.extendApproval;

    if(caseType === 'CD') {
      if (priority === 'Expedited') {
        request.SLA = expeditedCDSLA;
      } else if (priority === 'Standard') {
        request.SLA = standardCDSLA;
      }
      if(request.SLA !== null) {
        if(extendApproval === 'YES') {
          request.SLA += hours24;
        }
        request.dueDate = new Date(receivedDate + request.SLA);
      }
    } else if (caseType === 'RD') {
      if (priority === 'Expedited') {
        request.SLA = expeditedRDSLA;
      } else if (priority === 'Standard') {
        request.SLA = standardRDSLA;
      } else {
        request.SLA = null;
      }
      if(request.SLA !== null) {
        if(extendApproval === 'YES') {
          request.SLA += hours24;
        }
        request.dueDate = new Date(receivedDate + request.SLA);
        request.dueDate = request.dueDate.setHours(23,59,59,999);
      }
    } else if (caseType === 'DMR') {
      request.casePriority = null;
      request.SLA = days14;
      request.dueDate = new Date(receivedDate + request.SLA);
      request.dueDate = request.dueDate.setHours(23,59,59,999);
    }
  };

  $scope.validateDueDate = function(request) {
    var receivedDate = null;

    if (request.exceptionRequest === 'YES') {
      if(request.ssDate !== null) {
        receivedDate = request.ssDate.getTime();
        $scope.setDueDate(receivedDate, request);
      }
    } else {
      if(request.receivedDate !== null) {
        receivedDate = request.receivedDate.getTime();
        request.ssDate = null;
        $scope.setDueDate(receivedDate, request);
      }
    }

    $scope.calcTimelyDecision(request);
    $scope.calcTimelyEffectuation(request);
    $scope.calcTimelyOralNotification(request);
    $scope.calcTimelyWrittenNotification(request);
  };

/**
 * Since I'm no longer using the AngularUI Bootstrap Datepicker, this code is irrelevent, but it allows for multiple datepickers in one controller.

  $scope.toggleOpen = function($event, which){
    $scope.datePopupStatus[which] = ! $scope.datePopupStatus[which];
  };
 */

}]);