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
    var caseType = request.caseType;
    var priority = request.priority;
    var extendApproval = request.extendApproval;
    var SLA = null;
    receivedDate = receivedDate.getTime();

    // Implement switch here

    if(caseType === 'CD') {
      if(false) {
        // set DMR SLA
      } else {
        if (priority === true) {
          SLA = expeditedCDSLA;
        } else if (priority === false) {
          SLA = standardCDSLA;
        }
      }
      if(SLA !== null) {
        if(extendApproval && request.decision === 'Approved') {
          SLA += hours24;
        }
        request.dueDate = new Date(receivedDate + SLA);
      }
    } else if (caseType === 'RD') {
      if(false) {
        // set DMR SLA
      } else {
        if (priority === true) {
          SLA = expeditedRDSLA;
        } else if (priority === false) {
          SLA = standardRDSLA;
        } else {
          SLA = null;
        }
      }
      if(SLA !== null) {
        if(extendApproval && request.decision === 'Approved') {
          SLA += hours24;
        }
        request.dueDate = new Date(new Date(receivedDate + SLA).setHours(23,59,59,999));
      }
    }/* else if (caseType === 'DMR') {
      request.priority = null;
      SLA = days14;
      request.dueDate = new Date(receivedDate + SLA);
      request.dueDate = request.dueDate.setHours(23,59,59,999);
    }*/
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
      if (request.exceptionRequest === true) {
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
      if (request.exceptionRequest === true) {
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
      if (request.exceptionRequest === true) {
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

      if (request.exceptionRequest === true) {
        receivedDate = request.ssDate;
      } else {
        receivedDate = request.receivedDate;
      }

      var SLA = dueDate - receivedDate;

      if(request.timelyOralNotification === true && request.priority === true) {
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
      if (request.exceptionRequest) {
        if(request.ssDate !== null) {
          receivedDate = request.ssDate;
          request = setSLA(receivedDate, request);
        }
      } else if (!request.exceptionRequest) {
        if(request.receivedDate !== null) {
          receivedDate = request.receivedDate;
          request = setSLA(receivedDate, request);
        }
      }
      request = recalcTimelyCase(request);
      return request;
    }
  };
  return factory;
}]);