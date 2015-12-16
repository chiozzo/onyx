app.controller('universeDetailController', ['$stateParams', 'caseVault', function($stateParams, caseVault) {
  var self = this;
  console.log("$stateParams.index", $stateParams.index);
  var caseID = $stateParams.index;
  console.log("caseVault.getCase(caseID)", caseVault.getCase(caseID));
  self.selectedRequest = caseVault.getCase(caseID);
  console.log("self.selectedRequest", self.selectedRequest);
}]);