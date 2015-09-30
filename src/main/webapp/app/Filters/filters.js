(function(){
		
	angular.module("goalApp").filter('splitColon', function(){
		return (function(inputData){
			return inputData.split(":")[1];
		});
	});
	
	angular.module("goalApp").filter('revertNewLine', function(){
		return(function(inputField){
			return inputField.replace(/\^/g, '\n');
		});
	});
}())