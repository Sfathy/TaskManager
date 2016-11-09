app.factory('team',['$http','auth',function($http,auth){
	var o= {
	    team: []
  	};
  	o.getAll = function(){
 		return $http.get('/team',{headers: {Authorization: 'Bearer '+auth.getToken()}}).success(function(data){

      	angular.copy(data, o.team);
      	// for (var i = o.team.length - 1; i >= 0; i--) {
      	// 	$http.get('/team/' + o.team[i].username).success(function(data2){
      	// 		o.team[i].workingTask = data2;
      	// 	});
      	// }
    //  	console.log(o.team);

    	});
  	};
  	return o;
}]);

app.controller('teamCtrl', [
'$scope','team','auth','$state',
  function($scope,team,auth,$state){
  	$scope.team = team.team;	
  	$scope.name = 'sherif';
  	$scope.job = 'eng';
  }]);

app.controller('teamDetailsCtrl', [
'$scope','tasks','auth','$state',
  function($scope,tasks,auth,$state){
  	$scope.tasks = tasks.tasks;	
  	$scope.name = 'sherif';
  	$scope.job = 'eng';
  }]);

