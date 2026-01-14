kelin.controller("ctrl_gbl_func", function($scope, $filter) 
{
    // Datetime Formatter
    $scope.dateFormatter = function dateFormatter() {
        var dateTaken = new Date();

        // Get the Date
        var dd = String(dateTaken.getDate()).padStart(2, '0');
        var mm = String(dateTaken.getMonth() + 1).padStart(2, '0'); // January is 0!
        var yyyy = dateTaken.getFullYear();

        // Get the Time
        var hrs     = dateTaken.getHours();
        var mins    = dateTaken.getMinutes();
        var secs    = dateTaken.getSeconds();
        var period  = (hrs >= 12) ? "PM" : "AM";

        hrs = hrs % 12;
        hrs = hrs ? hrs : 12; // If hrs = 0 therefore it should be 12

        hrs = (hrs < 10) ? "0" + hrs : hrs;
        mins = (mins < 10) ? "0" + mins : mins;
        secs = (secs < 10) ? "0" + secs : secs;

        var time = hrs + ":" + mins + ":" + secs + " " + period;

        var newDateTime = mm + '/' + dd + '/' + yyyy + ' ' + time;
        return newDateTime;
    }

    $scope.hasUndefinedValues = function(array) {
        return array.some(function(value) {
            return value === undefined;
        });
    }

    $scope.resetQuizData = function(){
        $scope.score = 0;
        $scope.questionNumber = 1;
        $scope.quizData = [];

        $scope.randomQuestionCategory;
        $scope.tempCategory;
        $scope.randomChoiceCategory;
        $scope.categoryChoices = [];
        $scope.categoryChoicesImgs = [];
        $scope.shuffleImages = [];

        $scope.answer;

        $scope.quizStatus = 0;

        $scope.results = [];

        $scope.test = [];

        $scope.questionStatus = "";
    }

    // Check duplicate in an array
    $scope.hasDuplicate = function(category){
        for (let count = 0; count < $scope.listCategory.length; count++)
        {
            if($scope.listCategory[count] == category){
                return true;
            }
        }
        return false;
    }

    $scope.checkDuplicate = function(qid, arr){
        for (let count = 0; count < arr.length; count++)
        {
            if(arr[count]['qid'] == qid){
                return true;
            }
        }
        return false;
    }

    $scope.checkDuplicateAnswer = function(questionNumber, arr){
        for (let count = 0; count < arr.length; count++)
        {
            if(arr[count]['questionNumber'] == questionNumber){
                return true;
            }
        }
        return false;
    }

});