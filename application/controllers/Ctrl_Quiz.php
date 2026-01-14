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

}

// =========================================================================================
// Developer: Bergado, Marvin V.
// Creation Datetime: 01/14/2026 1:45 pm

// Description:
// Quiz Controller of the Training Portal Web Application.