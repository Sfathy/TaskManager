app.config([
'$stateProvider',
'$urlRouterProvider',
function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: '/views/home.html',
      controller: 'MainCtrl',
      resolve: {
        taskPromise: ['tasks', function(tasks){
          
          return tasks.getAll();
        }]
      }
    })
    .state('task', {
      url: '/task/{taskId}',
      templateUrl: '/views/task.html',
      controller: 'taskCtrl',
      //  onEnter: ['$state', 'auth', function($state, auth){
      //   console.log ('edit task state'); 
      // }],
       resolve: {
         taskPromise: ['tasks', '$stateParams',function(tasks,$stateParams){
          //console.log("task id: " + $stateParams.taskId);
           return tasks.getTask($stateParams.taskId)  ;
         }]
      }
    })
    .state('timesheet',{
      url: '/timesheet',
      templateUrl: '/views/timesheet.html',
      controller: 'TimesheetCtrl',
        resolve: {
        taskPromise: ['tasks', function(tasks){

          return tasks.getAll();
        }]
      } 
    })
    .state('team',{
      url: '/team',
      templateUrl: '/views/team.html',
      controller: 'teamCtrl',
        resolve: {
        teamPromise: ['team', function(team){

          return team.getAll();
        }]
      } 
    })
    .state('teamDetailTimesheet',{
      url: '/team/{name}/timesheet',
      templateUrl: '/views/timesheet.html',
      controller: 'TimesheetCtrl',
        resolve: {
        teamPromise: ['tasks', '$stateParams',function(tasks,$stateParams){

          return tasks.getTeamTasks($stateParams.name);
        }]
      } 
    })
    .state('teamDetailTasks',{
      url: '/team/{name}/tasks',
      templateUrl: '/views/home.html',
      controller: 'MainCtrl',
        resolve: {
        teamPromise: ['tasks', '$stateParams',function(tasks,$stateParams){

          return tasks.getTeamTasks($stateParams.name);
        }]
      } 
    })
    .state('login', {
      url: '/login',
      templateUrl: '/views/login.html',
      controller: 'AuthCtrl',
      onEnter: ['$state', 'auth', function($state, auth){
        if(auth.isLoggedIn()){
          $state.go('home');
        }
      }]
    })
    .state('register', {
      url: '/register',
      templateUrl: '/views/register.html',
      controller: 'AuthCtrl',
      onEnter: ['$state', 'auth', function($state, auth){
        if(auth.isLoggedIn()){
          $state.go('home');
        }
      }]
    });
    

  $urlRouterProvider.otherwise('home');
}]);

// $rootScope.$on('$stateChangeStart',function(event, toState, toParams, fromState, fromParams){
//   console.log('$stateChangeStart to '+toState.to+'- fired when the transition begins. toState,toParams : \n',toState, toParams);
// });