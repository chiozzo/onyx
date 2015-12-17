app.controller('importUniverse', ['caseVault', function(caseVault) {
  var self = this;

  self.universeType = null;


  self.universeTypes = {
    SCDER: {
      receivedDate: "Date the request was received",
      receivedTime: "Time the request was received",
      decisionDate: "Date of plan decision",
      decisionTime: "Time of plan decision",
      effectuationDate: "Date effectuated in the plan's system",
      effectuationTime: "Time effectuated in the plans' system",
      oralNotificationDate: "Date oral notification provided to enrollee",
      oralNotificationTime: "Time oral notification provided to enrollee",
      writtenNotificationDate: "Date written notification provided to enrollee",
      writtenNotificationTime: "Time written notification provided to enrollee",
      ssDate: "Date prescriber supporting statement received",
      ssTime: "Time prescriber supporting statement received"
    },
    ECDER: {
      receivedDate: "Date the request was received",
      receivedTime: "Time the request was received",
      decisionDate: "Date of plan decision",
      decisionTime: "Time of plan decision",
      effectuationDate: "Date effectuated in the plan's system",
      effectuationTime: "Time effectuated in the plans' system",
      oralNotificationDate: "Date oral notification provided to enrollee",
      oralNotificationTime: "Time oral notification provided to enrollee",
      writtenNotificationDate: "Date written notification provided to enrollee",
      writtenNotificationTime: "Time written notification provided to enrollee",
      ssDate: "Date prescriber supporting statement received",
      ssTime: "Time prescriber supporting statement received"
    },
    SCD: {
      receivedDate: "Date the request was received",
      receivedTime: "Time the request was received",
      decisionDate: "Date of plan decision",
      decisionTime: "Time of plan decision",
      effectuationDate: "Date effectuated in the plan's system",
      effectuationTime: "Time effectuated in the plans' system",
      oralNotificationDate: "Date oral notification provided to enrollee",
      oralNotificationTime: "Time oral notification provided to enrollee",
      writtenNotificationDate: "Date written notification provided to enrollee",
      writtenNotificationTime: "Time written notification provided to enrollee",
      ssDate: "Date prescriber supporting statement received",
      ssTime: "Time prescriber supporting statement received"
    },
    ECD: {
      receivedDate: "Date the request was received",
      receivedTime: "Time the request was received",
      decisionDate: "Date of plan decision",
      decisionTime: "Time of plan decision",
      effectuationDate: "Date effectuated in the plan's system",
      effectuationTime: "Time effectuated in the plans' system",
      oralNotificationDate: "Date oral notification provided to enrollee",
      oralNotificationTime: "Time oral notification provided to enrollee",
      writtenNotificationDate: "Date written notification provided to enrollee",
      writtenNotificationTime: "Time written notification provided to enrollee",
      ssDate: "Date prescriber supporting statement received",
      ssTime: "Time prescriber supporting statement received"
    },
    SRD: {
      receivedDate: "Date the request was received",
      receivedTime: "Time the request was received",
      decisionDate: "Date of plan decision",
      decisionTime: "Time of plan decision",
      effectuationDate: "Date effectuated in the plan's system",
      effectuationTime: "Time effectuated in the plans' system",
      oralNotificationDate: "Date oral notification provided to enrollee",
      oralNotificationTime: "Time oral notification provided to enrollee",
      writtenNotificationDate: "Date written notification provided to enrollee",
      writtenNotificationTime: "Time written notification provided to enrollee",
      ssDate: "Date prescriber supporting statement received",
      ssTime: "Time prescriber supporting statement received"
    },
    ERD: {
      receivedDate: "Date the request was received",
      receivedTime: "Time the request was received",
      decisionDate: "Date of plan decision",
      decisionTime: "Time of plan decision",
      effectuationDate: "Date effectuated in the plan's system",
      effectuationTime: "Time effectuated in the plans' system",
      oralNotificationDate: "Date oral notification provided to enrollee",
      oralNotificationTime: "Time oral notification provided to enrollee",
      writtenNotificationDate: "Date written notification provided to enrollee",
      writtenNotificationTime: "Time written notification provided to enrollee",
      ssDate: "Date prescriber supporting statement received",
      ssTime: "Time prescriber supporting statement received"
    },
    DMRCD: {
      receivedDate: "Date the request was received",
      receivedTime: "Time the request was received",
      decisionDate: "Date of plan decision",
      decisionTime: "Time of plan decision",
      effectuationDate: "Date effectuated in the plan's system",
      effectuationTime: "Time effectuated in the plans' system",
      oralNotificationDate: "Date oral notification provided to enrollee",
      oralNotificationTime: "Time oral notification provided to enrollee",
      writtenNotificationDate: "Date written notification provided to enrollee",
      writtenNotificationTime: "Time written notification provided to enrollee",
      ssDate: "Date prescriber supporting statement received",
      ssTime: "Time prescriber supporting statement received"
    },
    DMRRD: {
      receivedDate: "Date the request was received",
      receivedTime: "Time the request was received",
      decisionDate: "Date of plan decision",
      decisionTime: "Time of plan decision",
      effectuationDate: "Date effectuated in the plan's system",
      effectuationTime: "Time effectuated in the plans' system",
      oralNotificationDate: "Date oral notification provided to enrollee",
      oralNotificationTime: "Time oral notification provided to enrollee",
      writtenNotificationDate: "Date written notification provided to enrollee",
      writtenNotificationTime: "Time written notification provided to enrollee",
      ssDate: "Date prescriber supporting statement received",
      ssTime: "Time prescriber supporting statement received"
    }
  };


/**
 * parseInputFile is a copy pasta function and uses the directive 'onReadFile'.
 */
  self.parseInputFile = function(fileText, caseType, priority, exception, extendApproval, reimbursement){
    // fileText = fileText.replace(/( )/g, '_');
    var universeType = self.universeTypes[self.makeUniverseType(caseType, priority, exception, reimbursement)];

    if (caseType === 'RD') {
      exception = false;
    }
    if (reimbursement) {
      exception = false;
      priority = false;
    }

    // Need functionality to convert tab delimited to JSON. fileText is loading JSON file in meantime.
    /**
     * BUG: JSON.parse does not recognize CMS formatted times prior to 10:00:00 because the number begins with 0. Must be string.
     */
    var universe = JSON.parse(fileText);
    // console.log("JSON.parse", universe);
    universe.map(function(request, index, array) {
      request.reimbursement = reimbursement;
      request.exceptionRequest = exception;
      request.extendApproval = extendApproval;
      request.caseType = caseType;
      request.priority = priority;
      request.decision = request["Was the case approved or denied?"];
      request.receivedDate = self.CMSToDate(request[universeType.receivedDate], request[universeType.receivedTime]);
      if (request[universeType.ssDate] !== null) {
        request.ssDate = self.CMSToDate(request[universeType.ssDate], request[universeType.ssTime]);
      }
      request.decisionDate = self.CMSToDate(request[universeType.decisionDate], request[universeType.decisionTime]);
      request.effectuationDate = self.CMSToDate(request[universeType.effectuationDate], request[universeType.effectuationTime]);
      request.oralNotificationDate = self.CMSToDate(request[universeType.oralNotificationDate], request[universeType.oralNotificationTime]);
      request.writtenNotificationDate = self.CMSToDate(request[universeType.writtenNotificationDate], request[universeType.writtenNotificationTime]);
      // "Disposition of the request" is also a field that may need to be evaluated
      request = caseVault.setDueDate(request);
      return request;
    });
    caseVault.setUniverse(universe);
  };

  self.makeUniverseType = function(caseType, priority, exception, reimbursement) {
    console.log('makeUniverseType run');
    if (caseType === 'CD') {
      if (reimbursement) {
        exception = false;
        priority = false;
        self.universeType = 'DMRCD';
        console.log("reimbursement", reimbursement);
        console.log('DMRCD');
      } else {
        if (!exception) {
          if (priority === false) {
            self.universeType = 'SCD';
          } else if (priority === true) {
            self.universeType = 'ECD';
          }
        } else if (exception) {
          if (priority === false) {
            self.universeType = 'SCDER';
          } else if(priority === true) {
            self.universeType = 'ECDER';
          }
        }
      }
    } else if (caseType === 'RD') {
      exception = false;
      if (reimbursement) {
        priority = false;
        self.universeType = 'DMRRD';
        console.log("reimbursement", reimbursement);
        console.log('DMRRD');
      } else {
        if (priority === false) {
          self.universeType = 'SRD';
        } else if (priority === true) {
          self.universeType = 'ERD';
        }
      }
    }/* else if (caseType === 'DMR') {
      // Hey DUMMY! DMR is a property of CD or RD that ignores priority. "Is this request for post service reimbursement?"
    }*/
    return self.universeType;
  };

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

}]);