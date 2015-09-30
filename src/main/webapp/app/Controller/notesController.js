(function(){
	
	angular.module("goalApp").controller('NotesController',['$scope','notesService','appService', function($scope,notesService,appService){
		$scope.notes={};
		notesURL=appService.getNotesURL;
		notesService.getNotesForm(notesURL).then(function(data){
			$scope.notesList= data;
			$scope.lasElement = data.length-1;
		});
		
		$scope.saveNotes = function(){
			notesValsFinal =[];
			notesURL= appService.updateNotesURL;
			//$.extend($scope.notesList[0], $scope.notesList[1])
			notesService.updateNotesForm(notesURL,$scope.notes).then(function(data){
				$scope.notesList= data;
				$scope.lasElement = data.length-1;
		});
	}
	}]);
	
	angular.module("goalApp").service('notesService',['$http','$q',function($http,$q){
		return{
			updateNotesForm:updateNotesForm,
			getNotesForm:getNotesForm
		}
		function updateNotesForm(notesURL,notes){
			return($http.post(notesURL,$.param(notes),{
				headers: {'Content-Type':'application/x-www-form-urlencoded'}
			}).then(handleSuccess,handleError));
		}
		
		function getNotesForm(notesURL){
			return($http.get(notesURL).then(handleSuccess,handleError));
		}
		
		function handleSuccess(response){
			return response.data;
		}
		function handleError(response){
			return $q.reject(response.data.message);
		}
	}])
}())