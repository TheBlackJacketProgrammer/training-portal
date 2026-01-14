<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Ctrl_Quiz extends CI_Controller 
{
	function __construct()
	{
	   parent::__construct();
	}

	public function fetch_quizData(){
		$result["category_list"] = $this->model_quiz->fetch_categoryList();
		$result["product_list"] = $this->model_quiz->fetch_productList();
		echo json_encode($result);
	}

	// Save Exam Result
	public function insert_examResult(){
		if (isset($_SESSION['is_logged']))
		{
			$data = json_decode(file_get_contents('php://input'),true); 
			$data["account_id"] = $_SESSION['id'];
			$response['status'] = $this->model_quiz->insert_examResult($data);
			$response['view'] = "";
		}
		else
		{
			$response['status'] = false;
			$response["view"] = $this->load->view('sections/section_login.html', "", true);
		}
		echo json_encode($response);
	}

	public function insert_essay(){
		if (isset($_SESSION['is_logged']))
		{
			$data = json_decode(file_get_contents('php://input'),true); 
			$data["account_id"] = $_SESSION['id'];
			$data["is_correct"] = 2; // 2 kasi wala pang validation kung tama or mali yung sagot
			$data["quiz_id"] = "Essay";
			$response['status'] = $this->model_quiz->insert_essay($data);
			$response['view'] = "";
		}
		else
		{
			$response['status'] = false;
			$response["view"] = $this->load->view('sections/section_login.html', "", true);
		}
		echo json_encode($response);
	}

	public function fetch_answerlist(){
		$data = json_decode(file_get_contents('php://input'),true);
		$response['list'] = $this->model_quiz->fetch_answerlist($data);
		echo json_encode($response);
	}
	
	public function validateAnswer(){
		$data = json_decode(file_get_contents('php://input'),true);
		// $data['score'] = 10;
		$response['status'] = $this->model_quiz->validateAnswer($data); // Update Answer's is_correct
		$isRecorded = $this->model_quiz->fetch_userscore($data);// Check User Score
		if($isRecorded == 0) // No Record -> Insert New Score
		{
			$response['newscore'] = $this->model_quiz->insert_score($data);
			$this->model_quiz->update_answerscore($data);
		}
		else // Exist Record -> Update Score
		{
			$scoreData = $this->model_quiz->fetch_currentUserScore($data);
			$this->model_quiz->update_answerscore($data);
			$response['newscore'] = $this->model_quiz->update_score($data, $scoreData);
		}
		echo json_encode($response);
	}

	public function revertAnswer(){
		$data = json_decode(file_get_contents('php://input'),true);
		$scoreData = $this->model_quiz->fetch_currentUserScore($data);
		$this->model_quiz->revert_answerscore($data); // tbl_essay score
		$this->model_quiz->revert_score($data, $scoreData); // tbl_score score
		echo json_encode($data);
	}

	public function fetch_score(){
		$data = json_decode(file_get_contents('php://input'),true);
		$response = $this->model_quiz->fetch_currentUserScore($data);
		echo json_encode($response);
	}

	// Create Quiz - tbl_quizmaster
	public function createQuiz(){
		$data = json_decode(file_get_contents('php://input'),true);
		$response = $this->model_quiz->createQuiz($data);
		echo json_encode($response);
	}

	// Create Question - Multiple Choice tbl_quizmultiple
	public function createQuestion(){
		$data = json_decode(file_get_contents('php://input'),true);
		$response["id"] = $this->model_quiz->createQuestion($data);
		echo json_encode($response);
	}

	public function saveItemChoicesList(){
		$data = json_decode(file_get_contents('php://input'),true);
		$count = count($data);
		for ($i = 0; $i < $count ; $i++) 
		{ 
			$this->model_quiz->saveItemChoicesList($data[$i]);
		}
		// $response["id"] = $this->model_quiz->createQuestion($data);
		$response["status"] = true;
		echo json_encode($response);
	}

	public function saveQuiz(){
		$data = json_decode(file_get_contents('php://input'),true);
		$questions = $data["questions"];
		$choices = $data["choices"];

		// Quiz Information
		$this->model_quiz->createQuiz($data["details"]);

		// Question Details
		$questionCount = count($data["questions"]);
		for ($i = 0; $i < $questionCount ; $i++) 
		{ 
			$this->model_quiz->saveQuestionDetails($questions[$i]);
		}

		// Item Choices
		$countChoices = count($data["choices"]);
		for ($i = 0; $i < $countChoices ; $i++) 
		{ 
			$questionItems = $data["choices"][$i];
			$countQuestionItems = count($questionItems);
			for ($c = 0; $c < $countQuestionItems ; $c++){
				//print_r($questionItems[$c]);
				$this->model_quiz->saveItemChoices($questionItems[$c]);
			}
			
		}
	}

	public function quizSearch(){
		$data = json_decode(file_get_contents('php://input'),true);
		$quizData["details"] = $this->model_quiz->quizSearch($data["quiz_id"]);
		$quizData["quizType"] = $quizData["details"][0]->quiz_type;
		if ($quizData["quizType"] == "Multiple Choice") // Quiz Type => Multiple Choice
		{
			$quizData["questionSet"] = $this->model_quiz->fetchQuestionSet($data["quiz_id"]);
			$questionCount = count($quizData["questionSet"]);
			for ($i = 0; $i < $questionCount ; $i++) 
			{ 
				$quizData["itemChoicesSet"][$i] = $this->model_quiz->fetchItemChoicesSet($quizData["questionSet"][$i]->q_id);
			}
			$quizData["view"] = $this->load->view('quiz_templates/quiz_templates_multiple_choice.html', "", true);

			// Event Log
			$logdata["quiz_id"] = $data["quiz_id"];
			$logdata["account_id"] = $_SESSION['id'];
			$logdata["log_details"] = "Taking Quiz";
			$logdata["quiz_status"] = "Start Quiz";
			$logdata["datetime_taken"] = date('m/d/Y h:i:s A');
			$this->model_logger->insert_log($logdata);
		}
		else if($quizData["quizType"] == "Essay")
		{
			$quizData["questionSet"] = $this->model_quiz->fetchEssayQuestionSet($data["quiz_id"]);
			$quizData["view"] = $this->load->view('quiz_templates/quiz_templates_essay.html', "", true);

			// Event Log
			$logdata["quiz_id"] = $data["quiz_id"];
			$logdata["account_id"] = $_SESSION['id'];
			$logdata["log_details"] = "Taking Quiz";
			$logdata["quiz_status"] = "Start Quiz";
			$logdata["datetime_taken"] = date('m/d/Y h:i:s A');
			$this->model_logger->insert_log($logdata);
		}
		else if($quizData["quizType"] == "Blank")
		{
			$quizData["view"] = $this->load->view('quiz_templates/quiz_templates_blank.html', "", true);

			// Event Log
			$logdata["quiz_id"] = $data["quiz_id"];
			$logdata["account_id"] = $_SESSION['id'];
			$logdata["log_details"] = "Taking Quiz";
			$logdata["quiz_status"] = "Start Quiz";
			$logdata["datetime_taken"] = date('m/d/Y h:i:s A');
			$this->model_logger->insert_log($logdata);
		}
		else
		{
			$quizData["view"] = "";
			$quizData["quizType"] = "";
			$quizData["details"] = "";
		}
		echo json_encode($quizData);
	}

	public function submitquiz(){
		$data = json_decode(file_get_contents('php://input'),true);
		$data["account_id"] = $_SESSION['id'];
		$this->model_quiz->submitquiz($data);

		// Event Log
		$logdata["quiz_id"] = $data["quiz_id"];
		$logdata["account_id"] = $data['account_id'];
		$logdata["log_details"] = "Done Taking Quiz";
		$logdata["quiz_status"] = "End Quiz";
		$logdata["datetime_taken"] = date('m/d/Y h:i:s A');
		$this->model_logger->insert_log($logdata);

		echo json_encode($data);
	}

	// Batch
	public function submitEssayAnswer(){
		$data = json_decode(file_get_contents('php://input'),true);
		$anwserCount = count($data);
		for ($i = 0; $i < $anwserCount ; $i++) 
		{
			$data[$i]["account_id"] = $_SESSION['id'];
			$this->model_quiz->submitEssayAnswer($data[$i]);
		}
		$this->getAnswerSheetBlankQuiz();
		// echo json_encode($anwserCount);
	}

	public function submitGenerateBlankAnswersheetJSON(){
		$data = json_decode(file_get_contents('php://input'),true);
		$anwserCount = count($data["tbl_essay"]);
		$param["quiz_id"] = $data["quiz_id"];
		$param["account_id"] = $_SESSION['id'];
		$tbl_essay  = $data["tbl_essay"];
		for ($i = 0; $i < $anwserCount ; $i++) 
		{
			$tbl_essay[$i]["account_id"] = $_SESSION['id'];
			$this->model_quiz->submitEssayAnswer($tbl_essay[$i]);
		}
		$this->getAnswerSheetBlankQuiz($param);
	}

	// Single
	public function submitBlankAnswer(){
		$data = json_decode(file_get_contents('php://input'),true);
		$this->model_quiz->updateBlankQuizQuestionAnswer($data);

		// Event Log
		$logdata["quiz_id"] = $data["quiz_id"];
		$logdata["account_id"] = $data['account_id'];
		$logdata["log_details"] = "Done Taking Quiz";
		$logdata["quiz_status"] = "End Quiz";
		$logdata["datetime_taken"] = date('m/d/Y h:i:s A');
		$this->model_logger->insert_log($logdata);
	}

	// Fetch User Answer List by Quiz Date
	public function fetchAnswerListbyDateFilter(){
		$data = json_decode(file_get_contents('php://input'),true);
		$response['list'] = $this->model_quiz->fetchAnswerListbyDateFilter($data);
		$response['scorelist'] = $this->model_quiz->fetchScoreListbyDateFilter($data);
		echo json_encode($response);
	}

	// Fetch User Answer List by Quiz Date
	// public function fetchAnswerListbyQuizNameFilter(){
	// 	$data = json_decode(file_get_contents('php://input'),true);
	// 	$response['list'] = $this->model_quiz->fetchAnswerListbyQuizNameFilter($data);
	// 	$response['scorelist'] = $this->model_quiz->fetchScoreListbyQuizNameFilter($data);
	// 	echo json_encode($response);
	// }

	public function fetch_quizmaster(){
		$response['tbl_quizmaster'] = $this->model_quiz->fetch_quizmaster();
		echo json_encode($response);
	}

	public function fetch_quizDetails(){
		$data = json_decode(file_get_contents('php://input'),true);
		if($data["quizType"] == "Essay")
		{
			$response['details'] = $this->model_quiz->fetch_quizDetails($data["quizId"]);
			$response['questions'] = $this->model_quiz->fetch_question($data);
		}
		else
		{
			$response['details'] = $this->model_quiz->fetch_quizDetails($data["quizId"]);
			$response['questions'] = $this->model_quiz->fetch_question($data);
			$response['choices'] = $this->model_quiz->fetch_itemChoices($data);
		}
		echo json_encode($response);
	}

	public function deactivate_quizId(){
		$data = json_decode(file_get_contents('php://input'),true);
		$response["status"] = $this->model_quiz->deactivate_quizId($data["quizId"]);
		echo json_encode($response);
	}

	public function saveBlankQuiz(){
		$data = json_decode(file_get_contents('php://input'),true);
		$response["status"] = $this->model_quiz->saveBlankQuiz($data);
		echo json_encode($response);
	}

	public function getAnswerSheetBlankQuiz(){
		$data = json_decode(file_get_contents('php://input'),true);
		$data["account_id"] = $_SESSION['id'];
		$response = $this->model_quiz->getAnswerSheetBlankQuiz($data);
		echo json_encode($response);
	}

	public function fetchDateList(){
		$data = json_decode(file_get_contents('php://input'),true);
		$result["dates"] = $this->model_quiz->fetchDateList($data); // NEW
		echo json_encode($result);
	}

	public function fetchQuizNameList(){
		$data = json_decode(file_get_contents('php://input'),true);
		$result["quiznames"] = $this->model_quiz->fetchQuizNameList($data); // NEW
		echo json_encode($result);
	}

	public function fetchAnswerListbyQuizname(){
		$data = json_decode(file_get_contents('php://input'),true);
		$response['list'] = $this->model_quiz->fetchFilteredAnswerList($data);
		$response['scorelist'] = $this->model_quiz->fetchFilteredScoreList($data);
		echo json_encode($response);
	}

	public function fetchQuizDateList(){
		$result["dates"] = $this->model_quiz->fetch_examDates(); // NEW
		echo json_encode($result);
	}



}

// =========================================================================================
// Developer: Bergado, Marvin V.
// Position: Senior IT Developer - MIS Head
// Company: Kelin Graphics System
// Department: KGS-MIS
// Creation Datetime: 11/4/2023 8:36 AM

// Description:
// Quiz Controller of the Kelin Product Quiz Web Application.