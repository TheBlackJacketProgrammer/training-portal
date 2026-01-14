kelin.controller("ctrl_form_essay", function($scope, $http, $filter, $timeout, $interval, $sce, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder) 
{
	$scope.idx = 0;
	$scope.tbl_essay = [];
	$scope.answer = "";
	$scope.answerdetails = {
		account_id : "",
		questionNumber : "",
		answer: "",
		datetime_taken: $scope.dateFormatter(),
		is_correct: 2,
		quiz_id: $scope.quizId
	};

    $scope.startEssayScript = function(){
    	console.log("Form Essay Script running...");
    	$scope.totalItems = parseInt($scope.quiz_totalitems);
    	// for (var i = 0; i < $scope.questionCount; i++) {
    	// 	$scope.answerdetails.questionNumber = $scope.questionSet[i].question_num;
		// 	$scope.tbl_essay.push(angular.copy($scope.answerdetails));
    	// }
		$http({
            method: "POST",
            url: url + "ctrl_quiz/getAnswerSheetBlankQuiz",
            data: {quiz_id : $scope.quizId, account_id : ""}
        }).then(function successCallback(response) {
			if (response.data.length == 0){
				$scope.generateBlankAnswersheetJSON();
			}
			else{
				$scope.tbl_essay = response.data;
			}
			// console.log($scope.tbl_essay);
        });
    }

	$scope.generateBlankAnswersheetJSON = function(){
		for (var i = 0; i < $scope.quiz_totalitems; i++) {
    		$scope.answerdetails.questionNumber = i+1;
			$scope.tbl_essay.push(angular.copy($scope.answerdetails));
    	}
		$http({
            method: "POST",
            url: url + "ctrl_quiz/submitGenerateBlankAnswersheetJSON",
            data: {tbl_essay: $scope.tbl_essay,quiz_id : $scope.quizId}
        }).then(function successCallback(response) {
			$scope.tbl_essay = response.data;
			console.log("Blank Answersheet generated.");
        });
	}

    // $scope.nextQuestion = function(){
    // 	if($scope.idx != $scope.questionSet.length - 1)
    // 	{
    // 		$scope.tbl_essay[$scope.idx].answer = $scope.answer;
	// 		$scope.idx = $scope.idx + 1;
    // 	}
	// 	$scope.answer = $scope.tbl_essay[$scope.idx].answer;
    // }

    // $scope.previousQuestion = function(){
    // 	$scope.tbl_essay[$scope.idx].answer = $scope.answer;
    // 	if($scope.idx != 0)
    // 	{
	// 		$scope.idx = $scope.idx - 1;
	// 		$scope.answer = $scope.tbl_essay[$scope.idx].answer;
    // 	}
    // }
	$scope.nextQuestion = function(){
		$scope.saveBlankQuizAnswer();
    	if($scope.idx != $scope.quiz_totalitems - 1)
    	{
			$scope.idx = $scope.idx + 1;
    	}
    }

    $scope.previousQuestion = function(){
		$scope.saveBlankQuizAnswer();
    	if($scope.idx != 0)
    	{
			$scope.idx = $scope.idx - 1;
    	}
    }

	// Single Answer or Answer per Question
	$scope.saveBlankQuizAnswer = function(){
		console.log($scope.tbl_essay[$scope.idx]);
		$http({
            method: "POST",
            url: url + "ctrl_quiz/submitBlankAnswer",
            data: $scope.tbl_essay[$scope.idx]
        }).then(function successCallback(response) {
            $("html").removeClass("loading");
        });
	}

    $scope.submitEssayAnswer = function(){
    	$("html").addClass("loading");
    	// $scope.tbl_essay[$scope.idx].answer = $scope.answer;
    	// console.log($scope.tbl_essay[$scope.idx].answer);
    	// $http({
        //     method: "POST",
        //     url: url + "ctrl_quiz/submitEssayAnswer",
        //     data: $scope.tbl_essay
        // }).then(function successCallback(response) {
        //     $("html").removeClass("loading");
        //     $("#modalQuizEssayDone").modal({backdrop: 'static', keyboard: true });
        // });
		$http({
            method: "POST",
            url: url + "ctrl_quiz/submitBlankAnswer",
            data: $scope.tbl_essay[$scope.idx]
        }).then(function successCallback(response) {
            $("html").removeClass("loading");
			$("#modalQuizEssayDone").modal({backdrop: 'static', keyboard: true });
        });
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

// =========================================================================================
// Developer: Bergado, Marvin V.
// Position: Senior IT Developer - MIS Head
// Company: Kelin Graphics System
// Department: KGS-MIS
// Creation Datetime: 2/14/2024 5:12 PM

// Description:
// Essay Form Controller AngularJS of the Kelin Product Quiz Web Application.