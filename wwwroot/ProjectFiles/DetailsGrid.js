<!DOCTYPE html>
<html lang="en">
  <head> 
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="/sites/Development/Site Assets/HistoricalStatusgrid/LocalURLs/3.4.0.bootstrap.min.css"/>
    <link rel="stylesheet" href="/sites/Development/Site Assets/HistoricalStatusgrid/LocalURLs/2019.2.619.kendo.common.min.css"/>    
    <link rel="stylesheet" href="/sites/Development/Site Assets/HistoricalStatusgrid/LocalURLs/2019.2.619.kendo.silver.min.css"/>
    <script type="text/javascript" src="/sites/Development/Site Assets/HistoricalStatusgrid/LocalURLs/3.4.1.jquery.min.js"></script>
    <script type="text/javascript" src="/sites/Development/Site Assets/HistoricalStatusgrid/LocalURLs/2019.2.619.angular.min.js"></script> 
    <script type="text/javascript" src="/sites/Development/Site Assets/HistoricalStatusgrid/LocalURLs/2019.2.619.kendo.all.min.js"></script>
    <script type="text/javascript"  src="/sites/Development/Site Assets/HistoricalStatusgrid/LocalURLs/ajax-libs-angularjs-1.2.0rc1-angular-route.min.js"></script>
    <script type="text/javascript"  src="/sites/Development/Site Assets/HistoricalStatusgrid/LocalURLs/ajax-libs-angularjs-1.2.18-angular-sanitize.js"></script>
    <script type="text/javascript" src="/_layouts/15/1033/strings.js"></script>
    <script type="text/javascript" src="/_layouts/15/clientforms.js"></script>
    <script type="text/javascript" src="/_layouts/15/autofill.js"></script> 
    <script type="text/javascript" src="/_layouts/15/sp.runtime.js"></script>
    <script type="text/javascript" src="/_layouts/15/sp.js"></script>
    <script type="text/javascript" src="/sites/Development/Site Assets/HistoricalStatusgrid/LocalURLs/PP/clientpeoplepicker.js"></script>
    <script type="text/javascript" src="/sites/Development/Site Assets/HistoricalStatusgrid/LocalURLs/PP/config.peoplepicker.js"></script>
    <script type="text/javascript" src="/sites/Development/Site Assets/HistoricalStatusgrid/LocalURLs/1.7.8.angular-resource.min.js"></script>
    <script type="text/javascript"  src="/sites/Development/Site Assets/HistoricalStatusgrid/LocalURLs/2019.19.2.619.jszip.min.js"></script>
    <script type="text/javascript" src="/sites/Development/Site Assets/HistoricalStatusgrid/ProjectFiles/GridController.js?v=1"></script>
    <link rel="stylesheet" href="/sites/Development/Site Assets/HistoricalStatusgrid/LocalURLs/CommonFile.css"> 
    <script src="/sites/Development/Site Assets/HistoricalStatusgrid/LocalURLs/ng-file-upload-all.js"></script>
    <script src="/sites/Development/Site Assets/HistoricalStatusgrid/LocalURLs/loadingoverlay.min.js"></script>
    <script src="/sites/Development/Site Assets/HistoricalStatusgrid/LocalURLs/jexcel.js"></script>
    <link rel="stylesheet" href="/sites/Development/Site Assets/HistoricalStatusgrid/LocalURLs/jexcel.css" type="text/css" />
    <script src="/sites/Development/Site Assets/HistoricalStatusgrid/LocalURLs/jsuites.js"></script>
    <link rel="stylesheet" href="/sites/Development/Site Assets/HistoricalStatusgrid/LocalURLs/jsuites.css" type="text/css" /> 
  </head>
  <body ng-app="KendoProjectApp">
	<div ng-controller="ProjectkController" ng-init='init()'>  	 
	  <div class="container-fluid" style="    margin-top: 70px; margin-left: -14px;">  
      <div>
		<label style="    margin-top: 12px;    margin-right: 9px;" id="timeoutcounter"></label>
		<button id="ReloadPageId" style="font-size: 12px; display: none;" class="k-button save-button" onclick="ReloadPageFunction()">Reload</button> 
	  </div>
	  <ul class="nav nav-tabs">
		<li class="active"><a href="#!StatusMain" style='color:#337ab7;' data-target="#!StatusMain" name="StatusMain" data-toggle="tab" ng-click="ShowStatusMain()" >Status</a></li>
	  </ul>
	  <div ng-view></div>
	  </div>
	</div>
  </body>
  <style>
  .ms-srch-sb>input {
    display: inline-block !important;
    border-style: none !important;
    outline-style: none !important;
    height: 18px !important;
    margin: 0px 0px 0px 5px !important;
    padding: 0px 1px 0px 0px !important;
    width: 200px !important;
    background-color: transparent !important;
  }
  .k-grid-filter.k-state-active {
    background-color: grey !important;
    color: white !important;
  }
  .k-grid-header th.k-header {
	font-weight: bold !important;
  }
  .k-grid td {
    padding: 1.4em .6em !important;
  }
  </style>
</html>