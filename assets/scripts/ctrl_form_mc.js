kelin.controller("ctrl_form_mc", function($scope, $http, $filter) 
{
    $scope.answerSheet = [];
    $scope.activeQuizId = "";
    $scope.totalScore = 0;

    $scope.startMCScript = function(){
        console.log("Form Multiple Choice Script running...");
    }

    $scope.getAnswer = function(idx, id, qmId, qid, qpts, state){
        $scope.activeQuizId = qmId;
        var isDuplicate = $scope.checkDuplicate(qmId, $scope.answerSheet);
        if(isDuplicate == true){ 
            $scope.answerSheet = $filter('filter')($scope.answerSheet, function(item) {
                return item.qmId !== qmId;
            });       
        }
        $scope.answerSheet.push(angular.copy({id : id, qmId: qmId, qid: qid, qpts: qpts, is_correct : state}));
        console.log($scope.answerSheet);
    }

    $scope.submitQuiz = function(){
        var totalscore = 0;
        $scope.answerSheet = $filter('filter')($scope.answerSheet, function(item) {
            return item.is_correct == 1;
        });
        angular.forEach($scope.answerSheet, function(item) {
            totalscore += parseInt(item.qpts);
        });
        $scope.totalscore = totalscore;
        $scope.userscore = {
            quiz_id : $scope.activeQuizId,
            account_id : "",
            score : totalscore,
            date_taken : $scope.dateFormatter(),
            is_status : 1
        }

        $("html").addClass("loading");
        $http({
            method: "POST",
            url: url + "ctrl_quiz/submitquiz",
            data: $scope.userscore
        }).then(function successCallback(response) {
            $("html").removeClass("loading");
            $scope.totalscore = totalscore;
            $("#modalQuizMCDone").modal({backdrop: 'static', keyboard: true });
        },
        function errorCallback(data) {

        });
        $scope.userscoretemp.total = totalscore;
        $scope.totalscore = totalscore;
        console.log($scope.totalscore);
    }

    $scope.clearBrowserQuiz = function(){
        $scope.isFound = false;
        $scope.quiztemplate = "";
        $scope.keyQuizId = "";
        $scope.quizName = "";
        $scope.quizId = "";
        $scope.questionSet = [];
        $scope.itemChoicesSet = [];
    }
});