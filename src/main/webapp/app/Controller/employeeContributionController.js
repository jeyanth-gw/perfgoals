(function(){
	
	Highcharts.setOptions({
	    colors: ['#50B432', '#ED561B', '#058DC7', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4'],
        series:{
            	animation:{
            		duration: 5000
            	}
            }
	});
	angular.module('goalApp').directive('hcDonut', function () { 
		return {
		  restrict: 'C',
		  replace: true,
		  
		  link: function (scope, element, attrs) {
		    var chart = new Highcharts.Chart({
		    	chart: {
		    		renderTo: $(element).attr('id'),
		            plotBackgroundColor: null,
		            plotBorderWidth: 0,
		            plotShadow: false
		        },
		        title: {
		            text: 'Utilization',
		            align: 'center',
		            verticalAlign: 'middle',
		            y: 50
		        },
		        tooltip: {
		            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
		        },
		        credits: false,
		        export: false,
		        plotOptions: {
		            pie: {
		                dataLabels: {
		                    enabled: true,
		                    distance: -50,
		                    style: {
		                        fontWeight: 'bold',
		                        color: 'white',
		                        textShadow: '0px 1px 2px black'
		                    }
		                },
		                startAngle: -90,
		                endAngle: 90,
		                center: ['50%', '75%']
		            }
		        },
		        series: [{
		            type: 'pie',
		            name: 'Billing',
		            innerSize: '50%',
		            data: scope.billingChart
		        }]
		    });
		    scope.$watch("billingChart", function (newValue) {
		        chart.series[0].setData(newValue, true);
		      }, true);
		  }
		}
		});
	
	angular.module('goalApp').controller('employeeContributionController', ['$scope','fetchBilling','appService', function($scope, fetchBilling,appService){
		var contributionURL = appService.contribURL;
		
		fetchBilling.getContributionDetails(contributionURL).then(function(data){
			 $scope.contribution = data;
			 $scope.billingChart= [
				                   ['Billable', data.billable.value],
				                   ['Non-Billable', data.nonBillable.value]
				                 ];
		 });
	}]);
	
	angular.module('goalApp').service('fetchBilling', ['$http','$q', function ($http,$q) {
		return({
			getContributionDetails:getContributionDetails
		})

		function getContributionDetails(contributionURL) {
	         return ($http.get(contributionURL).then(handleSuccess,handleError));
	    }
		function handleSuccess(response){
			return response.data;
		}
		function handleError(response){
			return $q.reject(response.data.message);
		}
	}]);
}());