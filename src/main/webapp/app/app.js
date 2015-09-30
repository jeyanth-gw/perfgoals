
(function(){
	var demoApp = angular.module("goalApp",['ngRoute','ngCookies']);
	demoApp.config(function($routeProvider){
		$routeProvider
		.when('/',{
				controller: 'employeeSuggestController',
				templateUrl: 'app/View/employeeSuggest.html'
			})
		.when('/employeeProfile/:employeeId',{
				controller: 'employeeController',
				templateUrl: 'app/View/employeeInfoView.html'
			})
		.when('/uploadGoal',{
				controller: 'uploadController',
				templateUrl: 'app/View/employeeGoalSheetUpload.html'
		})
		.when('/pto',{
				controller: 'ptoController',
				templateUrl: 'app/View/pto.html' 
		})
		.when('/contribution',{
				controller: 'employeeContributionController',
				templateUrl: 'app/View/employeeContribution.html'
		})
		.when('/notes',{
				controller: 'NotesController',
				templateUrl: 'app/View/notes.html'
		})
		.when('/abc',{
				controller: 'abcController',
				templateUrl: 'app/View/abc.html'
		})
		.otherwise( {redirectTo: '/'});
	});
}());
