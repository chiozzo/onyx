app.controller('universeController', ['caseVault', '$mdDialog', function(caseVault, $mdDialog) {
  var self = this;
  self.universe = caseVault.getUniverse();

  /**
   * This controller is responsible for showing the universe detail dialog window, generating it's local scope, and passing data into that scope.
   */
  self.showTabDialog = function(ev, caseNum) {
  	console.log("caseNum", caseNum);
  	console.log("self.universe[caseNum]", self.universe[caseNum]);
    $mdDialog.show({
      controller: 'universeDetailController',
      controllerAs: 'universeDetailCtrl',
      templateUrl: 'partial/universeCase.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose:true,
      locals: {
      	universeCaseNum: caseNum,
      	universeCase: self.universe[caseNum]
      }
    });
  };
}]);