var app = angular.module('TimeManagement', ['ui.router']);
app.run( [ '$rootScope', function ($rootScope) {
        $rootScope.$on('$stateChangeSuccess', function(event, to, toParams, from, fromParams) {
            $rootScope.$previousState = from;
        });
      }]);









