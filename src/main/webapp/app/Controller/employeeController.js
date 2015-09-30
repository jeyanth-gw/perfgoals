(function(){
			employeeController.$inject= ['$scope','$rootScope','$routeParams','appService','employeeFactory','employeeServices','$cookieStore'];
	function employeeController($scope,$rootScope,$routeParams,appService,employeeFactory,employeeServices,$cookieStore){
		$scope.passedEmployeeId = $routeParams.employeeId; 
		var employee= [];
		//$cookies.userName='Aj';
		//var exp = new Date(new Date().getTime() + 5*1000);
		if(null==$scope.passedEmployeeId)
			$scope.passedEmployeeId=$cookieStore.get('idNew');
		$cookieStore.put('idNew',$scope.passedEmployeeId);
		/*var empList=[]
		empList= $rootScope.employeeDetails;*/
		var empListURL=appService.employeeListURL;
		employeeServices.getEmpList(empListURL).then(function(data){
			$scope.employeeDetails=data;
			$scope.employee = employeeFactory.getSelectedUserDetails($scope.passedEmployeeId,$scope.employeeDetails);
		});
		
		$rootScope.empId= $scope.passedEmployeeId;
		
	    if($rootScope.empId)
	    $scope.resumeLink=appService.resumeLinkURL+$rootScope.empId;
	}
	angular.module('goalApp').controller('employeeController',employeeController);
	
	/**
	 * Service to fetch employee details from server.
	 */
	angular.module('goalApp').service('employeeServices', ['$http','$q', function ($http,$q) {
		
		this.getEmpList = function(empListURL){
			return ($http.get(empListURL).then(handleSuccess,handleError))
		}
		
		function handleError(response){
			return $q.reject(response.data);
		}
		function handleSuccess(response){
			return response.data;
		}
	}]);
	
}());