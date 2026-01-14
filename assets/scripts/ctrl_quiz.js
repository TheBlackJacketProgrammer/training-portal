kelin.controller("ctrl_quiz", function($scope, $http, $filter, $timeout) 
{

	$scope.fetch_quizData = function(){
        $http({
            method: "POST",
            url: url + "ctrl_quiz/fetch_quizData",
            data: $scope.credentials
        }).then(function successCallback(response) {
            $scope.quizData = response.data; 
            $scope.get_randomCategory();
        },
        function errorCallback(data) {

        });
    }

    $scope.get_randomCategory = function()
    {
        var randomIndex = Math.floor(Math.random() * $scope.quizData.category_list.length);
        $scope.randomQuestionCategory = $scope.quizData.category_list[randomIndex]; // Question Category
        $scope.categoryChoices.push($scope.randomQuestionCategory);
        $scope.get_randomProductImgByCat($scope.randomQuestionCategory.id);

        while ($scope.categoryChoices.length < 4) 
        {
            $scope.get_choices();
        }

        // Shuffle Choices
        $scope.shuffleImg();

        var hasUndefined = $scope.hasUndefinedValues($scope.categoryChoicesImgs);

        if (hasUndefined) {
            $scope.randomChoiceCategory = [];
            $scope.categoryChoices = [];
            $scope.categoryChoicesImgs = [];
            $scope.get_randomCategory();
        }

        $scope.productQuestion = $filter('filter')($scope.categoryChoicesImgs, { product_categoryId: $scope.randomQuestionCategory.id }, true);


        //console.log("TEST", $scope.productQuestion);


        console.log("Category Question => ", $scope.randomQuestionCategory);
        console.log("Category Choices => ", $scope.categoryChoices);
        console.log("Category Choices Images=> ", $scope.categoryChoicesImgs);
    
    }



    $scope.get_choices = function()
    {
        var randomIndex = Math.floor(Math.random() * $scope.quizData.category_list.length);
        $scope.randomChoiceCategory = $scope.quizData.category_list[randomIndex]; // Question Category
        var x = $scope.check_duplicate($scope.randomChoiceCategory);
        if(x == false){
            $scope.categoryChoices.push($scope.randomChoiceCategory);
            $scope.get_randomProductImgByCat($scope.randomChoiceCategory.id);
        }
    }

    $scope.check_duplicate = function(category){
        for (var key in $scope.categoryChoices) 
        {
            var storedId = $scope.categoryChoices[key].id;
            if(category.id == storedId){
                return true;
            }
        }
        return false;
    }

    $scope.get_randomProductImgByCat = function(categoryId) {
        var imgList = $filter('filter')($scope.quizData.product_list, { product_categoryId: categoryId }, true);
        var randomIndex = Math.floor(Math.random() * imgList.length);
        var randomImg = imgList[randomIndex];
        $scope.categoryChoicesImgs.push(randomImg);
    };

    $scope.shuffleImg = function(){
        // for (let i = 1; i > $scope.categoryChoicesImgs.length; i++)
        // {
        //     var j = Math.floor(Math.random() * (i));
        //     var temp = $scope.categoryChoicesImgs[i];
        //     $scope.categoryChoicesImgs[i] = $scope.categoryChoicesImgs[j];
        //     $scope.categoryChoicesImgs[j] = temp;
        // }
        for (var i = $scope.categoryChoicesImgs.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            // Swap elements at positions i and j
            var temp = $scope.categoryChoicesImgs[i];
            $scope.categoryChoicesImgs[i] = $scope.categoryChoicesImgs[j];
            $scope.categoryChoicesImgs[j] = temp;
        }
    }

    $scope.getCategoryId = function(id){
        $scope.answer = id;
        $("#rbxImg" + id).prop('checked', true);
        // console.log("Selected Answer => " + $scope.answer);
    }

    $scope.nextQuestion = function(){
        $scope.quizStatus = 2;
        if($scope.answer == $scope.randomQuestionCategory.id){
            $scope.score = $scope.score + 10;
            $scope.questionStatus = "Correct Answer!!"
        }
        else
        {
            $scope.questionStatus = "Wrong Answer!!"
        }
        $timeout(function() 
        {
            $scope.quizStatus = 0;
            $scope.questionStatus = "";
            $scope.questionNumber = $scope.questionNumber + 1;
            $scope.randomChoiceCategory = [];
            $scope.categoryChoices = [];
            $scope.categoryChoicesImgs = [];
            $scope.fetch_quizData();
            if($scope.questionNumber == 20){
                $scope.quizStatus = 1;
            }
        }, 2000);
    }

    $scope.endExam = function(){
        if($scope.answer == $scope.randomQuestionCategory.id){
            $scope.score = $scope.score + 10;
            $scope.questionStatus = "Correct Answer!!"
        }
        else
        {
            $scope.questionStatus = "Wrong Answer!!"
        }
        
        $scope.results = {
            score : $scope.score,
            datetime_taken : $scope.dateFormatter(),
            account_id : ""
        }

        $http({
            method: "POST",
            url: url + "ctrl_quiz/insert_examResult",
            data: $scope.results
        }).then(function successCallback(response) {
            $("#modalSuccess").modal({ backdrop: 'static', keyboard: true });
        });
    }

    $scope.cancelExam = function(){
        $scope.results = {
            score : $scope.score,
            datetime_taken : $scope.dateFormatter(),
            account_id : ""
        }

        $http({
            method: "POST",
            url: url + "ctrl_quiz/insert_examResult",
            data: $scope.results
        }).then(function successCallback(response) {
            window.location = url;
        });
    }

    $scope.refreshPage = function(){
        window.location = url;
    }

});

// =========================================================================================
// Developer: Bergado, Marvin V.
// Position: Senior IT Developer - MIS Head
// Company: Kelin Graphics System
// Department: KGS-MIS
// Creation Datetime: 11/4/2023 8:37 AM

// Description:
// Quiz Controller AngularJS of the Kelin Product Quiz Web Application.