app.controller('TimesheetCtrl', [
'$scope','tasks','auth',
  function($scope,tasks,auth){
    $scope.test = 'Hello world!';
    $scope.timesheet = [[]];
    $scope.tasks=tasks.tasks;
    $scope.days = [];
   // var today = new Date();
    $scope.month = new Date();
    $scope.period = 1;
    var noOfDays = 7;
    $scope.calTaskEff = function(day,task){
    	taskobj = $scope.tasks[task];
    	//var date =  
    	var taskEffort = 0;
    	var currDate = new Date($scope.days[day].dt);
    	//currDate = currDate.setMonth(currDate.getMonth()-1);
    	//currDate = new Date(currDate);
    	//currDate.toDate().setHours(0,0,0,0);
    	var taskStart;
    	var taskEnd;
    	var taskStartDt
    	var	taskEndDt
    	for (var i = taskobj.work.length - 1; i >= 0; i--) {
    		taskStart = new Date(taskobj.work[i].stDt);//.toDate();
    		taskStartDt = new Date(taskobj.work[i].stDt);//.toDate();
    		taskEnd = new Date(taskobj.work[i].endDt);//.toDate();
    		taskEndDt = new Date(taskobj.work[i].endDt);//.toDate();
    		if(taskStart.setHours(0,0,0,0) == currDate.setHours(0,0,0,0) ) {
    			taskEffort += (taskEndDt.getTime() - taskStartDt.getTime())/(1000*60*60);
    		}
    	}

    	return Math.round(taskEffort*10)/10;
    };
	$scope.calcTasksEffort = function(){
		for (var task = 0 ;  task < $scope.tasks.length ; task++) {
			$scope.timesheet[task] = [];	
		for (var day =	 0; day <$scope.days.length ; day++	) {
				$scope.timesheet[task][day] = $scope.calTaskEff(day,task);
			}
		}
	
    };
    $scope.getTotal = function(index){
    	var total = 0;
    	for (var i = 0; i < $scope.timesheet.length; i++) {
    		total += $scope.timesheet[i][index];
    	}
    	return Math.round(total*10)/10;
    };
    $scope.calcTimesheet = function(){
    	
    	$scope.days = [];
    	today = $scope.month;
    	var dateString = "";
    	//console.log('current month: ' + today.getMonth());

    	dateString = dateString.concat( today.getFullYear(),"-",today.getMonth()+1,"-26");
    	//console.log('date string:' + dateString);
 
    	//starDay.day = 26;
    	//starDay.month = $scope.month-1;
    	startDay = new Date(dateString);
    	var day = $scope.month.getDate();	
		
		if(day<26){
    		startDay = startDay.setMonth(startDay.getMonth()-1);
    	}
    	startDay = new Date(startDay);
    	startDay.setDate( startDay.getDate() + ($scope.period-1) * 7);	
    	startDay = new Date(startDay);
    	//console.log('current month: ' + startDay.getMonth());
    	//console.log('start day:' + startDay);
    	for (var i = 0; i < noOfDays; i++) {
    		$scope.days[i] = {'str':startDay.getDate() + '/' + (startDay.getMonth() + 1),'dt':new Date(startDay)};
    	//	console.log('days: '+$scope.days[i].str);
    		startDay.setDate(startDay.getDate() + 1);
    	}
    	if($scope.period ==4){
    		//adjust no of days for the last period
    		for (var i = startDay.getDate(); i <=25  ; i++) {
    			
    			$scope.days.push({'str':startDay.getDate() + '/' + startDay.getMonth(),'dt':startDay});
    			startDay.setDate(startDay.getDate() + 1);
    		}
    	}
    	$scope.calcTasksEffort();
    };

   
    //$scope.days=['26/10','27/10','28/10','29/10','30/10','31/10','1/11'];
    

    $scope.calcTimesheet();
}]);