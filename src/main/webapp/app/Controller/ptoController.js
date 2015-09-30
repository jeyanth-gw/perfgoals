
angular.module('goalApp').controller('ptoController', ['$scope', '$rootScope','ptoService','appService', function($scope,$rootScope,ptoService,appService){
	var emp= $rootScope.empId;
	var chartVals = [];
	var ptoDetUrl= appService.ptoURL;
	ptoService.fetchPTODet(ptoDetUrl).then(function(data){
		$scope.ptoDays = data["totalLeavesTaken"];
		$scope.leaveDates = {};
		$scope.leaveChartValues = []; 
		var chartValsFinal=[];
		
		$.each(data["leaveDates"], function(key, val) {
			$scope.leaveDates[new Date(val)] = new Date(val);
		});
		
		$.each(data["leaveChartValues"], function(key,val) {
			var chartVals=[];
			$.each(val, function(index, value) {
				chartVals.push(index,value)
			});
			chartValsFinal.push(chartVals)
		});
		$scope.leaveChartValues =chartValsFinal;
	});
	
}]);

angular.module('goalApp').service('ptoService', ['$http','$q', function ($http,$q) {
	return({
		fetchPTODet:fetchPTODet
	});

	function fetchPTODet(ptoDetUrl) {
         return ($http.get(ptoDetUrl).then(handleSuccess,handleError));
    }
	
   
	function handleSuccess(response){
		return response.data;
	}
	function handleError(response){
		return $q.reject(response.data.message);
	}
}]);