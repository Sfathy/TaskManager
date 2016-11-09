app.factory('tasks',['$http','auth',function($http,auth){
  var o= {
    tasks: [],
    task:{}
  };
  o.getAll = function(user) {
    return $http.get('/tasks/' ,{headers: {Authorization: 'Bearer '+auth.getToken()}}).success(function(data){
      angular.copy(data, o.tasks);

    });
  };
  o.getTask = function(taskId) {
    return $http.get('/tasks/'+taskId,{headers: {Authorization: 'Bearer '+auth.getToken()}}).success(function(data){
      angular.copy(data, o.task);
      for (var i = o.task.work.length - 1; i >= 0; i--) {
        o.task.work[i].stDt = new Date(o.task.work[i].stDt);
        o.task.work[i].endDt = new Date(o.task.work[i].endDt);
      }
     //task = {name:'test',type:'test'};
    });
  };
  o.create = function(task) {
    return $http.post('/tasks', task, 
      {headers: {Authorization: 'Bearer '+auth.getToken()}}).success(function(data){
        o.tasks.push(data);
    });
  };
  o.start = function(task) {
    return $http.put('/tasks/' + task._id + '/start', {
    headers: {Authorization: 'Bearer '+auth.getToken()}})
      .success(function(data){
        for (var i = o.tasks.length - 1; i >= 0; i--) {
          if(o.tasks[i].isworking){
             o.stop(o.tasks[i]); 
          }
        }
        o.getAll();
      });
  };
  0.getTeamTasks = function(name){
    return $http.get('/tasks/team/' + name ,{headers: {Authorization: 'Bearer '+auth.getToken()}}).success(function(data){
      angular.copy(data, o.tasks);

    });  
    } ;

  o.finish = function(task) {
    return $http.put('/tasks/' + task._id + '/finish', {
    headers: {Authorization: 'Bearer '+auth.getToken()}})
      .success(function(data){
        o.getAll();
      });
  };

  o.stop = function(task) {
    return $http.put('/tasks/' + task._id + '/stop', {
    headers: {Authorization: 'Bearer '+auth.getToken()}})
      .success(function(data){
        task.isworking = false;
      });
  };
  o.update = function(task) {
    return $http.put('/tasks/' + task._id , task,{
    headers: {Authorization: 'Bearer '+auth.getToken()}})
      .success(function(data){
        o.getAll();
      });
  };
  // o.getTimesheet(){
  //   return $http.get('/timesheet' , {
  //   headers: {Authorization: 'Bearer '+auth.getToken()}})
  //     .success(function(data){
  //       timesheet = data ;
  //     });
  // };
 return o;
}]);


app.controller('MainCtrl', [
'$scope','tasks','auth','$state',
  function($scope,tasks,auth,$state){
    $scope.test = 'Hello world!';
    $scope.name;
    $scope.type;
    $scope.estimation;
    $scope.project;
    $scope.tasks = tasks.tasks;
    $scope.isLoggedIn = auth.isLoggedIn;
    $scope.isSupervisor = auth.isSupervisor;
    $scope.addTask = function(){
      console.log($scope.name);
      if(!$scope.name || $scope.name === ''|| !$scope.type||$scope.type===''
        ||!$scope.estimation||$scope.estimation==0||!$scope.project||$scope.project==='') { return; }
      tasks.create({
          name: $scope.name,
          type: $scope.type,
          estimation:$scope.estimation,
          project:$scope.project
      });
      $scope.name = '';
      $scope.type = '';
      $scope.estimation =0;
      $scope.project = '';
    };

    $scope.start = function(task) {
      tasks.start(task);
      $state.go('home');
    };

    $scope.finish = function(task) {
      tasks.finish(task);
      $state.go('home');
    };

    $scope.stop = function(task) {
      tasks.stop(task);
      tasks.getAll();
      $state.go('home');
    };


  }
]);

app.controller('taskCtrl', [
'$scope','tasks','auth','$state','$rootScope',
  function($scope,tasks,auth,$state,$rootScope){
    $scope.test = 'Hello world!';
    $scope.task = tasks.task;
    $scope.update = function(){
      var taskEff=0;
      for (var i = $scope.task.work.length - 1; i >= 0; i--) {
        taskEff += Math.round((($scope.task.work[i].endDt- $scope.task.work[i].stDt)/(1000*60*60))*10)/10;
      }
      $scope.task.actualEffort = taskEff;
      tasks.update($scope.task);
      tasks.getAll();
      $state.go($rootScope.$previousState.name);
    };
    $scope.calcEffort = function(stDt,endDt){
      return Math.round(((endDt-stDt)/(1000*60*60))*10)/10;
    };
  }
]);