kelin.controller("ctrl_browse_quiz", function($scope, $http, $sce) 
{
    // Variables
    $scope.keyQuizId = "";
    $scope.quizName = "";
    $scope.quizId = "";
    $scope.quiz_totalitems = "";
    $scope.isFound = false;
    $scope.questionSet = [];
    $scope.itemChoicesSet = [];

	$scope.initiate = function(){
        console.log("Script Working");
    }

    $scope.quizSearch = function(){
        $http({
            method: "POST",
            url: url + "ctrl_quiz/quizSearch",
            data: {'quiz_id': $scope.keyQuizId, 'datetime_taken' : datetimeToday()}
        }).then(function successCallback(response) {
            if(response.data["quizType"] == "Multiple Choice"){
                $scope.quizName = response.data["details"][0]['quiz_name'];
                $scope.quizId = response.data["details"][0]['quiz_id'];
                $scope.questionSet = response.data["questionSet"];
                $scope.itemChoicesSet = response.data["itemChoicesSet"];
                $scope.quiztemplate = response.data["view"];
                $scope.isFound = true;
            }
            else if (response.data["quizType"] == "Essay"){
                $scope.quizName = response.data["details"][0]['quiz_name'];
                console.log($scope.quizName);
                $scope.quizId = response.data["details"][0]['quiz_id'];
                console.log($scope.quizId);
                $scope.questionSet = response.data["questionSet"];
                $scope.quiz_totalitems = $scope.questionSet.length;
                console.log("Question Count = " + $scope.questionSet.length);
                $scope.quiztemplate = response.data["view"];
                $scope.isFound = true;
            }
            else if (response.data["quizType"] == "Blank"){
                $scope.quizName = response.data["details"][0]['quiz_name'];
                console.log($scope.quizName);
                $scope.quizId = response.data["details"][0]['quiz_id'];
                console.log($scope.quizId);
                $scope.quiz_totalitems = response.data["details"][0]['quiz_totalitems'];
                console.log($scope.quiz_totalitems);
                $scope.quiztemplate = response.data["view"];
                $scope.isFound = true;
            }
            else{
                console.log("NO FOUND");
                $("#modalSearchOutput").modal({backdrop: 'static', keyboard: true });
            }
        });
    }
});