var KendoPApp = angular.module("KendoProjectApp", ["kendo.directives", "ngSanitize","ngRoute", "ngResource","ui.People",'ngFileUpload']);
var SpURL;
var projId;
var webURL;
var refreshTym;
var proLen;
if (location.hostname == 'projectmadeeasy.sharepoint.com') {
	SpURL = _spPageContextInfo.siteAbsoluteUrl;
	projId = getParameterByName("projuid");
	webURL = _spPageContextInfo.webServerRelativeUrl;
	refreshTym = _spFormDigestRefreshInterval;
	proLen = $('input[title="Project Name"]').length;
} else {
	SpURL = 'https://projectmadeeasy.sharepoint.com/sites/Development';
	projId = 'dabc99c5-1746-ed11-be1e-00155da45649';
	webURL = '/sites/Development';
	refreshTym = 1440000;
	proLen = 1;
}
KendoPApp.config(function ($routeProvider) {
	$routeProvider		
  .when('/StatusMain', {
	templateUrl: 'projectfiles/StatusMain.html',
	controller:"ProjectStatusMainController",
  })
  .otherwise({
	redirectTo: "/StatusMain"
  });
});
KendoPApp.directive('ngFileModel', ['$parse', function ($parse) {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      var model = $parse(attrs.ngFileModel);
      var isMultiple = attrs.multiple;
      var modelSetter = model.assign;
      element.bind('change', function () {
        var values = [];
        angular.forEach(element[0].files, function (item) {
          var value = {
            name: item.name,
            size: item.size,
            url: URL.createObjectURL(item),
            _file: item
          };values.push(value);
        });
        scope.$apply(function () {
          if(isMultiple) {
            modelSetter(scope, values);
          }else{
            modelSetter(scope, values[0]);
          }
        });
      });
    }
  };
}]);
KendoPApp.factory("baseSvc", ["$http", "$q",
  function ($http, $q) {
	var getRequest = function (baseUrl, query) {
	  var deferred = $q.defer();
	  $.ajax({
		url: query,
		type: "GET",
		headers: {
		  "accept": "application/json;odata=verbose",
		  "content-Type": "application/json;odata=verbose"
		},success: function (success) {
		  deferred.resolve(success);
		},error: function (error) {
		  deferred.reject(error);
		}
	  });return deferred.promise;
	};
	var postRequest = function (postData, baseUrl) {
	  var deferred = $q.defer();
	  $.ajax({
		url: baseUrl,
		type: "POST",
		data: JSON.stringify(postData),
		headers: {
		  "Accept": "application/json;odata=verbose",
		  "Content-Type": "application/json;odata=verbose",
		  "X-RequestDigest": $("#__REQUESTDIGEST").val(),
		  "X-HTTP-Method": "POST"
		},success: function (data, status, xhr) {
		  deferred.resolve(data);
		},error: function (xhr, status, error) {
		  deferred.reject(xhr);
		}
	  });return deferred.promise;
	};
	var updateRequest = function (postData, baseUrl) {
	  var deferred = $q.defer();
	  $.ajax({
		url: baseUrl,
		method: "POST",
		data: JSON.stringify(postData),
		headers: {
		  "accept": "application/json;odata=verbose",
		  "content-type": "application/json;odata=verbose",
		  "X-RequestDigest": $("#__REQUESTDIGEST").val(),
   		  "IF-MATCH": "*", 
		  "X-HTTP-Method": "MERGE" 
		},success: function (success) {
		  deferred.resolve(success);
		},error: function (error) {
		  deferred.reject(error);
	    }
	  });return deferred.promise;
	};
	var deleteRequest = function (baseUrl) {
	  var deferred = $q.defer();
	  $.ajax({
		url: baseUrl, 			
		type: "DELETE",
		headers: {
		  "accept": "application/json;odata=verbose",
		  "X-RequestDigest": $("#__REQUESTDIGEST").val(),
		  "If-Match": "*"
		},success: function (result) {
		  deferred.resolve(result);
		},error: function (error) {
		  deferred.reject(error);
		}
	  });return deferred.promise;
	};
    return{
	  getRequest: getRequest,
	  postRequest:postRequest,
	  updateRequest:updateRequest,
	  deleteRequest:deleteRequest,
	};
  }
]);
KendoPApp.factory("ProjectkFactoryService", ["baseSvc",
  function (baseService) {
	 var AddNew = function (data, ListName) {
		var url = SpURL + "/_api/web/lists/getByTitle('" + ListName + "')/items";
		return baseService.postRequest(data, url);
	};
	var GetAllItems = function (ListName,url) {			
	  return baseService.getRequest('', url);
	};
	var Update = function (data, ListName, Id) {
	  var url = SpURL + "/_api/web/lists/getByTitle('" + ListName + "')/GetItemById('" + Id + "')";
	  return baseService.updateRequest(data, url);
	};
	var DeleteById = function (ListName, Id) {
	  var url = SpURL + "/_api/web/lists/getByTitle('" + ListName + "')/items('" + Id + "')";
	  return baseService.deleteRequest(url);		
	};
    return {
	  AddNew:AddNew,
	  Update:Update,
	  GetAllItems:GetAllItems,
	  DeleteById:DeleteById,
	};
  }
]);
KendoPApp.controller('ProjectkController', ['$scope', "$http", "$q", "$location","$sce", 'baseSvc', 'ProjectkFactoryService',
  function ($scope, $http, $q, $location, $sce, bSvc, PService) {
	$scope.init = function(){	
	  $("#ReloadPageId").hide();
	  timecout()
	  if(window.location.hash === "#!/StatusMain"){				
		$location.path('/StatusMain');
		$scope.ShowStatusMain();
	  }
	  $scope.HealthDDList = [];
	  var UIDP = projId;
	  $scope.KeyLessonLessonsLearned = { dataSource:['Yes','No']}
	  $scope.HealthDDListTem = ['Grey','Green','Yellow','Red']
  	  $scope.KHealthDDList = { dataSource: $scope.HealthDDListTem, }; 
	  $scope.TrueProjectName = false;
	  if(proLen == 0){
		$scope.TrueProjectName = true;
	  }
	}
	$scope.ShowStatusMain = function(){		
	  $('ul.nav li.active').removeClass('active');
	  $("a[name^=StatusMain]").closest('li').addClass('active').hover();				
	}
  }
]);
KendoPApp.controller('ProjectStatusMainController', ['$scope', "$http", "$q", "$location","$sce", 'baseSvc', 'ProjectkFactoryService',
  function ($scope, $http, $q, $location, $sce, bSvc, PService) {
	$scope.init = function(){
	localStorage["kendo-grid-options"] = false;
	if(window.location.hash === "#!/StatusMain"){				
	  $location.path('/StatusMain');
	  $scope.ShowStatusMain();
	}
  }
  $scope.EditStatusMain = function(){
	$scope.ViewMode = false;	
	$scope.editviewdisblecopy = false
  }
  $scope.ConvertJsonDateString=function(jsonDate) {
    var shortDate = null;
    if (jsonDate) {
      var regex = /-?\d+/;
      var matches = regex.exec(jsonDate);
      var dt = new Date(parseInt(matches[0]));
      var month = dt.getUTCMonth() + 1;
      var monthString = month > 9 ? month : '0' + month;
      var day = dt.getUTCDate();
      var dayString = day > 9 ? day : '0' + day;
      var year = dt.getUTCFullYear();
      shortDate = monthString + '/' + dayString + '/' + year;
    }return shortDate;
  };
  $scope.to_trusted = function (html_code) {
	var html_code1=htmlDecode(html_code).replace(/\n/g, '<br />');
	return $sce.trustAsHtml(html_code1);
  }
	  $scope.WsiteAbsoluteUrl = SpURL;
  $scope.AddNewItemWindow = function () {
	$scope.ischkStatusMainAlert = false;
	  var projuid = projId;
	  if (location.hostname == 'projectmadeeasy.sharepoint.com') {
		  var url = SpURL + "/_api/ProjectData?$Select=ProjectId&$orderby=ProjectId%20desc&$top=1&$filter=(ProjectId eq guid'" + projuid + "')";
	  } else {
		  var url = 'Data.json';
	  }
	PService.GetAllItems('Status Grid: Data', url).then(function (response) {
	  var ScheduleHealth = 'Grey'
	  var ResourceHealth = 'Grey';	
	  var OverallHealth = null;
	  var ScopeHealth = 'Grey';
	  if(ResourceHealth == 'Red' || ScheduleHealth == 'Red'){
		OverallHealth = 'Red';
	  }else if(ResourceHealth == 'Yellow' || ScheduleHealth == 'Yellow'){
		OverallHealth = 'Yellow';
	  }else if(ResourceHealth == 'Green' || ScheduleHealth == 'Green'){
		OverallHealth = 'Green';
	  }else if(ResourceHealth == 'Grey' || ScheduleHealth == 'Grey'){
		OverallHealth = 'Grey';
	  }
	  $scope.editviewdisblecopy = false
	  $scope.Item = {
		ID: null,					
		Title: null,
		ExecSummary: null,
		GoLive:null,
		StatusDate: null,
		SystemOverallHealth: OverallHealth,
		SystemResourceHealth: ResourceHealth,
		SystemScheduleHealth: ScheduleHealth,
		UserOverallHealth: OverallHealth,
		UserResourceHealth: ResourceHealth,
		UserScheduleHealth: ScheduleHealth,
		WeekEnding:null,
		WeekEndingDate:null,
		UserScopeHealth:ScopeHealth,
		SystemScopeHealth:ScopeHealth,
	  }
	  $('#tablinkfiled1').text($scope.Item.SystemScheduleHealth);
	  $('#tablinkfiled2').text($scope.Item.SystemResourceHealth);
	  $('#tablinkfiled4').text($scope.Item.SystemOverallHealth);
	  $('#tablinkfiled3').text($scope.Item.ScopeHealth);
	  var arraycolor =['tablinks1','tablinks2','tablinks3','tablinks4']
	  angular.forEach(arraycolor, function (item, index) {
		var val = 'NotSet'
		switch (index) {
		  case 0:
		    val = $scope.Item.SystemScheduleHealth != null && $scope.Item.SystemScheduleHealth != '' ? $scope.Item.SystemScheduleHealth:'NotSet'
		  break;
		  case 1:
		    val = $scope.Item.SystemResourceHealth != null && $scope.Item.SystemResourceHealth != '' ? $scope.Item.SystemResourceHealth:'NotSet'	
		  break;
		  case 2:
			val = $scope.Item.ScopeHealth != null && $scope.Item.ScopeHealth != '' ? $scope.Item.ScopeHealth:'NotSet'
		  break;
		  case 3:
			val = $scope.Item.SystemOverallHealth != null && $scope.Item.SystemOverallHealth != '' ? $scope.Item.SystemOverallHealth:'NotSet'
		  break;
		}
		val = (val =='Grey'?"NotSet":val);
		for(i = 0; i < $('.'+item).length; i++) {
		  debugger
		  $('.'+item)[i].className = item+" "
		  switch (val) {
			case 'NotSet':
			if(i == 0){
			  $('.'+item)[i].className = item+" "+val	
			}
			break;
			case 'Grey':
			if(i == 0){
			  $('.'+item)[i].className = item+" "+val	
			}
			break;
			case 'Green':
			if(i == 1){
              $('.'+item)[i].className = item+" "+val	
			}							
			break;
			case 'Red':
			if(i == 3){
			  $('.'+item)[i].className = item+" "+val
			}
			break;
			case 'Yellow':
			if(i == 2){
			  $('.'+item)[i].className = item+" "+val	
			}
			break;
		  }				  
		}
      });
	  $scope.SOJRTextboxTrue =false;
	  $scope.ROJRTextboxTrue =false;
	  if($scope.dataResL){			 
	    $scope.PreFillViewMode = true;
	  }
	  $scope.ViewMode = false;
	  $('.btn').attr('disabled', false);
	  $scope.filesdata = []
	  var heightmax =$('.k-window').height($(window).height()-120);
	  var widthmax =$('.k-window').width($(window).width()-350);
	  var dialogKeyWindow = $("#KWindowStatusMain").data("kendoWindow");
	  dialogKeyWindow.open();
	  dialogKeyWindow.center();
	},function(error){                   
	  console.error('Error: ' + error.result);
	}); 
  }
  //Comment : View and Edit the selected table item
  $scope.EditStatusMainItemView = function (data,ItemView) {
	$scope.ischkStatusMainAlert = false;
	$scope.PreFillViewMode = false;
	  var projuid = projId;
	  if (location.hostname == 'projectmadeeasy.sharepoint.com') {
		  var url = SpURL + "/_api/ProjectData?$Select=ProjectId&$orderby=ProjectId%20desc&$top=1&$filter=(ProjectId eq guid'" + projuid + "')";
	  } else {
		  var url = 'Data.json';
	  }
	PService.GetAllItems('Status Grid: Data', url).then(function (response) {
	  var ScheduleHealth = 'Grey'
	  var ResourceHealth = 'Grey';
	  var OverallHealth = null;
	  var ScopeHealth = 'Grey'
	  if(ResourceHealth == 'Red' || ScheduleHealth == 'Red'){
		OverallHealth = 'Red';
	  }else if(ResourceHealth == 'Yellow' || ScheduleHealth == 'Yellow'){
		OverallHealth = 'Yellow';
	  }else if(ResourceHealth == 'Green' || ScheduleHealth == 'Green'){
		OverallHealth = 'Green';
	  }else if(ResourceHealth == 'Grey' || ScheduleHealth == 'Grey'){
		OverallHealth = 'Grey';
	  }
	  $scope.editviewdisblecopy = false
	  $scope.ViewMode = false;	
	  if(ItemView == 'Title'){
		$scope.ViewMode = true;	
		$scope.editviewdisblecopy = true
		$scope.editviewdisble = true;
		if(data.WeekNumberIstrue){
		  $scope.editviewdisble = false;
		}
	  }
	  $scope.SOJRTextboxTrue =false;
	  $scope.ROJRTextboxTrue =false;
	  if(data.UserScheduleHealth != ScheduleHealth){
		$scope.SOJRTextboxTrue =true;
	  }
	  if(data.UserResourceHealth != ResourceHealth){
		$scope.ROJRTextboxTrue =true;
	  }
	  var cin = ['Grey','Red','Yellow','Green']
	  $scope.Item = {
		ID: data.ID,					
		Title: data.Title,
		ExecSummary: data.ItemsUpcoming,
		GoLive:data.ItemsCompleted,
		StatusDate: data.WeekEndingText,
		SystemOverallHealth: cin[data.OverallHealth]== -1 ?cin[0]:cin[data.OverallHealth],
		SystemResourceHealth: cin[data.ResourcesHealth]== -1 ?cin[0]:cin[data.ResourcesHealth],
		SystemScheduleHealth: cin[data.ScheduleHealth]== -1 ?cin[0]:cin[data.ScheduleHealth],
		UserOverallHealth: null,
		UserResourceHealth: null,
		UserScheduleHealth: null, 
		WeekEndingDate:data.WeekEndingDate,
		UserScopeHealth:null,
		SystemScopeHealth:cin[data.ScopeHealth] == -1 ?cin[0]:cin[data.ScopeHealth],
	  }
	  $('.btn').attr('disabled', false);
	  $('#tablinkfiled1').text($scope.Item.SystemScheduleHealth);
	  $('#tablinkfiled2').text($scope.Item.SystemResourceHealth);
	  $('#tablinkfiled4').text($scope.Item.SystemOverallHealth);
	  $('#tablinkfiled3').text($scope.Item.SystemScopeHealth);
	  var arraycolor =['tablinks1','tablinks2','tablinks3','tablinks4']
	  angular.forEach(arraycolor, function (item, index) {
		var val = 'NotSet'
		switch (index) {
		  case 0:
			val = $scope.Item.SystemScheduleHealth != null && $scope.Item.SystemScheduleHealth != '' ? $scope.Item.SystemScheduleHealth:'NotSet'
		  break;
		  case 1:
			val = $scope.Item.SystemResourceHealth != null && $scope.Item.SystemResourceHealth != '' ? $scope.Item.SystemResourceHealth:'NotSet'	
		  break;
		  case 2:
			val = $scope.Item.SystemScopeHealth != null && $scope.Item.SystemScopeHealth != '' ? $scope.Item.SystemScopeHealth:'NotSet'
		  break;
		  case 3:
			val = $scope.Item.SystemOverallHealth != null && $scope.Item.SystemOverallHealth != '' ? $scope.Item.SystemOverallHealth:'NotSet'
		  break;
		}
		val = (val =='Grey'?"NotSet":val);
	    for (i = 0; i < $('.'+item).length; i++) {
		  debugger
		  $('.'+item)[i].className = item+" "
		  switch (val) {
			case 'NotSet':
			if(i == 0){
			  $('.'+item)[i].className = item+" "+val	
			}
			break;
			case 'Grey':
			if(i == 0){
			  $('.'+item)[i].className = item+" "+val	
			}
			break;
			case 'Green':
			if(i == 1){
			  $('.'+item)[i].className = item+" "+val	
			}							
			break;
			case 'Red':
			if(i == 3){
			  $('.'+item)[i].className = item+" "+val
			}
			break;
			case 'Yellow':
			if(i == 2){
			  $('.'+item)[i].className = item+" "+val	
			}
			break;
		  }				  
		}
	  });
	  $scope.filesdata = []
	  var heightmax =$('.k-window').height($(window).height()-120);
	  var widthmax =$('.k-window').width($(window).width()-350);
	  var dialogKeyWindow = $("#KWindowStatusMain").data("kendoWindow");
	  dialogKeyWindow.open();
	  dialogKeyWindow.center();
	  dialogKeyWindow.setOptions({height:heightmax,width:widthmax});
	  $('.k-content').animate({ scrollTop: 0 }, 'fast');
	}, function (error) {                   
	  console.error('Error: ' + error.result);
	}); 
  }
  $scope.ViewModeD = true;
  $scope.SaveFillfromPrevious = function(){
	var data = $scope.PrefilldataB;			
	  var projuid = projId;
	  if (location.hostname == 'projectmadeeasy.sharepoint.com') {
		  var url = SpURL + "/_api/ProjectData?$Select=ProjectId&$orderby=ProjectId%20desc&$top=1&$filter=(ProjectId eq guid'" + projuid + "')";
	  } else {
		  var url = 'Data.json';
	  }
	PService.GetAllItems('Status Grid: Data', url).then(function (response) {
	  var ScheduleHealth = 'Grey'
	  var ResourceHealth = 'Grey';
	  var OverallHealth = null;
	  var ScopeHealth = 'Grey'
	  if(ResourceHealth == 'Red' || ScheduleHealth == 'Red'){
		OverallHealth = 'Red';
	  }else if(ResourceHealth == 'Yellow' || ScheduleHealth == 'Yellow'){
		OverallHealth = 'Yellow';
	  }else if(ResourceHealth == 'Green' || ScheduleHealth == 'Green'){
		OverallHealth = 'Green';
	  }else if(ResourceHealth == 'Grey' || ScheduleHealth == 'Grey'){
		OverallHealth = 'Grey';
	  }		
	  var cin = ['Grey','Red','Yellow','Green']
	  $scope.Item = {
		ID: null,					
		Title: data.Title,
		ExecSummary: data.ItemsUpcoming,
		GoLive:data.ItemsCompleted,
		StatusDate: data.WeekEndingText,//StatusDate,
		SystemOverallHealth: cin[data.OverallHealth]== -1 ?cin[0]:cin[data.OverallHealth],
		SystemResourceHealth: cin[data.ResourcesHealth]== -1 ?cin[0]:cin[data.ResourcesHealth],
		SystemScheduleHealth: cin[data.ScheduleHealth]== -1 ?cin[0]:cin[data.ScheduleHealth],
		UserOverallHealth: null,
		UserResourceHealth: null,
		UserScheduleHealth: null, 
		WeekEndingDate:data.WeekEndingDate,
		UserScopeHealth:null,
		SystemScopeHealth:cin[data.ScopeHealth] == -1 ?cin[0]:cin[data.ScopeHealth],
	  }
	  $('.btn').attr('disabled', false);
	  $('#tablinkfiled1').text($scope.Item.SystemScheduleHealth);
	  $('#tablinkfiled2').text($scope.Item.SystemResourceHealth);
	  $('#tablinkfiled4').text($scope.Item.SystemOverallHealth);
	  $('#tablinkfiled3').text($scope.Item.SystemScopeHealth);
	  var arraycolor =['tablinks1','tablinks2','tablinks3','tablinks4']
	  angular.forEach(arraycolor, function (item, index) {
	  var val = 'NotSet'
	  switch (index) {
		case 0:
		val = $scope.Item.SystemScheduleHealth != null && $scope.Item.SystemScheduleHealth != '' ? $scope.Item.SystemScheduleHealth:'NotSet'
		break;
	    case 1:
		val = $scope.Item.SystemResourceHealth != null && $scope.Item.SystemResourceHealth != '' ? $scope.Item.SystemResourceHealth:'NotSet'	
		break;
		case 2:
	    val = $scope.Item.SystemScopeHealth != null && $scope.Item.SystemScopeHealth != '' ? $scope.Item.SystemScopeHealth:'NotSet'
		break;
		case 3:
		val = $scope.Item.SystemOverallHealth != null && $scope.Item.SystemOverallHealth != '' ? $scope.Item.SystemOverallHealth:'NotSet'
		break;
	  }
	  val = (val =='Grey'?"NotSet":val);
	  for (i = 0; i < $('.'+item).length; i++) {
		debugger
		$('.'+item)[i].className = item+" "
		switch (val) {
		  case 'NotSet':
		  if(i == 0){
			$('.'+item)[i].className = item+" "+val	
		  }
		  break;
		  case 'Grey':
		  if(i == 0){
			$('.'+item)[i].className = item+" "+val	
		  }
		  break;
		  case 'Green':
		  if(i == 1){
			$('.'+item)[i].className = item+" "+val	
		  }							
		  break;
		  case 'Red':
		  if(i == 3){
			$('.'+item)[i].className = item+" "+val
		  }
		  break;
		  case 'Yellow':
		  if(i == 2){
			$('.'+item)[i].className = item+" "+val	
		  }
		  break;
		}				  
	  }
	});		
  }, function (error) {                   
	console.error('Error: ' + error.result);
  }); 
  }
  $scope.changeHealth = function(){
	var	ResourceHealth = $scope.Item.SystemResourceHealth
	var	ScheduleHealth =$scope.Item.SystemScheduleHealth
	$scope.SOJRTextboxTrue =false;
	$scope.ROJRTextboxTrue =false;
    if($scope.Item.UserScheduleHealth != ScheduleHealth){
	  $scope.SOJRTextboxTrue =true;
	}
	if($scope.Item.UserResourceHealth != ResourceHealth){
	  $scope.ROJRTextboxTrue =true;
	}
	var OverallHealth = null;
	if(ResourceHealth == 'Red' || ScheduleHealth == 'Red'){
	  OverallHealth = 'Red';
	}else if(ResourceHealth == 'Yellow' || ScheduleHealth == 'Yellow'){
	  OverallHealth = 'Yellow';
	}else if(ResourceHealth == 'Green' || ScheduleHealth == 'Green'){
	  OverallHealth = 'Green';
	}else if(ResourceHealth == 'Grey' || ScheduleHealth == 'Grey'){
	  OverallHealth = 'Grey';
	}
	$scope.Item.SystemOverallHealth = OverallHealth;
  }
  $scope.returnValTestMain = function(val){
	  var num = null;
	  if(val == 0){num ='Grey'}				
	  else if(val == 1){num ='Red'}				
	  else if(val == 2){num ='Yellow'}
	  else if(val == 3){num ='Green'}
	  return num;	
  }
  // Comment: Page Load  Get the data form the list and bind the table
	$scope.ShowStatusMain = function(){	 
	  $('ul.nav li.active').removeClass('active');
	  $("a[name^=StatusMain]").closest('li').addClass('active').hover();
	  var UID = projId;
	  var today = new Date();
	  var firstDayOfYear = new Date(today.getFullYear(), 0, 1);
	  var pastDaysOfYear = (today - firstDayOfYear) / 86400000;
	  var weeknumchk =  Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() - 1) / 7);
	  var currcopy = new Date();
	  if(currcopy.getDay() == 0){currcopy.setDate(currcopy.getDate() - 1)}
	  else if(currcopy.getDay() == 1){currcopy.setDate(currcopy.getDate() - 2);}
	  else if(currcopy.getDay() == 2){currcopy.setDate(currcopy.getDate() - 3);}
	  else if(currcopy.getDay() == 3){currcopy.setDate(currcopy.getDate() + 3);}
	  else if(currcopy.getDay() == 4){currcopy.setDate(currcopy.getDate() + 2); }
	  else if(currcopy.getDay() == 5){currcopy.setDate(currcopy.getDate() + 1);}
	  else if(currcopy.getDay() == 6){currcopy.setDate(currcopy.getDate() + 0);}
	  var WeekEnddateNew = new Date(currcopy);
	  $scope.WeekNumberIstrue = false;
	  if (location.hostname == 'projectmadeeasy.sharepoint.com') {
			var url = SpURL + "/_api/web/lists/getByTitle('Status Grid: Data')/items?$top=4998&$select=*,Created,Modified,Author/Id,Author/Name,Author/Title,Editor/Id,Editor/Name,Editor/Title,Attachments,AttachmentFiles&$expand=AttachmentFiles,Author/Id,Editor/Id&$filter=ProjectId eq '" + UID + "'&$orderby=WeekEndingDate desc";
		} else {
			var url = 'Data.json';
		}
		PService.GetAllItems('Status Grid: Data', url).then(function (response) {			
		$scope.getStatusMainRes = [];
		angular.forEach(response.d.results, function (item, index) {
		$scope.getStatusMainRes.push(item)						
		$scope.getStatusMainRes[index].Title  = item.Title != null ?item.Title:'';
	    $scope.getStatusMainRes[index].CreatedC = (item.Created != null) ? $scope.ConvertDateToMMDDYYYY(item.Created) : '';
		$scope.getStatusMainRes[index].ModifiedC = (item.Modified != null) ? $scope.ConvertDateToMMDDYYYY(item.Modified) : '';
		$scope.getStatusMainRes[index].Delete  = null;
		$scope.getStatusMainRes[index].Edit  = null;
		$scope.getStatusMainRes[index].WeekNumberIstrue  = false;
		$scope.getStatusMainRes[index].WeekEndtext = item.Title.split(':')[1].trim()
		$scope.getStatusMainRes[index].UserOverallHealth  = $scope.returnValTestMain(item.OverallHealth);
	    $scope.getStatusMainRes[index].UserResourceHealth  = $scope.returnValTestMain(item.ResourcesHealth);
		$scope.getStatusMainRes[index].UserScheduleHealth  = $scope.returnValTestMain(item.ScheduleHealth);
		$scope.getStatusMainRes[index].UserScopeHealth  = $scope.returnValTestMain(item.ScopeHealth);
		$scope.getStatusMainRes[index].ItemsCompleted  =$("<div>").html(item.ItemsCompleted).html();
		$scope.getStatusMainRes[index].ItemsUpcoming  =  $("<div>").html(item.ItemsUpcoming).html();
		var Ctoday = new Date(); 
		Ctoday = new Date(Ctoday.getFullYear(),Ctoday.getMonth(),Ctoday.getDate());
		Ctoday = new Date(Ctoday.getFullYear(),Ctoday.getMonth(),Ctoday.getDate());
		var WeekEnddate= new Date(item.WeekEndingDate);
		var Weektoday = new Date(item.WeekEndingDate);
		Weektoday = new Date(Weektoday.setDate(Weektoday.getDate()+7));
		Weektoday = new Date(Weektoday.getFullYear(),Weektoday.getMonth(),Weektoday.getDate())
		var WeekStart = new Date(item.WeekEndingDate);
		WeekStart = new Date(WeekStart.setDate(WeekStart.getDate()-3));
		WeekStart = new Date(WeekStart.getFullYear(),WeekStart.getMonth(),WeekStart.getDate())
		if(WeekEnddate<=Ctoday && Ctoday<=Weektoday){
		  $scope.getStatusMainRes[index].WeekNumberIstrue  = true;
		}
		if(WeekEnddate >=WeekEnddateNew){
		  $scope.getStatusMainRes[index].WeekNumberIstrue  = true;
		}
		if(item.WeekEndingDate != null){
		  if(parseInt(item.WeekEndingDate.split('T')[0].split('-')[0])  == new Date().getFullYear()){
			if(parseInt(item.WeekEndingDate.split('T')[0].split('-')[1])  == new Date().getMonth()+1){
			  if(parseInt(item.WeekEndingDate.split('T')[0].split('-')[2])  <= new Date().getDate() && parseInt(item.WeekEndingDate.split('T')[0].split('-')[2])+7  >= new Date().getDate() ){
				$scope.getStatusMainRes[index].WeekNumberIstrue  = true;
			  }
			}
		  }
		}
		if(WeekStart<=Ctoday && Ctoday<=WeekEnddate){
		  $scope.getStatusMainRes[index].WeekNumberIstrue  = true;
		}
		if(WeekEnddateNew.getFullYear()  == WeekEnddate.getFullYear() &&  WeekEnddateNew.getMonth()  == WeekEnddate.getMonth() && WeekEnddateNew.getDate()  == WeekEnddate.getDate() ){
		  $scope.WeekNumberIstrue = true;
		}
	  });
	  if($scope.SaveEditTrue){
		$scope.SaveEditTrue = false;
		if($scope.getStatusMainRes.length != 0 ){
		  $('input[title="Overall Health"]').val($scope.getStatusMainRes[0].UserOverallHealth);
		  $('input[title="Resource Health"]').val($scope.getStatusMainRes[0].UserResourceHealth);
		  $('input[title="Schedule Health"]').val($scope.getStatusMainRes[0].UserScheduleHealth);
		  $('input[title="Scope Health"]').val($scope.getStatusMainRes[0].UserScopeHealth);
		  $('input[title="Overall Health"]').change();
		  PDPButton.SaveData();
		}else{
		  $('input[title="Overall Health"]').val('');
		  $('input[title="Resource Health"]').val('');
		  $('input[title="Schedule Health"]').val('');
		  $('input[title="Scope Health"]').val('');
		  $('input[title="Overall Health"]').change(); 
		  PDPButton.SaveData();
		}
	  }
	  $('#StatusMaingrid').empty();
	  $scope.dataResL = false;
	  if($scope.getStatusMainRes.length != 0){
		$scope.dataResL = true;
		$scope.PrefilldataB =$scope.getStatusMainRes[0];
	  }
	  if($scope.ExportallTrue){
		$scope.ExportAllForm();
	  }else{
	    $scope.LoadKendoGridAction($scope.getStatusMainRes);
		$('.btnSColums').css( "font-weight", "bold" );
		$('.btnAllcoumns').css( "font-weight", "" );
	  }
	}, function (error) {                   
	  console.error('Error: ' + error.result);
	}); 
  }
  // Comment : View All column view Table
  $scope.ExportAllForm = function(){			
	$scope.ExportallTrue = true;
	$('.btnAllcoumns').css( "font-weight", "bold" );
	$('.btnSColums').css( "font-weight", "" );
	var options = localStorage["kendo-grid-options"];
	var gridsourcs =[];
	if (options != 'false' && options != 'null'  && options != 'undefined') {
	  var st =JSON.parse(options);
	  gridsourcs = new kendo.data.DataSource({
		data:$scope.getStatusMainRes,
		filter: st,
	  });
	  localStorage["kendo-grid-options"] = 'false';
	}else{
	  gridsourcs = new kendo.data.DataSource({
	    data:$scope.getStatusMainRes,
	  });
	}
	var Vheight = '55vh'
	$('#StatusMaingrid').empty();
	$("#StatusMaingrid").kendoGrid({
	  toolbar: ["excel"],
	  excel: {
		fileName: "StatusMain.xlsx"
	  },
	  dataSource:gridsourcs,
	  height: Vheight,
	  scrollable: {
        virtual: true
      },sortable: true,
	  filterable: {
	    extra: false,
		operators: { 
		  string: {   
			contains: "Contains",									
		  },
		}
	  },
	  resizable: true,
	  selectable: "cell",
	  change: function (e) {
		var cell = this.select();
		var cellIndex = cell[0].cellIndex;
		var column = this.columns[cellIndex];
		var dataItem = this.dataItem(cell.closest("tr"));
		if (column.title == "Title") {									
		  $scope.EditStatusMainItemView(dataItem, column.title);
		}
		if(dataItem.WeekNumberIstrue){
		  if (column.field == "Edit") {									
			$scope.EditStatusMainItemView(dataItem, column.title);
		  }else if (column.field == "Delete") {											
			$scope.DeleteItem(dataItem);
		  }
		}
	  },
	  filterMenuInit: function(e) {
		if (e.field === "UserOverallHealth" || e.field === "UserScheduleHealth" || e.field === "UserResourceHealth" || e.field === "UserScopeHealth" || e.field === "SystemOverallHealth"  || e.field === "SystemScheduleHealth" || e.field === "SystemResourceHealth" || e.field === "SystemScopeHealth" ) {
		  var filterMultiCheck = this.thead.find("[data-field=" + e.field + "]").data("kendoFilterMultiCheck")
		  filterMultiCheck.container.empty();
		  filterMultiCheck.checkSource.sort({field: e.field, dir: "asc"});
		  filterMultiCheck.checkSource.data(filterMultiCheck.checkSource.view().toJSON());
		  filterMultiCheck.createCheckBoxes();
		}
	  },
	  columns: [{ 
		field: "Edit",
		filterable:false,
		title:'.',
		headerTemplate:'<label style=" color:#f3f3f4 ;" class=""></label>',
		template:function(dataItem) {
		  var values = '';
		  if(dataItem.WeekNumberIstrue){
			values = "<a id='btnEdit' class='btnEdit' title='Click to View' ><span class='pointer' style='float: right; cursor: pointer;' title='Click to Edit'><span class='k-icon k-i-edit'></span></span></a>";
		  }return values;
		},width: 30
	  },{ field: "Title",title:'Title',width:200,
		  template: function(dataItem) {
		    var values = '';
		    values = "<span class='textdecoration' style='color: #337ab7;  cursor: pointer;'>" + dataItem.Title + "</span>";
		    return values;
		  }
		},{ field: "UserOverallHealth" ,width:110,title:'Overall',filterable: {
							multi: true,
							search: true
		},headerAttributes: {
								style: "white-space: normal"
							},
							template: function(dataItem) {								  
									var a =getbgcolor(dataItem.UserOverallHealth);
								  return a;
								}
						},
						 { field: "UserScheduleHealth" ,width:120,title:'Schedule',filterable: {
							multi: true,
							search: true
						},
						headerAttributes: {
								style: "white-space: normal"
							},
							template: function(dataItem) {								  
									var a =getbgcolor(dataItem.UserScheduleHealth);
								  return a;
								}
						},
						{ field: "UserResourceHealth" ,width:110,title:'Resource',filterable: {
							multi: true,
							search: true
						},
						headerAttributes: {
								style: "white-space: normal"
							},
						template: function(dataItem) {								  
									var a =getbgcolor(dataItem.UserResourceHealth);
								  return a;
								}
						},	
						{ field: "UserScopeHealth" ,width:120,title:'Scope',filterable: {
							multi: true,
							search: true
						},
						headerAttributes: {
								style: "white-space: normal"
							},
						template: function(dataItem) {								  
									var a =getbgcolor(dataItem.UserScopeHealth);
								  return a;
								}
						},
						{ field: "ItemsCompleted",width:600,title:'Items Completed',
						headerAttributes: {
								style: "white-space: normal"
							},
							template: function(dataItem) {
								  return "<span style='white-space: pre;'>" + htmlDecode(dataItem.ItemsCompleted).replace(/\n/g, '<br />') + "</span>";
								}
						 },
						{ field: "ItemsUpcoming",width:600,title:'Items Upcoming',
							template: function(dataItem) {
								  return "<span style='white-space: pre;'>" + htmlDecode(dataItem.ItemsUpcoming).replace(/\n/g, '<br />') + "</span>";
								},
											headerAttributes: {
												style: "white-space: normal"
											}
						
						 },
						 { field: "ModifiedC",width:150,title: "Modified", },
						{ field: "Editor.Title",width:200,title: "Modified By",
							template: function(dataItem) {
								  var values = '';
								  if(dataItem.EditorId != null){
									  values = "<span>" + dataItem.Editor.Title + "</span>";
								  }								  
								  return values;
								}
						 },
						{ field: "CreatedC",width:150,title: "Created", },
						{ field: "Author.Title",width:200,title: "Created By",
							template: function(dataItem) {
								  var values = '';
								  if(dataItem.AuthorId != null){
									  values = "<span>" + dataItem.Author.Title + "</span>";
								  }								  
								  return values;
								}
						 },	
						 {
								field: 'Delete',
								title:'.',
								filterable: false,
								width: 35,
									headerTemplate:'<label style=" color:#f3f3f4 ;" class=""></label>',
								template:function(dataItem) {
									var a = '';
									if(dataItem.WeekNumberIstrue){
										a= '<span class="pointer" style="float: center; cursor: pointer;" title="Click to delete"><span class="k-icon k-i-trash	k-i-delete"></span></span>'
									}
								return a;
								}
							},
					  ],
					   excelExport: function (e) {
							var sheet = e.workbook.sheets[0];
							for (var i = 1; i < sheet.rows.length; i++) {
								var row = sheet.rows[i];
								for (var ci = 0; ci < row.cells.length; ci++) {
									var cell = row.cells[ci];
									if (ci == 6 || ci == 7 || ci == 8 || ci == 9 || ci == 5 || ci == 16 || ci == 15) {
										if (cell.value) {
											cell.value = $('<div>').html((cell.value)).text();
											cell.wrap = true;
											cell.align= 'top';
										}
									}
								}
							}
					  }
					});
					$('#StatusMaingrid').width($(window).width()-270);
					if(proLen == 0){
							var grid = $("#StatusMaingrid").data("kendoGrid");
							grid.hideColumn(12);
							grid.hideColumn(0);
						}
						var grid = $("#StatusMaingrid").data("kendoGrid");
								var exportFlag = false;
								grid.bind("excelExport", function (e) {
									if (!exportFlag) {
										e.sender.hideColumn(0);
										e.sender.hideColumn(12);
										e.preventDefault();
										exportFlag = true;
										setTimeout(function () {
											e.sender.saveAsExcel();
										});
									} else {
										e.sender.showColumn(0);
										e.sender.showColumn(12);
										exportFlag = false;
									}
								});
	}
	$scope.loadgriddata = function (e) {
                        var options = localStorage["kendo-grid-options"];
                        if (options != 'false') {
							var ds =e.dataSource.data();
							var st =JSON.parse(options);							
								st.dataSource.data = [];
								st.dataSource.data = $scope.getStatusMainRes;
                            e.setOptions(st);
                        }
			};
	$scope.MainGrrdForm = function(){
			$scope.ExportallTrue = false;			
			$('#StatusMaingrid').empty();
				$('.btnSColums').css( "font-weight", "bold" );
				$('.btnAllcoumns').css( "font-weight", "" );
			$scope.LoadKendoGridAction($scope.getStatusMainRes);
		}
	// Comment : Delete Selected Item on the Table
	$scope.DeleteItem = function(data){
				var Chktrue = confirm("Are you sure you want to delete this entry?");
				var grid = $("#StatusMaingrid").data("kendoGrid");
				localStorage["kendo-grid-options"] =  kendo.stringify(grid.dataSource.filter());
				if(Chktrue){
					PService.DeleteById('Status Grid: Data', data.ID).then(function (response) {
						$scope.ShowStatusMaintrue = true;
						$scope.SaveEditTrue = true;
						$scope.ShowStatusMain();
					});
				}
		}
// Comment : View Selected column view Table
	$scope.LoadKendoGridAction = function (ResData) {
			 var options = localStorage["kendo-grid-options"];
					var gridsourcs =[];
					if (options != 'false' && options != 'null'  && options != 'undefined') {
						var st =JSON.parse(options);
							gridsourcs = new kendo.data.DataSource({
								data:ResData,
								filter: st,
							});
						localStorage["kendo-grid-options"] = 'false';
					}else{
						gridsourcs = new kendo.data.DataSource({
							data:ResData,
						});
					}
		var Vheight = '55vh'
			$("#StatusMaingrid").kendoGrid({
						toolbar: ["excel"],
						excel: {
							fileName: "StatusMain.xlsx"
						},
					  dataSource: gridsourcs,	
					  height: Vheight,
						scrollable: {
                            virtual: true
                        },
						sortable: true,
							filterable: {
									extra: false,
									operators: { 
										string: {   
											contains: "Contains",								
										},
									}
								},
							resizable: true,
							selectable: "cell",
							change: function (e) {
								var cell = this.select();
								var cellIndex = cell[0].cellIndex;
								var column = this.columns[cellIndex];
								var dataItem = this.dataItem(cell.closest("tr"));
							if (column.title == "Title") {									
									$scope.EditStatusMainItemView(dataItem, column.title);
								}
							if(dataItem.WeekNumberIstrue){
								if (column.field == "Edit") {									
									$scope.EditStatusMainItemView(dataItem, column.title);
								}								
								else if (column.field == "Delete") {											
											$scope.DeleteItem(dataItem);
									}
								}
							},
				 filterMenuInit: function(e) {
							  if (e.field === "UserOverallHealth" || e.field === "UserScheduleHealth" || e.field === "UserResourceHealth" || e.field === "UserScopeHealth" || e.field === "SystemOverallHealth"  || e.field === "SystemScheduleHealth" || e.field === "SystemResourceHealth" || e.field === "SystemScopeHealth") {
								var filterMultiCheck = this.thead.find("[data-field=" + e.field + "]").data("kendoFilterMultiCheck")
								filterMultiCheck.container.empty();
								filterMultiCheck.checkSource.sort({field: e.field, dir: "asc"});
								filterMultiCheck.checkSource.data(filterMultiCheck.checkSource.view().toJSON());
								filterMultiCheck.createCheckBoxes();
							  }
							},
				columns: [{ 
							field: "Edit",
							filterable:false,
							 title:'.',
								headerTemplate:'<label style=" color:#f3f3f4 ;" class=""></label>',
							  template:function(dataItem) {
								   var values = '';
								  if(dataItem.WeekNumberIstrue){
									values = "<a id='btnEdit' class='btnEdit' title='Click to View' ><span class='pointer' style='float: right; cursor: pointer;' title='Click to Edit'><span class='k-icon k-i-edit'></span></span></a>";
								  }								  
								  return values;
							  },
							 width: 30
							 },{ field: "Title" ,title:'Title',
							template: function(dataItem) {
								  var values = '';
									values = "<span class='textdecoration' style='color: #337ab7;  cursor: pointer;'>" + dataItem.Title + "</span>";
								  return values;
								}
						 },{ field: "UserOverallHealth" ,width:110,title:'Overall',filterable: {
							multi: true,
							search: true
							},
							headerAttributes: {
								style: "white-space: normal"
							},
							template: function(dataItem) {								  
									var a =getbgcolor(dataItem.UserOverallHealth);
								  return a;
								}
						},{ field: "UserScheduleHealth" ,width:120,title:'Schedule',filterable: {
							multi: true,
							search: true
						},headerAttributes: {
								style: "white-space: normal"
							},template: function(dataItem) {								  
									var a =getbgcolor(dataItem.UserScheduleHealth);
								  return a;
								}
						},{ field: "UserResourceHealth" ,width:110,title:'Resource',filterable: {
							multi: true,
							search: true
						},headerAttributes: {
								style: "white-space: normal"
							},template: function(dataItem) {								  
									var a =getbgcolor(dataItem.UserResourceHealth);
								  return a;
								}
						},{ field: "UserScopeHealth" ,width:120,title:'Scope',filterable: {
							multi: true,
							search: true
						},headerAttributes: {
								style: "white-space: normal"
							},template: function(dataItem) {								  
									var a =getbgcolor(dataItem.UserScopeHealth);
								  return a;
								}
						},{field: 'Delete',
								title:'.',
								filterable: false,
								width: 35,
									headerTemplate:'<label style=" color:#f3f3f4 ;" class=""></label>',
								template:function(dataItem) {
									var a = '';
									if(dataItem.WeekNumberIstrue){
										a= '<span class="pointer" style="float: center; cursor: pointer;" title="Click to delete"><span class="k-icon k-i-trash	k-i-delete"></span></span>'
									}
								return a;
								}
							},
				  ],
					});
					$('#StatusMaingrid').width($(window).width()-270);
						if(proLen == 0){
							var grid = $("#StatusMaingrid").data("kendoGrid");
							grid.hideColumn(6);
							grid.hideColumn(0);
						}
						var grid = $("#StatusMaingrid").data("kendoGrid");
								var exportFlag = false;
								grid.bind("excelExport", function (e) {
									if (!exportFlag) {
										e.sender.hideColumn(0);
										e.sender.hideColumn(6);
										e.preventDefault();
										exportFlag = true;
										setTimeout(function () {
											e.sender.saveAsExcel();
										});
									} else {
										e.sender.showColumn(0);
										e.sender.showColumn(6);
										exportFlag = false;
									}
								});
	}
		$scope.returnValMain = function(val){
				var num = null;
				if(val == 'Grey'){num =0}				
				else if(val == 'Red'){num =1}				
				else if(val == 'Yellow'){num =2}
				else if(val == 'Green'){num =3}
				return num;	
		}
// Comment : Item Save and Update Function
	$scope.SaveStatusMain = function(){
				timecout()
	$('.btn').attr('disabled', true);
				var	ID =$scope.Item.ID;					
				var	Title=$scope.Item.Title;
				var	ItemsUpcoming=$scope.Item.ExecSummary;
				var	ItemsCompleted=$scope.Item.GoLive;
				var	StatusDate=$scope.Item.StatusDate;
				var USH = $('#tablinkfiled1').text() != 'NotSet' && $('#tablinkfiled1').text() != 'Not Set' ? $('#tablinkfiled1').text():'Grey'
				var URH =  $('#tablinkfiled2').text() != 'NotSet' && $('#tablinkfiled2').text() != 'Not Set' ? $('#tablinkfiled2').text():'Grey'
				var UOH = $('#tablinkfiled4').text() != 'NotSet' && $('#tablinkfiled4').text() != 'Not Set' ? $('#tablinkfiled4').text():'Grey'
				var USch = $('#tablinkfiled3').text() != 'NotSet' && $('#tablinkfiled3').text() != 'Not Set' && $('#tablinkfiled3').text() != '' ? $('#tablinkfiled3').text():'Grey'
				var	SystemOverallHealth=$scope.returnValMain(UOH)
				var	SystemResourceHealth=$scope.returnValMain(URH)
				var	SystemScheduleHealth=$scope.returnValMain(USH)
				var SystemScopeHealth = $scope.returnValMain(USch)
				var currcopy = new Date();
				if(currcopy.getDay() == 0){currcopy.setDate(currcopy.getDate() - 1)}
				else if(currcopy.getDay() == 1){currcopy.setDate(currcopy.getDate() - 2);}
				else if(currcopy.getDay() == 2){currcopy.setDate(currcopy.getDate() - 3);}
				else if(currcopy.getDay() == 3){currcopy.setDate(currcopy.getDate() + 3);}
				else if(currcopy.getDay() == 4){currcopy.setDate(currcopy.getDate() + 2); }
				else if(currcopy.getDay() == 5){currcopy.setDate(currcopy.getDate() + 1);}
				else if(currcopy.getDay() == 6){currcopy.setDate(currcopy.getDate() + 0);}
				var WeekEnddatecopy = currcopy;	
			   var WeekEnddateNew = new Date(currcopy);
				var WeekStartdateNew = new Date(currcopy);			
					WeekStartdateNew = new Date(WeekStartdateNew.setDate(WeekStartdateNew.getDate() -6))
				var curr = new Date();
				if(curr.getDay() == 0){curr.setDate(curr.getDate() - 6)}
				else if(curr.getDay() == 1){curr.setDate(curr.getDate() + 0);}
				else if(curr.getDay() == 2){curr.setDate(curr.getDate() - 1);}
				else if(curr.getDay() == 3){curr.setDate(curr.getDate() - 2);}
				else if(curr.getDay() == 4){curr.setDate(curr.getDate() - 3); }
				else if(curr.getDay() == 5){curr.setDate(curr.getDate() - 4);}
				else if(curr.getDay() == 6){curr.setDate(curr.getDate() - 5);}
				var WeekEnddate = curr;				
				var currS = new Date();
				if(currS.getDay() == 0){currS.setDate(currS.getDate() - 1)}
				else if(currS.getDay() == 1){currS.setDate(currS.getDate() - 2);}
				else if(currS.getDay() == 2){currS.setDate(currS.getDate() - 3);}
				var first = currS.getDate() - currS.getDay();
				var firstdayWeek = new Date(currS.setDate(first));//.toLocaleDateString()
				$scope.ischkStatusMainAlert = false;
				$scope.fileArray = [];
				
				var ProjectId =projId;
                var grid = $("#StatusMaingrid").data("kendoGrid");
				localStorage["kendo-grid-options"] =  kendo.stringify(grid.dataSource.filter());
				if(ItemsUpcoming == '' || ItemsUpcoming == null ||ItemsCompleted == '' || ItemsCompleted == null){
					$('.btn').attr('disabled', false);
					$scope.ischkStatusMainAlert = true;
					return;
				}						
				if(ID == null){
					var monthfor = ["Jan","Feb","Mar","Apr","May","Jun","Jul", "Aug","Sep","Oct", "Nov","Dec"]
					var getM= monthfor[WeekEnddateNew.getMonth()]
					var dayles = WeekEnddateNew.getDate()
					if(dayles <10){
						dayles = "0"+dayles
					}
					var GMonth = 1+WeekEnddateNew.getMonth()
					if(GMonth <10){
						GMonth = "0"+GMonth
					}
					var firstdayWeekText= dayles +"-"+getM + "-" + WeekEnddateNew.getFullYear()
					var WeekEnddateText= GMonth + "/" + dayles + "/" + WeekEnddateNew.getFullYear()
					var StatusText= 1+WeekStartdateNew.getMonth() + "/" + WeekStartdateNew.getDate() + "/" + WeekStartdateNew.getFullYear()
					var data = {
							__metadata: {
								'type': 'SP.Data.Status_x0020_Grid_x0020_DataListItem'
							},
							Title: 'Week Ending: ' +firstdayWeekText,//$scope.ConvertToMMDDYYYY(WeekEnddateNew),//WeekEnddatecopy
							ItemsUpcoming: ItemsUpcoming,						
						   ItemsCompleted:ItemsCompleted,
							WeekEndingDate:WeekEnddateNew,
							WeekEndingText:WeekEnddateText,
							OverallHealth: SystemOverallHealth,
							ResourcesHealth: SystemResourceHealth,
							ScheduleHealth: SystemScheduleHealth,
							ScopeHealth:SystemScopeHealth,
							ProjectId:ProjectId,
						};	
					PService.AddNew(data, 'Status Grid: Data').then(function (response) {
						$scope.SaveEditTrue = true;
						var id = response.d.Id;
				var promise = $q.all({});
												$scope.ShowStatusMaintrue = true;
												$scope.ShowStatusMain();
												var dialogKeyWindow = $("#KWindowStatusMain").data("kendoWindow");
													dialogKeyWindow.close();
													dialogKeyWindow.center();
									

							}, function (error) {    
									$('.btn').attr('disabled', false);               
								console.error('Error:SaveStatusMain ' + error.result);
							});
				}
				if(ID != null){
					var data = {
						__metadata: {
							'type': 'SP.Data.Status_x0020_Grid_x0020_DataListItem'
						},
						ItemsCompleted: ItemsCompleted,						
						ItemsUpcoming:ItemsUpcoming,
							OverallHealth: SystemOverallHealth,
							ResourcesHealth: SystemResourceHealth,
							ScheduleHealth: SystemScheduleHealth,
							ScopeHealth:SystemScopeHealth,
							ProjectId:ProjectId,
					};	
						PService.Update(data, 'Status Grid: Data',ID).then(function (response) {
						$scope.SaveEditTrue = true;			
						var promise = $q.all({});
					if ($scope.fileArray.length != 0) {
			
								promise.then(function (responseAtch) {
									$scope.filesdata = [];
									$scope.ShowStatusMaintrue = true;
									$('#StatusMaingrid').empty();
										$scope.ShowStatusMain();
									var dialogKeyWindow = $("#KWindowStatusMain").data("kendoWindow");
								dialogKeyWindow.close();
								dialogKeyWindow.center();
								$('.btn').attr('disabled', false);
							}, function (error) {
								console.error('Error: ' + error.result);
								$('.btn').attr('disabled', false);
							});
						} else {
							$scope.ShowStatusMaintrue = true;
							$('#StatusMaingrid').empty();
								$scope.ShowStatusMain();
							var dialogKeyWindow = $("#KWindowStatusMain").data("kendoWindow");
								dialogKeyWindow.close();
								dialogKeyWindow.center();
								$('.btn').attr('disabled', false);
						}
						}, function (error) {    
								$('.btn').attr('disabled', false);               
							console.error('Error:SaveStatusMain ' + error.result);
						});	
					}
		}
		$scope.ConvertToMMDDYYYY = function (dDate) {
			if (dDate != undefined) {
				if (dDate != null) {					
					return new Date(dDate).format("dd-MMM-yyyy");
				}
			}
		}
		$scope.ConvertDateToMMDDYYYY = function (dDate) {
			if (dDate != undefined) {
				if (dDate != null) {
					var months = new Array(12);
						months[0] = "null";
						months[1] = "Jan";
						months[2] = "Feb";
						months[3] = "Mar";
						months[4] = "Apr";
						months[5] = "May";
						months[6] = "Jun";
						months[7] = "Jul";
						months[8] = "Aug";
						months[9] = "Sep";
						months[10] = "Oct";
						months[11] = "Nov";
						months[12] = "Dec";
					var SplitdDate = dDate.split('T')[0]
					var year = SplitdDate.split("-")[0]
					var Month;
					if(SplitdDate.split("-")[1] <10){						
						Month =SplitdDate.split("-")[1].slice(1, 2);
					}else{
					     Month= SplitdDate.split("-")[1]
					  }
						Month = months[Month]
					var day = SplitdDate.split("-")[2]
					var dateformate = day+"-"+Month+"-"+year
					return dateformate;
				}
			}
		}
		$scope.CloseStatusMainForm = function(){
			 $('.btn').attr('disabled', false);
	if($scope.editviewdisblecopy){
	  $scope.ShowStatusMaintrue = true;
	  $scope.ShowStatusMain();
					var dialogKeyWindow = $("#KWindowStatusMain").data("kendoWindow");
					dialogKeyWindow.close();
					dialogKeyWindow.center();
	}else{
	  var Chktrue = confirm("Are you sure you want to close this window?");
	  var grid = $("#StatusMaingrid").data("kendoGrid");
	  localStorage["kendo-grid-options"] =  kendo.stringify(grid.dataSource.filter());
	  if(Chktrue){
		$scope.ShowStatusMaintrue = true;
		$scope.ShowStatusMain();
		var dialogKeyWindow = $("#KWindowStatusMain").data("kendoWindow");
		dialogKeyWindow.close();
		dialogKeyWindow.center();	
	  } 
	}
  }
}]);
function getbgcolor(a) {
  var values = '';
  if (a == "Red") {											
	values = "<div style='color: white; background-color: red; text-align: center;'>" + a + "</div>";
  }else if (a == "Green") {
	values = "<div style='color: white; background-color: #41bd46; text-align: center;'>" + a + "</div>";
  }else if (a == "Yellow") {
    values = "<div style='color: black; background-color: yellow; text-align: center;'>" + a + "</div>";
  }else if (a == "Grey") {
    values = "<div style='color: white; background-color: Grey; text-align: center;'>" + a + "</div>";
  }else{
	a =  a != null? a:'';
	values = "<div style='text-align: center;'>" + a + "</div>";
  }
	return values;
}
function htmlDecode(value) {
  if (value == null) {
	return '';
  }else{
	var newVal = value.replace(/&amp;/g, "&").replace(/&#34;/g, '"').replace(/&quot;/g, '"').replace(/&#35;/g, '#').replace(/&num;/g, '#').replace(/&#36;/g, '$').replace(/&dollar;/g, '$').replace(/&#37;/g, '%').replace(/&percnt;/g, '%').replace(/&#38;/g, '&').replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&apos;/g, "'").replace(/&#40;/g, '(').replace(/&lpar;/g, '(').replace(/&#41;/g, ')').replace(/&rpar;/g, ')').replace(/&#42;/g, '*').replace(/&ast;/g, '*').replace(/&#43;/g, '+').replace(/&plus;/g, '+').replace(/&#44;/g, ',').replace(/&comma;/g, ',').replace(/&#45;/g, '-').replace(/&minus;/g, '-').replace(/&#46;/g, '.').replace(/&period;/g, '.').replace(/&#47;/g, '/').replace(/&sol;/g, '/').replace(/&#58;/g, ':').replace(/&colon;/g, ':').replace(/&#59;/g, ';').replace(/&semi;/g, ';').replace(/&#60;/g, '<').replace(/&lt;/g, '<').replace(/&#61;/g, '=').replace(/&equals;/g, '=').replace(/&#62;/g, '>').replace(/&gt;/g, '>').replace(/&#63;/g, '?').replace(/&quest;/g, '?').replace(/&#64;/g, '@').replace(/&commat;/g, '@').replace(/&#91;/g, '[').replace(/&lsqb;/g, '[').replace(/&#92;/g, '\\').replace(/&bsol;/g, '\\').replace(/&#93;/g, ']').replace(/&rsqb;/g, ']').replace(/&#94;/g, '^').replace(/&Hat;/g, '^').replace(/&#95;/g, '_').replace(/&lowbar;/g, '_').replace(/&#96;/g, '`').replace(/&grave;/g, '`').replace(/&#123;/g, '{').replace(/&lcub;/g, '{').replace(/&#124;/g, '|').replace(/&verbar;/g, '|').replace(/&#125;/g, '}').replace(/&rcub;/g, '}').replace(/&#126;/g, '~');
	return newVal;
  }
}
function getParameterByName(name) {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
  results = regex.exec(location.search.toLowerCase());
  return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
function opencolor(evt, tName,namez,tablink) {
  var i, tabcontent, tablinks;
  tablinks = document.getElementsByClassName(tablink);
  for (i = 0; i < tablinks.length; i++) {
	tablinks[i].className = tablinks[i].className.replace('NotSet', "");
	tablinks[i].className = tablinks[i].className.replace("Green", "");
	tablinks[i].className = tablinks[i].className.replace("Yellow", "");
    tablinks[i].className = tablinks[i].className.replace("Red", "");
  }
  if(tablink == 'tablinks1'){ $('#tablinkfiled1').text(tName);}
  else if(tablink == 'tablinks2'){ $('#tablinkfiled2').text(tName);}
  else if(tablink == 'tablinks3'){ $('#tablinkfiled3').text(tName);}
  else if(tablink == 'tablinks4'){ $('#tablinkfiled4').text(tName);}
  if(tablink != 'tablinks4'){
	if ($('#tablinkfiled1').text() == 'Red' || $('#tablinkfiled2').text() == 'Red' || $('#tablinkfiled3').text() == 'Red') {
	  $('#tablinkfiled4').text('Red');
	} else if ($('#tablinkfiled1').text() == 'Yellow' || $('#tablinkfiled2').text() == 'Yellow' || $('#tablinkfiled3').text() == 'Yellow') {
	  $('#tablinkfiled4').text('Yellow');
	}else if ($('#tablinkfiled1').text() == 'Green' || $('#tablinkfiled2').text() == 'Green' || $('#tablinkfiled3').text() == 'Green' ) {
	  $('#tablinkfiled4').text('Green');
	} else {				
	  $('#tablinkfiled4').text('NotSet');
	}
  }
  var tab6 = $('#tablinkfiled4').text()
  var item = 'tablinks4';
  for (i = 0; i < $('.'+item).length; i++) {
	debugger
	$('.'+item)[i].className = item+" "
	switch (tab6) {
	  case 'NotSet':
	  if(i == 0){
		$('.'+item)[i].className = item+" "+tab6	
	  }
	  break;
	  case 'Green':
	  if(i == 1){
		$('.'+item)[i].className = item+" "+tab6	
	  }							
	  break;
	  case 'Red':
	  if(i == 3){
	    $('.'+item)[i].className = item+" "+tab6
	  }
	  break;
	  case 'Yellow':
	  if(i == 2){
		$('.'+item)[i].className = item+" "+tab6	
	  }
	  break;
	}				  
  }
  var cName= ''
  if(tName == 'Not Set'){cName=" NotSet"}
  else if(tName == 'Green'){cName=" Green"}
  else if(tName == 'Yellow'){cName=" Yellow"}
  else if(tName == 'Red'){cName=" Red"}
  evt.currentTarget.className += cName;
}
function ReloadPageFunction() {
  location.href = location.href.replace('#!','?#!');
  $("#ReloadPageId").hide();
}
var sscount =0;
var siteAbsoluteUrl = SpURL
$(document).bind('mousemove',function(e){
  if(sscount==0){
    if($('a[aria-describedby="Ribbon.Tabs.PDP.Home.Project.Edit_ToolTip"]').length==1){
	  sscount=1;
	  $('a[aria-describedby="Ribbon.Tabs.PDP.Home.Project.Edit_ToolTip"]').bind("click", function(){
        $.LoadingOverlay("show");
		setTimeout(function () {window.location.href = siteAbsoluteUrl+"/project%20detail%20pages/status.aspx?projuid="+getParameterByName('projuid'); return true;}, 3000);
		return true;
      })
	  $.LoadingOverlay("hide");
	}
	$('a[href^="unsafe:"]').each(function(){ 
      var oldUrl = $(this).attr("href"); // Get current url
      var newUrl = oldUrl.replace("unsafe:", ""); // Create new url
      $(this).attr("href", newUrl); // Set herf value
    });
  }
});
var tm;
function timecout() {
  $('#timeoutcounter').css("background-color", "white");
  $('#timeoutcounter').css("color", "black");
  $('#ReloadPageId').hide();
  clearInterval(tm);
  $('#timeoutcounter').text(" ");
  var n = 1000;
  tm = setInterval(countDown, 1000);
  function countDown() {
	n--;
    if (n == 0) {
	  clearInterval(tm);
    }
	var secondschk = n % 60;
	var miniteschk = Math.floor(n / 60);
	var minites = Math.floor(n / 60);
	var seconds = n % 60;
	if (secondschk < 10) {
	  seconds = "0" + secondschk;
	}
	if (miniteschk < 10) {
	  minites = "0" + miniteschk;
	}
	if (n < 1000) {
	  if (n < 300) {
		$('#timeoutcounter').css("background-color", "Red");
		$('#timeoutcounter').css("color", "white");
	    $('#ReloadPageId').show();
		UpdateFormDigest(webURL, refreshTym);
	  }
	  if (n < 1) {
		$('#timeoutcounter').css("background-color", "Red");
	    $('#timeoutcounter').css("color", "white");
	    $('#timeoutcounter').text("The page has expired. Please click Reload button to continue.");
		$('#ReloadPageId').show();
	  } else {
		$('#timeoutcounter').text("Page will expire in " + minites + ":" + seconds + ". Please save all changes prior to timeout.");
	  }
	}
  }
}