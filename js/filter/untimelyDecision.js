app.filter('untimelyDecisionsFilter', [function () {
  return function (array) {
    return array.filter(function(request, index, array) {
      if(!request.timelyDecision) {
        return request;
      }
    });
  };
}]);