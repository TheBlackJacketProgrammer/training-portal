<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Ctrl_Quiz extends CI_Controller 
{
	function __construct()
	{
	   parent::__construct();
	}

	public function get_quizlist()
	{
		$result['quizlist'] = $this->model_quiz->get_quizlist();
		$result['status'] = "success";
		echo json_encode($result);
	}

	// Insert Quiz
	public function insert_quiz()
	{
		$data = json_decode(file_get_contents('php://input'),true);
		$data['created_by'] = $_SESSION['id'];
		$data['date_created'] = date('Y-m-d H:i:s');
		$data['status'] = 1;
		$result = $this->model_quiz->insert_quiz($data);
		echo json_encode($result);
	}

	// Insert Essay Quiz
	public function insert_essay_quiz()
	{
		$data = json_decode(file_get_contents('php://input'),true);
		$quizDetails = $data['quizDetails'];
		$quizDetails['created_by'] = $_SESSION['id'];
		$quizDetails['date_created'] = date('Y-m-d H:i:s');
		$quizDetails['status'] = 1;
		$this->model_quiz->insert_quiz($quizDetails);
		$quizId = $this->db->insert_id();

		$essayQuestions = $data['essayQuestions'];
		$essayQuestionsCount = count($essayQuestions);
		for ($row = 0; $row < $essayQuestionsCount; $row++) {
			$essayQuestions[$row]['quiz_id'] = $quizId;
			$essayQuestions[$row]['question'] = $essayQuestions[$row]['question'];
			$essayQuestions[$row]['question_points'] = 0;
			$essayQuestions[$row]['date_created'] = date('Y-m-d H:i:s');
			$essayQuestions[$row]['status'] = 1;
			$result = $this->model_quiz->insert_essay_question($essayQuestions[$row]);
		}
		echo json_encode($result);
	}

}

// =========================================================================================
// Developer: Bergado, Marvin V.
// Creation Datetime: 01/14/2026 1:45 pm

// Description:
// Quiz Controller of the Training Portal Web Application.