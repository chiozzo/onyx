app.controller('singleCaseController', ['caseVault', function (caseVault) {
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

  self.labels = {
    caseType: null,
    priority: 'Standard or Expedited?',
    exception: 'PA or Exception?',
    reimbursement: 'Preservice or DMR?',
    extendApproval: 'Late Approval?'
  };

  self.changeLabels = function(field) {
    switch (field) {
      case 'caseType': if(self.caseStatus.caseType === 'CD') {
          self.labels.caseType = "Coverage Determination";
        } else {
          self.labels.caseType = "Redetermination";
        } break;
      case 'expedited': if(self.caseStatus.expedited) {
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
          self.labels.reimbursement = "DMR";
        } else {
          self.labels.reimbursement = "Preservice";
        } break;
      case 'extendApproval': if(self.caseStatus.extendApproval) {
          self.labels.extendApproval = "If Approved within 24 hours";
        } else {
          self.labels.extendApproval = "Without grace period";
        } break;
    }
  };

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
    caseType: null,
    priority: null,
    decision: 'Approved or Denied?',
    dueDate: null,
    SLA: null,
    // exception: "What's an exception?",
    extendApproval: 'NO'
  };



/**
 * Since I'm no longer using the AngularUI Bootstrap Datepicker, this code is irrelevent, but it allows for multiple datepickers in one controller.

  this.toggleOpen = function($event, which){
    this.datePopupStatus[which] = ! this.datePopupStatus[which];
  };
 */

}]);