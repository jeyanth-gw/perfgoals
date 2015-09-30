(function(){
			employeeSuggestController.$inject= ['$scope','employeeService','appService'];
	function employeeSuggestController($scope,employeeService,appService){ 
		var employee= [];
		
		var empListURL=appService.employeeListURL;
		employeeService.getEmpList(empListURL).then(function(data){
			$scope.employeeDetails=data;
		});
		
	}
	angular.module('goalApp').controller('employeeSuggestController',employeeSuggestController);
	
	/**
	 * Service to fetch employee list.
	 */
	angular.module('goalApp').service('employeeService', ['$http','$q', function ($http,$q) {
		
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