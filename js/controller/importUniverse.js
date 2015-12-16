app.controller('importUniverse', ['caseVault', function(caseVault) {
  var self = this;

  self.universeType = null;


  self.universeTypes = {
    SCDER: {
      receivedDate: "Date the request was received",
      receivedTime: "Time the request was received"
    },
    ECDER: {
      receivedDate: "Date the request was received",
      receivedTime: "Time the request was received"
    }
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

/**
 * parseInputFile is a copy pasta function and uses the directive 'onReadFile'.
 */
  self.parseInputFile = function(fileText, universeType, priority, exceptionRequest, extendApproval){
    // if (!caseVault.getUniverse()) {
    // fileText = fileText.replace(/( )/g, '_');
    // Need functionality to convert tab delimited to JSON. fileText is loading JSON file in meantime.

    /**
     * BUG: JSON.parse does not recognize CMS formatted times prior to 10:00:00 because the number begins with 0. Must be string.
     */
    var universe = JSON.parse(fileText);
    if (universeType === 'CD' && exceptionRequest === false) {
      if (priority === false) {
        self.universeType = 'SCDER';
      } else if(priority === true) {
        self.universeType = 'ECDER';
      }
      universe.map(function(request, index, array) {
        console.log("self.universeTypes[self.universeType]", self.universeTypes[self.universeType]);
        request.receivedDate = self.CMSToDate(request[self.universeTypes[self.universeType].receivedDate], request[self.universeTypes[self.universeType].receivedTime]);
        request.decisionDate = self.CMSToDate(request["Date of plan decision"], request["Time of plan decision"]);
        request.effectuationDate = self.CMSToDate(request["Date effectuated in the plan's system"], request["Time effectuated in the plans' system"]);
        request.oralNotificationDate = self.CMSToDate(request["Date oral notification provided to enrollee"], request["Time oral notification provided to enrollee"]);
        request.writtenNotificationDate = self.CMSToDate(request["Date written notification provided to enrollee"], request["Time written notification provided to enrollee"]);
        request.caseType = universeType;
        request.priority = priority;
        request.decision = request["Was the case approved or denied?"];
        // "Disposition of the request" is also a field that may need to be evaluated
        // request.ssDate = null;
        request = caseVault.setDueDate(request);
        request.exceptionRequest = exceptionRequest;
        request.extendApproval = extendApproval;
        return request;
      });
    }
    caseVault.setUniverse(universe);
    // }
  };

}]);