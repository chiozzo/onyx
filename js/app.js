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

/**
 * This directive is a copy pasta job and I'm not entirely sure how it works yet.
 * http://stackoverflow.com/questions/25652959/angular-file-upload-without-local-server
 */
app.directive('onReadFile', ['$parse', '$state', function($parse, $state){
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
            $state.go('universeList');
          };

          reader.readAsText((onChangeEvent.srcElement || onChangeEvent.target).files[0]);
        });

      }
    };
  }
]);

app.factory('caseVault', [function() {
  var universe = null;
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

  var recalcTimelyWrittenNotification = function(request) {
    return factory.calcTimelyWrittenNotification(request);
  };

  var recalcTimelyCase = function(request) {
    request = factory.calcTimelyDecision(request);
    request = factory.calcTimelyEffectuation(request);
    request = factory.calcTimelyOralNotification(request);
    return request;
  };

  var setSLA = function(receivedDate, request) {
    // console.log("receivedDate", receivedDate);
    var caseType = request.caseType;
    var priority = request.casePriority;
    var extendApproval = request.extendApproval;
    var SLA = null;
    receivedDate = receivedDate.getTime();

    if(caseType === 'CD') {
      if (priority === 'Expedited') {
        SLA = expeditedCDSLA;
      } else if (priority === 'Standard') {
        SLA = standardCDSLA;
      }
      if(SLA !== null) {
        if(extendApproval === 'YES') {
          SLA += hours24;
        }
        request.dueDate = new Date(receivedDate + SLA);
      }
    } else if (caseType === 'RD') {
      if (priority === 'Expedited') {
        SLA = expeditedRDSLA;
      } else if (priority === 'Standard') {
        SLA = standardRDSLA;
      } else {
        SLA = null;
      }
      if(SLA !== null) {
        if(extendApproval === 'YES') {
          SLA += hours24;
        }
        request.dueDate = new Date(receivedDate + SLA);
        request.dueDate = request.dueDate.setHours(23,59,59,999);
      }
    } else if (caseType === 'DMR') {
      request.casePriority = null;
      SLA = days14;
      request.dueDate = new Date(receivedDate + SLA);
      request.dueDate = request.dueDate.setHours(23,59,59,999);
    }
    return request;
  };

  var factory = {
    getUniverse: function() {
      return universe;
    },
    setUniverse: function(universeFile) {
      universe = universeFile;
      console.log("setUniverse in caseVault", universe);
    },
    getCase: function(index) {
      return universe[index];
    },
    calcTimelyDecision: function(request) {
      var receivedDate = null;
      var decisionDate = request.decisionDate;
      var dueDate = request.dueDate;

      // Determine the actual received date based on exception status
      if (request.exceptionRequest === 'YES') {
        receivedDate = request.ssDate;
      } else {
        receivedDate = request.receivedDate;
      }

      var SLA = dueDate - receivedDate;

      // When decision and received dates are not null, flag decision timely or not
      if(decisionDate !== null && receivedDate !== null) {
        var timeliness = decisionDate - receivedDate;
        if(timeliness >= 0 && timeliness <= SLA) {
          request.timelyDecision = true;
        } else {
          request.timelyDecision = false;
        }
      }
      return request;
    },
    calcTimelyEffectuation: function(request){
      var receivedDate = null;
      var effectuationDate = request.effectuationDate;
      var dueDate = request.dueDate;

      // Determine the actual received date based on exception status
      if (request.exceptionRequest === 'YES') {
        receivedDate = request.ssDate;
      } else {
        receivedDate = request.receivedDate;
      }

      var SLA = dueDate - receivedDate;

      // When effectuation and received dates are not null, flag effectuation timely or not
      if(effectuationDate !== null && receivedDate !== null) {
        var timeliness = effectuationDate - receivedDate;
        if(timeliness >= 0 && timeliness <= SLA){
          request.timelyEffectuation = true;
        } else {
          request.timelyEffectuation = false;
        }
      }
      return request;
    },
    calcTimelyOralNotification: function(request) {
      var receivedDate = null;
      var oralNotificationDate = request.oralNotificationDate;
      var dueDate = request.dueDate;

      // Determine the actual received date based on exception status
      if (request.exceptionRequest === 'YES') {
        receivedDate = request.ssDate;
      } else {
        receivedDate = request.receivedDate;
      }

      var SLA = dueDate - receivedDate;

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
        request = recalcTimelyWrittenNotification(request);
      }
      return request;
    },
    calcTimelyWrittenNotification: function(request) {
      var receivedDate = null;
      var writtenNotificationDate = request.writtenNotificationDate;
      var dueDate = request.dueDate;

      if (request.exceptionRequest === 'YES') {
        receivedDate = request.ssDate;
      } else {
        receivedDate = request.receivedDate;
      }

      var SLA = dueDate - receivedDate;

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
      return request;
    },
    setDueDate: function(request) {
      var receivedDate = null;

      if (request.exceptionRequest === 'YES') {
        if(request.ssDate !== null) {
          receivedDate = request.ssDate;
          request = setSLA(receivedDate, request);
        }
      } else {
        if(request.receivedDate !== null) {
          receivedDate = request.receivedDate;
          request.ssDate = null;
          request = setSLA(receivedDate, request);
        }
      }
      request = recalcTimelyCase(request);
      return request;
    }
  };
  return factory;
}]);

app.controller('universeController', ['caseVault', function(caseVault) {
  var self = this;
  self.universe = caseVault.getUniverse();

  self.untimelyDecisions = self.universe.filter(function(request, index, array) {
    if(!request.timelyDecision) {
      return request;
    }
  });
  console.log("self.untimelyDecisions", self.untimelyDecisions);

  self.untimelyEffectuations = self.universe.filter(function(request, index, array) {
    if(!request.timelyEffectuation) {
      return request;
    }
  });
  console.log("self.untimelyEffectuations", self.untimelyEffectuations);

  self.untimelyNotifications = self.universe.filter(function(request, index, array) {
    if(!request.timelyOralNotification || !request.timelyWrittenNotification) {
      return request;
    }
  });
  console.log("self.untimelyNotifications", self.untimelyNotifications);







}]);

app.controller('universeDetailController', ['$stateParams', 'caseVault', function($stateParams, caseVault) {
  var self = this;
  console.log("$stateParams.index", $stateParams.index);
  var caseID = $stateParams.index;
  console.log("caseVault.getCase(caseID)", caseVault.getCase(caseID));
  self.selectedRequest = caseVault.getCase(caseID);
  console.log("self.selectedRequest", self.selectedRequest);
}]);

app.controller('importUniverse', ['caseVault', function(caseVault) {
  var self = this;

  self.CMSToDate = function(dateInput, timeInput) {
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
 * parseInputFile is a copy pasta function and uses the directive 'onReadFile'.
 */
  self.parseInputFile = function(fileText){
    if (!caseVault.getUniverse()) {
    // fileText = fileText.replace(/( )/g, '_');
    // Need functionality to convert tab delimited to JSON. fileText is loading JSON file in meantime.

    /**
     * BUG: JSON.parse does not recognize CMS formatted times prior to 10:00:00 because the number begins with 0. Must be string.
     */
    var universe = JSON.parse(fileText);
    universe.map(function(request, index, array) {
      request.receivedDate = self.CMSToDate(request["Date the request was received"], request["Time the request was received"]);
      request.decisionDate = self.CMSToDate(request["Date of plan decision"], request["Time of plan decision"]);
      request.effectuationDate = self.CMSToDate(request["Date effectuated in the plan's system"], request["Time effectuated in the plans' system"]);
      request.oralNotificationDate = self.CMSToDate(request["Date oral notification provided to enrollee"], request["Time oral notification provided to enrollee"]);
      request.writtenNotificationDate = self.CMSToDate(request["Date written notification provided to enrollee"], request["Time written notification provided to enrollee"]);
      request.caseType = 'CD';
      request.casePriority = 'Standard';
      request.decision = request["Was the case approved or denied?"];
      // "Disposition of the request" is also a field that may need to be evaluated
      // request.ssDate = null;
      request = caseVault.setDueDate(request);
      request.exceptionRequest = "What's an exception?";
      request.extendApproval = 'NO';
      return request;
    });
    caseVault.setUniverse(universe);
    }
  };

}]);

app.controller('caseController', ['caseVault', function (caseVault) {
  var self = this;
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

  self.restrictInput = null;

  self.makeRestrictions = function() {
    self.restrictInput = {
      receivedMinDate: new Date(today.getTime() - days7),
      //Could next line be a problem if the user stays logged in for many days?
      receivedMaxDate: new Date(today.getTime() + hours24)
    };
  };
  self.makeRestrictions();


  self.caseStatus = {
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



/**
 * Since I'm no longer using the AngularUI Bootstrap Datepicker, this code is irrelevent, but it allows for multiple datepickers in one controller.

  this.toggleOpen = function($event, which){
    this.datePopupStatus[which] = ! this.datePopupStatus[which];
  };
 */

}]);