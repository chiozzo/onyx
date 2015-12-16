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
    priority: null,
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