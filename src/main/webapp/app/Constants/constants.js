(function(){
	
	var goalApp = angular.module('goalApp');
	var context='perfgoals';
	goalApp.constant('appService',{
		imageURL: '/perfgoals/service/names/image',
		employeeListURL: '/perfgoals/service/names/getEmployeeList',
		resumeLinkURL: '/perfgoals/service/names/getResume/',
		uploadURL: '/perfgoals/service/names/upload',
		utilGoalURL: '/perfgoals/service/names/goals/UtilizationGoal',
		pracAreaURL: '/perfgoals/service/names/goals/Practice%20Area%20Goal',
		profDvpURL: '/perfgoals/service/names/goals/Professional%20Development%20Goal',
		genURL: '/perfgoals/service/names/goals/General%20Goal',
		evalURL: '/perfgoals/service/names/goals/Evaluation',
		contribURL: '/perfgoals/service/names/contribution',
		ptoURL: '/perfgoals/service/names/ptoDetails',
		getNotesURL: '/perfgoals/service/names/getNotes/1',
		updateNotesURL: '/perfgoals/service/names/updateNotes/1',
		prevYrsURL: '/perfgoals/service/names/getPrevYearsGoal'
	});
	
	goalApp.constant('chartAttributes',{
		spiderTitle: 'Goals Across Criteria',
		spiderCategoryProject: 'Project',
		spiderCategoryProf: 'Professional',
		spiderCategoryOrg: 'Organization',
		spiderCategoryGen: 'General',
		spiderCategoryUtil: 'Utilization',
		spiderName: 'Years Rating'
	});
	
	goalApp.constant('factoryData',{
		
	});
	
	goalApp.constant('filterNames',{
		revertNewLine: 'revertNewLine',
		splitColon: 'splitColon'
	});
	
}());