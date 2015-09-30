(function(){
	var goalApp = angular.module("goalApp");
	
	/**
	 *  Directive to plot spider chart based - Goals Summary Section.
	 */
	goalApp.directive('hcSpider',['chartAttributes', function (chartAttributes) {
		return {
		  restrict: 'C',
		  replace: true,
		  
		  link: function (scope, element, attrs) {
		      var chart = new Highcharts.Chart({
		    	  chart: {
		              polar: true,
		              type: 'line',
		              renderTo:$(element).attr('id')
		          },
		          title: {
		              text: chartAttributes.spiderTitle,
		              x: -80
		          },
		          pane: {
		              size: '80%'
		          },
		          xAxis: {
		              categories: [chartAttributes.spiderCategoryProject, chartAttributes.spiderCategoryProf, chartAttributes.spiderCategoryOrg, chartAttributes.spiderCategoryGen, chartAttributes.spiderCategoryUtil],
		              tickmarkPlacement: 'on',
		              lineWidth: 0
		          },
		          yAxis: {
		              gridLineInterpolation: 'polygon',
		              lineWidth: 0,
		              min: 0
		          },
		          tooltip: {
		              shared: true,
		              pointFormat: '<span style="color:{series.color}">{series.name}: <b>{point.y:,.0f}</b><br/>'
		          },
		          legend: {
		              align: 'right',
		              verticalAlign: 'top',
		              y: 70,
		              layout: 'vertical'
		          },
		          series: [{
		              name: chartAttributes.spiderName,
		              data: [parseInt(scope.evalBox), parseInt(scope.profEvalBox), parseInt(scope.orgEvalBox), parseInt(scope.generalEvalBox), parseInt(scope.utilEvalBox)],
		              pointPlacement: 'on'
		          }]
		      });
		  }
		}
	}]);
	
	/** 
	 *  Directive to update the width of elements 
	 **/
	angular.module('goalApp').directive('flexibleWidth', function() {
		return {
	        restrict: 'A',
	        link: function(scope, element, attrs) {
	        	scope.$watch($(element).attr('ng-model'), function (newValue) {
	        		if(undefined!=newValue){
		        		element.css({ 
		        	        width: ((newValue.length + 1) * 8) + 'px',
		        	        maxWidth: '800px',
		        	        minWidth: '145px',
		        	        height: '100%'
		        	      });
	        		}
	              }, true);
	        }
	    };
	});
	
	/**
	 * 	Directive to bind file to scope for upload
	 **/
	angular.module('goalApp').directive('fileModel', function ($parse) {
	    return {
	        restrict: 'A',
	        link: function(scope, element, attrs) {
//	        	var model = $parse(attrs.ngModel);
//	            var modelSetter = model.assign;
	            element.bind('change', function(){
	                    scope.newFileVal=element[0].files[0];
	                    //modelSetter(scope,element[0].files[0])
	            });
	        }
	    };
	});
	
	/**
	 * 	Directive to plot Previous Year's Goals.
	 */
	angular.module("goalApp").directive('hcGoalbar',function(){
		return{
			restrict: 'C',
			replace: true,
			link: function(scope,element,attr){
				scope.$watch($(element).attr('ng-model'), function (newValue) {
					if(undefined!=newValue){
						var chart = new Highcharts.Chart({
							chart: {
								renderTo: $(element).attr('id'),
					            type: 'column',
					            margin: 75,
					            options3d: {
					                enabled: true,
					                alpha: 10,
					                beta: 20,
					                depth: 70
					            }
					        },
					        title: {
					            text: "Previous Year's Goals"
					        },
					        plotOptions: {
					            column: {
					                depth: 25
					            }
					        },
					        xAxis: {
					        	categories: scope.plotXVals
					        },
					        yAxis: {
					            title: {
					                text: null
					            }
					        },
					        series: [{
					            name: 'Previous Years Goals',
					            data: scope.plotYVals
					        }]
						});
					}
				},true);
			}
		}
	});
	
	/**
	 *  Directive to plot PTO chart.
	 */
	angular.module('goalApp').directive('hcPie', function () {
		return {
		  restrict: 'C',
		  
		  link: function (scope, element, attrs) {
		    var chart = new Highcharts.Chart({
		      chart: {
		        renderTo: $(element).attr('id'),
		        plotBackgroundColor: null,
		        plotBorderWidth: null,
		        plotShadow: false,
		        options3d: {
	                enabled: true,
	                alpha: 45
	            }
		      },
		      legend: {
		        layout: 'horizontal',
		        align: 'center',
		        verticalAlign: 'top',
		        x: 0,
		        y: 20
		      },
		      title: {
		        text: 'Leaves Taken'
		      },
		      tooltip: {
		        pointFormat: '{series.name}: <b>{point.percentage}%</b>',
		        percentageDecimals: 1
		      },
		      plotOptions: {
		        pie: {
		          allowPointSelect: true,
		          cursor: 'pointer',
		          innerSize: 100,
	              depth: 45,
		          dataLabels: {
		            enabled: true,
		            color: '#000000',
		            connectorColor: '#000000',
		            formatter: function () {
		              return '<b>' + this.point.name + '</b>: ' + this.percentage + ' %';
		            }
		          },
		        showInLegend:true
		        }
		      },
		      series: [{
		        type: 'pie',
		        name: 'Leave Chart',
		        data: scope.leaveChartValues
		      }]
		    });
		   scope.$watch("leaveChartValues", function (newValue) {
			   
			   if(undefined!=newValue){
				        chart.series[0].setData(newValue, true);
			   }
		      }, true);
		  }
		}
		});
	
	/**
	 * Date Picker Directive - Employee PTO Section.
	 * 
	 */
	angular.module('goalApp').directive('leaveCalendar', function () {
	    return {
	        restrict: 'A',
	        require: 'ngModel',
	         link: function (scope, element, attrs) {
	        	 scope.$watch("leaveDates", function (newValue) {
	      		   if(undefined!=newValue){
	      			 element.datepicker({
			                beforeShowDay: function(date){
			                var Highlight = scope.leaveDates[date];
			                
			                if (Highlight)
			                return [true, "leaveDays", Highlight];
			                else
			                 return [true, '', ''];
			                },
			                dateFormat: 'DD, d  MM, yy',
			                firstDay: 1, 
			                numberOfMonths: 12,
			                minDate: new Date(2013, 0, 1),
			                maxDate: new Date(),
			                numberOfMonths: [2,6],
			                onSelect: function (date) {
			                    scope.date = date;
			                    scope.$apply();
			                }
			            });
	      		   }
	      		 
	      	      }, true);
	        }
	    };
	});
	
	/**
	 *  To implement date picker for Notes Page
	 */
	angular.module("goalApp").directive('notesCalendar', function(){
		return{
			restrict:'A',
			link: function(scope,element,attrs){
				element.datepicker({
					buttonImage: './img/calendar-icon.png',
			        buttonImageOnly: true,
			        changeMonth: true,
			        changeYear: true,
			        showOn: 'button',
				});
			}
		}
	});
	
	/**
	 *  To append rows on clicking the addbutton image.
	 */
	angular.module("goalApp").directive('addbuttons', function($compile){
		return(
			function(scope,element,attrs){
				element.bind("click", function(){
					var incrementor= $('#firstSec input[type=radio]').last().attr('name').split("feeling")[1];
					incrementor++;
					var html="<div class='form-group col-md-4'><input name='notesDate' class='datePicInp' style='margin-left: -15px;' type='text' ng-model='notes.notesDate"+incrementor+"' notes-calendar/>"+
					"</div><div class='form-group col-md-4'><textarea class='form-control padTextbox' style='width:350px; margin-left: -45px;' ng-model='notes.textArea"+incrementor+"'></textarea></div><div class='form-group col-md-4' style='margin-left:-75px'><label class='padEmoticon'>"+
					"<input type='radio' name='feeling"+incrementor+"' value='1' ng-model='notes.feel"+incrementor+"'/><img src='./img/revenge-emoticon.gif'>"+
					"</label><label class='padEmoticon'><input type='radio' name='feeling"+incrementor+"' value='2' ng-model='notes.feel"+incrementor+"'/>"+
					"<img src='./img/sad-eyes-smiley-emoticon.gif'></label><label class='padEmoticon'>"+
					"<input type='radio' name='feeling"+incrementor+"' value='3' ng-model='notes.feel"+incrementor+"'/><img src='./img/widely-grinning-smiley-emoticon.gif'>"+
					"</label><label class='padEmoticon'><input type='radio' name='feeling"+incrementor+"' value='4' ng-model='notes.feel"+incrementor+"'/><img src='./img/thumbs-up.gif'></label></div></div>";
					angular.element($("#"+element.attr('id')).parent().parent()).append($compile(html)(scope));
				});
		} )
	});
	angular.module("goalApp").directive('persistId',function($cookieStore,$rootScope){
		return{
			restrict: 'A',
			link:function(scope,element,attrs){
				element.bind("click",function(){
					$rootScope.empId=$cookieStore.get('idNew');
					window.location = "#/employeeProfile/"+$rootScope.empId;
					//$(element).attr('')
				})
			}
		}
	})
}())