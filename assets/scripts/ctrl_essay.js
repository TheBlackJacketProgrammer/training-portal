kelin.controller("ctrl_essay", function($scope, $http, $filter, $timeout, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, Excel) 
{
    // Initial limit for quiz dates (show first 3)
    $scope.quizDatesLimit = 3;
    $scope.isLoadingMoreDates = false;

    // Sort dates by descending order (latest first)
    $scope.sortDatesByLatest = function(dates){
        if(!dates || dates.length === 0) return dates;
        return dates.sort(function(a, b){
            // Parse dates and compare (assuming format like "MM/DD/YYYY" or "YYYY-MM-DD")
            var dateA = new Date(a.DATETAKEN);
            var dateB = new Date(b.DATETAKEN);
            return dateB - dateA; // Descending order (latest first)
        });
    }

    // Test Function
    $scope.test = function(){
        // console.log($scope.quizDates);
        $scope.essaylist = "";
        $scope.quizDatesLimit = 3; // Reset limit on init
        $scope.isLoadingMoreDates = false;
        $http({
            method: "POST",
            url: url + "ctrl_quiz/fetchQuizDateList"
        }).then(function successCallback(response) {
            $scope.quizDates = $scope.sortDatesByLatest(response.data["dates"]); // Sort by latest
            console.log($scope.quizDates);
        },
            function errorCallback(data) {

        });
    }

    // Select quiz date for Essay and Blank tab (closes dropdown)
    $scope.selectQuizDate = function(date, $event){
        $event.preventDefault();
        $scope.quizDateFilter = date;
        if(date !== ''){
            $scope.fetchQuizNameList();
        }
    }

    // Select quiz date for Multiple Choice tab (closes dropdown)
    $scope.selectQuizDateM = function(date, $event){
        $event.preventDefault();
        $scope.quizDateFilter = date;
        if(date !== ''){
            $scope.fetchAnswerListbyDateFilter('M');
        }
    }

    // Load more dates (keeps dropdown open)
    $scope.loadMoreDates = function($event){
        $event.preventDefault();
        $event.stopPropagation(); // Prevent dropdown from closing
        $scope.isLoadingMoreDates = true;
        $timeout(function(){
            $scope.quizDatesLimit += 10; // Load 10 more dates
            $scope.isLoadingMoreDates = false;
        }, 400); // Small delay for animation effect
    }

    $scope.dtOpt_answerslist = {
        // Configure DataTable options here
        paging: true,
        searching: false,
        ordering: true,
        order: [[0, 'desc']]
    };

    $scope.dtOptions = {
        // Configure DataTable options here
        dom:    "<'row'<'col-sm-6'B><'col-sm-6'f>>" +
                "<'row'<'col-sm-12'tr>>" +
                "<'row'<'col-sm-4'i><'col-sm-4 text-center'l><'col-sm-4'p>>",
        buttons: [
            {
                extend: 'print',
                exportOptions: {
                    columns: [0, ':visible']
                }
            },
            {
                extend: 'excelHtml5',
                exportOptions: {
                    columns: ':visible'
                }
            },
            {
                extend: 'pdfHtml5',
                exportOptions: {
                    columns: ':visible'
                }
            },
            'colvis'
        ],
            responsive: true,
            paging: true,
            ordering: true,
            order: [[6, 'desc']]
    };

    $scope.nextQuestion = function(){
        $scope.quizStatus = 2;
        $("#txt_essay").prop('readonly', true);
        $scope.results = {
            questionNumber : $scope.questionNumber,
            answer : $scope.essay,
            datetime_taken : $scope.dateFormatter(),
            account_id : ""
        }
        $http({
            method: "POST",
            url: url + "ctrl_quiz/insert_essay",
            data: $scope.results
        }).then(function successCallback(response) {
            $timeout(function() 
            {
                $("#txt_essay").prop('readonly', false);
                $scope.essay = "";
                $scope.quizStatus = 0;
                $scope.questionStatus = "";
                $scope.questionNumber = $scope.questionNumber + 1;
                if($scope.questionNumber == 20){
                    $scope.quizStatus = 1;
                }
            }, 1000);
        });

    }

    $scope.endExam = function(){
        $scope.results = {
            questionNumber : $scope.questionNumber,
            answer : $scope.essay,
            datetime_taken : $scope.dateFormatter(),
            account_id : ""
        }
        $http({
            method: "POST",
            url: url + "ctrl_quiz/insert_essay",
            data: $scope.results
        }).then(function successCallback(response) {
            $scope.essay = "";
            $("#modalQuizEnd").modal('show');
            // $scope.refreshPage();
        });

    }

    $scope.cancelExam = function(){
        $scope.results = {
            questionNumber : $scope.questionNumber,
            answer : $scope.essay,
            datetime_taken : $scope.dateFormatter(),
            account_id : ""
        }
        $http({
            method: "POST",
            url: url + "ctrl_quiz/insert_essay",
            data: $scope.results
        }).then(function successCallback(response) {
            $scope.essay = "";
            $scope.refreshPage();
        });
    }

    $scope.refreshPage = function(){
        window.location = url;
    }

    $scope.checkAll = function (isChecked) {
        $scope.selectedItems = [];
        console.log("Is Checked? -> " + isChecked);
        $scope.essaylist.forEach(function (item) 
        {
            item.Selected = isChecked;
            if(isChecked != false)
            {
                $scope.selectedItems.push(item.id);
            }
        });
        $scope.totalSelectedItem = $scope.selectedItems.length;
        // console.log($scope.totalSelectedItem);
        // console.log($scope.selectedItems);
    }

    $scope.getId = function (id){
        if ($scope.selectedItems.includes(id))
        {
            $scope.selectedItems = $scope.selectedItems.filter(item => item !== id);
        } 
        else 
        {
            $scope.selectedItems.push(id);
        }
        $scope.totalSelectedItem = $scope.selectedItems.length;
        // console.log($scope.totalSelectedItem);
        // console.log($scope.selectedItems);
    }

    $scope.openAnswers = function(){
        $scope.params = {
            ids: $scope.selectedItems.join(),
            date_taken: $scope.quizDateFilter,
            quiz_id : $scope.selectedQuizId
        }
        $http({
            method: "POST",
            url: url + "ctrl_quiz/fetch_answerlist",
            data: $scope.params
        }).then(function successCallback(response) {
            $scope.answerlist = response.data["list"];
            $scope.userAnswerList = $filter('filter')($scope.answerlist, { account_id: $scope.selectedItems[$scope.employeeNumber] });
            $scope.employeeCount = $scope.selectedItems.length;
            $scope.getScore();
            $("#modalAnswer").modal({ backdrop: 'static', keyboard: true });
        });
    }

    $scope.getScore = function(){
        $scope.userCurrentScore = 0;
        $scope.accountId = $scope.selectedItems[$scope.employeeNumber];
        $scope.quizId = $scope.selectedQuizId;

        $scope.params = {
            account_id : $scope.accountId,
            quiz_id: $scope.quizId
        }

        $http({
            method: "POST",
            url: url + "ctrl_quiz/fetch_score",
            data: $scope.params
        }).then(function successCallback(response) {
            $scope.userCurrentScore = (response.data[0]['score'] != null) ? response.data[0]['score']  : 0;
        });

    }

    $scope.previous = function(){
        if($scope.employeeNumber != 0)
        {
            $scope.employeeNumber = $scope.employeeNumber - 1;
            $scope.userAnswerList = $filter('filter')($scope.answerlist, { account_id: $scope.selectedItems[$scope.employeeNumber] });
            console.log($scope.userAnswerList[0]);
            $scope.getScore();
        }
    }

    $scope.next = function(){
        if($scope.employeeNumber != ($scope.selectedItems.length - 1))
        {
            $scope.employeeNumber = $scope.employeeNumber + 1;
            $scope.userAnswerList = $filter('filter')($scope.answerlist, { account_id: $scope.selectedItems[$scope.employeeNumber] });
             console.log($scope.userAnswerList[0]);
            $scope.getScore();
        }
    }

    $scope.clear_ModalAnswerData = function(){
        $scope.employeeNumber = 0;
        $scope.employeeCount = 0;
        $scope.userAnswerList = [];
        $scope.answerlist = [];
        $scope.userCurrentScore = 0;
        $scope.accountId = 0;
        $scope.selectedItems = [];
        $scope.totalSelectedItem = 0;
        $scope.essaylist.forEach(function (item) 
        {
            item.Selected = false;
            $scope.selectAll = false;
        });
        // $scope.fetchAnswerListbyDateFilter('EB');
        // console.log("Selected Items -> ", $scope.selectedItems);
        $scope.fetchAnswerListbyQuizname();
    }

    $scope.validateAnswer = function(accountId, quizId, id, datetimeTaken, isCorrect, score, remarks){
        // console.log("id => " + id + " isCorrect => " + isCorrect);
        $scope.params = {
            account_id: accountId,
            quiz_id: quizId,
            id: id,
            datetime_taken: datetimeTaken,
            is_correct: isCorrect,
            score  :score,
            remarks : remarks
        }

        console.log( $scope.params.score);

        $http({
            method: "POST",
            url: url + "ctrl_quiz/validateAnswer",
            data: $scope.params
        }).then(function successCallback(response) {
            var userAnswerListToBeUpdate = $scope.userAnswerList.find(function(answer) 
            {
                return answer.id === id;
            });

            if (userAnswerListToBeUpdate) 
            {
              userAnswerListToBeUpdate.is_correct = isCorrect;
              $scope.userCurrentScore = response.data['newscore'];
            }
            this.score = 0;
        });
    }

    $scope.revertAnswer = function(accountId, quizId, id, datetimeTaken, isCorrect, score, remarks){
        // console.log("id => " + id + " isCorrect => " + isCorrect);
        $scope.userCurrentScore = $scope.userCurrentScore - score;

        $scope.params = {
            id: id,
            account_id: accountId,
            quiz_id: quizId,
            score  :score,
            currentScore : $scope.userCurrentScore,
            remarks : remarks
        }
        console.log( $scope.params);

        $http({
            method: "POST",
            url: url + "ctrl_quiz/revertAnswer",
            data: $scope.params
        }).then(function successCallback(response) {
            var userAnswerListToBeUpdate = $scope.userAnswerList.find(function(answer) 
            {
                return answer.id === id;
            });

            if (userAnswerListToBeUpdate) 
            {
                userAnswerListToBeUpdate.is_correct = isCorrect;
                userAnswerListToBeUpdate.answer_score = 0;
            }
            this.score = 0;
        });
    }

    // Fetch User Answer List by Quiz Date
    $scope.fetchAnswerListbyDateFilter = function(quizTypes){
        // console.log("Date Selected: "+ $scope.quizDateFilter);
        $("html").addClass("loading");
        $scope.essaylist = [];
        $http({
            method: "POST",
            url: url + "ctrl_quiz/fetchAnswerListbyDateFilter",
            data: {filterdate : $scope.quizDateFilter, qtype : quizTypes}
        }).then(function successCallback(response) {
            $("html").removeClass("loading");
            $scope.essaylist = response.data["list"];
            $scope.scorelist = response.data["scorelist"];
        });
    }

    // $scope.fetchAnswerListbyQuizNameFilter = function(quizName){
    //     // console.log("Date Selected: "+ $scope.quizDateFilter);
    //     $("html").addClass("loading");
    //     $scope.essaylist = [];
    //     $http({
    //         method: "POST",
    //         url: url + "ctrl_quiz/fetchAnswerListbyQuizNameFilter",
    //         data: {filterdate : $scope.quizDateFilter, qname : quizName}
    //     }).then(function successCallback(response) {
    //         $("html").removeClass("loading");
    //         $scope.essaylist = response.data["list"];
    //         $scope.scorelist = response.data["scorelist"];
    //     });
    // }

    $scope.exportScore  = function(tableId)
    {
        var exportHref = Excel.tableToExcel(tableId,'ScoreList');
        $timeout(function(){
            //location.href = exportHref;
            window.open(exportHref, '_blank');
        }, 100);
    }

    $scope.selectedTabItem = function(id){
        $scope.quizDates = [];
        $scope.selectedTab = id;
        $scope.fetchDateList(id);
        $scope.quizDateFilter = "";
        $scope.essaylist = [];
        $scope.quizDatesLimit = 3; // Reset to show first 3 dates
    }

    $scope.fetchDateList = function(qtype){
        $http({
            method: "POST",
            url: url + "ctrl_quiz/fetchDateList",
            data: {qtype : qtype}
        }).then(function successCallback(response) {
            $scope.quizDates = $scope.sortDatesByLatest(response.data["dates"]); // Sort by latest
        });
    }

    $scope.fetchQuizNameList = function(){
        // console.log($scope.quizDateFilter);
        $scope.quizNames = [];
        $scope.essaylist = [];
        $scope.scorelist = [];
        $http({
            method: "POST",
            url: url + "ctrl_quiz/fetchQuizNameList",
            data: {datefilter : $scope.quizDateFilter}
        }).then(function successCallback(response) {
            $scope.quizNames = response.data["quiznames"];
        });
    }

    $scope.fetchAnswerListbyQuizname = function(){
        // console.log($scope.quizDateFilter);
        // console.log($scope.selectedQuizId);
        $("html").addClass("loading");
        $scope.essaylist = [];
        $http({
            method: "POST",
            url: url + "ctrl_quiz/fetchAnswerListbyQuizname",
            data: {datefilter : $scope.quizDateFilter, quizId : $scope.selectedQuizId, qtype : 'EB'}
        }).then(function successCallback(response) {
            $("html").removeClass("loading");
            $scope.essaylist = response.data["list"];
            $scope.scorelist = response.data["scorelist"];
        });
    }


});

// =========================================================================================
// Developer: Bergado, Marvin V.
// Position: Senior IT Developer - MIS Head
// Company: Kelin Graphics System
// Department: KGS-MIS
// Creation Datetime: 1/6/2024 6:30 AM

// Description:
// Quiz Controller AngularJS of the Kelin Product Quiz Web Application.