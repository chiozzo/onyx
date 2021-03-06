app.controller('importUniverse', ['caseVault', function(caseVault) {
  var self = this;

  self.universeType = null;

  /**
   * Field names for each universe type per CMS spec. This code will eventually be refactored to implement tab-delimited to JSON conversion. Would like to have a view that displays field headers and allows user to confirm/match to CMS standard header.
   */
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
      receivedDate: "Date the Request was Received",
      receivedTime: "Time the Request was Received",
      decisionDate: "Date of Plan Decision",
      decisionTime: "Time of Plan Decision",
      effectuationDate: "Date Effectuated in the Plans' system",
      effectuationTime: "Time Effectuated in the Plans' system",
      oralNotificationDate: "Date Oral Notification provided to Enrollee",
      oralNotificationTime: "Time Oral Notification provided to Enrollee",
      writtenNotificationDate: "Date written Notification provided to Enrollee",
      writtenNotificationTime: "Time written Notification provided to Enrollee",
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
   * Labels for options in universe upload form
   */
  self.labels = {
    caseType: null,
    priority: 'Standard or Expedited?',
    exception: 'Prior Auth or Exception?',
    reimbursement: 'Preservice or Reimbursement?',
    extendApproval: 'Late Approval?'
  };

  /**
   * Method to change labels based on selections in universe upload form
   */
  self.changeLabels = function(field) {
    switch (field) {
      case 'caseType': if(self.caseType === 'CD') {
          self.labels.caseType = "Coverage Determination";
        } else {
          self.labels.caseType = "Redetermination";
        } break;
      case 'universeExpedited': if(self.universeExpedited) {
          self.labels.priority = "Expedited";
        } else {
          self.labels.priority = "Standard";
        } break;
      case 'universeException': if(self.universeException) {
          self.labels.exception = "Exception";
        } else {
          self.labels.exception = "Prior Authorization";
        } break;
      case 'universeReimbursement': if(self.universeReimbursement) {
          self.labels.reimbursement = "Reimbursement";
        } else {
          self.labels.reimbursement = "Preservice";
        } break;
      case 'universeExtendedApproval': if(self.universeExtendedApproval) {
          self.labels.extendApproval = "If Approved within 24 hours";
        } else {
          self.labels.extendApproval = "Without grace period";
        } break;
    }
  };

  /**
   * Method to convert CMS formatted date/time to Date object
   */
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
   * Method to decide universe type based on selections in universe upload form
   */
  self.makeUniverseType = function(caseType, priority, exception, reimbursement) {
    console.log('makeUniverseType run');
    if (caseType === 'CD') {
      if (reimbursement) {
        exception = false;
        priority = false;
        self.universeType = 'DMRCD';
      } else {
        if (!exception) {
          if (priority === false || priority === undefined) {
            self.universeType = 'SCD';
          } else if (priority === true) {
            self.universeType = 'ECD';
          }
        } else if (exception) {
          if (priority === false || priority === undefined) {
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
      } else {
        if (priority === false || priority === undefined) {
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
    universe.map(function(request, index, array) {
      request.caseNum = index;
      request.reimbursement = reimbursement;
      request.exception = exception;
      request.extendApproval = extendApproval;
      request.caseType = caseType;
      request.priority = priority;
      request.drugName = request["Drug Name Strength Dosage Form"];
      request.drugNDC = request.NDC_11;
      request.beneficiaryHICN = request["Beneficiary HICN"];
      request.decision = request["Was the case approved or denied "];
      request.receivedDate = self.CMSToDate(request[universeType.receivedDate], request[universeType.receivedTime]);
      // if (request[universeType.ssDate] !== null) {
      //   request.ssDate = self.CMSToDate(request[universeType.ssDate], request[universeType.ssTime]);
      // }
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

}]);
