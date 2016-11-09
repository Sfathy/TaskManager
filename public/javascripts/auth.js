app.factory('auth', ['$http', '$window', function($http, $window){
  var auth = {};
  auth.saveToken = function (token){
    $window.localStorage['time-management-token'] = token;
  };

  auth.getToken = function (){
    return $window.localStorage['time-management-token'];
  };

  auth.isLoggedIn = function(){
    var token = auth.getToken();
    //console.log('from isLoggedIn');
    if(token){
      var payload = JSON.parse($window.atob(token.split('.')[1]));

      return payload.exp > Date.now() / 1000;
    } else {
      return false;
    }
  };

  auth.isSupervisor = function(){
    var token = auth.getToken();
    //console.log('from isLoggedIn');
    if(token){
      var payload = JSON.parse($window.atob(token.split('.')[1]));
      //console.log('from isSupervisor');
      return payload.isSupervisor;
    } else {
      return false;
    }
  };

  auth.currentUser = function(){
    if(auth.isLoggedIn()){
      var token = auth.getToken();
      var payload = JSON.parse($window.atob(token.split('.')[1]));
      //console.log('from currentUser');
      return payload.username;
    }
  };
  // auth.isSupervisor = function(){
  //   if(auth.isLoggedIn()){
  //     var token = auth.getToken();
  //     var payload = JSON.parse($window.atob(token.split('.')[1]));
  //     //console.log('from isSupervisor');
  //     return payload.isSupervisor;
  //   }
  // };
  auth.register = function(user){
    return $http.post('/register', user).success(function(data){
      auth.saveToken(data.token);
    });
  };
  auth.logIn = function(user){
    return $http.post('/login', user).success(function(data){
      auth.saveToken(data.token);
    });
  };
  auth.logOut = function(){
    $window.localStorage.removeItem('time-management-token');
  };  
  return auth;
}]);


app.controller('AuthCtrl', [
'$scope',
'$state',
'auth',
function($scope, $state, auth){
  $scope.user = {};

  $scope.register = function(){
    auth.register($scope.user).error(function(error){
      $scope.error = error;
    }).then(function(){
      $state.go('home');
    });
  };

  $scope.logIn = function(){
    auth.logIn($scope.user).error(function(error){
      $scope.error = error;
    }).then(function(){
      $state.go('home');
    });
  };
}]);
app.controller('NavCtrl', [
'$scope',
'auth',
function($scope, auth){
  $scope.isLoggedIn = auth.isLoggedIn;
  $scope.isSupervisor = auth.isSupervisor;
  $scope.currentUser = auth.currentUser;
  $scope.logOut = auth.logOut;
}]);