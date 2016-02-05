app.controller('universeDetailController', ['universeCaseNum', 'universeCase', function(universeCaseNum, universeCase) {
  var self = this;

  /**
   * This controller is the basis for the scope created by universeController.js, but currently serves little other purpose.
   */
  self.universeCaseNum = universeCaseNum;
  self.universeCase = universeCase;
  console.log("universeCaseNum", universeCaseNum);
  console.log("universeCase", universeCase);
}]);