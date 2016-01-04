app.filter('untimelyNotificationsFilter', [function() {
  return function (array) {
    return array.filter(function(request, index, array) {
      if(!request.timelyOralNotification || !request.timelyWrittenNotification) {
        return request;
      }
    });
  };
}]);