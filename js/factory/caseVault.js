/**
 * This is where the compliance rules live
 */

app.factory('caseVault', [function() {
  var universe = null;

  // Set various popular timespans as varibles for ease of use
  var hours24 = 86400000;
  var hours72 = 259200000;
  var days7   = 604800000;
  var days14  = 1209600000;

  // Set compliance due date for each type of case
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

  /**
   * Sets compliance due date of case based on selected options
   */
  var setSLA = function(receivedDate, request) {
    var reimbursement = request.reimbursement;
    var caseType = request.caseType;
    var priority = request.priority;
    var extendApproval = request.extendApproval;
    var SLA = null;

    // Convert received date to epoch time for SLA calculation
    receivedDate = receivedDate.getTime();

    if (caseType === 'CD') {
      if (reimbursement) {
        // DMRCD
        SLA = days14;
        request.dueDate = new Date(new Date(receivedDate + SLA).setHours(23,59,59,999));
      } else {
        if (priority === true) {
          // ECD
          SLA = expeditedCDSLA;
        } else if (priority === false) {
          // SCD
          SLA = standardCDSLA;
        }
      }
      // Timeframe Extended CD
      if (SLA !== null) {
        if (extendApproval && request.decision === 'Approved') {
          SLA += hours24;
        }
        request.dueDate = new Date(receivedDate + SLA);
      }
    } else if (caseType === 'RD') {
      if (reimbursement) {
        // DMRRD
        SLA = days14;
        request.dueDate = new Date(new Date(receivedDate + SLA).setHours(23,59,59,999));
      } else {
        if (priority === true) {
          // ERD
          SLA = expeditedRDSLA;
        } else if (priority === false) {
          // SRD
          SLA = standardRDSLA;
        }
      }
      // Timeframe Extended RD
      if (SLA !== null) {
        if (extendApproval && request.decision === 'Approved') {
          SLA += hours24;
        }
        request.dueDate = new Date(new Date(receivedDate + SLA).setHours(23,59,59,999));
      }
    }
    return request;
  };


  /**
   * var factory is returned as the publicly exposed methods from this Angular factory/service
   */
  var factory = {
    setUniverse: function(universeFile) {
      universe = universeFile;
    },
    getUniverse: function() {
      return universe;
    },
    getCase: function(index) {
      return universe[index];
    },
    calcTimelyDecision: function(request) {
      var receivedDate = null;
      var decisionDate = request.decisionDate;
      var dueDate = request.dueDate;

      // Determine the actual received date based on exception status
      if (request.exception === true) {
        receivedDate = request.ssDate;
      } else {
        receivedDate = request.receivedDate;
      }

      var SLA = dueDate - receivedDate;

      // When decision and received dates are not null, flag decision timely bool
      if (decisionDate !== null && receivedDate !== null) {
        var timeliness = decisionDate - receivedDate;
        if (timeliness >= 0 && timeliness <= SLA) {
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
      if (request.exception === true) {
        receivedDate = request.ssDate;
      } else {
        receivedDate = request.receivedDate;
      }

      var SLA = dueDate - receivedDate;

      // When effectuation and received dates are not null, flag effectuation timely bool
      if (effectuationDate !== null && receivedDate !== null) {
        var timeliness = effectuationDate - receivedDate;
        if (timeliness >= 0 && timeliness <= SLA){
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
      if (request.exception === true) {
        receivedDate = request.ssDate;
      } else {
        receivedDate = request.receivedDate;
      }

      var SLA = dueDate - receivedDate;

      // When oral notification and received dates are not null, flag effectuation timely bool
      if (oralNotificationDate !== null && receivedDate !== null) {
        var timeliness = oralNotificationDate - receivedDate;
        if (timeliness >= 0 && timeliness <= SLA) {
          request.timelyOralNotification = true;
        } else {
          request.timelyOralNotification = false;
        }
      }
      if (request.writtenNotificationDate !== null) {
        request = recalcTimelyWrittenNotification(request);
      }
      return request;
    },
    calcTimelyWrittenNotification: function(request) {
      var receivedDate = null;
      var writtenNotificationDate = request.writtenNotificationDate;
      var dueDate = request.dueDate;

      // Determine the actual received date based on exception status
      if (request.exception === true) {
        receivedDate = request.ssDate;
      } else {
        receivedDate = request.receivedDate;
      }

      var SLA = dueDate - receivedDate;

      /**
       * If oral notification is timely, case is given additional 24 hours for written notification.
       * BUG: This extra 24 hours should ONLY apply to the written notification.
       * For instance, in a corner case where timely oral notification occurs before decision (logistically impossible; result of typo) the decision should not get the benefit of this extra 24 hours.
       */
      if (request.timelyOralNotification === true && request.priority === true) {
        SLA += hours24;
      }

      // When written notification and received dates are not null, flag effectuation timely bool
      if (writtenNotificationDate !== null && receivedDate !== null) {
        var timeliness = writtenNotificationDate - receivedDate;
        if (timeliness >= 0 && timeliness <= SLA) {
          request.timelyWrittenNotification = true;
        } else {
          request.timelyWrittenNotification = false;
        }
      }
      return request;
    },
    setDueDate: function(request) {
      var receivedDate = null;
      if (request.exception) {
        if (request.ssDate !== null) {
          receivedDate = request.ssDate;
          request = setSLA(receivedDate, request);
        }
      } else if (!request.exception) {
        if (request.receivedDate !== null) {
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