kelin.controller("ctrl_multiple_choice", function($scope, $http, $filter, $timeout, $interval, $sce, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder) 
{

    $scope.initiate = function(){
        console.log("Multple Choice Script Working.");
    }

    $scope.addChoiceItem = function(){
        console.log("Selected q_id = " + $scope.selectedQID);
        $scope.quizQuestionDetails.q_id =  ($scope.selectedQID == "") ? $scope.quizDetails.quiz_id + "-" + $scope.questionCount : $scope.selectedQID;
        $scope.quizMultipleChoice.itemChoiceCount = ($scope.selectedQID == "") ? $scope.itemChoiceCount : $scope.itemChoiceCount + 1;
        $scope.quizMultipleChoice.q_id =  ($scope.selectedQID == "") ? $scope.quizDetails.quiz_id + "-" + $scope.questionCount : $scope.selectedQID;
        $scope.quizMultipleChoiceList.push(angular.copy($scope.quizMultipleChoice));
        $scope.quizMultipleChoice = {
            id : null,
            q_id : "",
            itemChoiceCount : 0,
            item : "",
            is_correct : 0
        }
        $scope.itemChoiceCount = $scope.itemChoiceCount + 1;
    }
    
    $scope.saveItemChoicesList = function(){
        // Question Details 
        $scope.quizQuestionDetails.qm_id = $scope.quizDetails.quiz_id;
        $scope.quizQuestionDetails.q_id =  $scope.quizDetails.quiz_id + "-" + $scope.questionCount;
        // $scope.quizQuestionDetails.question = $scope.quizQuestionDetails.question.replace(/["']/g, "''");
        $scope.questionList.push(angular.copy($scope.quizQuestionDetails));
        // Item Choices
        $scope.itemChoicesList.push(angular.copy($scope.quizMultipleChoiceList));

        $scope.quizpackage = {
            questions : $scope.questionList,
            choices : $scope.itemChoicesList
        };

        $scope.quizQuestionDetails = {
            id: null,
            qm_id: "", // Quiz Master - quiz_id
            q_id: "",  // Quiz Question - Question Id
            question_num: 0,
            question: "",
            question_pts: ""
        };

        $scope.quizMultipleChoiceList = [];
        $scope.questionCount = $scope.questionCount + 1;
        $scope.itemChoiceCount = 1;

        console.log("Quiz Package => ", $scope.quizpackage);
    }

    $scope.saveQuiz = function(){
        $("html").addClass("loading");
        console.log("Edit Quiz Status = " + $scope.editQuiz);
        $scope.saveMC();
    }

    // Save Quiz - Multiple Choice
    $scope.saveMC = function(){
        $scope.quizpackage.details = $scope.quizDetails;
        $http({
            method: "POST",
            url: url + "ctrl_quiz/saveQuiz",
            data: $scope.quizpackage
        }).then(function successCallback(response) {
            $("html").removeClass("loading");
            $("#modalOutput").modal({backdrop: 'static', keyboard: true });
            // $("#modalOutput").show();
            $scope.clearDataMultipleChoice();
            $scope.fetch_quizmaster();
            console.log("Form Type => " + $scope.formStyle.quizType);
        });
    }

    $scope.updateMC = function(){
        $scope.quizpackage.details = $scope.quizDetails;
        $http({
            method: "POST",
            url: url + "ctrl_quiz/updateMCQuiz",
            data: $scope.quizpackage
        }).then(function successCallback(response) {
            $("html").removeClass("loading");
            $("#modalOutput").modal({backdrop: 'static', keyboard: true });
            // $("#modalOutput").show();
            $scope.clearDataMultipleChoice();
            $scope.fetch_quizmaster();
            console.log("Form Type => " + $scope.formStyle.quizType);
        });
    }

    // Clear Data - Multiple Choice Form
    $scope.clearDataMultipleChoice = function(){
        $scope.clearAll();

        // Quiz Questionaire List
        $scope.questionList = [];

        // Item Choices List
        $scope.itemChoiceCount = 1;
        $scope.quizMultipleChoiceList = [];

        // Form Type
        $scope.formStyle.quizType = "None";

        console.log("Clear Data Multiple Choice");
    }


    $scope.updateItemChoices = function(question){
        // Specific Question
        var q_id = question.q_id
        $scope.selectedQID = q_id;
        var fltrdChoices = $filter('filter')($scope.itemChoicesList, { q_id: q_id });
        var fltrdQuestion = $filter('filter')($scope.questionList, { q_id: q_id });
        // Question Details
        $scope.currQuizQuestionDetails = [];
        $scope.tempQuizQuestionDetails = [];
        $scope.currQuizQuestionDetails.push(angular.copy(fltrdQuestion[0]));
        $scope.tempQuizQuestionDetails.push(angular.copy(fltrdQuestion[0]));

        // Item Choices List
        $scope.quizMultipleChoiceList = fltrdChoices[0];
        $scope.quizQuestionDetails = $scope.tempQuizQuestionDetails[0];

        var icc = fltrdChoices[0].length;
        $scope.itemChoiceCount = fltrdChoices[0][icc-1].itemChoiceCount;
        console.log("Item Choice Count: " + $scope.itemChoiceCount);

        // $scope.questionCount = $scope.questionCount + 1;
        // $scope.itemChoiceCount = 1;

        $scope.editStatus.question  = true;
    }

    $scope.deleteItemChoices = function(qId){
        console.log(qId);
        $scope.itemChoicesList.splice(qId, 1);
        $scope.questionList = $scope.questionList.filter(function(item) {
            return item.q_id !== qId;
        });
    }

    $scope.editItem = function(idx, item){
        $scope.idx = idx;
        $scope.currQuizMultipleChoice = [];
        $scope.tempQuizMultipleChoice = [];
        $scope.currQuizMultipleChoice.push(angular.copy(item)); // Stores Current Data
        $scope.tempQuizMultipleChoice.push(angular.copy(item)); // Temporary for Updating Data
        $scope.quizMultipleChoice = $scope.tempQuizMultipleChoice[0];
        $scope.editStatus.choices  = true;
    }

    $scope.deleteItem = function(idx, item){
        $scope.quizMultipleChoiceList.splice(idx, 1);
    }

    $scope.cancelChoiceItem = function(){
        $scope.quizMultipleChoiceList[$scope.idx] = $scope.currQuizMultipleChoice[0];
        $scope.quizMultipleChoice = [];
        $scope.currQuizMultipleChoice = [];
        $scope.tempQuizMultipleChoice = [];
        $scope.editStatus.choices  = false;
        $scope.idx = null;
    }

    $scope.updateChoiceItem = function(){
        $scope.quizMultipleChoiceList[$scope.idx] = $scope.tempQuizMultipleChoice[0];
        $scope.quizMultipleChoice = [];
        $scope.currQuizMultipleChoice = [];
        $scope.tempQuizMultipleChoice = [];
        $scope.editStatus.choices  = false;
        $scope.idx = null;
    }

    $scope.cancelItemChoicesList = function(){
        $scope.quizQuestionDetails = {
            id: null,
            qm_id: "", // Quiz Master - quiz_id
            q_id: "",  // Quiz Question - Question Id
            question_num: 0,
            question: "",
            question_pts: ""
        };
        $scope.quizMultipleChoice = {
            id : null,
            q_id : "",
            itemChoiceCount : 0,
            item : "",
            is_correct : 0
        }
        $scope.currQuizMultipleChoice = [];
        $scope.tempQuizMultipleChoice = [];
        $scope.quizMultipleChoiceList = [];
        $scope.editStatus.choices  = false;
        $scope.editStatus.question  = false;
        $scope.idx = null;
    }

    $scope.updateItemChoicesList = function(){
        // Question Details
        $scope.questionList = $scope.questionList.filter(function(item) {
            return item.q_id !== $scope.selectedQID;
        });
        $scope.questionList.push(angular.copy($scope.quizQuestionDetails));

        $scope.itemChoicesList = $scope.itemChoicesList.filter(function(item) {
            return item.q_id !== $scope.selectedQID;
        });
        // $scope.itemChoicesList.push(angular.copy($scope.quizMultipleChoiceList));

        $scope.quizpackage = {
            questions : $scope.questionList,
            choices : $scope.itemChoicesList
        };

        $scope.quizQuestionDetails = {
            id: null,
            qm_id: "", // Quiz Master - quiz_id
            q_id: "",  // Quiz Question - Question Id
            question_num: 0,
            question: "",
            question_pts: ""
        };

        $scope.cancelItemChoicesList();
        $scope.currQuizQuestionDetails = [];
        $scope.tempQuizQuestionDetails = [];
        $scope.selectedQID = "";

        console.log("Quiz Package => ", $scope.quizpackage);

    }

});

// =========================================================================================
// Developer: Bergado, Marvin V.
// Position: Senior IT Developer - MIS Head
// Company: Kelin Graphics System
// Department: KGS-MIS
// Creation Datetime: 1/12/2024 2:12 PM

// Description:
// Create Quiz Controller AngularJS of the Kelin Product Quiz Web Application.