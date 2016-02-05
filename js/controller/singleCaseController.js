app.controller('singleCaseController', ['caseVault', function (caseVault) {
  var self = this;

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
    caseType: null,
    priority: null,
    decision: null,
    dueDate: null,
    SLA: null,
    // exception: "What's an exception?",
    extendApproval: null
  };

  /**
   * Set keywords for epoch time
   */
  var hours24 = 86400000;
  var hours72 = 259200000;
  var days7   = 604800000;
  var days14  = 1209600000;

  /**
   * Set SLAs for case types
   */
  var expeditedCDSLA = hours24;
  var standardCDSLA = hours72;
  var expeditedRDSLA = hours72;
  var standardRDSLA = days7;
  var DMRSLA = days14;

  /**
   * Labels for options in case form
   */
  self.labels = {
    caseType: null,
    priority: 'Standard or Expedited?',
    exception: 'Prior Auth or Exception?',
    reimbursement: 'Preservice or Reimbursement?',
    extendApproval: 'Evaluate this case within the CMS grace period?',
    decision: 'Approved or Denied?'
  };

  /**
   * Method to change labels based on selections in case form
   */
  self.changeLabels = function(field) {
    switch (field) {
      case 'caseType': if(self.caseStatus.caseType === 'CD') {
          self.labels.caseType = "Coverage Determination";
        } else {
          self.labels.caseType = "Redetermination";
        } break;
      case 'priority': if(self.caseStatus.priority) {
          self.labels.priority = "Expedited";
        } else {
          self.labels.priority = "Standard";
        } break;
      case 'exception': if(self.caseStatus.exception) {
          self.labels.exception = "Exception";
        } else {
          self.labels.exception = "Prior Authorization";
        } break;
      case 'reimbursement': if(self.caseStatus.reimbursement) {
          self.labels.reimbursement = "Reimbursement";
        } else {
          self.labels.reimbursement = "Preservice";
        } break;
      case 'extendApproval': if(self.caseStatus.extendApproval) {
          self.labels.extendApproval = "Yes, this case was approved within 24 hours of SLA expiration.";
        } else {
          self.labels.extendApproval = "No, I'd like to evaluate this case on the normal SLA.";
        } break;
      case 'decision': if(self.caseStatus.decision) {
          self.labels.decision = "Approved";
        } else {
          self.labels.decision = "Denied";
        } break;
    }
  };

  /**
   * Method to create min/max restrictions. Is this really the best idea? What if page is not refreshed for many days?
   */
  var today = new Date();
  self.restrictInput = null;

  self.makeRestrictions = function() {
    self.restrictInput = {
      receivedMinDate: new Date(today.getTime() - (days14 * 26)),
      //Could next line be a problem if the user stays logged in for many days?
      receivedMaxDate: new Date(today.getTime() + (days14 * 26))
    };
  };
  self.makeRestrictions();


  self.setDueDate = function () {
    return caseVault.setDueDate(self.caseStatus);
  };

}]);