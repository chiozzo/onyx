var app = angular.module('onyx', ['ui.router', 'ngMaterial', 'ngMessages']);

app.config(['$stateProvider', '$urlRouterProvider', '$mdThemingProvider', function($stateProvider, $urlRouterProvider, $mdThemingProvider) {
	$urlRouterProvider.otherwise('/');

	$stateProvider
  /**
    .state('auditType', {
      url: '/auditType',
      //I want multiple templatesUrls and/or controllers
    })
   */
    .state('home', {
      url: '/',
      templateUrl: 'partial/home.html'
    })
    .state('materialUniverse', {
      url: '/materialUniverse',
      templateUrl: 'partial/materialUniverse.html'
    })
    .state('materialTest', {
      url: '/materialTest',
      templateUrl: 'partial/materialTest.html',
    })
    .state('fileUpload', {
      url: '/fileUpload',
      templateUrl: 'partial/fileUpload.html'
    })
		.state('singleCase', {
			url:'/singleCase',
			templateUrl: 'partial/singleCase.html'
		})
    .state('universeList', {
      url:'/universe',
      templateUrl: 'partial/universeList.html',
      controller: 'universeController as universeCtrl'
    })
    .state('universeCase', {
      url:'/universe/:index',
      templateUrl: 'partial/universeCase.html',
      controller: 'universeDetailController as universeDetailCtrl'
    });
    $mdThemingProvider.theme('default')
    .primaryPalette('blue')
    .accentPalette('purple')
    .warnPalette('red');
}]);





app.filter('untimelyDecisionsFilter', [function () {
  return function (array) {
    return array.filter(function(request, index, array) {
      if(!request.timelyDecision) {
        return request;
      }
    });
  };
}]);



app.filter('not', [function() {
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