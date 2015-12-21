app.controller('universeController', ['caseVault', function(caseVault) {
  var self = this;
  self.universe = caseVault.getUniverse();
}]);