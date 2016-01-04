app.filter('untimelyEffectuationsFilter', [function() {
  return function (array) {
    return array.filter(function(request, index, array) {
      if(!request.timelyEffectuation) {
        return request;
      }
    });
  };
}]);