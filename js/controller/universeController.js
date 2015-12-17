app.controller('universeController', ['caseVault', function(caseVault) {
  var self = this;
  self.universe = caseVault.getUniverse();

  self.untimelyDecisions = self.universe.filter(function(request, index, array) {
    if(!request.timelyDecision) {
      return request;
    }
  });
  console.log("self.untimelyDecisions", self.untimelyDecisions);

  self.untimelyEffectuations = self.universe.filter(function(request, index, array) {
    if(!request.timelyEffectuation) {
      return request;
    }
  });
  console.log("self.untimelyEffectuations", self.untimelyEffectuations);

  self.untimelyNotifications = self.universe.filter(function(request, index, array) {
    if(!request.timelyOralNotification || !request.timelyWrittenNotification) {
      return request;
    }
  });
  console.log("self.untimelyNotifications", self.untimelyNotifications);
}]);