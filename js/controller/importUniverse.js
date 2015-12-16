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
    }
  };


/**
 * parseInputFile is a copy pasta function and uses the directive 'onReadFile'.
 */
  self.parseInputFile = function(fileText, universeType, priority, exception, extendApproval){
    // fileText = fileText.replace(/( )/g, '_');
    // Need functionality to convert tab delimited to JSON. fileText is loading JSON file in meantime.

    /**
     * BUG: JSON.parse does not recognize CMS formatted times prior to 10:00:00 because the number begins with 0. Must be string.
     */
    var universe = JSON.parse(fileText);

    // implement switch here
    if (universeType === 'CD') {
      if (!exception) {
        console.log('not an exception universe');
        if (priority === false) {
          self.universeType = 'SCD';
        } else if(priority === true) {
          self.universeType = 'ECD';
        }
      } else if (exception) {
        if (priority === false) {
          self.universeType = 'SCDER';
        } else if(priority === true) {
          self.universeType = 'ECDER';
        }
      }
      universe.map(function(request, index, array) {
        // console.log("array", array);
        // console.log("request", request);
        // console.log("self.universeType", self.universeType);
        request.receivedDate = self.CMSToDate(request[self.universeTypes[self.universeType].receivedDate], request[self.universeTypes[self.universeType].receivedTime]);
        if (request[self.universeTypes[self.universeType].ssDate] !== null) {
        // console.log("request[self.universeTypes[self.universeType].ssDate]", request[self.universeTypes[self.universeType].ssDate]);
          request.ssDate = self.CMSToDate(request[self.universeTypes[self.universeType].ssDate], request[self.universeTypes[self.universeType].ssTime]);
        }
        // console.log("request.ssDate", request.ssDate);
        request.decisionDate = self.CMSToDate(request[self.universeTypes[self.universeType].decisionDate], request[self.universeTypes[self.universeType].decisionTime]);
        request.effectuationDate = self.CMSToDate(request[self.universeTypes[self.universeType].effectuationDate], request[self.universeTypes[self.universeType].effectuationTime]);
        request.oralNotificationDate = self.CMSToDate(request[self.universeTypes[self.universeType].oralNotificationDate], request[self.universeTypes[self.universeType].oralNotificationTime]);
        request.writtenNotificationDate = self.CMSToDate(request[self.universeTypes[self.universeType].writtenNotificationDate], request[self.universeTypes[self.universeType].writtenNotificationTime]);
        request.caseType = universeType;
        request.priority = priority;
        request.decision = request["Was the case approved or denied?"];
        // "Disposition of the request" is also a field that may need to be evaluated
        request.exceptionRequest = exception;
        request = caseVault.setDueDate(request);
        // console.log("request.dueDate", request.dueDate);
        request.extendApproval = extendApproval;
        return request;
      });
    }
    caseVault.setUniverse(universe);
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