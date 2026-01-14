kelin.controller("ctrl_vars", function($scope) 
{
	// $scope.formData = new FormData();

	$scope.section = "";
	$scope.module = "";

	$scope.credentials = {
        employeeId: "",
        password: ""
    };
	
	$scope.blank = "";
	

    // // Product List from Database
    // $scope.productList = [];

    // Product List to Table
    $scope.tbl_productlist = {
        id: null,
        product_name : "",
        product_description : "",
        product_category : "",
        product_img : ""
    };

    $scope.productDetails = {
    	data_id: null,
    	inventory_id : "",
    	description : "",
    	category : "",
    	item_class : "",
        image : "",
    };

    $scope.categorylist = {
        id: null,
        category: ""
    };

    $scope.categorydetails = {
        id: null,
        category: ""
    };

    $scope.registerDetails = {
        employee_id: "",
        firstname: "",
        lastname: "",
        middlename: "",
		usertype: "User",
		is_active: 1,
		department: "",
		branch: "",
        password: ""    
    };
	
	// $scope.registerDetails = {
		// employee_id: "",
		// password: ""
	// };

    $scope.listCategory =  [];

    // $scope.selectedCategory = $scope.categorylist[0];

    // $scope.productdetails.product_category = $scope.categorylist[0];

    $scope.filename = "Choose File";

    $scope.tempImgLoc = "";

    $scope.editCategory = false;

    $scope.scoreboard = [];


    // Quiz Variables Here

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

    $scope.answer;

    $scope.quizStatus = 0;

    $scope.results = [];

    $scope.test = [];

    $scope.tempIndex;

    $scope.totalSelectedItem = 0;

    $scope.questionStatus = "";

    $scope.productQuestion = [];

    // $scope.selectAll = false;

    $scope.selectedItems = [];

    $scope.employeeNumber = 0;

    $scope.employeeCount = 0;

    $scope.userAnswerList = [];

    $scope.userCurrentScore = 0;

    $scope.quizlist = [];

    // FILTERS
    $scope.filterQuizName = "";
    $scope.filterEmployee = "";

    // BROWSE QUIZ
    $scope.hasResult = false;

    // Quiz Details
    $scope.quizDetails = {
        quiz_id : "",
        quiz_name : "",
        quiz_type : "",
        date_created : "",
        quiz_totalitems : "",
        is_active : ""
    }

    // Forms of Quiz Type
    // $scope.formQuizType = "";
    $scope.formStyle = {
        quizType : ""
    };

    // NEW VARIABLES
    $scope.quizDates = [];
    $scope.quizDateFilter = "";
    $scope.scorelist = [];

        // MULTIPLE CHOICE

    $scope.quizQuestionDetails = {
        id: null,
        qm_id: "", // Quiz Master - quiz_id
        q_id: "",  // Quiz Question - Question Id
        question_num: 0,
        question: "",
        question_pts: ""
    };
    $scope.currQuizQuestionDetails = {
        id: null,
        qm_id: "", // Quiz Master - quiz_id
        q_id: "",  // Quiz Question - Question Id
        question_num: 0,
        question: "",
        question_pts: ""
    };
    $scope.tempQuizQuestionDetails = {
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
    $scope.tempQuizMultipleChoiceList = [];

    $scope.quizMultipleChoiceList = [];

    $scope.questionList = [];
    $scope.currQuestionList = [];
    $scope.tempQuestionList = [];

    $scope.itemChoicesList = [];
    $scope.quizpackage = [];

    $scope.itemChoiceCount = 1;
    $scope.questionCount = 1;

    $scope.quizpackage = [];


    $scope.isQuizCreated = false;


    $scope.quizQuestionList = [];

    $scope.questionList = [];

    $scope.questionId = null;
    $scope.isNewQuiz = true;
    $scope.isEditable = true;

    // For edit
    $scope.editQuiz = false;

    $scope.userscoretemp = {
        total :0
    }

    $scope.selectedTab = 1;
    $scope.idx;
    $scope.selectedQID = "";

    $scope.editStatus = {
        details : false,
        question : false,
        choices : false
    };

    // For Recover Account
    $scope.account_details = {
        id: null,
    	employee_id : "",
    	firstname : "",
    	middlename : "",
    	lastname : "",
        new_password: ""
    };

    $scope.loglist = [];

    // New -> 5/14/24
    $scope.list_category = [];
    $scope.list_itemClass = [];

    // New -> 5/15/24
    $scope.list_employee = [];
    $scope.list_branches = [];
    $scope.list_departments = [];
    $scope.table_employee = [];

    // New -> 5/16/2024
    $scope.details_employee = [];
    $scope.details_feedback = {
        data_id: null,
        employee_id: "",
        date_created: "",
        creator_employee_id: "",
        feedback: "",
        remark: null
    };
    $scope.list_feedback = [];

    // New -> 5/18/2024
    $scope.table_product = [];

    // New -> 5/23/2024
    $scope.details_quizResult = [];

});