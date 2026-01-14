<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Ctrl_Dev extends CI_Controller 
{
	function __construct()
	{
	   parent::__construct();
	}

	// Fetch Browse Quiz View
	public function module_browseQuiz(){
		$response['view'] = $this->load->view('modules/module_browseQuiz.html', "", true);
		echo json_encode($response);
	}

	// Fetch Create Quiz View
	public function module_createQuiz(){
		$response['view'] = $this->load->view('modules/module_createQuiz.html', "", true);
		echo json_encode($response);
	}

	// Insert Essay Question Set
	public function save_questionSet(){
		$data = json_decode(file_get_contents('php://input'),true);
		$setQuestions = $data['setQuestions'];

		// Quiz Details
		$this->model_quiz->save_quizDetails($data['details']);

		// Get Generated Id
		// $id = $this->model_quiz->fetch_quizId($data['details']['quiz_id']);

		// Quiz Set of Questions
		$questionSetCount = count($setQuestions);
		for ($row = 0; $row < $questionSetCount; $row++) 
		{
			// $setQuestions[$row]['quiz_id'] = $id;
			$setQuestions[$row]['question_num'] = $row + 1;
			$this->model_quiz->save_questionSet($setQuestions[$row]);
		};

		return true;
	}

	public function update_questionSet(){
		$data = json_decode(file_get_contents('php://input'),true);
		$setQuestions = $data['setQuestions'];

		// Quiz Details
		$this->model_quiz->update_quizDetails($data['details']);

		// Quiz Set of Questions
		$questionSetCount = count($setQuestions);
		for ($row = 0; $row < $questionSetCount; $row++) 
		{
			$this->model_quiz->update_questionSet($setQuestions[$row]);
		};

		return true;
	}
	
}

// =========================================================================================
// Developer: Bergado, Marvin V.
// Position: Senior IT Developer - MIS Head
// Company: Kelin Graphics System
// Department: KGS-MIS
// Creation Datetime: 1/10/2023 2:02 PM

// Description:
// Main Developer Controller of the Kelin Product Quiz Web Application.