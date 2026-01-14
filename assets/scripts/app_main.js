// Instantiate App's URL Address

// var url = window.location.protocol + '//' + window.location.host + '/kelin-products-quiz/'; // Production
var url = window.location.protocol + '//' + window.location.host + '/training-portal/'; // Development

// Instantiate Angular JS Module

// var kelin = angular.module("kelin", ["datatables","ngSanitize"]);
var kelin = angular.module("kelin", ["datatables"]);

// For Partial View Use
kelin.directive('compile', ['$compile', function ($compile) 
{
  return function(scope, element, attrs) 
  {
    scope.$watch(function(scope) 
    {
      return scope.$eval(attrs.compile);
    },function(value)
    {
      element.html(value);
      $compile(element.contents())(scope);
    });
  };
}]);

// For File Uploading
kelin.directive('fileModel', ['$parse', function ($parse) 
{
  return {
    restrict: 'A',
    link: function(scope, element, attrs) 
          {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
    
            element.bind('change', function() 
            {
              scope.$apply(function() 
              {
                modelSetter(scope, element[0].files[0]);
              });
            });
          }
    };
}]);

// For Export as Excel
kelin.factory('Excel',function($window)
  {
    var uri = 'data:application/vnd.ms-excel;base64,',
        template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
        base64 = function(s) {
          return $window.btoa(unescape(encodeURIComponent(s)));
        },
        format = function(s,c) {
          return s.replace(/{(\w+)}/g,function(m,p){
            return c[p];
          })
        };
    return {
      tableToExcel:function(tableId, worksheetName){
        var table = $(tableId),
            ctx = {
              worksheet:worksheetName, 
              table:table.html()
            },
            href = uri + base64(format(template, ctx));
            // return href;
            var link = document.createElement('a');
                link.download = "scorelist" + '.xls';
                link.href = uri + base64(format(template, ctx));
                link.click();
        }
      };
});

// Datetime Formatter
function dateFormatter(myDate) {
    // console.log("Date = " + myDate);

    // Get the Date
    var dd = String(myDate.getDate()).padStart(2, '0');
    var mm = String(myDate.getMonth() + 1).padStart(2, '0'); // January is 0!
    var yyyy = myDate.getFullYear();

    // Get the Time
    var hrs     = myDate.getHours();
    var mins    = myDate.getMinutes();
    var secs    = myDate.getSeconds();
    var period  = hrs >= 12 ? "PM" : "AM";
	

    hrs = hrs % 12;
    hrs = hrs ? hrs : 12; // If hrs = 0 therefore it should be 12

    hrs = (hrs < 10) ? "0" + hrs : hrs;
    mins = (mins < 10) ? "0" + mins : mins;
    secs = (secs < 10) ? "0" + secs : secs;

    var time = hrs + ":" + mins + ":" + secs + " " + period;

    var formattedDate = mm + '/' + dd + '/' + yyyy + ' ' + time;

    return formattedDate;
}

function datetimeToday() {
    var currentDate = new Date();

    // Get the Date
    var dd = String(currentDate.getDate()).padStart(2, '0');
    var mm = String(currentDate.getMonth() + 1).padStart(2, '0'); // January is 0!
    var yyyy = currentDate.getFullYear();

    // Get the Time
    var hrs     = currentDate.getHours();
    var mins    = currentDate.getMinutes();
    var secs    = currentDate.getSeconds();
    var period  = hrs >= 12 ? "PM" : "AM";
  

    hrs = hrs % 12;
    hrs = hrs ? hrs : 12; // If hrs = 0 therefore it should be 12

    hrs = (hrs < 10) ? "0" + hrs : hrs;
    mins = (mins < 10) ? "0" + mins : mins;
    secs = (secs < 10) ? "0" + secs : secs;

    var time = hrs + ":" + mins + ":" + secs + " " + period;

    var formattedDate = mm + '/' + dd + '/' + yyyy + ' ' + time;

    return formattedDate;
}

// Get Date Today
function getDateToday() {
    // console.log("Date = " + myDate);
    var currentDate = new Date();

    // Get the DatecurrentDate
    var dd = String(currentDate.getDate()).padStart(2, '0');
    var mm = String(currentDate.getMonth() + 1).padStart(2, '0'); // January is 0!
    var yyyy = currentDate.getFullYear();

    var formattedDate = mm + '/' + dd + '/' + yyyy;

    return formattedDate;
}

// Get Date Format
function getDateFormat() {
    // console.log("Date = " + myDate);
    var currentDate = new Date();

    // Get the DatecurrentDate
    var dd = String(currentDate.getDate()).padStart(2, '0');
    var mm = String(currentDate.getMonth() + 1).padStart(2, '0'); // January is 0!
    var yyyy = currentDate.getFullYear();

     // Get the Time
    var hrs     = currentDate.getHours();
    var mins    = currentDate.getMinutes();
    var secs    = currentDate.getSeconds();
    var period  = hrs >= 12 ? "PM" : "AM";
  

    hrs = hrs % 12;
    hrs = hrs ? hrs : 12; // If hrs = 0 therefore it should be 12

    hrs = (hrs < 10) ? "0" + hrs : hrs;
    mins = (mins < 10) ? "0" + mins : mins;
    secs = (secs < 10) ? "0" + secs : secs;

    var time = hrs  + mins + secs;

    var formattedDate = mm  + dd +  yyyy + time;

    return formattedDate;
}

// Get Quiz Id
function getQuizId(quiztype)
{
  var generatedQuizId = "";
  var dateformat = getDateFormat();
  if(quiztype == "Blank"){
    generatedQuizId = "QB-" + dateformat;
  }
  else if(quiztype == "Essay"){
    generatedQuizId = "QE-" + dateformat;
  }
  else if(quiztype == "Multiple Choice"){
    generatedQuizId = "QMC-" + dateformat;
  }
  else if(quiztype == "Matching"){
    generatedQuizId = "QM-" + dateformat;
  }
  return generatedQuizId;
}