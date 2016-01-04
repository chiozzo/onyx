app.controller('universeDetailController', ['universeCaseNum', 'universeCase', function(universeCaseNum, universeCase) {
  var self = this;
  self.universeCaseNum = universeCaseNum;
  self.universeCase = universeCase;
  console.log("universeCaseNum", universeCaseNum);
  console.log("universeCase", universeCase);
}]);