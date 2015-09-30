(function(){

	var employeeFactory = function(){
		var tabRedirection = [{
	        title: 'Project Goals',
	        url: 'app/View/projectGoals.html'
	    }, {
	        title: 'Utilization Goals',
	        url: 'app/View/utilizationGoals.html'
	    },{
	        title: 'Organization Goals',
	        url: 'app/View/orgGoals.html'
	    },{
	        title: 'Professional Goals',
	        url: 'app/View/profGoals.html'
	    },{
	        title: 'General Goals',
	        url: 'app/View/generalGoal.html'
	    },{
	        title: 'Summary',
	        url: 'app/View/summary.html'
	    }
	    ];
		//Factory Object
		var empFactory = {};
		
		//Method which returns tabs
		empFactory.getTab = function(){
			return tabRedirection;
		}
		
		//Method to filter out employee details using empId
		empFactory.getSelectedUserDetails = function(employeeId,empList){
			var employeeDetLength = empList.length;
			var empJSON;
			for(i=0;i<employeeDetLength;i++){
				if(empList[i].id == employeeId){
					empJSON = empList[i];
					break;
				}
			}
			return empJSON;
		}
		return empFactory;
	}
	angular.module('goalApp').factory('employeeFactory',employeeFactory);
}());
	
