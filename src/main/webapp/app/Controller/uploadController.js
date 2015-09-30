(function(){
	
	Highcharts.theme = {
			   colors: ["#f45b5b", "#90ee7e", "#f45b5b", "#7798BF", "#aaeeee", "#ff0066", "#eeaaee",
			      "#55BF3B", "#DF5353", "#7798BF", "#aaeeee"],
			   chart: {
			      backgroundColor: {
			         linearGradient: { x1: 0, y1: 0, x2: 1, y2: 1 },
			         stops: [
			            [0, '#2a2a2b'],
			            [1, '#3e3e40']
			         ]
			      },
			      style: {
			         fontFamily: "'Unica One', sans-serif"
			      },
			      plotBorderColor: '#606063'
			   },
			   title: {
			      style: {
			         color: '#E0E0E3',
			         textTransform: 'uppercase',
			         fontSize: '20px'
			      }
			   },
			   xAxis: {
			      gridLineColor: '#707073',
			      labels: {
			         style: {
			            color: '#E0E0E3'
			         }
			      }
			   },
			   yAxis: {
			      gridLineColor: '#707073',
			      labels: {
			         style: {
			            color: '#E0E0E3'
			         }
			      }
			   },
			   tooltip: {
			      backgroundColor: 'rgba(0, 0, 0, 0.85)',
			      style: {
			         color: '#F0F0F0'
			      }
			   },
			   plotOptions: {
			      series: {
			         dataLabels: {
			            color: '#B0B0B3'
			         }
			      },
			      errorbar: {
			         color: 'white'
			      }
			   },
			   legend: {
			      itemStyle: {
			         color: '#E0E0E3'
			      },
			      itemHoverStyle: {
			         color: '#FFF'
			      },
			      itemHiddenStyle: {
			         color: '#606063'
			      }
			   },
			   credits: {
			       enabled: false
			   },
			   labels: {
			      style: {
			         color: '#707073'
			      }
			   }
			};

			// Apply the theme
			Highcharts.setOptions(Highcharts.theme);
	
angular.module('goalApp').controller('uploadController', ['$scope','$filter','employeeFactory', 'fileUpload','appService','filterNames', function($scope,$filter,employeeFactory, fileUpload,appService,filterNames){
	$scope.onResponse=false;
	$scope.onPrjtResponse = false;
	$scope.onUtilResponse=false;
	
	var barFinalVal =[];
	var xVals = [];
	var yVals = [];
	var prevURL= appService.prevYrsURL;
	fileUpload.fetchGoals(prevURL).then(function(data){
		$.each(data["Rating"], function(key,val) {
			xVals.push(val["year"]);
			yVals.push([val["Comm"],parseInt(val["Rating"])]);
		});
		$scope.plotXVals = xVals;
		$scope.plotYVals = yVals;
		$scope.prevGoalValues = yVals;
	});
	$scope.tabs = employeeFactory.getTab();
	$scope.currentTab = 'app/View/projectGoals.html';

    $scope.onClickTab = function (tab) {
        $scope.currentTab = tab.url;
    }
    
    $scope.isActiveTab = function(tabUrl) {
        return tabUrl == $scope.currentTab;
    }
    
	$scope.uploadFile = function(){
	 var file = $scope.newFileVal;
//	 var field= $scope.uploadFiles;
	   var uploadUrl =appService.uploadURL;
		fileUpload.uploadFileToUrl(file, uploadUrl).then(function(data){
			 $scope.prjtBox = data["1"];
			 $scope.descBox = $filter(filterNames.revertNewLine)(data["2"]);
			 $scope.selfEvalBox = data["3"];
			 $scope.evalBox = data["4"];
			 $scope.scoringAnnoBox = $filter(filterNames.splitColon)(data["5"]);
			 $scope.counselorCommBox = $filter(filterNames.splitColon)(data["6"]);
			 $scope.onResponse=true;
			$scope.getUtilGoals();
			$scope.getOrgGoals();
			$scope.getPrfDvpGoals();
			$scope.getGeneralGoals();
			$scope.getfinalSummary();
		 });
	}; 
	$scope.getUtilGoals = function(){
		 var utilUrl = appService.utilGoalURL;
			fileUpload.fetchGoals(utilUrl).then(function(data){
				 $scope.utilPrjtBox = data["1"];
				 $scope.utilGoalBox = data["2"];
				 $scope.utilEvalBox = data["3"];
				 $scope.utilSelfEvalBox = data["4"];
				 $scope.utilScoringAnnoBox = $filter(filterNames.splitColon)(data["5"]);
			 });
	}
	
	$scope.getOrgGoals = function(){
		 var orgUrl = appService.pracAreaURL;
			fileUpload.fetchGoals(orgUrl).then(function(data){
				 $scope.orgGoalBox = $filter(filterNames.revertNewLine)(data["1"]);
				 $scope.orgWeightBox = data["2"];
				 $scope.orgEvalBox = data["3"];
				 $scope.orgPointsBox = data["4"];
				 $scope.orgSelfEvalBox = data["5"];
				 $scope.orgScoringAnnoBox = $filter(filterNames.splitColon)(data["6"]);
			 });
	}
	
	$scope.getPrfDvpGoals = function(){
		 var prfDvtUrl = appService.profDvpURL;
			fileUpload.fetchGoals(prfDvtUrl).then(function(data){
				 $scope.profGoalBox = $filter(filterNames.revertNewLine)(data["1"]);
				 $scope.profWeightBox = data["2"];
				 $scope.profEvalBox = data["3"];
				 $scope.profPointsBox = data["4"];
				 $scope.profSelfEvalBox = data["5"];
				 $scope.profScoringAnnoBox = $filter(filterNames.splitColon)(data["6"]);
			 });
	}
	
	$scope.getGeneralGoals = function(){
		 var genUrl = appService.genURL;
			fileUpload.fetchGoals(genUrl).then(function(data){
				 $scope.generalGoalBox = $filter(filterNames.revertNewLine)(data["1"]);
				 $scope.generalWeightBox = data["2"];
				 $scope.generalEvalBox = data["3"];
				 $scope.generalPointsBox = data["4"];
				 $scope.generalSelfEvalBox = data["5"];
				 $scope.generalScoringAnnoBox = $filter(filterNames.splitColon)(data["6"]);
			 });
	}
	
	$scope.getfinalSummary= function(){
		 var evalUrl = appService.evalURL;
			fileUpload.fetchGoals(evalUrl).then(function(data){
				 $scope.evalGoalBox = data["1"];
				 $scope.evalWeightBox = data["3"];
				 $scope.evalEvalBox = $filter(filterNames.revertNewLine)(data["5"]);
			 });
	}
}]);

/**
 * Service to upload excel file to the server.
 */
angular.module('goalApp').factory('fileUpload', ['$http','$q', function ($http,$q) { 
	return({
		uploadFileToUrl:uploadFileToUrl,
		fetchGoals: fetchGoals
	});

	function uploadFileToUrl(file, uploadUrl) {
            var fd = new FormData();
            fd.append('uploadFiles',file);
         return ($http.post(uploadUrl, fd, {
             transformRequest: angular.identity,
             headers: {'Content-Type': undefined}
         }).then(handleSuccess,handleError));
    }
	
	function fetchGoals(utilUrl) {
        return ($http.get(utilUrl).then(handleSuccess,handleError));
   }
	
	function handleSuccess(response){
		return response.data;
	}
	function handleError(response){
		return $q.reject(response.data.message);
	}
}]);
}());

