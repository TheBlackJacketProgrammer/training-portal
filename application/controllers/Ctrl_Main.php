<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Ctrl_Main extends CI_Controller 
{
	function __construct()
	{
	   parent::__construct();
	}
	
	public function index()
	{
		$this->load->view('pages/page_main');
	}


	public function load_view()
	{
		if (isset($_SESSION['is_logged']))
		{
			if($_SESSION['usertype']  == "Admin")
			{
				// $this->load->view("HTML FILE","DATA","Convert to String");
				$result["view"] = $this->load->view('sections/section_admin.html', "", true);
			}
			else if ($_SESSION['usertype']  == "Developer")
			{
				$result["view"] = $this->load->view('sections/section_dashboard.html', "", true);
			}
			else if ($_SESSION['usertype']  == "GM")
			{
				$result["view"] = $this->load->view('sections/section_gm.html', "", true);
			}
			else
			{
				$result["view"] = $this->load->view('sections/section_main.html', "", true);
			}
		}
		else
		{
			$result["view"] = $this->load->view('sections/section_login.html', "", true);
		}
		echo json_encode($result);
	}

	public function register()
	{
		$result["view"] = $this->load->view('sections/section_register.html', "", true);
		echo json_encode($result);
	}

	// Authenticate User
	public function authenticate()
	{
		$data = json_decode(file_get_contents('php://input'),true);
		$result = $this->model_main->authenticate($data);
		if($result != null){
			$this->session->set_userdata('id', $result[0]->id);
			$this->session->set_userdata('employee_id', $result[0]->employee_id);
			$this->session->set_userdata('usertype', $result[0]->usertype);
			$this->session->set_userdata('is_logged', 1);
			switch ($result[0]->usertype) {
				case "Admin":
					$result['view'] = $this->load->view('sections/section_admin.html', "", true);
				    break;
				case "Developer":
					$result['view'] = $this->load->view('sections/section_dashboard.html', "", true);
					break;
				case "GM":
					$result['view'] = $this->load->view('sections/section_gm.html', "", true);
					break;
			  	default:
			  		$result['view'] = $this->load->view('sections/section_main.html', "", true);
			}
			$result['status'] = "success";
			$result['message'] = "Login successful";
		}
		else{
			$result['status'] = "error";
			$result['message'] = "Invalid credentials";
		}
		echo json_encode($result);
	}

	// API Login
	public function api_authenticate()
	{
		$data = json_decode(file_get_contents('php://input'),true);
		$result = $this->model_main->authenticate($data);
		echo json_encode($result);
	}

	// API Update Password
	public function api_update_pass()
	{
		$data = json_decode(file_get_contents('php://input'),true);
		$this->model_main->api_update_pass($data);
		$result = true;
		echo json_encode($result);
	}

	public function module_productList()
	{
		$result["view"] = $this->load->view('modules/module_product_master_list.html', "", true);
		$result["list"] = $this->model_product->fetch_productList();
		echo json_encode($result);
	}
	

	public function module_quiz()
	{
		$result["view"] = $this->load->view('modules/module_quiz.html', "", true);
		$result["list"] = $this->model_product->fetch_productList();
		echo json_encode($result);
	}

	// New 
	public function module_essay()
	{
		$result["view"] = $this->load->view('modules/module_essay.html', "", true);
		$result["list"] = "";
		echo json_encode($result);
	}

	// Event Logger 
	public function module_quizEventLogs(){
		$result["view"] = $this->load->view('modules/module_eventLogger.html', "", true);
		$result["list"] = $this->model_logger->fetch_logslist();;
		echo json_encode($result);
	}

	public function fetch_userprofile()
	{
		$result["view"] = $this->load->view('modules/module_userprofile.html', "", true);
		$result["profile"] = $this->model_main->module_userProfile($_SESSION['id']);
		echo json_encode($result);
	}

	public function scoreboard()
	{
		if($_SESSION['usertype'] == "Admin"){
			$result["list"] = $this->model_main->fetch_scoreboardAdmin();
			$result["quizlist"] = $this->model_main->fetch_quizName();
			$result["view"] = $this->load->view('modules/module_scoreboard.html', "", true);
		}
		else{
			$result["list"] = $this->model_main->fetch_scoreboard($_SESSION['id']);
			// $result["quizlist"] = $this->model_main->fetch_quizName();
			$result["view"] = $this->load->view('modules/module_scoreboarduser.html', "", true);
		}
		echo json_encode($result);
	}

	public function logout()
	{
		unset(
        	$_SESSION['id'],
        	$_SESSION['employee_id'],
        	$_SESSION['usertype'],
        	$_SESSION['is_logged']
		);
		return true;
	}

	// Guard Clause
	// var asim = (conditions) ? true : false ;

	public function insert_employee(){
		$data = json_decode(file_get_contents('php://input'),true);
		$isExist = $this->model_main->checkAccount($data['employee_id']);
		if($isExist == 0)
		{
			$employeeDetails 	= $this->model_main->getEmployeeData($data['employee_id']);
			$data["firstname"] 	= $employeeDetails[0]->firstname;
			$data["lastname"] 	= $employeeDetails[0]->lastname;
			$data["middlename"] = $employeeDetails[0]->middlename;
			$data["department"] = $employeeDetails[0]->department;
			$data["branch"] 	= $employeeDetails[0]->division;
			$response = $this->model_main->insert_employee($data);
		}
		echo json_encode($isExist);
	}

	public function update_employee(){
		$data = json_decode(file_get_contents('php://input'),true);
		$data["id"] = $_SESSION['id'];
		$result = $this->model_main->update_employee($data);
        return $result;
	}

	// Open Answer Sheet Records
	public function module_answerSheetRecords(){
		$result["view"] = $this->load->view('modules/module_answerSheetRecords.html', "", true);
		$result["dates"] = $this->model_quiz->fetch_examDates(); 
		echo json_encode($result);
	}

	// Verify Employee
	public function verifyEmployee(){
		$data = json_decode(file_get_contents('php://input'),true);
		$response = $this->model_main->verifyEmployee($data["employee_id"]);
		echo json_encode($response);
	}

	// Fetch User Answer List by Quiz Date
	public function fetchAnswerListbyDateFilter(){
		$data = json_decode(file_get_contents('php://input'),true);
		$response['list'] = $this->model_quiz->fetchAnswerListbyDateFilter($data['filterdate']);
		$response['scorelist'] = $this->model_quiz->fetchScoreListbyDateFilter($data['filterdate']);
		echo json_encode($response);
	}

	// View - Recover Account
	public function recover_account(){
		$result["view"] = $this->load->view('sections/section_forgotpass.html', "", true);
		echo json_encode($result);
	}

	// Verify Account
	public function verify_account(){
		$data = json_decode(file_get_contents('php://input'),true);
		$response = $this->model_main->verify_account($data);
		echo json_encode($response);
	}

	// Update Password
	public function update_password(){
		$data = json_decode(file_get_contents('php://input'),true);
		$response = $this->model_main->update_password($data);
		echo json_encode($response);
	}

	public function module_feedback()
	{
		$result["view"] = $this->load->view('modules/module_feedback.html', "", true);
		echo json_encode($result);
	}

	// Fetch Employee List
	public function fetch_employeeList(){
		$data["employee_id"] = $_SESSION["employee_id"];
		$result["list"] = $this->model_main->fetch_employeeList($data);
		$result["branch"] = $this->model_main->fetch_branches($data);
		$result["department"] = $this->model_main->fetch_departments($data);
		echo json_encode($result);
	}

	// Fetch Feedback List by Specific Employee
	public function fetch_feedback(){
		$data = json_decode(file_get_contents('php://input'),true);
		$response = $this->model_main->fetch_feedback($data);
		echo json_encode($response);
	}

	// Save Feedback
	public function save_feedback(){
		$data = json_decode(file_get_contents('php://input'),true);
		$data["creator_employee_id"] = $_SESSION['employee_id'];
		$this->model_main->save_feedback($data);
		$response = $this->model_main->fetch_feedback($data);
		echo json_encode($response);
	}

	// Remove Feedback
	public function remove_feedback(){
		$data = json_decode(file_get_contents('php://input'),true);
		$this->model_main->remove_feedback($data);
		return true;
	}

	// Update Feedback
	public function update_feedback(){
		$data = json_decode(file_get_contents('php://input'),true);
		$this->model_main->update_feedback($data);
		return true;
	}

	// Fetch All Feedbacks 
	public function fetch_all_feedbacks()
	{
		$result = $this->model_main->fetch_all_feedbacks();
		echo json_encode($result);
	}

	// Fetch Quiz Result
	public function fetch_quizDetails(){
		$data = json_decode(file_get_contents('php://input'),true);
		$result = $this->model_main->fetch_quizDetails($data);
		echo json_encode($result);
	}


}

// =========================================================================================
// Developer: Bergado, Marvin V.
// Position: Senior IT Developer - MIS Head
// Company: Kelin Graphics System
// Department: KGS-MIS
// Creation Datetime: 11/2/2023 11:08 AM

// Description:
// Main Controller of the Kelin Product Quiz Web Application.